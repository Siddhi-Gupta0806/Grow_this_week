from typing import Dict, Any, List

def calculate_water_savings(
    garden_items: List[Dict[str, Any]],
    weather_summary: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Water Saver Engine:
    Estimates total weekly water requirement for the user's active garden,
    factors in forecasted rainfall, and determines exact days to skip watering.
    """
    total_rain_mm = weather_summary.get("total_rain_mm", 0.0)
    daily_forecast = weather_summary.get("daily_forecast", [])
    
    # Base water requirement per plant type per week (liters)
    base_water_needs = {
        "vegetable": 3.5,
        "herb": 2.0,
        "flower": 2.5,
        "fruit": 5.0,
        "microgreen": 1.0
    }
    
    plant_count = max(len(garden_items), 4)  # Default calculation for at least 4 pots if empty
    estimated_weekly_need_liters = round(plant_count * 2.8, 1)
    
    # Effective rainfall harvested per average pot surface (~0.1 sq meters per pot)
    # 1 mm rain on 0.1 m2 = 0.1 liters per pot
    rain_harvest_per_pot = total_rain_mm * 0.1
    effective_rain_liters = round(rain_harvest_per_pot * plant_count, 1)
    
    net_water_needed = max(0.0, round(estimated_weekly_need_liters - effective_rain_liters, 1))
    water_saved_percent = min(100, round((effective_rain_liters / max(1.0, estimated_weekly_need_liters)) * 100))
    
    # Identify skip watering days (days where precipitation_sum >= 3.0 mm or prob >= 60%)
    skip_days = []
    for day in daily_forecast:
        if day.get("precipitation_sum", 0) >= 3.0 or day.get("precipitation_probability", 0) >= 60:
            skip_days.append({
                "date": day["date"],
                "reason": f"Expected rain ({day.get('precipitation_sum')}mm, {day.get('precipitation_probability')}% chance)"
            })
            
    advice = ""
    if water_saved_percent >= 50:
        advice = f"🌧️ Heavy rain expected! Rain will meet {water_saved_percent}% of your garden's water needs. Skip watering on rainy days."
    elif water_saved_percent > 0:
        advice = f"🌤️ Moderate rain will cover ~{effective_rain_liters}L ({water_saved_percent}%) of your garden's needs. Only water when topsoil feels dry."
    else:
        advice = "☀️ Dry week ahead! Ensure regular morning watering, especially for fruiting vegetables."

    return {
        "estimated_weekly_need_liters": estimated_weekly_need_liters,
        "effective_rain_liters": effective_rain_liters,
        "net_water_needed_liters": net_water_needed,
        "water_saved_percent": water_saved_percent,
        "skip_days": skip_days,
        "advice": advice
    }
