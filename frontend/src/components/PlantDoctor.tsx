import React, { useState } from 'react';
import { DoctorDiagnosis } from '../types';
import { diagnoseDoctorPhotoApi } from '../utils/api';
import { Stethoscope, Upload, Camera, ShieldAlert, Loader2, CheckCircle, AlertTriangle, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

export const PlantDoctor: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DoctorDiagnosis | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please choose a smaller image.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setDiagnosis(null);
    }
  };

  const handleDiagnose = async () => {
    if (!selectedFile) return;
    setIsDiagnosing(true);
    try {
      const res = await diagnoseDoctorPhotoApi(selectedFile, notes);
      setDiagnosis(res);
    } catch (e) {
      alert('Diagnosis failed. Please try again.');
    } finally {
      setIsDiagnosing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-sage-600 dark:text-sage-400">
          Gemma 4 Vision AI
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-forest-800 dark:text-cream-50 mt-1">
          Plant Doctor — AI Health & Pest Diagnosis
        </h2>
        <p className="text-xs sm:text-sm text-forest-800/70 dark:text-cream-50/70 mt-1">
          Upload or capture a photo of yellow leaves, spots, or sick foliage to receive instant organic remedies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Upload Card */}
        <div className="glass-card rounded-3xl p-6 border border-sage-500/20 shadow-soft space-y-4">
          <h3 className="font-serif font-bold text-lg flex items-center gap-2">
            <Camera className="w-5 h-5 text-sage-500" />
            <span>Upload Sick Plant Photo</span>
          </h3>

          <div className="relative border-2 border-dashed border-sage-500/40 rounded-2xl p-6 text-center hover:bg-sage-50/50 dark:hover:bg-forest-800/50 transition-colors cursor-pointer">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {previewUrl ? (
              <img src={previewUrl} alt="Sick plant preview" className="max-h-48 mx-auto rounded-xl object-cover shadow-soft" />
            ) : (
              <div className="space-y-2 py-4">
                <Upload className="w-10 h-10 text-sage-500 mx-auto" />
                <span className="block text-xs font-bold text-forest-800 dark:text-cream-50">
                  Click or drag photo here
                </span>
                <span className="block text-[11px] text-forest-500 dark:text-sage-400">
                  JPEG, PNG, or WebP up to 5MB
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Optional Symptoms / Notes:</label>
            <input
              type="text"
              placeholder="e.g. Lower leaves yellowing, white powdery spots..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-cream-50 dark:bg-forest-800 border border-sage-500/30 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
            />
          </div>

          <button
            onClick={handleDiagnose}
            disabled={!selectedFile || isDiagnosing}
            className="w-full py-3 rounded-2xl bg-sage-500 text-cream-50 font-bold text-xs hover:bg-forest-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-soft"
          >
            {isDiagnosing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing Image with Gemma 4 Vision...</span>
              </>
            ) : (
              <>
                <Stethoscope className="w-4 h-4" />
                <span>Diagnose Plant Health</span>
              </>
            )}
          </button>
        </div>

        {/* Results Panel */}
        <div>
          {diagnosis ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-3xl p-6 border border-sage-500/30 shadow-soft space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-sage-600 dark:text-sage-400">
                    Identified Crop ({diagnosis.confidence}% Confidence)
                  </span>
                  <h3 className="font-serif font-bold text-xl text-forest-800 dark:text-cream-50">
                    {diagnosis.plant_name}
                  </h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  diagnosis.health_status.includes('Healthy')
                    ? 'bg-emerald-500/20 text-emerald-600'
                    : 'bg-amber-500/20 text-amber-600'
                }`}>
                  {diagnosis.health_status}
                </span>
              </div>

              {/* Suspected Issues */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-forest-500 dark:text-sage-400">
                  Suspected Issues
                </h4>
                {diagnosis.suspected_issues?.map((issue, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-cream-50/80 dark:bg-forest-800/80 border border-sage-500/10 text-xs space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>{issue.issue}</span>
                      <span className="text-amber-500">{issue.probability} Risk</span>
                    </div>
                    <p className="opacity-80 text-[11px]">{issue.symptoms_seen}</p>
                  </div>
                ))}
              </div>

              {/* Organic Treatment Steps */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Organic Low-Cost Remedies
                </h4>
                <ul className="space-y-1.5 text-xs text-forest-800/90 dark:text-cream-50/90 pl-2">
                  {diagnosis.organic_treatment_steps?.map((step, idx) => (
                    <li key={idx} className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mandatory AI Disclaimer */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>{diagnosis.disclaimer}</span>
              </div>
            </motion.div>
          ) : (
            <div className="glass-card rounded-3xl p-8 text-center space-y-3 border border-sage-500/20 h-full flex flex-col items-center justify-center">
              <Stethoscope className="w-12 h-12 text-sage-400 opacity-60" />
              <h4 className="font-serif font-bold text-base">No Photo Analyzed Yet</h4>
              <p className="text-xs text-forest-800/60 dark:text-cream-50/60 max-w-xs">
                Upload a photo on the left to receive immediate AI pest and disease identification.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
