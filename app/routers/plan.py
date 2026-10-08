from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any, List
from app.models.schemas import WeeklyPlanRequest, WeeklyPlanResponse
from app.services.weather_service import get_weekly_forecast, search_city
from app.services.grounding import filter_candidate_plants, load_all_plants
from app.services.gemma_service import gemma_service
from app.services.memory_service import memory_service
from app.services.water_saver import calculate_water_savings
from app.database import get_user_profile, list_garden_items

router = APIRouter(prefix="/api/plan", tags=["Weekly Plan"])

@router.post("/weekly", response_model=WeeklyPlanResponse)
async def get_weekly_plan(req: WeeklyPlanRequest):
    """Generate grounded weekly garden plan using Python deterministic filter + Gemma 4."""
    # 1. Resolve city coordinates if lat/lon not provided
    lat, lon = req.lat, req.lon
    if lat is None or lon is None:
        cities = await search_city(req.city)
        if cities:
            lat = cities[0]["latitude"]
            lon = cities[0]["longitude"]
        else:
            raise HTTPException(status_code=404, detail=f"City not found: {req.city}")

    # 2. Fetch 7-day weather summary
    weather_summary = await get_weekly_forecast(lat, lon, req.city)

    # 3. Fetch user profile & active garden items
    profile = get_user_profile()
    profile.update({
        "garden_type": req.garden_type,
        "experience_level": req.experience_level,
        "organic_only": req.organic_only,
        "container_only": req.container_only,
        "language": req.language
    })

    garden_items = list_garden_items()
    already_planted_names = [item["plant_name"] for item in garden_items]

    # 4. Grounding Engine deterministic filtering (BEFORE AI call)
    candidate_plants = filter_candidate_plants(weather_summary, profile, already_planted_names)

    # 5. Gemma 4 AI generation with candidate constraint
    plan_response = await gemma_service.generate_weekly_plan(
        city=req.city,
        weather_summary=weather_summary,
        user_profile=profile,
        candidate_plants=candidate_plants
    )

    return plan_response

@router.post("/whatif")
async def whatif_simulation(payload: Dict[str, Any] = Body(...)):
    """
    Instant 'What If' simulator.
    Uses the exact same deterministic filter code for instant results when user drags sliders.
    """
    city = payload.get("city", "Mumbai")
    temp_override = float(payload.get("temp_override", 26.0))
    rain_override = float(payload.get("rain_override", 10.0))
    heavy_rain = (rain_override > 40.0)

    weather_summary = {
        "city": city,
        "avg_temp": temp_override,
        "avg_max": temp_override + 4.0,
        "avg_min": temp_override - 4.0,
        "total_rain_mm": rain_override,
        "heavy_rain_week": heavy_rain
    }

    profile = get_user_profile()
    garden_items = list_garden_items()
    already_planted = [g["plant_name"] for g in garden_items]

    candidates = filter_candidate_plants(weather_summary, profile, already_planted)
    
    top_matches = candidates[:6]
    return {
        "simulated_temp": temp_override,
        "simulated_rain_mm": rain_override,
        "candidate_count": len(candidates),
        "recommended_plants": top_matches,
        "explanation": f"At {temp_override}°C and {rain_override}mm rain, {len(candidates)} plants pass strict climate requirements."
    }
