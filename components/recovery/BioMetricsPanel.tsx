'use client';

import React, { useState } from 'react';
import { Droplet, Moon, Thermometer, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

interface BioMetricsPanelProps {
  initialWorkoutDuration?: number; // minutes
  initialTemperature?: number; // Fahrenheit
  initialSweatRate?: 'low' | 'moderate' | 'high';
  onLogHydration?: (oz: number) => void;
}

export default function BioMetricsPanel({
  initialWorkoutDuration = 90,
  initialTemperature = 75,
  initialSweatRate = 'moderate',
  onLogHydration,
}: BioMetricsPanelProps) {
  const [duration, setDuration] = useState(initialWorkoutDuration);
  const [temp, setTemp] = useState(initialTemperature);
  const [sweatRate, setSweatRate] = useState<'low' | 'moderate' | 'high'>(initialSweatRate);

  // Math models for hydration
  // Base hydration: 15ml per kg of bodyweight + sweat loss compensation
  const sweatMultipliers = {
    low: 0.5, // Liters per hour
    moderate: 1.0,
    high: 1.8,
  };

  const hoursOfWork = duration / 60;
  const sweatLossLiters = hoursOfWork * sweatMultipliers[sweatRate];
  const tempCorrection = temp > 80 ? (temp - 80) * 0.02 : 0;
  const totalWaterRequiredLiters = sweatLossLiters + tempCorrection + 0.5; // base + sweat loss + margin
  const totalFluidOz = Math.round(totalWaterRequiredLiters * 33.814);
  const sodiumMg = Math.round(totalWaterRequiredLiters * 500); // 500mg sodium per liter recommended for athletes

  // Sleep cycles calculation
  // Optimal sleep is composed of 90-minute cycles. We suggest cycles based on duration & stress.
  const recommendedSleepCycles = duration > 90 || sweatRate === 'high' ? 6 : 5; // 6 cycles = 9 hours, 5 cycles = 7.5 hours
  const optimalSleepHours = recommendedSleepCycles * 1.5;

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl p-6 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-800 shadow-2xl text-neutral-100 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Droplet className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-wide bg-gradient-to-r from-neutral-100 to-neutral-400 bg-clip-text text-transparent">
              HYDRATION & BIOMETRIC TUNER
            </h3>
            <p className="text-xs text-neutral-500 font-mono">FLUID & SLEEP OPTIMIZATION MODEL</p>
          </div>
        </div>
      </div>

      {/* Slide Controls */}
      <div className="space-y-4 mb-6">
        {/* Workout Duration Slider */}
        <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-900">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider font-mono">
              Workout Duration
            </label>
            <span className="text-sm font-bold text-cyan-400 font-mono">{duration} min</span>
          </div>
          <input
            type="range"
            min="30"
            max="180"
            step="15"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Ambient Temperature Slider */}
        <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-900">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider font-mono">
              Ambient Temperature
            </label>
            <span className="text-sm font-bold text-rose-400 font-mono">{temp}°F</span>
          </div>
          <input
            type="range"
            min="50"
            max="105"
            value={temp}
            onChange={(e) => setTemp(Number(e.target.value))}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
          />
        </div>

        {/* Sweat Rate Toggle */}
        <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-900">
          <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-mono">
            Athlete Sweat Rate
          </label>
          <div className="grid grid-cols-3 gap-2 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
            {(['low', 'moderate', 'high'] as const).map((rate) => (
              <button
                key={rate}
                onClick={() => setSweatRate(rate)}
                className={`py-1.5 text-xs font-bold uppercase rounded-lg transition-all ${
                  sweatRate === rate
                    ? 'bg-cyan-500 text-neutral-950 shadow-lg font-black'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
                }`}
              >
                {rate}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dual Results Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Hydration outputs */}
        <div className="p-4 rounded-2xl bg-cyan-950/15 border border-cyan-500/10 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-cyan-400 mb-2">
            <Droplet className="w-4 h-4" />
            <span className="text-xs font-bold font-mono tracking-wider uppercase">Fluid Replacement</span>
          </div>
          <div>
            <div className="text-3xl font-black font-mono text-cyan-300">
              {totalWaterRequiredLiters.toFixed(1)}
              <span className="text-sm font-bold text-neutral-500 ml-1">L</span>
            </div>
            <div className="text-xs text-neutral-400 font-mono mt-1">
              {totalFluidOz} fl oz / {sodiumMg} mg Sodium
            </div>
            <span className="text-[10px] text-cyan-500/80 font-mono font-medium block mt-2">
              (Electrolyte Ratio: ~500mg/L)
            </span>
            <button
              onClick={() => {
                if (onLogHydration) {
                  onLogHydration(totalFluidOz);
                }
              }}
              className="mt-3 w-full py-1.5 rounded-xl bg-cyan-500 text-neutral-950 font-bold hover:bg-cyan-400 transition-colors text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/10 cursor-pointer"
            >
              Log Fluid Intake
            </button>
          </div>
        </div>

        {/* Sleep cycle outputs */}
        <div className="p-4 rounded-2xl bg-indigo-950/15 border border-indigo-500/10 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-indigo-400 mb-2">
            <Moon className="w-4 h-4" />
            <span className="text-xs font-bold font-mono tracking-wider uppercase">Sleep Recharge</span>
          </div>
          <div>
            <div className="text-3xl font-black font-mono text-indigo-300">
              {optimalSleepHours.toFixed(1)}
              <span className="text-sm font-bold text-neutral-500 ml-1">hrs</span>
            </div>
            <div className="text-xs text-neutral-400 font-mono mt-1">
              {recommendedSleepCycles} full REM/Deep cycles
            </div>
            <span className="text-[10px] text-indigo-500/80 font-mono font-medium block mt-2">
              (Parasympathetic upregulation target)
            </span>
          </div>
        </div>
      </div>

      {/* Warning/Pro-Tip */}
      <div className="flex items-start gap-3 p-3 px-4 rounded-2xl bg-neutral-950 border border-neutral-900/60 text-[11px] text-neutral-400 leading-relaxed">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-neutral-300">Sports Science Recommendation:</span> Drink 16–24 fl oz of electrolyte solution for every pound of bodyweight lost during high sweat workouts. Prioritize sleep cycles for nervous system recovery.
        </div>
      </div>
    </div>
  );
}
