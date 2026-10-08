import React, { useState } from 'react';
import { SpaceScannerResult } from '../types';
import { scanSpacePhotoApi } from '../utils/api';
import { Layers, Upload, Sun, Box, CheckCircle, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const SpaceScanner: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<SpaceScannerResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleScan = async () => {
    if (!selectedFile) return;
    setIsScanning(true);
    try {
      const res = await scanSpacePhotoApi(selectedFile);
      setResult(res);
    } catch (e) {
      alert('Space scan failed. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-sage-600 dark:text-sage-400">
          Gemma 4 Vision AI
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-forest-800 dark:text-cream-50 mt-1">
          Space Scanner — Balcony & Yard Estimator
        </h2>
        <p className="text-xs sm:text-sm text-forest-800/70 dark:text-cream-50/70 mt-1">
          Upload a photo of your balcony, terrace, or windowsill to calculate sunlight hours, container capacity, and ideal plant matches.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Upload Panel */}
        <div className="glass-card rounded-3xl p-6 border border-sage-500/20 shadow-soft space-y-4">
          <h3 className="font-serif font-bold text-lg flex items-center gap-2">
            <Layers className="w-5 h-5 text-sage-500" />
            <span>Upload Garden Space Photo</span>
          </h3>

          <div className="relative border-2 border-dashed border-sage-500/40 rounded-2xl p-6 text-center hover:bg-sage-50/50 dark:hover:bg-forest-800/50 transition-colors cursor-pointer">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {previewUrl ? (
              <img src={previewUrl} alt="Space preview" className="max-h-48 mx-auto rounded-xl object-cover shadow-soft" />
            ) : (
              <div className="space-y-2 py-4">
                <Upload className="w-10 h-10 text-sage-500 mx-auto" />
                <span className="block text-xs font-bold text-forest-800 dark:text-cream-50">
                  Click or drag balcony/space photo
                </span>
                <span className="block text-[11px] text-forest-500 dark:text-sage-400">
                  Balcony, terrace, windowsill, or yard
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleScan}
            disabled={!selectedFile || isScanning}
            className="w-full py-3 rounded-2xl bg-sage-500 text-cream-50 font-bold text-xs hover:bg-forest-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-soft"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Scanning Space with Gemma 4...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Scan Space & Estimate Potential</span>
              </>
            )}
          </button>
        </div>

        {/* Results Panel */}
        <div>
          {result ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-3xl p-6 border border-sage-500/30 shadow-soft space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-sage-600 dark:text-sage-400">
                    Detected Space Type
                  </span>
                  <h3 className="font-serif font-bold text-xl text-forest-800 dark:text-cream-50">
                    {result.space_type}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-sunrise-500 flex items-center gap-1">
                    <Sun className="w-4 h-4" /> {result.estimated_sunlight_hours}
                  </span>
                  <span className="text-[10px] opacity-70 block">{result.sunlight_quality}</span>
                </div>
              </div>

              <p className="text-xs text-forest-800/90 dark:text-cream-50/90 bg-sage-500/10 p-3 rounded-2xl border border-sage-500/20 leading-relaxed">
                "{result.space_assessment}"
              </p>

              {/* Recommended Containers */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-sage-600 dark:text-sage-400 flex items-center gap-1">
                  <Box className="w-4 h-4" /> Recommended Containers
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {result.recommended_container_types?.map((c, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-full bg-cream-50 dark:bg-forest-800 border border-sage-500/20 text-xs">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Best Plant Matches */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Best Plant Matches for this Layout
                </h4>
                <div className="space-y-1.5">
                  {result.best_plant_matches?.map((m, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                      <strong className="block font-bold text-forest-900 dark:text-cream-50">{m.plant_name}</strong>
                      <span className="opacity-80 text-[11px]">{m.reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Layout Tips */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-forest-500 dark:text-sage-400">
                  Optimal Layout Tips
                </h4>
                <ul className="list-disc list-inside text-xs text-forest-800/80 dark:text-cream-50/80 space-y-0.5">
                  {result.layout_tips?.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ) : (
            <div className="glass-card rounded-3xl p-8 text-center space-y-3 border border-sage-500/20 h-full flex flex-col items-center justify-center">
              <Layers className="w-12 h-12 text-sage-400 opacity-60" />
              <h4 className="font-serif font-bold text-base">No Space Photo Analyzed</h4>
              <p className="text-xs text-forest-800/60 dark:text-cream-50/60 max-w-xs">
                Upload a balcony photo on the left to estimate sunlight hours and grow container potential.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
