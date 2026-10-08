import httpx
import logging
import time
from datetime import datetime
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
FORECAST_URL = "https://api.open-meteo.com/v1/forecast"
TIMEOUT_SECONDS = 10.0
CACHE_EXPIRY_SECONDS = 1800.0  # 30-minute cache

# In-memory weather cache: Keyed by f"{round(lat, 2)}_{round(lon, 2)}" -> (timestamp, data_dict)
_WEATHER_CACHE: Dict[str, tuple[float, Dict[str, Any]]] = {}

async def search_city(city_name: str, count: int = 10) -> List[Dict[str, Any]]:
    """
    Geocoding API search returning distinct place matches with name, state (admin1), country, lat, lon, and elevation.
    """
    if not city_name or len(city_name.strip()) < 2:
        return []

    try:
        async with httpx.AsyncClient(timeout=TIMEOUT_SECONDS) as client:
            resp = await client.get(GEOCODING_URL, params={"name": city_name, "count": count})
            if resp.status_code == 200:
                data = resp.json()
                results = data.get("results", [])
                if results:
                    return [{
                        "id": item.get("id", idx),
                        "name": item.get("name"),
                        "latitude": float(item.get("latitude")),
                        "longitude": float(item.get("longitude")),
                        "elevation": float(item.get("elevation")) if item.get("elevation") is not None else None,
                        "country": item.get("country", ""),
                        "admin1": item.get("admin1", "")  # State / Region
                    } for idx, item in enumerate(results)]
    except Exception as e:
        logger.error(f"Geocoding error for '{city_name}': {e}")
    
    # Offline / Fallback location dictionary with exact geographical coordinates & elevation
    q = city_name.lower().strip()
    fallback_places = [
        {"name": "Srinagar", "latitude": 34.0837, "longitude": 74.7973, "elevation": 1585.0, "country": "India", "admin1": "Jammu and Kashmir"},
        {"name": "Jammu", "latitude": 32.7266, "longitude": 74.8570, "elevation": 327.0, "country": "India", "admin1": "Jammu and Kashmir"},
        {"name": "Leh", "latitude": 34.1526, "longitude": 77.5771, "elevation": 3500.0, "country": "India", "admin1": "Ladakh"},
        {"name": "London", "latitude": 51.5074, "longitude": -0.1278, "elevation": 11.0, "country": "United Kingdom", "admin1": "England"},
        {"name": "Mumbai", "latitude": 19.0760, "longitude": 72.8777, "elevation": 14.0, "country": "India", "admin1": "Maharashtra"},
        {"name": "New Delhi", "latitude": 28.6139, "longitude": 77.2090, "elevation": 216.0, "country": "India", "admin1": "Delhi"},
        {"name": "Bengaluru", "latitude": 12.9716, "longitude": 77.5946, "elevation": 920.0, "country": "India", "admin1": "Karnataka"},
        {"name": "Pune", "latitude": 18.5204, "longitude": 73.8567, "elevation": 560.0, "country": "India", "admin1": "Maharashtra"},
        {"name": "Shimla", "latitude": 31.1048, "longitude": 77.1734, "elevation": 2200.0, "country": "India", "admin1": "Himachal Pradesh"}
    ]

    matched = []
    for place in fallback_places:
        if q in place["name"].lower() or q in place["admin1"].lower():
            matched.append({
                "id": hash(place["name"]),
                "name": place["name"],
                "latitude": place["latitude"],
                "longitude": place["longitude"],
                "elevation": place["elevation"],
                "country": place["country"],
                "admin1": place["admin1"]
            })

    if matched:
        return matched

    return []
    
def get_cache_key(lat: float, lon: float) -> str:
    """Generate 30-minute cache key based on rounded latitude and longitude."""
    return f"{round(float(lat), 2)}_{round(float(lon), 2)}"

async def get_weekly_forecast(
    lat: float,
    lon: float,
    city_name: str = "Location",
    state: str = "",
    country: str = ""
) -> Dict[str, Any]:
    """
    Fetch 7-day weather forecast from Open-Meteo API using exact latitude, longitude, and elevation.
    Caches weather per rounded lat/lon pair for 30 minutes.
    """
    cache_key = get_cache_key(lat, lon)
    now = time.time()

    # 1. Check 30-minute Cache
    if cache_key in _WEATHER_CACHE:
        cached_time, cached_data = _WEATHER_CACHE[cache_key]
        if now - cached_time < CACHE_EXPIRY_SECONDS:
            logger.info(f"Returning 30-min cached weather for {city_name} ({cache_key})")
            # Update display city name if passed
            result = dict(cached_data)
            result["city"] = city_name
            if state: result["state"] = state
            if country: result["country"] = country
            return result

    # 2. Live Open-Meteo Forecast Call
    params = {
        "latitude": lat,
        "longitude": lon,
        "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max",
        "hourly": "relative_humidity_2m",
        "timezone": "auto",
        "forecast_days": 7
    }

    try:
        async with httpx.AsyncClient(timeout=TIMEOUT_SECONDS) as client:
            resp = await client.get(FORECAST_URL, params=params)
            if resp.status_code == 200:
                data = resp.json()
                elevation = data.get("elevation", None)
                daily = data.get("daily", {})
                clean = lambda vals: [0.0 if v is None else v for v in vals]
                times = daily.get("time", [])
                t_max = clean(daily.get("temperature_2m_max", []))
                t_min = clean(daily.get("temperature_2m_min", []))
                p_sum = clean(daily.get("precipitation_sum", []))
                p_prob = clean(daily.get("precipitation_probability_max", []))
                wind = clean(daily.get("wind_speed_10m_max", []))
                uv = clean(daily.get("uv_index_max", []))

                daily_forecasts = []
                for i in range(len(times)):
                    daily_forecasts.append({
                        "date": times[i],
                        "temp_max": round(float(t_max[i]), 1) if i < len(t_max) else 25.0,
                        "temp_min": round(float(t_min[i]), 1) if i < len(t_min) else 15.0,
                        "precipitation_sum": round(float(p_sum[i]), 1) if i < len(p_sum) else 0.0,
                        "precipitation_probability": round(float(p_prob[i]), 1) if i < len(p_prob) else 0.0,
                        "wind_speed": round(float(wind[i]), 1) if i < len(wind) else 10.0,
                        "uv_index": round(float(uv[i]), 1) if i < len(uv) else 5.0
                    })

                avg_max = sum(t_max) / len(t_max) if t_max else 25.0
                avg_min = sum(t_min) / len(t_min) if t_min else 15.0
                avg_temp = (avg_max + avg_min) / 2.0
                total_rain = sum(p_sum) if p_sum else 0.0
                rainy_days = sum(1 for p in p_sum if p >= 1.0)
                heavy_rain_week = total_rain > 40.0

                fetched_time_str = datetime.now().strftime("%H:%M %p")

                weather_result = {
                    "city": city_name,
                    "state": state,
                    "country": country,
                    "latitude": lat,
                    "longitude": lon,
                    "elevation": elevation,
                    "avg_max": round(avg_max, 1),
                    "avg_min": round(avg_min, 1),
                    "avg_temp": round(avg_temp, 1),
                    "total_rain_mm": round(total_rain, 1),
                    "rainy_days": rainy_days,
                    "heavy_rain_week": heavy_rain_week,
                    "daily_forecast": daily_forecasts,
                    "is_live_data": True,
                    "fetched_at": fetched_time_str
                }

                # Save to 30-minute cache
                _WEATHER_CACHE[cache_key] = (now, weather_result)
                logger.info(f"Fetched live Open-Meteo weather for {city_name} (avg_temp={avg_temp:.1f}°C)")
                return weather_result
    except Exception as e:
        logger.error(f"Live Open-Meteo API call failed for lat={lat}, lon={lon}: {e}")

    # 3. Fallback Sample Data (Explicitly tagged with is_live_data = False)
    # Estimate realistic fallback temperature based on latitude & altitude
    estimated_base = 28.0
    if abs(lat) > 50: # e.g. London / UK
        estimated_base = 14.0
    elif abs(lat) > 30: # e.g. Srinagar / Leh / Northern mountains
        estimated_base = 16.0

    fallback_daily = []
    for d_idx in range(7):
        fallback_daily.append({
            "date": f"2026-10-0{d_idx+1}",
            "temp_max": round(estimated_base + 4.0, 1),
            "temp_min": round(estimated_base - 4.0, 1),
            "precipitation_sum": 1.0,
            "precipitation_probability": 15.0,
            "wind_speed": 12.0,
            "uv_index": 5.0
        })

    return {
        "city": city_name,
        "state": state,
        "country": country,
        "latitude": lat,
        "longitude": lon,
        "elevation": None,
        "avg_max": round(estimated_base + 4.0, 1),
        "avg_min": round(estimated_base - 4.0, 1),
        "avg_temp": round(estimated_base, 1),
        "total_rain_mm": 7.0,
        "rainy_days": 1,
        "heavy_rain_week": False,
        "daily_forecast": fallback_daily,
        "is_live_data": False,
        "fetched_at": datetime.now().strftime("%H:%M %p")
    }
