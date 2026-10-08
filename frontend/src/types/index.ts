export interface WeatherSummary {
  city: string;
  latitude: number;
  longitude: number;
  avg_max: number;
  avg_min: number;
  avg_temp: number;
  total_rain_mm: number;
  rainy_days: number;
  heavy_rain_week: boolean;
  daily_forecast: DailyForecast[];
}

export interface DailyForecast {
  date: string;
  temp_max: number;
  temp_min: number;
  precipitation_sum: number;
  precipitation_probability: number;
  wind_speed: number;
  uv_index: number;
}

export interface PlantMatch {
  temp_ok: boolean;
  rain_ok: boolean;
}

export interface RecommendedPlant {
  name: string;
  why: string;
  how: string;
  sunlight: string;
  water: string;
  days_to_harvest: number;
  match: PlantMatch;
}

export interface WeeklyPlanResponse {
  plant_now: RecommendedPlant[];
  avoid_this_week: string[];
  protect: string;
  tip_of_the_day: string;
}

export interface UserProfile {
  city: string;
  lat: number;
  lon: number;
  garden_type: 'balcony' | 'terrace' | 'ground' | 'indoor';
  experience_level: 'beginner' | 'intermediate' | 'expert';
  sunlight_hours: string;
  pot_sizes: string[];
  organic_only: boolean;
  language: 'en' | 'hi' | 'mr';
}

export interface GardenItem {
  id: number;
  plant_name: string;
  planted_date: string;
  location: string;
  notes?: string;
  growth_stage: string;
  days_planted: number;
  days_to_harvest: number;
  days_remaining: number;
  progress_pct: number;
  category?: string;
  companions?: string[];
  bad_neighbours?: string[];
}

export interface SuspectedIssue {
  issue: string;
  probability: string;
  symptoms_seen: string;
}

export interface DoctorDiagnosis {
  plant_name: string;
  confidence: number;
  health_status: string;
  suspected_issues: SuspectedIssue[];
  organic_treatment_steps: string[];
  prevention_tips: string[];
  disclaimer: string;
}

export interface SpaceScannerMatch {
  plant_name: string;
  reason: string;
}

export interface SpaceScannerResult {
  space_type: string;
  estimated_sunlight_hours: string;
  sunlight_quality: string;
  space_assessment: string;
  recommended_container_types: string[];
  best_plant_matches: SpaceScannerMatch[];
  layout_tips: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AITelemetryLog {
  id: string;
  endpoint: string;
  model_used: string;
  latency_ms: number;
  input_tokens: number;
  output_tokens: number;
  fallback_used: boolean;
  status: string;
  timestamp: string;
}

export interface HarvestEntry {
  id: number;
  plant_name: string;
  harvest_date: string;
  weight_grams: number;
  notes?: string;
}
