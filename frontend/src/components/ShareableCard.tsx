import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import html2canvas from 'html2canvas';
import { Download, Sprout, Calendar, MapPin, Sparkles } from 'lucide-react';

export const ShareableCard: React.FC = () => {
  const { city, weather, weeklyPlan } = useApp();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `GrowThisWeek_${city}_Plan.png`;
      link.click();
    } catch (e) {
      alert('Failed to generate image card.');
    }
  };

  if (!weeklyPlan) return null;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif font-bold text-xl text-forest-800 dark:text-cream-50">
          Shareable Weekly Plan Card
        </h3>
        <button
          onClick={handleDownloadImage}
          className="px-4 py-2 text-xs font-bold rounded-2xl bg-sage-500 text-cream-50 hover:bg-forest-800 transition-colors flex items-center gap-1.5 shadow-soft"
        >
          <Download className="w-4 h-4" />
          <span>Download Image</span>
        </button>
      </div>

      {/* The Printable / Downloadable Card */}
      <div
        ref={cardRef}
        className="bg-gradient-to-br from-forest-900 via-forest-800 to-sage-900 text-cream-50 p-8 rounded-3xl shadow-lift border-2 border-sage-400/30 space-y-6 select-none"
      >
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-sage-500/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sage-500 text-cream-50 flex items-center justify-center font-bold text-2xl shadow-soft">
              🌱
            </div>
            <div>
              <h2 className="font-serif font-bold text-2xl tracking-tight">GrowThisWeek</h2>
              <span className="text-xs text-sage-300">Grounded AI Garden Planner</span>
            </div>
          </div>
          <div className="text-right text-xs text-sage-300">
            <div className="flex items-center gap-1 justify-end font-bold text-cream-50">
              <MapPin className="w-3.5 h-3.5 text-sunrise-400" />
              <span>{city}</span>
            </div>
            <span>Avg Temp: {weather?.avg_temp}°C</span>
          </div>
        </div>

        {/* Crops List */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-sage-400 block">
            This Week's Optimal Planting Choices:
          </span>
          <div className="grid grid-cols-2 gap-3">
            {weeklyPlan.plant_now.slice(0, 4).map((plant, idx) => (
              <div key={idx} className="bg-forest-800/80 p-3 rounded-2xl border border-sage-500/20 text-xs">
                <strong className="block font-bold text-base text-cream-50">{plant.name}</strong>
                <span className="text-[11px] text-sage-300">{plant.why}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card Footer */}
        <div className="pt-3 border-t border-sage-500/30 flex items-center justify-between text-[11px] text-sage-400">
          <span>Powered by Gemma 4 AI & Open-Meteo</span>
          <span>#GrowThisWeek #DEVHacktoberfest</span>
        </div>
      </div>
    </div>
  );
};
