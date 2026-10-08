import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { searchCitiesApi } from '../utils/api';
import { Sprout, MapPin, Search, Sun, Moon, Activity, Globe, Sparkles, Home, Calendar, Flower2, Stethoscope, MessageSquare, BookOpen, Layers } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab, setActiveTab,
    city, setCity, setCoords, loadWeeklyPlan,
    language, setLanguage,
    darkMode, setDarkMode,
    demoMode, enableDemoMode,
    isLoadingWeather
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (val: string) => {
    setSearchQuery(val);
    if (val.trim().length >= 2) {
      setIsSearching(true);
      try {
        const results = await searchCitiesApi(val);
        setSearchResults(results);
      } catch (e) {
        console.error(e);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const selectCity = (c: any) => {
    setCity(c.name);
    setCoords(c.latitude, c.longitude);
    setSearchQuery('');
    setSearchResults([]);
    loadWeeklyPlan(c.name, c.latitude, c.longitude);
  };

  const useCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setCoords(lat, lon);
          setCity('My Location');
          loadWeeklyPlan('My Location', lat, lon);
        },
        (err) => {
          alert('Location permission denied or unavailable. Using default city.');
        }
      );
    }
  };

  return (
    <>
      {/* Top Navbar Header */}
      <header className="sticky top-0 z-40 w-full glass-card border-b border-sage-500/20 px-4 py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-forest-800 dark:bg-sage-500 text-cream-50 dark:text-forest-900 flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 animate-sway" />
            </div>
            <div>
              <span className="font-serif font-bold text-xl tracking-tight text-forest-800 dark:text-cream-50">
                GrowThisWeek
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-sage-100 dark:bg-forest-800 text-forest-800 dark:text-sage-400 border border-sage-400/30">
                Gemma 4 AI
              </span>
            </div>
          </div>

          {/* City Autocomplete Search + Use My Location */}
          <div className="relative flex-1 max-w-sm hidden sm:block">
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-forest-500 dark:text-sage-400" />
              <input
                type="text"
                placeholder="Search city (e.g. Mumbai, Delhi, London)..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-9 pr-24 py-1.5 text-sm rounded-full bg-cream-50 dark:bg-forest-800/80 border border-sage-500/30 text-forest-900 dark:text-cream-50 placeholder-forest-500/60 focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
              <button
                onClick={useCurrentLocation}
                title="Use My Location"
                className="absolute right-1 px-2.5 py-1 text-xs font-medium rounded-full bg-sage-500 text-cream-50 hover:bg-forest-800 transition-colors flex items-center gap-1"
              >
                <MapPin className="w-3 h-3" />
                <span className="hidden md:inline">Near me</span>
              </button>
            </div>

            {/* Dropdown search results */}
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-cream-50 dark:bg-forest-800 rounded-xl shadow-lift border border-sage-500/20 overflow-hidden z-50 max-h-60 overflow-y-auto">
                {searchResults.map((res) => (
                  <div
                    key={res.id}
                    onClick={() => selectCity(res)}
                    className="px-4 py-2.5 hover:bg-sage-100 dark:hover:bg-forest-900 cursor-pointer text-sm border-b border-sage-100 dark:border-forest-700/50 flex items-center justify-between"
                  >
                    <span className="font-medium text-forest-900 dark:text-cream-50">{res.name}</span>
                    <span className="text-xs text-forest-500 dark:text-sage-400">{res.admin1}, {res.country}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Controls: Demo Mode, Language, Theme, Under-The-Hood */}
          <div className="flex items-center gap-2">
            
            {/* Demo Mode Button */}
            <button
              onClick={enableDemoMode}
              className="px-3 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-sunrise-500 to-botanical-gold text-cream-50 shadow-soft hover:opacity-90 transition-opacity flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Demo Mode</span>
            </button>

            {/* Language Selector */}
            <div className="relative flex items-center bg-cream-50 dark:bg-forest-800 rounded-full border border-sage-500/30 px-2 py-1 text-xs font-semibold">
              <Globe className="w-3.5 h-3.5 mr-1 text-sage-500" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent text-forest-900 dark:text-cream-50 focus:outline-none cursor-pointer"
              >
                <option value="en" className="dark:bg-forest-800">English</option>
                <option value="hi" className="dark:bg-forest-800">हिंदी</option>
                <option value="mr" className="dark:bg-forest-800">मराठी</option>
              </select>
            </div>

            {/* Under the hood telemetry button */}
            <button
              onClick={() => setActiveTab('telemetry')}
              title="Under The Hood AI Telemetry"
              className={`p-2 rounded-full border transition-colors ${
                activeTab === 'telemetry'
                  ? 'bg-sage-500 text-cream-50 border-sage-500'
                  : 'bg-cream-50 dark:bg-forest-800 border-sage-500/30 text-forest-800 dark:text-cream-50 hover:bg-sage-100'
              }`}
            >
              <Activity className="w-4 h-4" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-cream-50 dark:bg-forest-800 border border-sage-500/30 text-forest-800 dark:text-cream-50 hover:bg-sage-100 dark:hover:bg-forest-700 transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4 text-botanical-gold" /> : <Moon className="w-4 h-4 text-forest-800" />}
            </button>
          </div>
        </div>

        {/* Mobile City Search Bar */}
        <div className="mt-2.5 sm:hidden px-1">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-forest-500 dark:text-sage-400" />
            <input
              type="text"
              placeholder="Search city (Mumbai, Delhi...)"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-9 pr-24 py-1.5 text-xs rounded-full bg-cream-50 dark:bg-forest-800 border border-sage-500/30 text-forest-900 dark:text-cream-50"
            />
            <button
              onClick={useCurrentLocation}
              className="absolute right-1 px-2 py-1 text-[10px] font-medium rounded-full bg-sage-500 text-cream-50 flex items-center gap-1"
            >
              <MapPin className="w-3 h-3" />
              <span>Location</span>
            </button>
          </div>
          {searchResults.length > 0 && (
            <div className="mt-1 bg-cream-50 dark:bg-forest-800 rounded-xl shadow-lift border border-sage-500/20 max-h-48 overflow-y-auto">
              {searchResults.map((res) => (
                <div
                  key={res.id}
                  onClick={() => selectCity(res)}
                  className="px-3 py-2 text-xs border-b border-sage-100 dark:border-forest-700 flex justify-between"
                >
                  <span className="font-medium text-forest-900 dark:text-cream-50">{res.name}</span>
                  <span className="text-forest-500 dark:text-sage-400">{res.country}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Desktop Main Header Tabs */}
      <nav className="hidden lg:block bg-forest-800 text-cream-50 border-b border-sage-500/20 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm font-medium">
          <div className="flex items-center gap-1">
            {[
              { id: 'home', label: 'Dashboard', icon: Home },
              { id: 'plan', label: "This Week's Plan", icon: Calendar },
              { id: 'garden', label: 'My Garden', icon: Flower2 },
              { id: 'doctor', label: 'Plant Doctor AI', icon: Stethoscope },
              { id: 'scanner', label: 'Space Scanner', icon: Layers },
              { id: 'chat', label: 'Ask Gemma Chat', icon: MessageSquare },
              { id: 'journal', label: 'Harvest Journal', icon: BookOpen },
              { id: 'telemetry', label: 'Under The Hood', icon: Activity },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-sage-500 text-cream-50 font-bold shadow-soft'
                      : 'text-cream-50/80 hover:bg-forest-700 hover:text-cream-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
          <div className="text-xs text-sage-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-sunrise-400" />
            <span>Active City: <strong>{city}</strong></span>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-sage-500/20 px-2 py-2 flex items-center justify-around">
        {[
          { id: 'home', label: 'Home', icon: Home },
          { id: 'plan', label: 'Plan', icon: Calendar },
          { id: 'garden', label: 'Garden', icon: Flower2 },
          { id: 'doctor', label: 'Doctor', icon: Stethoscope },
          { id: 'chat', label: 'Chat', icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
                isActive
                  ? 'text-sage-500 dark:text-sage-400 font-bold scale-105'
                  : 'text-forest-800/60 dark:text-cream-50/60'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
