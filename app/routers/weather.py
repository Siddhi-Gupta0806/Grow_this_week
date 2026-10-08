from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from app.services.weather_service import get_weekly_forecast, search_city

router = APIRouter(prefix="/api/weather", tags=["Weather"])


@router.get("/search")
async def search_cities(q: str = Query(..., min_length=2)):
    """City search with autocomplete via Open-Meteo."""
    results = await search_city(q)
    return {"results": results}


@router.get("/forecast")
async def get_forecast(
    lat: Optional[float] = Query(None),
    lon: Optional[float] = Query(None),
    city: str = Query(""),
):
    """7-day forecast. Uses lat/lon if given, otherwise finds the city."""
    state, country = "", ""
    if lat is None or lon is None:
        if not city.strip():
            raise HTTPException(status_code=400, detail="Please give a city or lat/lon.")
        places = await search_city(city)
        if not places:
            raise HTTPException(status_code=404, detail=f"City not found: {city}")
        place = places[0]
        lat, lon = place["latitude"], place["longitude"]
        city = place["name"]
        state = place.get("admin1", "")
        country = place.get("country", "")
    return await get_weekly_forecast(lat, lon, city or "Location", state, country)