import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from app.services.grounding import filter_candidate_plants, load_all_plants

def test_load_all_plants():
    plants = load_all_plants()
    assert len(plants) >= 150
    for p in plants:
        assert "id" in p
        assert "name" in p
        assert "temp_min" in p
        assert "temp_max" in p

def test_filter_candidate_plants_temperature():
    weather_warm = {"avg_temp": 28.0, "heavy_rain_week": False}
    profile = {"garden_type": "balcony", "container_only": True}
    already_planted = ["Tomato"]

    candidates = filter_candidate_plants(weather_warm, profile, already_planted)
    
    names = [c["name"].lower() for c in candidates]
    assert "tomato" not in names
    
    for c in candidates:
        assert c["temp_min"] <= 28.0 <= c["temp_max"]
        assert c["container_friendly"] is True

def test_filter_candidate_plants_heavy_rain():
    weather_rainy = {"avg_temp": 25.0, "heavy_rain_week": True}
    profile = {"garden_type": "ground", "container_only": False}
    candidates = filter_candidate_plants(weather_rainy, profile, [])

    for c in candidates:
        assert c["rain_tolerance"] is True
