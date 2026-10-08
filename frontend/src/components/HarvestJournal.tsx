import React, { useState, useEffect } from 'react';
import { HarvestEntry } from '../types';
import { getHarvestJournalApi, addHarvestEntryApi } from '../utils/api';
import confetti from 'canvas-confetti';
import { BookOpen, Scale, Plus, Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export const HarvestJournal: React.FC = () => {
  const [entries, setEntries] = useState<HarvestEntry[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [plantName, setPlantName] = useState('');
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().slice(0, 10));
  const [weightGrams, setWeightGrams] = useState<number>(150);
  const [notes, setNotes] = useState('');

  const loadJournal = () => {
    getHarvestJournalApi().then(setEntries).catch(console.error);
  };

  useEffect(() => {
    loadJournal();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plantName.trim()) return;
    try {
      await addHarvestEntryApi(plantName, harvestDate, weightGrams, notes);
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      setPlantName('');
      setNotes('');
      setIsAdding(false);
      loadJournal();
    } catch (err) {
      alert('Failed to log harvest.');
    }
  };

  const totalWeightKg = (entries.reduce((acc, curr) => acc + curr.weight_grams, 0) / 1000).toFixed(2);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sage-600 dark:text-sage-400">
            Garden Productivity Tracker
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-forest-800 dark:text-cream-50 mt-1">
            Harvest Journal
          </h2>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 text-xs font-bold rounded-2xl bg-sage-500 text-cream-50 hover:bg-forest-800 transition-colors flex items-center gap-1.5 shadow-soft self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Harvest</span>
        </button>
      </div>

      {/* Summary Stat Card */}
      <div className="glass-card rounded-3xl p-5 border border-sage-500/20 shadow-soft flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-cream-50 flex items-center justify-center font-bold text-2xl shadow-soft">
            🧺
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sage-600 dark:text-sage-400">
              Total Organic Yield
            </span>
            <h3 className="text-2xl font-serif font-bold text-forest-800 dark:text-cream-50">
              {totalWeightKg} kg harvested ({entries.length} yields)
            </h3>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
          <TrendingUp className="w-4 h-4" />
          <span>Active Streak!</span>
        </div>
      </div>

      {/* Add Log Drawer */}
      {isAdding && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={handleCreate}
          className="glass-card rounded-3xl p-5 border border-sage-500/30 space-y-4"
        >
          <h3 className="font-serif font-bold text-lg">Record Fresh Harvest</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Crop Name</label>
              <input
                type="text"
                placeholder="e.g. Cherry Tomato, Spinach"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-cream-50 dark:bg-forest-800 border border-sage-500/30 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Harvest Date</label>
              <input
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-cream-50 dark:bg-forest-800 border border-sage-500/30 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Weight (Grams)</label>
              <input
                type="number"
                value={weightGrams}
                onChange={(e) => setWeightGrams(parseFloat(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-cream-50 dark:bg-forest-800 border border-sage-500/30 text-xs focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Notes (taste, quality)</label>
            <input
              type="text"
              placeholder="e.g. Super sweet & juicy cherry tomatoes from balcony!"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-cream-50 dark:bg-forest-800 border border-sage-500/30 text-xs focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-sage-100 dark:bg-forest-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-sage-500 text-cream-50 shadow-soft"
            >
              Save Harvest
            </button>
          </div>
        </motion.form>
      )}

      {/* History List */}
      <div className="space-y-3">
        {entries.length === 0 ? (
          <p className="text-xs text-forest-500 dark:text-sage-400 italic">
            No harvests recorded yet. Click "+ Log New Harvest" after your first picking!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {entries.map((item) => (
              <div
                key={item.id}
                className="glass-card rounded-2xl p-4 border border-sage-500/20 text-xs flex items-center justify-between"
              >
                <div>
                  <h4 className="font-serif font-bold text-sm text-forest-800 dark:text-cream-50">
                    {item.plant_name}
                  </h4>
                  <span className="text-[11px] opacity-70 block">
                    {item.harvest_date} • {item.notes}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                    {item.weight_grams} g
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
