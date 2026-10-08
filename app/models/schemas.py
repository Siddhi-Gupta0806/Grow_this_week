from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# --- Single Source of Truth Location Schema ---
class LocationObject(BaseModel):
    name: str
    state: Optional[str] = ""
    country: Optional[str] = ""
    latitude: float
    longitude: float
    elevation: Optional[float] = None

# --- Grounding & Weekly Plan ---
class PlantMatch(BaseModel):
    temp_ok: bool = True
    rain_ok: bool = True

class RecommendedPlant(BaseModel):
    name: str
    why: str
    how: str
    sunlight: str = "full_sun"
    water: str = "medium"
    days_to_harvest: int = 60
    match: PlantMatch = Field(default_factory=PlantMatch)

class WeeklyPlanResponse(BaseModel):
    plant_now: List[RecommendedPlant]
    avoid_this_week: List[str]
    protect: str
    tip_of_the_day: str

class WeeklyPlanRequest(BaseModel):
    location: Optional[LocationObject] = None
    city: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None
    language: str = "en"
    garden_type: str = "balcony"  # balcony, terrace, ground, indoor
    experience_level: str = "beginner"  # beginner, intermediate, expert
    organic_only: bool = True
    container_only: bool = False

# --- Weather ---
class CitySearchResult(BaseModel):
    id: int
    name: str
    latitude: float
    longitude: float
    elevation: Optional[float] = None
    country: str
    admin1: Optional[str] = ""

class DailyForecast(BaseModel):
    date: str
    temp_max: float
    temp_min: float
    precipitation_sum: float
    precipitation_probability: float
    wind_speed: float
    uv_index: float

class WeatherSummary(BaseModel):
    city: str
    state: Optional[str] = ""
    country: Optional[str] = ""
    latitude: float
    longitude: float
    elevation: Optional[float] = None
    avg_max: float
    avg_min: float
    avg_temp: float
    total_rain_mm: float
    rainy_days: int
    heavy_rain_week: bool
    daily_forecast: List[DailyForecast]
    is_live_data: bool = True
    fetched_at: str = ""

# --- User Profile ---
class UserProfile(BaseModel):
    city: str = "Mumbai"
    state: str = "Maharashtra"
    country: str = "India"
    lat: float = 19.0760
    lon: float = 72.8777
    elevation: Optional[float] = 10.0
    garden_type: str = "balcony"
    experience_level: str = "beginner"
    sunlight_hours: str = "4-6 hours"
    pot_sizes: List[str] = ["10-inch", "12-inch"]
    organic_only: bool = True
    language: str = "en"

# --- Garden Items ---
class GardenItemCreate(BaseModel):
    plant_name: str
    planted_date: str  # YYYY-MM-DD
    location: str = "balcony"
    notes: Optional[str] = ""

class GardenItem(BaseModel):
    id: int
    plant_name: str
    planted_date: str
    location: str
    notes: Optional[str] = ""
    growth_stage: str = "Seedling"
    days_planted: int = 0
    days_to_harvest: int = 60
    days_remaining: int = 60

# --- Plant Doctor ---
class SuspectedIssue(BaseModel):
    issue: str
    probability: str
    symptoms_seen: str

class DoctorDiagnosisResponse(BaseModel):
    plant_name: str
    confidence: int
    health_status: str
    suspected_issues: List[SuspectedIssue]
    organic_treatment_steps: List[str]
    prevention_tips: List[str]
    disclaimer: str = "This is an AI visual diagnosis estimate, not an absolute guarantee. Inspect closely before treating."

# --- Space Scanner ---
class SpaceScannerMatch(BaseModel):
    plant_name: str
    reason: str

class SpaceScannerResponse(BaseModel):
    space_type: str
    estimated_sunlight_hours: str
    sunlight_quality: str
    space_assessment: str
    recommended_container_types: List[str]
    best_plant_matches: List[SpaceScannerMatch]
    layout_tips: List[str]

# --- Ask Gemma Chat ---
class ChatMessage(BaseModel):
    role: str  # user, assistant
    content: str
    timestamp: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    city: str = "Mumbai"
    lat: Optional[float] = None
    lon: Optional[float] = None
    language: str = "en"
    history: List[ChatMessage] = []

class ChatResponse(BaseModel):
    reply: str

# --- Harvest Journal ---
class HarvestEntryCreate(BaseModel):
    plant_name: str
    harvest_date: str
    weight_grams: float
    notes: Optional[str] = ""

class HarvestEntry(BaseModel):
    id: int
    plant_name: str
    harvest_date: str
    weight_grams: float
    notes: Optional[str] = ""

# --- Telemetry Log ---
class AITelemetryLog(BaseModel):
    id: str
    endpoint: str
    model_used: str
    latency_ms: float
    input_tokens: int
    output_tokens: int
    fallback_used: bool
    status: str
    timestamp: str
