import React, { useState, useEffect } from 'react';
import { getCompanionMapApi } from '../utils/api';
import { Heart, AlertTriangle, Users } from 'lucide-react';

export const CompanionMap: React.FC = () => {
  const [mapData, setMapData] = useState<any>(null);

  useEffect(() => {
    getCompanionMapApi().then(setMapData).catch(console.error);
  }, []);

  if (!mapData || !mapData.matrix) return null;

  return (
    <div className="glass-card rounded-3xl p-5 border border-sage-500/20 shadow-soft space-y-3">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-sage-500" />
        <h3 className="font-serif font-bold text-lg text-forest-800 dark:text-cream-50">
          Companion Planting Map
        </h3>
      </div>
      <p className="text-xs text-forest-800/70 dark:text-cream-50/70">
        Visual breakdown of plant relationships in your active garden:
      </p>

      {mapData.matrix.length === 0 ? (
        <p className="text-xs text-forest-500 dark:text-sage-400 italic">
          Add at least 2 plants to your garden to analyze companion compatibility.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {mapData.matrix.map((item: any, idx: number) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl border text-xs flex items-center gap-2.5 ${
                item.relationship === 'companion'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                  : item.relationship === 'antagonist'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200'
                  : 'bg-sage-50 dark:bg-forest-800 border-sage-500/10 text-forest-800 dark:text-cream-50'
              }`}
            >
              {item.relationship === 'companion' ? (
                <Heart className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              ) : item.relationship === 'antagonist' ? (
                <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              ) : (
                <Users className="w-4 h-4 text-sage-400 flex-shrink-0" />
              )}
              <div>
                <strong className="block font-bold">{item.plant1} & {item.plant2}</strong>
                <span className="opacity-80">{item.explanation}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
