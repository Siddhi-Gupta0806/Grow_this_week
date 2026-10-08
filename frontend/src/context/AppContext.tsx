import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, WeatherSummary, WeeklyPlanResponse, GardenItem } from '../types';
import { getForecastApi, getWeeklyPlanApi, getMyGardenApi, getUserProfileApi, saveUserProfileApi } from '../utils/api';

interface AppContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: 'en' | 'hi' | 'mr';
  setLanguage: (lang: 'en' | 'hi' | 'mr') => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  city: string;
  setCity: (city: string) => void;
  lat: number;
  lon: number;
  setCoords: (lat: number, lon: number) => void;
  profile: UserProfile;
  updateProfile: (newProf: Partial<UserProfile>) => Promise<void>;
  weather: WeatherSummary | null;
  weeklyPlan: WeeklyPlanResponse | null;
  gardenItems: GardenItem[];
  refreshGarden: () => Promise<void>;
  isLoadingWeather: boolean;
  isLoadingPlan: boolean;
  loadWeeklyPlan: (overrideCity?: string, overrideLat?: number, overrideLon?: number) => Promise<void>;
  demoMode: boolean;
  enableDemoMode: () => void;
}

const defaultProfile: UserProfile = {
  city: 'Mumbai',
  lat: 19.0760,
  lon: 72.8777,
  garden_type: 'balcony',
  experience_level: 'beginner',
  sunlight_hours: '4-6 hours',
  pot_sizes: ['10-inch', '12-inch'],
  organic_only: true,
  language: 'en',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [language, setLanguageState] = useState<'en' | 'hi' | 'mr'>('en');
  const [darkMode, setDarkModeState] = useState<boolean>(false);
  const [city, setCity] = useState<string>('Mumbai');
  const [lat, setLat] = useState<number>(19.0760);
  const [lon, setLon] = useState<number>(72.8777);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [weather, setWeather] = useState<WeatherSummary | null>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlanResponse | null>(null);
  const [gardenItems, setGardenItems] = useState<GardenItem[]>([]);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);
  const [isLoadingPlan, setIsLoadingPlan] = useState<boolean>(false);
  const [demoMode, setDemoMode] = useState<boolean>(false);

  useEffect(() => {
    // Load stored preferences
    const savedDark = localStorage.getItem('gtw_dark') === 'true';
    setDarkModeState(savedDark);
    if (savedDark) document.documentElement.classList.add('dark');

    // Fetch profile & initial garden
    getUserProfileApi()
      .then(p => {
        setProfile(p);
        setCity(p.city);
        setLat(p.lat);
        setLon(p.lon);
        setLanguageState(p.language as any);
      })
      .catch(() => {});

    refreshGarden();
  }, []);

  const setDarkMode = (dark: boolean) => {
    setDarkModeState(dark);
    localStorage.setItem('gtw_dark', String(dark));
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setLanguage = (lang: 'en' | 'hi' | 'mr') => {
    setLanguageState(lang);
    updateProfile({ language: lang });
  };

  const setCoords = (newLat: number, newLon: number) => {
    setLat(newLat);
    setLon(newLon);
  };

  const updateProfile = async (newProf: Partial<UserProfile>) => {
    const updated = { ...profile, ...newProf };
    setProfile(updated);
    await saveUserProfileApi(updated).catch(() => {});
  };

  const refreshGarden = async () => {
    try {
      const items = await getMyGardenApi();
      setGardenItems(items);
    } catch (e) {
      console.warn('Could not refresh garden:', e);
    }
  };

  const loadWeeklyPlan = async (overrideCity?: string, overrideLat?: number, overrideLon?: number) => {
    const targetCity = overrideCity || city;
    const targetLat = overrideLat !== undefined ? overrideLat : lat;
    const targetLon = overrideLon !== undefined ? overrideLon : lon;

    setIsLoadingWeather(true);
    setIsLoadingPlan(true);

    try {
      const wData = await getForecastApi(targetLat, targetLon, targetCity);
      setWeather(wData);
      setIsLoadingWeather(false);

      const pData = await getWeeklyPlanApi({
        city: targetCity,
        lat: targetLat,
        lon: targetLon,
        language: profile.language,
        garden_type: profile.garden_type,
        experience_level: profile.experience_level,
        organic_only: profile.organic_only,
      });
      setWeeklyPlan(pData);
    } catch (e) {
      console.error('Plan loading failed:', e);
    } finally {
      setIsLoadingWeather(false);
      setIsLoadingPlan(false);
    }
  };

  const enableDemoMode = () => {
    setDemoMode(true);
    setCity('Mumbai');
    setLat(19.0760);
    setLon(72.8777);
    loadWeeklyPlan('Mumbai', 19.0760, 72.8777);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        language,
        setLanguage,
        darkMode,
        setDarkMode,
        city,
        setCity,
        lat,
        lon,
        setCoords,
        profile,
        updateProfile,
        weather,
        weeklyPlan,
        gardenItems,
        refreshGarden,
        isLoadingWeather,
        isLoadingPlan,
        loadWeeklyPlan,
        demoMode,
        enableDemoMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
