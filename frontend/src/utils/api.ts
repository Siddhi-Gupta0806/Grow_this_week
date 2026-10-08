import { WeatherSummary, WeeklyPlanResponse, UserProfile, GardenItem, DoctorDiagnosis, SpaceScannerResult, ChatMessage, AITelemetryLog, HarvestEntry } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '';

export async function searchCitiesApi(query: string) {
  const resp = await fetch(`${API_BASE}/api/weather/search?q=${encodeURIComponent(query)}`);
  if (!resp.ok) throw new Error('Failed to search cities');
  const data = await resp.json();
  return data.results || [];
}

export async function getForecastApi(lat: number, lon: number, city: string): Promise<WeatherSummary> {
  const resp = await fetch(`${API_BASE}/api/weather/forecast?lat=${lat}&lon=${lon}&city=${encodeURIComponent(city)}`);
  if (!resp.ok) throw new Error('Failed to fetch weather forecast');
  return resp.json();
}

export async function getWeeklyPlanApi(params: {
  city: string;
  lat?: number;
  lon?: number;
  language: string;
  garden_type: string;
  experience_level: string;
  organic_only: boolean;
}): Promise<WeeklyPlanResponse> {
  const resp = await fetch(`${API_BASE}/api/plan/weekly`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!resp.ok) throw new Error('Failed to generate weekly plan');
  return resp.json();
}

export async function whatifApi(city: string, temp: number, rain: number) {
  const resp = await fetch(`${API_BASE}/api/plan/whatif`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ city, temp_override: temp, rain_override: rain }),
  });
  if (!resp.ok) throw new Error('Failed to run simulation');
  return resp.json();
}

export async function getMyGardenApi(): Promise<GardenItem[]> {
  const resp = await fetch(`${API_BASE}/api/garden`);
  if (!resp.ok) throw new Error('Failed to fetch garden items');
  return resp.json();
}

export async function addGardenItemApi(plantName: string, plantedDate: string, location: string = 'balcony', notes: string = ''): Promise<any> {
  const resp = await fetch(`${API_BASE}/api/garden`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plant_name: plantName, planted_date: plantedDate, location, notes }),
  });
  if (!resp.ok) throw new Error('Failed to add plant to garden');
  return resp.json();
}

export async function deleteGardenItemApi(id: number): Promise<any> {
  const resp = await fetch(`${API_BASE}/api/garden/${id}`, { method: 'DELETE' });
  if (!resp.ok) throw new Error('Failed to delete plant');
  return resp.json();
}

export async function getGardenHealthScoreApi(lat: number, lon: number) {
  const resp = await fetch(`${API_BASE}/api/garden/health-score?lat=${lat}&lon=${lon}`);
  if (!resp.ok) throw new Error('Failed to get health score');
  return resp.json();
}

export async function getCompanionMapApi() {
  const resp = await fetch(`${API_BASE}/api/garden/companion-map`);
  if (!resp.ok) throw new Error('Failed to get companion map');
  return resp.json();
}

export async function getWaterSaverApi(lat: number, lon: number) {
  const resp = await fetch(`${API_BASE}/api/garden/water-saver?lat=${lat}&lon=${lon}`);
  if (!resp.ok) throw new Error('Failed to get water saver analysis');
  return resp.json();
}

export async function diagnoseDoctorPhotoApi(file: File, notes: string = ''): Promise<DoctorDiagnosis> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('notes', notes);
  const resp = await fetch(`${API_BASE}/api/doctor/diagnose`, {
    method: 'POST',
    body: formData,
  });
  if (!resp.ok) throw new Error('Plant doctor diagnosis failed');
  return resp.json();
}

export async function scanSpacePhotoApi(file: File): Promise<SpaceScannerResult> {
  const formData = new FormData();
  formData.append('file', file);
  const resp = await fetch(`${API_BASE}/api/scanner/analyze`, {
    method: 'POST',
    body: formData,
  });
  if (!resp.ok) throw new Error('Space scanner analysis failed');
  return resp.json();
}

export async function askGemmaChatApi(message: string, city: string, language: string): Promise<string> {
  const resp = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, city, language }),
  });
  if (!resp.ok) throw new Error('Chat response failed');
  const data = await resp.json();
  return data.reply;
}

export async function speakTipApi(text: string): Promise<Blob | null> {
  try {
    const resp = await fetch(`${API_BASE}/api/voice/speak`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (resp.ok) {
      return await resp.blob();
    }
  } catch (e) {
    console.warn('Voice API call failed:', e);
  }
  return null;
}

export async function getTelemetryLogsApi(): Promise<AITelemetryLog[]> {
  const resp = await fetch(`${API_BASE}/api/telemetry/logs`);
  if (!resp.ok) throw new Error('Failed to fetch telemetry logs');
  return resp.json();
}

export async function getHarvestJournalApi(): Promise<HarvestEntry[]> {
  const resp = await fetch(`${API_BASE}/api/journal`);
  if (!resp.ok) throw new Error('Failed to fetch harvest journal');
  return resp.json();
}

export async function addHarvestEntryApi(plantName: string, date: string, weightGrams: number, notes: string = '') {
  const resp = await fetch(`${API_BASE}/api/journal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plant_name: plantName, harvest_date: date, weight_grams: weightGrams, notes }),
  });
  if (!resp.ok) throw new Error('Failed to log harvest');
  return resp.json();
}

export async function getUserProfileApi(): Promise<UserProfile> {
  const resp = await fetch(`${API_BASE}/api/profile`);
  if (!resp.ok) throw new Error('Failed to fetch profile');
  return resp.json();
}

export async function saveUserProfileApi(profile: UserProfile) {
  const resp = await fetch(`${API_BASE}/api/profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });
  if (!resp.ok) throw new Error('Failed to save profile');
  return resp.json();
}
