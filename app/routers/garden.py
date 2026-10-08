from fastapi import APIRouter, HTTPException, Response, Query
from typing import List, Dict, Any
from datetime import datetime, timedelta

from app.models.schemas import GardenItemCreate, GardenItem
from app.database import list_garden_items, add_garden_item, delete_garden_item
from app.services.grounding import load_all_plants
from app.services.water_saver import calculate_water_savings
from app.services.weather_service import get_weekly_forecast

router = APIRouter(prefix="/api/garden", tags=["My Garden"])

def compute_growth_stage(planted_date_str: str, days_to_harvest: int) -> Dict[str, Any]:
    try:
        planted = datetime.strptime(planted_date_str, "%Y-%m-%d")
        today = datetime.now()
        days_planted = max(0, (today - planted).days)
    except Exception:
        days_planted = 10

    days_remaining = max(0, days_to_harvest - days_planted)
    progress_pct = min(100, int((days_planted / max(1, days_to_harvest)) * 100))

    stage = "Seedling"
    if progress_pct > 80:
        stage = "Ready for Harvest 🎉"
    elif progress_pct > 60:
        stage = "Fruiting / Podding"
    elif progress_pct > 35:
        stage = "Flowering"
    elif progress_pct > 15:
        stage = "Vegetative Growth"

    return {
        "days_planted": days_planted,
        "days_to_harvest": days_to_harvest,
        "days_remaining": days_remaining,
        "progress_pct": progress_pct,
        "growth_stage": stage
    }

@router.get("", response_model=List[Dict[str, Any]])
async def get_my_garden():
    """List active garden plants with calculated growth stage and countdown."""
    items = list_garden_items()
    all_plants_db = {p["name"].lower(): p for p in load_all_plants()}

    enhanced_items = []
    for item in items:
        p_info = all_plants_db.get(item["plant_name"].lower(), {})
        days_to_harvest = p_info.get("days_to_harvest", 60)
        stage_info = compute_growth_stage(item["planted_date"], days_to_harvest)
        
        enhanced_items.append({
            "id": item["id"],
            "plant_name": item["plant_name"],
            "planted_date": item["planted_date"],
            "location": item["location"],
            "notes": item["notes"],
            "growth_stage": stage_info["growth_stage"],
            "days_planted": stage_info["days_planted"],
            "days_to_harvest": stage_info["days_to_harvest"],
            "days_remaining": stage_info["days_remaining"],
            "progress_pct": stage_info["progress_pct"],
            "category": p_info.get("category", "vegetable"),
            "companions": p_info.get("companions", []),
            "bad_neighbours": p_info.get("bad_neighbours", [])
        })

    return enhanced_items

@router.post("", response_model=Dict[str, Any])
async def add_plant_to_garden(item: GardenItemCreate):
    """Add a new plant to user's active garden."""
    item_id = add_garden_item(item.dict())
    return {"status": "success", "id": item_id, "message": f"Added {item.plant_name} to your garden!"}

@router.delete("/{item_id}")
async def remove_plant_from_garden(item_id: int):
    """Remove plant from active garden."""
    delete_garden_item(item_id)
    return {"status": "success", "message": "Plant removed"}

@router.get("/health-score")
async def get_garden_health_score(lat: float = 19.0760, lon: float = 72.8777):
    """Calculate Garden Health Score (0-100) with detailed factor breakdown."""
    items = list_garden_items()
    weather = await get_weekly_forecast(lat, lon)
    avg_temp = weather.get("avg_temp", 26.0)
    heavy_rain = weather.get("heavy_rain_week", False)

    base_score = 80
    factors = []

    if not items:
        return {
            "score": 75,
            "grade": "Good",
            "explanation": "Your garden is empty! Add your first plant to get customized health monitoring.",
            "factors": [{"name": "Garden Setup", "points": "+75", "type": "positive", "detail": "Ready to plant"}]
        }

    # Factor 1: Diversity
    categories = set()
    all_plants_db = {p["name"].lower(): p for p in load_all_plants()}
    for item in items:
        cat = all_plants_db.get(item["plant_name"].lower(), {}).get("category", "vegetable")
        categories.add(cat)
    
    if len(categories) >= 3:
        base_score += 10
        factors.append({"name": "High Biodiversity", "points": "+10", "type": "positive", "detail": "Combination of veggies & herbs deters pests."})
    elif len(categories) == 1:
        base_score -= 5
        factors.append({"name": "Monoculture Risk", "points": "-5", "type": "negative", "detail": "Add flowers or herbs for pest protection."})

    # Factor 2: Climate suitability
    unsuitable = 0
    for item in items:
        p = all_plants_db.get(item["plant_name"].lower(), {})
        if p and not (p.get("temp_min", 10) <= avg_temp <= p.get("temp_max", 35)):
            unsuitable += 1

    if unsuitable > 0:
        deduction = unsuitable * 8
        base_score -= deduction
        factors.append({"name": "Temperature Stress", "points": f"-{deduction}", "type": "negative", "detail": f"{unsuitable} plants are outside ideal temperature range."})
    else:
        base_score += 10
        factors.append({"name": "Perfect Climate Match", "points": "+10", "type": "positive", "detail": "All plants thrive in current forecast temperature."})

    # Factor 3: Weather protection
    if heavy_rain:
        base_score -= 5
        factors.append({"name": "Heavy Rain Risk", "points": "-5", "type": "warning", "detail": "Ensure pots have working drainage holes."})

    final_score = max(10, min(100, base_score))
    grade = "Excellent 🌱" if final_score >= 85 else ("Good 🌿" if final_score >= 70 else "Needs Attention ⚠️")

    return {
        "score": final_score,
        "grade": grade,
        "explanation": f"Your garden score is {final_score}/100. " + ("All plants match current weather!" if final_score >= 85 else "Check climate stress factors."),
        "factors": factors
    }

@router.get("/companion-map")
async def get_companion_map():
    """Returns companion planting relationships for active garden items."""
    items = list_garden_items()
    all_plants_db = {p["name"].lower(): p for p in load_all_plants()}
    
    matrix = []
    active_names = [item["plant_name"] for item in items]
    
    for i in range(len(active_names)):
        for j in range(i + 1, len(active_names)):
            p1_name = active_names[i]
            p2_name = active_names[j]
            p1_info = all_plants_db.get(p1_name.lower(), {})
            
            companions = [c.lower() for c in p1_info.get("companions", [])]
            bad = [b.lower() for b in p1_info.get("bad_neighbours", [])]
            
            relationship = "neutral"
            if p2_name.lower() in companions or any(c in p2_name.lower() for c in companions):
                relationship = "companion"
            elif p2_name.lower() in bad or any(b in p2_name.lower() for b in bad):
                relationship = "antagonist"
                
            matrix.append({
                "plant1": p1_name,
                "plant2": p2_name,
                "relationship": relationship,
                "explanation": f"{p1_name} & {p2_name}: " + ("Great companions! 💚" if relationship == "companion" else ("Keep apart! ⚠️" if relationship == "antagonist" else "Neutral neighbors"))
            })
            
    return {"active_plants": active_names, "matrix": matrix}

@router.get("/water-saver")
async def get_water_saver_analysis(lat: float = 19.0760, lon: float = 72.8777):
    """Water saver calculator endpoint."""
    items = list_garden_items()
    weather = await get_weekly_forecast(lat, lon)
    return calculate_water_savings(items, weather)

@router.get("/calendar/ics")
async def download_calendar_ics():
    """Generates an iCalendar (.ics) file for weekly garden tasks."""
    today = datetime.now()
    ics_lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//GrowThisWeek//AI Garden Planner//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH"
    ]
    
    tasks = [
        ("Monday Morning Sow & Water", "Best day to sow fast-growing leafy greens and check topsoil moisture."),
        ("Wednesday Organic Pest Inspection", "Inspect under leaves for aphids and spray neem oil solution if needed."),
        ("Friday Mid-Week Liquid Fertilizer", "Apply organic compost tea or seaweed extract to fruiting plants."),
        ("Sunday Garden Harvest & Pruning", "Prune yellowing leaves and harvest mature herbs/leafy greens.")
    ]
    
    for idx, (title, desc) in enumerate(tasks):
        event_date = today + timedelta(days=idx*2)
        dt_start = event_date.strftime("%Y%m%dT080000Z")
        dt_end = event_date.strftime("%Y%m%dT090000Z")
        
        ics_lines.extend([
            "BEGIN:VEVENT",
            f"UID:growthisweek-{idx}-{event_date.strftime('%Y%m%d')}@growthisweek.app",
            f"DTSTAMP:{today.strftime('%Y%m%dT%H%M%SZ')}",
            f"DTSTART:{dt_start}",
            f"DTEND:{dt_end}",
            f"SUMMARY:{title}",
            f"DESCRIPTION:{desc}",
            "STATUS:CONFIRMED",
            "END:VEVENT"
        ])
        
    ics_lines.append("END:VCALENDAR")
    content = "\r\n".join(ics_lines)
    
    return Response(
        content=content,
        media_type="text/calendar",
        headers={"Content-Disposition": "attachment; filename=growthisweek_calendar.ics"}
    )
