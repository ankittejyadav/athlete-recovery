'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Dumbbell, Award, RotateCcw } from 'lucide-react';

interface MacroSliderProps {
  initialWeight?: number; // in kg
  initialTrainingLoad?: 'low' | 'moderate' | 'high' | 'peak';
  initialProteinRatio?: number; // 0 to 100 percentage of non-fat macros
}

export default function MacroSlider({
  initialWeight = 80,
  initialTrainingLoad = 'moderate',
  initialProteinRatio = 40,
}: MacroSliderProps) {
  const [weight, setWeight] = useState(initialWeight);
  const [trainingLoad, setTrainingLoad] = useState<'low' | 'moderate' | 'high' | 'peak'>(initialTrainingLoad);
  const [proteinRatio, setProteinRatio] = useState(initialProteinRatio); // percentage allocated to protein
  
  // Dynamic macro multipliers (g/kg of body weight) based on training load
  // Fats are kept relatively stable around 1.0g/kg, protein/carbs vary
  const loadMultipliers = {
    low: { baseCalPerKg: 30, fatGramsPerKg: 0.9, totalNonFatGramsPerKg: 3.5 },
    moderate: { baseCalPerKg: 38, fatGramsPerKg: 1.0, totalNonFatGramsPerKg: 5.5 },
    high: { baseCalPerKg: 46, fatGramsPerKg: 1.1, totalNonFatGramsPerKg: 7.5 },
    peak: { baseCalPerKg: 55, fatGramsPerKg: 1.2, totalNonFatGramsPerKg: 9.5 },
  };

  // Adjust default ratio when training load changes to reflect standard sports science
  useEffect(() => {
    if (trainingLoad === 'low') {
      setProteinRatio(50); // Higher protein percentage in low volume/rest days
    } else if (trainingLoad === 'moderate') {
      setProteinRatio(40);
    } else if (trainingLoad === 'high') {
      setProteinRatio(30); // Higher carb percentage needed for high volume training
    } else if (trainingLoad === 'peak') {
      setProteinRatio(25); // Carb loading / extreme fuel priority
    }
  }, [trainingLoad]);

  const currentLoadData = loadMultipliers[trainingLoad];
  const totalNonFatGrams = currentLoadData.totalNonFatGramsPerKg * weight;
  const fatGrams = Math.round(currentLoadData.fatGramsPerKg * weight);

  const proteinGrams = Math.round(totalNonFatGrams * (proteinRatio / 100));
  const carbGrams = Math.round(totalNonFatGrams * ((100 - proteinRatio) / 100));

  // Calories: Protein = 4 kcal/g, Carbs = 4 kcal/g, Fats = 9 kcal/g
  const totalKcal = (proteinGrams * 4) + (carbGrams * 4) + (fatGrams * 9);

  const handleReset = () => {
    setWeight(initialWeight);
    setTrainingLoad(initialTrainingLoad);
    setProteinRatio(initialProteinRatio);
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl p-6 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-800 shadow-2xl text-neutral-100 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-wide bg-gradient-to-r from-neutral-100 to-neutral-400 bg-clip-text text-transparent">
              FUEL RECOVERY MODEL
            </h3>
            <p className="text-xs text-neutral-500 font-mono">ADAPTIVE MACRONUTRIENT RATIOS</p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="p-1.5 rounded-lg text-neutral-500 hover:text-emerald-400 hover:bg-neutral-800/50 transition-all border border-transparent hover:border-neutral-800"
          title="Reset Parameters"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Grid Inputs */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Weight Selector */}
        <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-900">
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 font-mono">
            Athlete Weight
          </label>
          <div className="flex items-center justify-between">
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Math.max(40, Math.min(180, Number(e.target.value) || 75)))}
              className="w-20 bg-transparent text-xl font-bold font-mono focus:outline-none border-b border-transparent focus:border-emerald-500 transition-colors text-neutral-100"
            />
            <span className="text-xs font-bold text-neutral-500 bg-neutral-900 px-2 py-1 rounded-md border border-neutral-800">
              KG
            </span>
          </div>
          <span className="text-[10px] text-neutral-600 block mt-1">({Math.round(weight * 2.20462)} lbs)</span>
        </div>

        {/* Training Load Toggle */}
        <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-900">
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 font-mono">
            Training Intensity
          </label>
          <div className="grid grid-cols-4 gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
            {(['low', 'moderate', 'high', 'peak'] as const).map((load) => (
              <button
                key={load}
                onClick={() => setTrainingLoad(load)}
                className={`py-1 text-[10px] font-bold uppercase rounded-lg transition-all ${
                  trainingLoad === load
                    ? 'bg-emerald-500 text-neutral-950 shadow-lg font-extrabold'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
                }`}
              >
                {load}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ratios Slider Display */}
      <div className="mb-6 p-4 rounded-2xl bg-neutral-950/40 border border-neutral-900/60">
        <div className="flex justify-between items-center mb-3">
          <div className="text-xs font-semibold text-neutral-400 font-mono">PROTEIN / CARBS BIAS</div>
          <div className="flex gap-2 text-xs font-mono">
            <span className="text-emerald-400 font-bold">{proteinRatio}% Pro</span>
            <span className="text-neutral-600">/</span>
            <span className="text-cyan-400 font-bold">{100 - proteinRatio}% Carb</span>
          </div>
        </div>

        {/* Custom Custom styled HTML slider */}
        <div className="relative w-full h-8 flex items-center group">
          <div className="absolute top-1/2 left-0 right-0 h-2 -translate-y-1/2 rounded-lg bg-neutral-800 overflow-hidden flex">
            <div className="h-full bg-emerald-500 transition-all duration-75" style={{ width: `${proteinRatio}%` }} />
            <div className="h-full bg-cyan-500 transition-all duration-75" style={{ width: `${100 - proteinRatio}%` }} />
          </div>
          <input
            type="range"
            min="15"
            max="65"
            value={proteinRatio}
            onChange={(e) => setProteinRatio(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          {/* Thumb visual representation */}
          <div
            className="absolute w-5 h-5 rounded-full bg-white border-2 border-emerald-500 shadow-xl pointer-events-none transition-all duration-75 group-hover:scale-110 flex items-center justify-center -translate-x-1/2"
            style={{ left: `${proteinRatio}%` }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-950" />
          </div>
        </div>

        <div className="flex justify-between mt-1.5 text-[9px] text-neutral-600 font-mono">
          <span>HIGH-CARB RATIO (PEAK LOAD)</span>
          <span>BALANCED (REST/RECOVERY)</span>
        </div>
      </div>

      {/* Target Macros breakdown cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {/* Protein */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/10 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
            <Dumbbell className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold tracking-wider uppercase font-mono">Protein</span>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-emerald-300">{proteinGrams}<span className="text-xs font-semibold text-neutral-500 ml-0.5">g</span></div>
            <div className="text-[9px] text-emerald-500/80 font-mono font-medium">{(proteinGrams / weight).toFixed(1)} g/kg</div>
          </div>
        </div>

        {/* Carbs */}
        <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/10 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-cyan-400 mb-1">
            <Award className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold tracking-wider uppercase font-mono">Carbohydrate</span>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-cyan-300">{carbGrams}<span className="text-xs font-semibold text-neutral-500 ml-0.5">g</span></div>
            <div className="text-[9px] text-cyan-500/80 font-mono font-medium">{(carbGrams / weight).toFixed(1)} g/kg</div>
          </div>
        </div>

        {/* Fats */}
        <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-900 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
            <Flame className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold tracking-wider uppercase font-mono">Essential Fats</span>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-neutral-300">{fatGrams}<span className="text-xs font-semibold text-neutral-500 ml-0.5">g</span></div>
            <div className="text-[9px] text-neutral-500/80 font-mono font-medium">{(fatGrams / weight).toFixed(1)} g/kg</div>
          </div>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="flex items-center justify-between p-3 px-4 rounded-2xl bg-neutral-950 border border-neutral-900/60">
        <div className="flex flex-col">
          <span className="text-[9px] text-neutral-600 font-mono font-bold tracking-wider uppercase">Caloric Expenditure Estimate</span>
          <span className="text-sm font-black font-mono text-emerald-400/90">{totalKcal} kcal</span>
        </div>
        <div className="text-[10px] text-neutral-500 max-w-[240px] text-right leading-tight">
          Recommended target for <span className="text-neutral-300 font-bold uppercase">{trainingLoad}</span> training volume. Adjust protein bias dynamically for hyper-recovery or low glycogen states.
        </div>
      </div>
    </div>
  );
}
