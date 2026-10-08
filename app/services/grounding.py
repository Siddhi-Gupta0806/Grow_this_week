import json
import os
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

PLANTS_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "plants.json")

def load_all_plants() -> List[Dict[str, Any]]:
    """Load plant database from data/plants.json."""
    if not os.path.exists(PLANTS_FILE):
        logger.error(f"Plants file not found at {PLANTS_FILE}")
        return []
    with open(PLANTS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def filter_candidate_plants(
    weather_summary: Dict[str, Any],
    profile: Dict[str, Any],
    already_planted_names: List[str]
) -> List[Dict[str, Any]]:
    """
    Grounding Engine Step 1:
    Deterministic filtering in plain Python BEFORE AI call.
    Filters by:
    - Temperature range: temp_min <= avg_temp <= temp_max
    - Rain tolerance: (heavy_rain_ok OR not heavy_rain_week)
    - Container friendliness (if profile container_only is True or garden_type == 'balcony')
    - Exclude plants already in active garden
    """
    all_plants = load_all_plants()
    avg_temp = weather_summary.get("avg_temp", 25.0)
    heavy_rain = weather_summary.get("heavy_rain_week", False)
    
    container_only = profile.get("container_only", False) or (profile.get("garden_type") in ["balcony", "indoor"])
    planted_lower = [p.strip().lower() for p in already_planted_names]
    
    candidates = []
    for plant in all_plants:
        name_lower = plant["name"].strip().lower()
        
        # 1. Remove already planted items
        if name_lower in planted_lower or any(p in name_lower for p in planted_lower):
            continue
            
        # 2. Temperature check
        t_min = plant.get("temp_min", 10)
        t_max = plant.get("temp_max", 35)
        temp_ok = (t_min <= avg_temp <= t_max)
        
        # 3. Rain check
        rain_ok = plant.get("rain_tolerance", True) if heavy_rain else True
        
        # 4. Container check
        container_ok = True
        if container_only and not plant.get("container_friendly", True):
            container_ok = False
            
        # Keep candidate if all deterministic checks pass
        if temp_ok and rain_ok and container_ok:
            candidates.append(plant)
            
    # Fallback safety: If candidate list is too small (< 4), relax slightly to ensure Gemma has enough options
    if len(candidates) < 4:
        logger.warning(f"Candidate count ({len(candidates)}) low. Relaxing strict temperature bounds by 3°C.")
        candidates = []
        for plant in all_plants:
            name_lower = plant["name"].strip().lower()
            if name_lower in planted_lower:
                continue
            t_min = plant.get("temp_min", 10) - 3
            t_max = plant.get("temp_max", 35) + 3
            if t_min <= avg_temp <= t_max:
                candidates.append(plant)

    return candidates
