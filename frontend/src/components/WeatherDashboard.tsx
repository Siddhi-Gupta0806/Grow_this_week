import React from 'react';
import { useApp } from '../context/AppContext';
import { Sun, CloudRain, Wind, Thermometer, Droplets, CloudSun, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const WeatherDashboard: React.FC = () => {
  const { weather, isLoadingWeather, city } = useApp();

  if (isLoadingWeather) {
    return (
      <div className="w-full glass-card rounded-2xl p-6 border border-sage-500/20 animate-pulse space-y-4">
        <div className="h-6 bg-sage-200 dark:bg-forest-800 rounded w-1/3"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="h-20 bg-sage-200 dark:bg-forest-800 rounded-xl"></div>
          <div className="h-20 bg-sage-200 dark:bg-forest-800 rounded-xl"></div>
          <div className="h-20 bg-sage-200 dark:bg-forest-800 rounded-xl"></div>
          <div className="h-20 bg-sage-200 dark:bg-forest-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full space-y-4"
    >
      {/* 7-Day Forecast Overview Header */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 border border-sage-500/20 shadow-soft relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-sage-600 dark:text-sage-400">
                Live 7-Day Open-Meteo Climate Grounding
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-forest-800 dark:text-cream-50 mt-1">
              Weather Forecast for {weather.city || city}
            </h2>
            <p className="text-xs sm:text-sm text-forest-800/70 dark:text-cream-50/70 mt-1">
              Average Temperature: <strong className="text-sunrise-500">{weather.avg_temp}°C</strong> ({weather.avg_min}°C to {weather.avg_max}°C) • Total Expected Rain: <strong>{weather.total_rain_mm} mm</strong>
            </p>
          </div>

          {/* Quick Metrics Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <div className="bg-cream-50/80 dark:bg-forest-800/80 p-3 rounded-2xl border border-sage-500/20 text-center">
              <div className="flex items-center justify-center text-sunrise-500 gap-1 mb-1">
                <Thermometer className="w-4 h-4" />
                <span className="text-xs font-bold">Avg Temp</span>
              </div>
              <span className="text-lg font-bold text-forest-900 dark:text-cream-50">{weather.avg_temp}°C</span>
            </div>

            <div className="bg-cream-50/80 dark:bg-forest-800/80 p-3 rounded-2xl border border-sage-500/20 text-center">
              <div className="flex items-center justify-center text-botanical-sky gap-1 mb-1">
                <CloudRain className="w-4 h-4" />
                <span className="text-xs font-bold">Total Rain</span>
              </div>
              <span className="text-lg font-bold text-forest-900 dark:text-cream-50">{weather.total_rain_mm} mm</span>
            </div>

            <div className="bg-cream-50/80 dark:bg-forest-800/80 p-3 rounded-2xl border border-sage-500/20 text-center">
              <div className="flex items-center justify-center text-sage-500 gap-1 mb-1">
                <Droplets className="w-4 h-4" />
                <span className="text-xs font-bold">Rainy Days</span>
              </div>
              <span className="text-lg font-bold text-forest-900 dark:text-cream-50">{weather.rainy_days} days</span>
            </div>

            <div className="bg-cream-50/80 dark:bg-forest-800/80 p-3 rounded-2xl border border-sage-500/20 text-center">
              <div className="flex items-center justify-center text-botanical-gold gap-1 mb-1">
                <Sun className="w-4 h-4" />
                <span className="text-xs font-bold">UV Risk</span>
              </div>
              <span className="text-lg font-bold text-forest-900 dark:text-cream-50">
                {Math.max(...weather.daily_forecast.map(d => d.uv_index))} / 10
              </span>
            </div>
          </div>
        </div>

        {/* Climate Warning Banner if heavy rain or temp extreme */}
        {weather.heavy_rain_week && (
          <div className="mt-4 bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 px-4 py-2.5 rounded-2xl flex items-center gap-2 text-xs sm:text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Heavy Rainfall Alert ({weather.total_rain_mm} mm):</strong> Grounding engine has automatically filtered out rain-sensitive plants to protect root rot.
            </span>
          </div>
        )}
      </div>

      {/* 7 Daily Cards Carousel / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {weather.daily_forecast.map((day, idx) => {
          const isRainy = day.precipitation_sum > 2.0 || day.precipitation_probability > 50;
          const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border transition-all hover:scale-105 ${
                idx === 0
                  ? 'bg-sage-500 text-cream-50 border-sage-500 shadow-soft'
                  : 'glass-card border-sage-500/20 text-forest-900 dark:text-cream-50'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold opacity-80 mb-2">
                <span>{idx === 0 ? 'Today' : dayName}</span>
                <span>{day.date.slice(5)}</span>
              </div>

              {/* Weather Icon */}
              <div className="my-2 flex justify-center">
                {isRainy ? (
                  <CloudRain className={`w-8 h-8 ${idx === 0 ? 'text-cream-50' : 'text-botanical-sky'} animate-bounce`} />
                ) : (
                  <Sun className={`w-8 h-8 ${idx === 0 ? 'text-cream-50' : 'text-botanical-gold'} animate-spin-slow`} />
                )}
              </div>

              {/* Temperature */}
              <div className="text-center">
                <span className="text-base font-extrabold">{Math.round(day.temp_max)}°</span>
                <span className="text-xs opacity-70 ml-1">{Math.round(day.temp_min)}°</span>
              </div>

              {/* Rain Chance & Wind */}
              <div className="mt-2 text-[10px] space-y-0.5 opacity-90 border-t border-current/10 pt-2 flex flex-col items-center">
                <span className="flex items-center gap-1">
                  <Droplets className="w-3 h-3" />
                  {Math.round(day.precipitation_probability)}% ({day.precipitation_sum}mm)
                </span>
                <span className="flex items-center gap-1 opacity-75">
                  <Wind className="w-3 h-3" />
                  {Math.round(day.wind_speed)} km/h
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
