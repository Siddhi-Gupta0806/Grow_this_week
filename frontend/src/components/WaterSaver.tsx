import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getWaterSaverApi } from '../utils/api';
import { Droplets, CloudRain, CalendarX, Sparkles } from 'lucide-react';

export const WaterSaver: React.FC = () => {
  const { lat, lon, gardenItems } = useApp();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getWaterSaverApi(lat, lon).then(setData).catch(console.error);
  }, [lat, lon, gardenItems.length]);

  if (!data) return null;

  return (
    <div className="glass-card rounded-3xl p-5 border border-sage-500/20 shadow-soft space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-botanical-sky" />
          <h3 className="font-serif font-bold text-lg text-forest-800 dark:text-cream-50">
            Water Saver Analysis
          </h3>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-botanical-sky/20 text-botanical-sky">
          Save {data.water_saved_percent}% Water
        </span>
      </div>

      <p className="text-xs text-forest-800/80 dark:text-cream-50/80 leading-relaxed">
        {data.advice}
      </p>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
        <div className="p-3 rounded-2xl bg-cream-50/80 dark:bg-forest-800/80 border border-sage-500/10">
          <span className="block opacity-70">Weekly Need</span>
          <strong className="text-base text-forest-900 dark:text-cream-50">{data.estimated_weekly_need_liters} L</strong>
        </div>

        <div className="p-3 rounded-2xl bg-cream-50/80 dark:bg-forest-800/80 border border-sage-500/10">
          <span className="block opacity-70">Rain Offset</span>
          <strong className="text-base text-emerald-600 dark:text-emerald-400">-{data.effective_rain_liters} L</strong>
        </div>

        <div className="p-3 rounded-2xl bg-cream-50/80 dark:bg-forest-800/80 border border-sage-500/10">
          <span className="block opacity-70">Net Tap Water</span>
          <strong className="text-base text-sunrise-500">{data.net_water_needed_liters} L</strong>
        </div>
      </div>

      {/* Skip Days List */}
      {data.skip_days && data.skip_days.length > 0 && (
        <div className="bg-botanical-sky/10 border border-botanical-sky/30 rounded-2xl p-3 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-botanical-sky">
            <CalendarX className="w-4 h-4" />
            <span>Recommended Days to Skip Watering:</span>
          </div>
          <ul className="space-y-1 pl-5 list-disc text-forest-800/90 dark:text-cream-50/90">
            {data.skip_days.map((sd: any, idx: number) => (
              <li key={idx}>
                <strong>{sd.date}:</strong> {sd.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
