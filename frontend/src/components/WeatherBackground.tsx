import React from 'react';
import { useApp } from '../context/AppContext';

export const WeatherBackground: React.FC = () => {
  const { weather } = useApp();

  if (!weather) return null;

  const totalRain = weather.total_rain_mm;
  const avgTemp = weather.avg_temp;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-1000 opacity-40 dark:opacity-20">
      {/* Sunny Glow Background */}
      {avgTemp > 28 && totalRain < 10 && (
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-sunrise-400/40 via-botanical-gold/20 to-transparent rounded-full blur-3xl animate-pulse-slow" />
      )}

      {/* Rain drop effect simulation */}
      {totalRain > 15 && (
        <div className="absolute inset-0 bg-[radial-gradient(#a8dede_1px,transparent_1px)] [background-size:16px_24px] opacity-30 animate-pulse" />
      )}

      {/* Gentle cloud blur for overcast */}
      {totalRain >= 5 && totalRain <= 15 && (
        <div className="absolute top-10 left-1/4 w-3/4 h-64 bg-slate-300/20 rounded-full blur-3xl animate-float" />
      )}
    </div>
  );
};
