import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getGardenHealthScoreApi } from '../utils/api';
import { ShieldCheck, PlusCircle, MinusCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const GardenHealthScore: React.FC = () => {
  const { lat, lon, gardenItems } = useApp();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getGardenHealthScoreApi(lat, lon)
      .then(setData)
      .catch(console.error);
  }, [lat, lon, gardenItems.length]);

  if (!data) return null;

  const score = data.score;
  const strokeDashoffset = 283 - (283 * score) / 100;

  return (
    <div className="glass-card rounded-3xl p-5 border border-sage-500/20 shadow-soft">
      <div className="flex flex-col sm:flex-row items-center gap-5">
        
        {/* Ring Chart Gauge */}
        <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              className="text-sage-100 dark:text-forest-800 stroke-current"
              strokeWidth="10"
              fill="transparent"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              className="text-sage-500 stroke-current"
              strokeWidth="10"
              strokeDasharray="283"
              initial={{ strokeDashoffset: 283 }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: 'easeOut' }}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black font-serif text-forest-800 dark:text-cream-50">{score}</span>
            <span className="text-[10px] uppercase font-bold text-sage-600 dark:text-sage-400">Score</span>
          </div>
        </div>

        {/* Breakdown details */}
        <div className="flex-1 space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h3 className="font-serif font-bold text-lg text-forest-800 dark:text-cream-50">
              Garden Health: {data.grade}
            </h3>
          </div>
          <p className="text-xs text-forest-800/80 dark:text-cream-50/80 leading-relaxed">
            {data.explanation}
          </p>

          {/* Factor Chips */}
          <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
            {data.factors?.map((f: any, idx: number) => (
              <span
                key={idx}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                  f.type === 'positive'
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30'
                }`}
              >
                {f.type === 'positive' ? <PlusCircle className="w-3 h-3" /> : <MinusCircle className="w-3 h-3" />}
                <span>{f.name} ({f.points})</span>
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
