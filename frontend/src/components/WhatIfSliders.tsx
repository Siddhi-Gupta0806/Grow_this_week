import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { whatifApi } from '../utils/api';
import { Sliders, Thermometer, CloudRain, Sparkles, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export const WhatIfSliders: React.FC = () => {
  const { city, weather } = useApp();

  const [temp, setTemp] = useState<number>(weather?.avg_temp || 26);
  const [rain, setRain] = useState<number>(weather?.total_rain_mm || 10);
  const [results, setResults] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = async (newTemp: number, newRain: number) => {
    setIsSimulating(true);
    try {
      const res = await whatifApi(city, newTemp, newRain);
      setResults(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleTempChange = (val: number) => {
    setTemp(val);
    runSimulation(val, rain);
  };

  const handleRainChange = (val: number) => {
    setRain(val);
    runSimulation(temp, val);
  };

  return (
    <div className="glass-card rounded-3xl p-5 border border-sage-500/20 shadow-soft space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-sunrise-500" />
          <h3 className="font-serif font-bold text-lg text-forest-800 dark:text-cream-50">
            "What If" Climate Simulator
          </h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sunrise-500/20 text-sunrise-500">
          Instant Re-Grounding
        </span>
      </div>

      <p className="text-xs text-forest-800/80 dark:text-cream-50/80">
        Drag sliders to simulate sudden heat waves or heavy rains and watch how candidate crops adapt in real-time:
      </p>

      {/* Sliders */}
      <div className="space-y-4 bg-cream-50/80 dark:bg-forest-800/80 p-4 rounded-2xl border border-sage-500/10">
        
        {/* Temperature Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold">
            <span className="flex items-center gap-1 text-sunrise-500">
              <Thermometer className="w-4 h-4" />
              Simulated Average Temp:
            </span>
            <span className="text-sm">{temp}°C</span>
          </div>
          <input
            type="range"
            min="5"
            max="45"
            step="1"
            value={temp}
            onChange={(e) => handleTempChange(parseFloat(e.target.value))}
            className="w-full accent-sunrise-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] opacity-60">
            <span>5°C (Cold Frost)</span>
            <span>25°C (Mild)</span>
            <span>45°C (Extreme Heat)</span>
          </div>
        </div>

        {/* Rain Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold">
            <span className="flex items-center gap-1 text-botanical-sky">
              <CloudRain className="w-4 h-4" />
              Simulated Rainfall:
            </span>
            <span className="text-sm">{rain} mm</span>
          </div>
          <input
            type="range"
            min="0"
            max="120"
            step="5"
            value={rain}
            onChange={(e) => handleRainChange(parseFloat(e.target.value))}
            className="w-full accent-botanical-sky cursor-pointer"
          />
          <div className="flex justify-between text-[10px] opacity-60">
            <span>0 mm (Dry Drought)</span>
            <span>40 mm (Heavy Rain Threshold)</span>
            <span>120 mm (Monsoon Storm)</span>
          </div>
        </div>
      </div>

      {/* Simulation Results */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-sage-500/10 border border-sage-500/30 rounded-2xl p-4 space-y-3"
        >
          <div className="flex items-center justify-between text-xs font-bold text-forest-800 dark:text-cream-50">
            <span>{results.candidate_count} Plants Match This Climate Window:</span>
            {isSimulating && <RefreshCw className="w-3.5 h-3.5 animate-spin text-sage-500" />}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {results.recommended_plants?.map((p: any, idx: number) => (
              <div key={idx} className="bg-cream-50/90 dark:bg-forest-800/90 p-2.5 rounded-xl border border-sage-500/20 text-xs">
                <strong className="block font-bold text-forest-900 dark:text-cream-50">{p.name}</strong>
                <span className="text-[10px] text-forest-500 dark:text-sage-400 capitalize">
                  {p.category} ({p.temp_min}°C - {p.temp_max}°C)
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
