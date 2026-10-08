import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from app.models.schemas import WeeklyPlanResponse, RecommendedPlant, PlantMatch

def test_weekly_plan_schema_valid():
    data = {
        "plant_now": [
            {
                "name": "Tomato",
                "why": "Optimal temperature range",
                "how": "Plant seedlings 10 inches apart",
                "sunlight": "full_sun",
                "water": "medium",
                "days_to_harvest": 75,
                "match": {"temp_ok": True, "rain_ok": True}
            },
            {
                "name": "Mint",
                "why": "Loves moist soil",
                "how": "Propagate from cuttings",
                "sunlight": "partial_shade",
                "water": "high",
                "days_to_harvest": 30,
                "match": {"temp_ok": True, "rain_ok": True}
            },
            {
                "name": "Chilli",
                "why": "Enjoys warm weather",
                "how": "Sow in small pots",
                "sunlight": "full_sun",
                "water": "medium",
                "days_to_harvest": 80,
                "match": {"temp_ok": True, "rain_ok": True}
            },
            {
                "name": "Tulsi",
                "why": "Heat resistant",
                "how": "Place in bright sunny location",
                "sunlight": "full_sun",
                "water": "medium",
                "days_to_harvest": 45,
                "match": {"temp_ok": True, "rain_ok": True}
            }
        ],
        "avoid_this_week": ["Cabbage"],
        "protect": "Provide afternoon shade",
        "tip_of_the_day": "Water early in the morning"
    }

    resp = WeeklyPlanResponse(**data)
    assert len(resp.plant_now) == 4
    assert resp.plant_now[0].name == "Tomato"
