import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { searchCitiesApi } from '../utils/api';
import { Sprout, MapPin, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile, setCity, setCoords, loadWeeklyPlan } = useApp();
  const [step, setStep] = useState(1);

  const [inputCity, setInputCity] = useState(profile.city);
  const [selectedGardenType, setSelectedGardenType] = useState<any>(profile.garden_type);
  const [selectedExp, setSelectedExp] = useState<any>(profile.experience_level);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  if (!isOpen) return null;

  const handleCitySearch = async (val: string) => {
    setInputCity(val);
    if (val.length >= 2) {
      try {
        const results = await searchCitiesApi(val);
        setSearchResults(results);
      } catch (e) {
        console.error(e);
      }
    } else {
      setSearchResults([]);
    }
  };

  const selectCity = (c: any) => {
    setInputCity(c.name);
    setCity(c.name);
    setCoords(c.latitude, c.longitude);
    setSearchResults([]);
  };

  const handleFinish = async () => {
    await updateProfile({
      city: inputCity,
      garden_type: selectedGardenType,
      experience_level: selectedExp,
    });
    loadWeeklyPlan(inputCity);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-900/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-card max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-lift border border-sage-500/30 text-forest-900 dark:text-cream-50 relative"
        >
          {/* Progress Bar */}
          <div className="flex items-center justify-between text-xs font-bold text-sage-600 dark:text-sage-400 mb-6">
            <span>Step {step} of 3</span>
            <div className="flex gap-1.5">
              <div className={`w-6 h-1.5 rounded-full ${step >= 1 ? 'bg-sage-500' : 'bg-sage-200 dark:bg-forest-800'}`} />
              <div className={`w-6 h-1.5 rounded-full ${step >= 2 ? 'bg-sage-500' : 'bg-sage-200 dark:bg-forest-800'}`} />
              <div className={`w-6 h-1.5 rounded-full ${step >= 3 ? 'bg-sage-500' : 'bg-sage-200 dark:bg-forest-800'}`} />
            </div>
          </div>

          {/* Step 1: City Search */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sage-500 text-cream-50 flex items-center justify-center font-bold text-2xl mb-2">
                📍
              </div>
              <h3 className="text-2xl font-serif font-bold">Where is your garden located?</h3>
              <p className="text-xs text-forest-800/70 dark:text-cream-50/70">
                We'll fetch real 7-day weather data from Open-Meteo to ground every plant recommendation.
              </p>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter city (e.g. Mumbai, Pune, London)..."
                  value={inputCity}
                  onChange={(e) => handleCitySearch(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-cream-50 dark:bg-forest-800 border border-sage-500/30 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500"
                />
                {searchResults.length > 0 && (
                  <div className="absolute left-0 right-0 mt-2 bg-cream-50 dark:bg-forest-800 rounded-xl shadow-lift border border-sage-500/20 max-h-40 overflow-y-auto z-50">
                    {searchResults.map((res) => (
                      <div
                        key={res.id}
                        onClick={() => selectCity(res)}
                        className="px-4 py-2 hover:bg-sage-100 dark:hover:bg-forest-900 cursor-pointer text-xs flex justify-between"
                      >
                        <span className="font-bold">{res.name}</span>
                        <span className="opacity-70">{res.country}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Garden Type */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-botanical-gold text-forest-900 flex items-center justify-center font-bold text-2xl mb-2">
                🏡
              </div>
              <h3 className="text-2xl font-serif font-bold">What type of space do you have?</h3>
              <p className="text-xs text-forest-800/70 dark:text-cream-50/70">
                This filters container-friendly crops and container sizing.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'balcony', label: 'Balcony', desc: 'Container friendly pots & grow bags' },
                  { id: 'terrace', label: 'Terrace', desc: 'Roof garden & raised beds' },
                  { id: 'ground', label: 'Ground Yard', desc: 'Open soil beds & ground garden' },
                  { id: 'indoor', label: 'Indoor / Windowsill', desc: 'Microgreens & indoor herbs' },
                ].map((type) => (
                  <div
                    key={type.id}
                    onClick={() => setSelectedGardenType(type.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      selectedGardenType === type.id
                        ? 'bg-sage-500 text-cream-50 border-sage-500 shadow-soft'
                        : 'bg-cream-50/80 dark:bg-forest-800/80 border-sage-500/20 hover:border-sage-500'
                    }`}
                  >
                    <strong className="block text-sm font-bold mb-1">{type.label}</strong>
                    <span className="text-[11px] opacity-80 leading-tight block">{type.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Experience Level */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sunrise-500 text-cream-50 flex items-center justify-center font-bold text-2xl mb-2">
                🌱
              </div>
              <h3 className="text-2xl font-serif font-bold">What is your experience level?</h3>
              <p className="text-xs text-forest-800/70 dark:text-cream-50/70">
                We'll tailor germination steps and plant difficulty.
              </p>

              <div className="space-y-2.5">
                {[
                  { id: 'beginner', label: 'Beginner Gardener', desc: 'Fast-growing, easy forgiving crops (microgreens, radishes, mint)' },
                  { id: 'intermediate', label: 'Intermediate', desc: 'Tomatoes, chillies, leafy greens, container vegetables' },
                  { id: 'expert', label: 'Expert Botanist', desc: 'Full garden diversity, root tubers, dwarf fruit trees' },
                ].map((lvl) => (
                  <div
                    key={lvl.id}
                    onClick={() => setSelectedExp(lvl.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedExp === lvl.id
                        ? 'bg-sage-500 text-cream-50 border-sage-500 shadow-soft'
                        : 'bg-cream-50/80 dark:bg-forest-800/80 border-sage-500/20 hover:border-sage-500'
                    }`}
                  >
                    <div>
                      <strong className="block text-sm font-bold">{lvl.label}</strong>
                      <span className="text-xs opacity-80">{lvl.desc}</span>
                    </div>
                    {selectedExp === lvl.id && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 flex items-center justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-sage-100 dark:bg-forest-800 hover:bg-sage-200 transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-5 py-2.5 text-xs font-bold rounded-xl bg-sage-500 text-cream-50 hover:bg-forest-800 transition-colors flex items-center gap-1 shadow-soft"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="px-6 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-sage-500 to-forest-800 text-cream-50 hover:opacity-90 transition-opacity flex items-center gap-1 shadow-soft"
              >
                <span>Start Gardening!</span>
                <Sprout className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
