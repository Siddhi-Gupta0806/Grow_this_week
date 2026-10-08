import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RecommendedPlant } from '../types';
import { WhyThisPlantModal } from './WhyThisPlantModal';
import { AudioPlayer } from './AudioPlayer';
import { addGardenItemApi } from '../utils/api';
import confetti from 'canvas-confetti';
import { Sprout, HelpCircle, ShieldAlert, AlertTriangle, Sparkles, Printer, Share2, Sun, Droplets, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export const WeeklyPlanCard: React.FC = () => {
  const { weeklyPlan, weather, isLoadingPlan, refreshGarden, setActiveTab } = useApp();
  const [selectedPlant, setSelectedPlant] = useState<RecommendedPlant | null>(null);

  const handleAddGarden = async (plantName: string) => {
    const today = new Date().toISOString().slice(0, 10);
    try {
      await addGardenItemApi(plantName, today);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      await refreshGarden();
      alert(`🎉 Added ${plantName} to your active garden!`);
    } catch (e) {
      alert('Failed to add plant.');
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  if (isLoadingPlan) {
    return (
      <div className="w-full space-y-4 animate-pulse">
        <div className="h-8 bg-sage-200 dark:bg-forest-800 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-64 bg-sage-200 dark:bg-forest-800 rounded-3xl"></div>
          <div className="h-64 bg-sage-200 dark:bg-forest-800 rounded-3xl"></div>
          <div className="h-64 bg-sage-200 dark:bg-forest-800 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (!weeklyPlan) return null;

  return (
    <div className="w-full space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sage-500 text-cream-50">
              Gemma 4 Grounded
            </span>
            <span className="text-xs text-forest-500 dark:text-sage-400">
              Filtered from 200+ botanical database candidates
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-forest-800 dark:text-cream-50 mt-1">
            This Week's Planting Plan
          </h2>
        </div>

        {/* Action Buttons: Print PDF & Shareable Card */}
        <div className="flex items-center gap-2 no-print">
          <button
            onClick={handlePrintPdf}
            className="px-3 py-1.5 text-xs font-semibold rounded-full bg-cream-50 dark:bg-forest-800 border border-sage-500/30 text-forest-800 dark:text-cream-50 hover:bg-sage-100 flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4 text-sage-500" />
            <span>Print PDF Plan</span>
          </button>
          <button
            onClick={() => setActiveTab('share')}
            className="px-3 py-1.5 text-xs font-semibold rounded-full bg-cream-50 dark:bg-forest-800 border border-sage-500/30 text-forest-800 dark:text-cream-50 hover:bg-sage-100 flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-4 h-4 text-sunrise-500" />
            <span>Share Card</span>
          </button>
        </div>
      </div>

      {/* Tip of the Day with ElevenLabs Audio Player */}
      {weeklyPlan.tip_of_the_day && (
        <div className="glass-card rounded-3xl p-5 border border-sage-500/20 shadow-soft bg-gradient-to-r from-sage-500/10 via-botanical-gold/10 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-botanical-gold text-forest-900 flex items-center justify-center flex-shrink-0 font-bold">
              💡
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sage-600 dark:text-sage-400">
                Daily Botanical Tip
              </span>
              <p className="text-sm font-medium text-forest-900 dark:text-cream-50 mt-0.5">
                "{weeklyPlan.tip_of_the_day}"
              </p>
            </div>
          </div>
          <AudioPlayer text={weeklyPlan.tip_of_the_day} />
        </div>
      )}

      {/* Protect & Avoid Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Protect Alert */}
        <div className="p-4 rounded-2xl bg-sunrise-500/10 border border-sunrise-500/30 text-sunrise-900 dark:text-sunrise-200 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-sunrise-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <strong className="block font-bold mb-0.5">Protect Your Plants This Week:</strong>
            <p className="opacity-90">{weeklyPlan.protect}</p>
          </div>
        </div>

        {/* Avoid Alert */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <strong className="block font-bold mb-0.5">Avoid Planting This Week:</strong>
            <ul className="list-disc list-inside space-y-0.5 opacity-90">
              {weeklyPlan.avoid_this_week.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Recommended Plants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {weeklyPlan.plant_now.map((plant, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.3 }}
            className="glass-card rounded-3xl p-5 border border-sage-500/20 shadow-soft flex flex-col justify-between hover:shadow-lift hover:-translate-y-1 transition-all group"
          >
            <div>
              {/* Plant Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-sage-500 text-cream-50 flex items-center justify-center font-bold text-xl shadow-soft">
                    🌱
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-forest-800 dark:text-cream-50 group-hover:text-sage-500 transition-colors">
                      {plant.name}
                    </h3>
                    <span className="text-[11px] text-forest-500 dark:text-sage-400">
                      Harvest in ~{plant.days_to_harvest} days
                    </span>
                  </div>
                </div>

                {/* Why This Plant Button */}
                <button
                  onClick={() => setSelectedPlant(plant)}
                  title="Why this plant?"
                  className="px-2.5 py-1 text-xs font-semibold rounded-full bg-sage-100 dark:bg-forest-800 text-sage-600 dark:text-sage-300 hover:bg-sage-500 hover:text-cream-50 transition-colors flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Why?</span>
                </button>
              </div>

              {/* Rationale ("Why") */}
              <div className="mb-3 text-xs bg-cream-50/80 dark:bg-forest-800/80 p-3 rounded-2xl border border-sage-500/10">
                <strong className="block text-sage-600 dark:text-sage-400 mb-1 uppercase tracking-wider text-[10px]">
                  Why this week:
                </strong>
                <p className="text-forest-900/90 dark:text-cream-50/90 leading-relaxed">
                  {plant.why}
                </p>
              </div>

              {/* Actionable How-to ("How") */}
              <div className="mb-4 text-xs bg-cream-50/80 dark:bg-forest-800/80 p-3 rounded-2xl border border-sage-500/10">
                <strong className="block text-sage-600 dark:text-sage-400 mb-1 uppercase tracking-wider text-[10px]">
                  How to plant:
                </strong>
                <p className="text-forest-900/90 dark:text-cream-50/90 leading-relaxed">
                  {plant.how}
                </p>
              </div>

              {/* Requirements Chips */}
              <div className="grid grid-cols-3 gap-2 text-[11px] text-center text-forest-800/80 dark:text-cream-50/80 mb-4">
                <div className="p-1.5 rounded-xl bg-sage-50 dark:bg-forest-900/50 flex flex-col items-center">
                  <Sun className="w-3.5 h-3.5 text-botanical-gold mb-0.5" />
                  <span className="capitalize">{plant.sunlight.replace('_', ' ')}</span>
                </div>
                <div className="p-1.5 rounded-xl bg-sage-50 dark:bg-forest-900/50 flex flex-col items-center">
                  <Droplets className="w-3.5 h-3.5 text-botanical-sky mb-0.5" />
                  <span className="capitalize">{plant.water}</span>
                </div>
                <div className="p-1.5 rounded-xl bg-sage-50 dark:bg-forest-900/50 flex flex-col items-center">
                  <Clock className="w-3.5 h-3.5 text-sunrise-400 mb-0.5" />
                  <span>{plant.days_to_harvest}d harvest</span>
                </div>
              </div>
            </div>

            {/* Add to Garden Button */}
            <button
              onClick={() => handleAddGarden(plant.name)}
              className="w-full py-2.5 rounded-xl bg-sage-500 text-cream-50 font-bold text-xs hover:bg-forest-800 transition-colors flex items-center justify-center gap-1.5 shadow-soft"
            >
              <Sprout className="w-4 h-4" />
              <span>Add to My Garden</span>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Why This Plant Modal */}
      <WhyThisPlantModal
        plant={selectedPlant}
        avgTemp={weather?.avg_temp || 26}
        totalRain={weather?.total_rain_mm || 10}
        onClose={() => setSelectedPlant(null)}
        onAddGarden={handleAddGarden}
      />
    </div>
  );
};
