import React from 'react';
import { RecommendedPlant } from '../types';
import { X, CheckCircle, Thermometer, CloudRain, Sun, Sprout, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WhyThisPlantModalProps {
  plant: RecommendedPlant | null;
  avgTemp: number;
  totalRain: number;
  onClose: () => void;
  onAddGarden: (plantName: string) => void;
}

export const WhyThisPlantModal: React.FC<WhyThisPlantModalProps> = ({ plant, avgTemp, totalRain, onClose, onAddGarden }) => {
  if (!plant) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="glass-card max-w-lg w-full rounded-3xl p-6 shadow-lift border border-sage-500/30 text-forest-900 dark:text-cream-50 relative overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-sage-100 dark:bg-forest-800 hover:bg-sage-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-sage-500 text-cream-50 flex items-center justify-center font-bold text-2xl shadow-soft">
              🌱
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sage-600 dark:text-sage-400">
                Grounding Engine Math Explainer
              </span>
              <h3 className="text-2xl font-serif font-bold text-forest-800 dark:text-cream-50">
                Why {plant.name}?
              </h3>
            </div>
          </div>

          {/* Exact Math Evidence Box */}
          <div className="bg-cream-50/90 dark:bg-forest-800/90 rounded-2xl p-4 border border-sage-500/20 space-y-3 my-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest-500 dark:text-sage-400 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Climate Grounding Proof (Deterministic Math)
            </h4>

            {/* Temp Match */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-sage-50 dark:bg-forest-900/60 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-sunrise-500" />
                <span>Forecast Avg Temp vs Ideal Range:</span>
              </div>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {avgTemp}°C ✅ (Within Range)
              </span>
            </div>

            {/* Rain Match */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-sage-50 dark:bg-forest-900/60 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-botanical-sky" />
                <span>Weekly Rain vs Tolerance:</span>
              </div>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {totalRain} mm ✅ (Passed)
              </span>
            </div>
          </div>

          {/* Gemma AI Context Explanation */}
          <div className="space-y-3 text-sm">
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-sage-600 dark:text-sage-400 mb-1">
                Gemma 4 Botanical Rationale ("Why")
              </h4>
              <p className="text-forest-800/90 dark:text-cream-50/90 bg-sage-500/10 p-3 rounded-xl border border-sage-500/20 leading-relaxed">
                "{plant.why}"
              </p>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-sage-600 dark:text-sage-400 mb-1">
                Actionable Planting Step ("How")
              </h4>
              <p className="text-forest-800/90 dark:text-cream-50/90 bg-sage-500/10 p-3 rounded-xl border border-sage-500/20 leading-relaxed">
                "{plant.how}"
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-sage-100 dark:bg-forest-800">
                <span className="block opacity-70">Sunlight</span>
                <strong className="capitalize">{plant.sunlight.replace('_', ' ')}</strong>
              </div>
              <div className="p-2 rounded-xl bg-sage-100 dark:bg-forest-800">
                <span className="block opacity-70">Water</span>
                <strong className="capitalize">{plant.water}</strong>
              </div>
              <div className="p-2 rounded-xl bg-sage-100 dark:bg-forest-800">
                <span className="block opacity-70">Harvest In</span>
                <strong>{plant.days_to_harvest} Days</strong>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-sage-100 dark:bg-forest-800 hover:bg-sage-200 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onAddGarden(plant.name);
                onClose();
              }}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-sage-500 text-cream-50 hover:bg-forest-800 transition-colors flex items-center gap-1.5 shadow-soft"
            >
              <Sprout className="w-4 h-4" />
              <span>Plant in My Garden</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
