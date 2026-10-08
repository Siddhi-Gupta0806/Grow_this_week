import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { addGardenItemApi, deleteGardenItemApi } from '../utils/api';
import { GardenHealthScore } from './GardenHealthScore';
import { CompanionMap } from './CompanionMap';
import { WaterSaver } from './WaterSaver';
import confetti from 'canvas-confetti';
import { Sprout, Plus, Trash2, Calendar, Clock, MapPin, Download, CheckCircle2, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

export const MyGarden: React.FC = () => {
  const { gardenItems, refreshGarden } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [plantName, setPlantName] = useState('');
  const [plantedDate, setPlantedDate] = useState(new Date().toISOString().slice(0, 10));
  const [location, setLocation] = useState('balcony');
  const [notes, setNotes] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plantName.trim()) return;
    try {
      await addGardenItemApi(plantName, plantedDate, location, notes);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      setPlantName('');
      setNotes('');
      setIsAdding(false);
      await refreshGarden();
    } catch (err) {
      alert('Failed to add plant.');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Remove ${name} from active garden?`)) {
      await deleteGardenItemApi(id);
      await refreshGarden();
    }
  };

  const handleDownloadIcs = () => {
    window.location.href = '/api/garden/calendar/ics';
  };

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sage-600 dark:text-sage-400">
            Active Garden Tracker
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-forest-800 dark:text-cream-50 mt-1">
            My Garden ({gardenItems.length} Plants)
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadIcs}
            className="px-3.5 py-2 text-xs font-semibold rounded-2xl bg-cream-50 dark:bg-forest-800 border border-sage-500/30 text-forest-800 dark:text-cream-50 hover:bg-sage-100 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-sage-500" />
            <span>Calendar .ics</span>
          </button>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-4 py-2 text-xs font-bold rounded-2xl bg-sage-500 text-cream-50 hover:bg-forest-800 transition-colors flex items-center gap-1.5 shadow-soft"
          >
            <Plus className="w-4 h-4" />
            <span>Add Plant</span>
          </button>
        </div>
      </div>

      {/* Add Plant Drawer Form */}
      {isAdding && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleCreate}
          className="glass-card rounded-3xl p-5 border border-sage-500/30 space-y-4"
        >
          <h3 className="font-serif font-bold text-lg text-forest-800 dark:text-cream-50">
            Plant a New Crop in Your Garden
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Plant Name</label>
              <input
                type="text"
                placeholder="e.g. Tomato, Mint, Chilli"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-cream-50 dark:bg-forest-800 border border-sage-500/30 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Planting Date</label>
              <input
                type="date"
                value={plantedDate}
                onChange={(e) => setPlantedDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-cream-50 dark:bg-forest-800 border border-sage-500/30 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-cream-50 dark:bg-forest-800 border border-sage-500/30 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              >
                <option value="balcony">Balcony Container</option>
                <option value="terrace">Terrace Grow Bag</option>
                <option value="ground">Ground Yard Bed</option>
                <option value="indoor">Indoor Windowsill</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Notes / Variety details</label>
            <input
              type="text"
              placeholder="e.g. Cherry variety in 12-inch terracotta pot..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-cream-50 dark:bg-forest-800 border border-sage-500/30 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
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
              className="px-5 py-2 text-xs font-bold rounded-xl bg-sage-500 text-cream-50 hover:bg-forest-800 transition-colors shadow-soft"
            >
              Save to Garden
            </button>
          </div>
        </motion.form>
      )}

      {/* Embedded Widgets Grid: Health Score & Water Saver */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <GardenHealthScore />
        <WaterSaver />
      </div>

      {/* Active Garden Items Grid */}
      <div className="space-y-3">
        <h3 className="font-serif font-bold text-xl text-forest-800 dark:text-cream-50">
          Active Crops ({gardenItems.length})
        </h3>

        {gardenItems.length === 0 ? (
          <div className="glass-card rounded-3xl p-8 text-center space-y-3 border border-sage-500/20">
            <div className="w-16 h-16 rounded-full bg-sage-100 dark:bg-forest-800 text-sage-500 flex items-center justify-center mx-auto text-3xl">
              🌱
            </div>
            <h4 className="font-serif font-bold text-lg">Your garden is empty!</h4>
            <p className="text-xs text-forest-800/70 dark:text-cream-50/70 max-w-sm mx-auto">
              Add your first plant or use "This Week's Plan" to populate your garden based on current 7-day weather.
            </p>
            <button
              onClick={() => setIsAdding(true)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-sage-500 text-cream-50 shadow-soft"
            >
              + Add First Plant
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gardenItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-3xl p-5 border border-sage-500/20 shadow-soft flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-sage-500 text-cream-50 flex items-center justify-center font-bold text-sm">
                        🌿
                      </div>
                      <h4 className="font-serif font-bold text-base text-forest-800 dark:text-cream-50">
                        {item.plant_name}
                      </h4>
                    </div>
                    <button
                      onClick={() => handleDelete(item.id, item.plant_name)}
                      className="text-rose-500 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-500/10 transition-colors"
                      title="Delete plant"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs text-forest-800/70 dark:text-cream-50/70 space-y-1 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-sage-500" />
                      <span>Planted on {item.planted_date} ({item.days_planted} days ago)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-sunrise-500" />
                      <span className="capitalize">Location: {item.location}</span>
                    </div>
                    {item.notes && <p className="italic text-[11px] opacity-80 pt-0.5">"{item.notes}"</p>}
                  </div>

                  {/* Growth Stage Progress Bar */}
                  <div className="bg-cream-50/80 dark:bg-forest-800/80 p-3 rounded-2xl border border-sage-500/10 space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-sage-600 dark:text-sage-400">{item.growth_stage}</span>
                      <span>{item.days_remaining}d to harvest</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-sage-200 dark:bg-forest-900 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sage-500 to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${item.progress_pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Companion Matrix */}
      <CompanionMap />
    </div>
  );
};
