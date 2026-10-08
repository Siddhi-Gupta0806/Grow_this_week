import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { WeatherBackground } from './components/WeatherBackground';
import { WeatherDashboard } from './components/WeatherDashboard';
import { WeeklyPlanCard } from './components/WeeklyPlanCard';
import { WhatIfSliders } from './components/WhatIfSliders';
import { MyGarden } from './components/MyGarden';
import { PlantDoctor } from './components/PlantDoctor';
import { SpaceScanner } from './components/SpaceScanner';
import { AskGemmaChat } from './components/AskGemmaChat';
import { HarvestJournal } from './components/HarvestJournal';
import { ShareableCard } from './components/ShareableCard';
import { UnderTheHood } from './components/UnderTheHood';
import { OnboardingModal } from './components/OnboardingModal';
import { Sprout, Sparkles, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, loadWeeklyPlan, weather, enableDemoMode } = useApp();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  useEffect(() => {
    // Initial fetch for Mumbai on app start
    loadWeeklyPlan();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col selection:bg-sage-400 selection:text-forest-900 pb-20 lg:pb-12">
      <WeatherBackground />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8 z-10">
        
        {/* TAB 1: HOME / DASHBOARD */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            
            {/* Landing Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-3xl p-6 sm:p-10 border border-sage-500/30 shadow-lift relative overflow-hidden bg-gradient-to-br from-forest-900/90 via-forest-800/80 to-sage-900/70 text-cream-50"
            >
              <div className="max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-500/30 text-sage-300 text-xs font-bold border border-sage-500/40">
                  <Sparkles className="w-3.5 h-3.5 text-botanical-gold" />
                  <span>Hacktoberfest Open-Source AI Challenge Entry</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight leading-tight">
                  What to plant <span className="text-sage-400 italic">this week</span> based on real 7-day weather.
                </h1>
                <p className="text-sm sm:text-base text-cream-50/80 leading-relaxed">
                  GrowThisWeek uses Gemma 4 open-source AI grounded in live Open-Meteo climate forecasts to recommend optimal crops, prevent weather risks, and maximize your garden harvest.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setIsOnboardingOpen(true)}
                    className="px-5 py-3 rounded-2xl bg-sage-500 text-cream-50 font-bold text-xs sm:text-sm hover:bg-emerald-600 transition-colors shadow-soft flex items-center gap-2"
                  >
                    <span>Set Up My Garden</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={enableDemoMode}
                    className="px-5 py-3 rounded-2xl bg-cream-50/10 hover:bg-cream-50/20 text-cream-50 font-bold text-xs sm:text-sm border border-cream-50/20 transition-colors flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-botanical-gold" />
                    <span>Try 10-Second Demo</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Weather Dashboard */}
            <WeatherDashboard />

            {/* Weekly Plan */}
            <WeeklyPlanCard />

            {/* What-If Climate Simulator */}
            <WhatIfSliders />
          </div>
        )}

        {/* TAB 2: WEEKLY PLAN */}
        {activeTab === 'plan' && (
          <div className="space-y-6">
            <WeeklyPlanCard />
            <WhatIfSliders />
          </div>
        )}

        {/* TAB 3: MY GARDEN */}
        {activeTab === 'garden' && <MyGarden />}

        {/* TAB 4: PLANT DOCTOR */}
        {activeTab === 'doctor' && <PlantDoctor />}

        {/* TAB 5: SPACE SCANNER */}
        {activeTab === 'scanner' && <SpaceScanner />}

        {/* TAB 6: ASK GEMMA CHAT */}
        {activeTab === 'chat' && <AskGemmaChat />}

        {/* TAB 7: HARVEST JOURNAL */}
        {activeTab === 'journal' && <HarvestJournal />}

        {/* TAB 8: SHARE CARD */}
        {activeTab === 'share' && <ShareableCard />}

        {/* TAB 9: TELEMETRY / UNDER THE HOOD */}
        {activeTab === 'telemetry' && <UnderTheHood />}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-sage-500/20 py-6 text-center text-xs text-forest-800/60 dark:text-cream-50/60">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>GrowThisWeek © 2026 — Built with Gemma 4, Open-Meteo, FastAPI & React.</span>
          <div className="flex items-center gap-3 font-semibold">
            <button onClick={() => setActiveTab('telemetry')} className="hover:underline">
              ⚡ Under The Hood
            </button>
            <span>•</span>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:underline">
              MIT License
            </a>
          </div>
        </div>
      </footer>

      {/* Onboarding Wizard Modal */}
      <OnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;
