'use client';

import React, { useState } from 'react';
import { Shield, Sparkles, CheckCircle2, ChevronRight, Activity, Zap, Play } from 'lucide-react';

interface MuscleGroup {
  id: string;
  name: string;
  soreness: 'mild' | 'moderate' | 'severe';
  prescriptions: string[];
  durationMinutes: number;
  icon: string;
  completed: boolean;
}

interface MobilityMapProps {
  initialMuscleGroups?: MuscleGroup[];
  onToggleComplete?: (id: string, completed: boolean) => void;
}

export default function MobilityMap({
  initialMuscleGroups = [
    {
      id: 'quads',
      name: 'Quadriceps',
      soreness: 'severe',
      prescriptions: ['Foam roll outer quads (3x45s)', '90/90 Hip mobility stretch (2m each side)', 'Low-intensity cycling (10m)'],
      durationMinutes: 15,
      icon: 'zap',
      completed: false,
    },
    {
      id: 'lower-back',
      name: 'Lower Back',
      soreness: 'moderate',
      prescriptions: ['Cat-Cow stretch (15 reps)', 'Child\'s pose holding (90s)', 'Decompression hang (60s)'],
      durationMinutes: 8,
      icon: 'shield',
      completed: false,
    },
    {
      id: 'calves',
      name: 'Calves & Soleus',
      soreness: 'mild',
      prescriptions: ['Stretching against wall (60s per leg)', 'Active trigger point release with lacrosse ball'],
      durationMinutes: 5,
      icon: 'activity',
      completed: false,
    },
  ],
  onToggleComplete,
}: MobilityMapProps) {
  const [muscles, setMuscles] = useState<MuscleGroup[]>(initialMuscleGroups);
  const [selectedId, setSelectedId] = useState<string>(initialMuscleGroups[0]?.id || '');

  const handleToggleComplete = (id: string) => {
    setMuscles(prev =>
      prev.map(m => {
        if (m.id === id) {
          const nextCompleted = !m.completed;
          if (onToggleComplete) {
            onToggleComplete(id, nextCompleted);
          }
          return { ...m, completed: nextCompleted };
        }
        return m;
      })
    );
  };

  const handleToggleSubtask = (muscleId: string, prescriptionIndex: number) => {
    // For simple UI interaction, let's toggle completion of entire muscle group if clicked
  };

  const selectedMuscle = muscles.find(m => m.id === selectedId);

  const getSorenessColor = (soreness: 'mild' | 'moderate' | 'severe') => {
    switch (soreness) {
      case 'severe':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          dot: 'bg-rose-500 shadow-rose-500/50',
          svg: '#f43f5e',
        };
      case 'moderate':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          dot: 'bg-amber-500 shadow-amber-500/50',
          svg: '#f59e0b',
        };
      case 'mild':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          dot: 'bg-emerald-500 shadow-emerald-500/50',
          svg: '#10b981',
        };
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl p-6 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-800 shadow-2xl text-neutral-100 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-wide bg-gradient-to-r from-neutral-100 to-neutral-400 bg-clip-text text-transparent">
              ACTIVE MOBILITY PREVIEW
            </h3>
            <p className="text-xs text-neutral-500 font-mono">TARGETED KINETIC RECOVERY</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[10px] font-bold text-neutral-400">
          <Sparkles className="w-3 h-3 text-cyan-400 animate-spin-slow" />
          <span>{muscles.filter(m => m.completed).length}/{muscles.length} CLEARED</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left Side: Body Interactive SVG Visualization (Col 5) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-neutral-950/60 rounded-2xl border border-neutral-900 relative min-h-[220px]">
          {/* Simple Vector Athlete Body Representation with target dots */}
          <svg className="w-24 h-48 opacity-65 text-neutral-600" viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M50 15C53.3137 15 56 12.3137 56 9C56 5.68629 53.3137 3 50 3C46.6863 3 44 5.68629 44 9C44 12.3137 46.6863 15 50 15Z"
              stroke="currentColor" strokeWidth="2.5"
            />
            {/* Torso & Arms */}
            <path
              d="M32 30H68L64 75L50 82L36 75L32 30Z"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            />
            <path d="M32 30L22 65L18 85" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M68 30L78 65L82 85" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            {/* Legs */}
            <path d="M37 80L33 130L30 185L22 190" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M63 80L67 130L70 185L78 190" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          {/* Absolute Soreness Targets on SVG */}
          {/* Lower Back */}
          <button
            onClick={() => setSelectedId('lower-back')}
            className={`absolute top-[48%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center transition-all ${
              selectedId === 'lower-back' ? 'scale-125' : 'hover:scale-110'
            }`}
          >
            <span className={`absolute w-3.5 h-3.5 rounded-full opacity-75 animate-ping ${getSorenessColor(muscles.find(m => m.id === 'lower-back')?.soreness || 'mild').dot}`} />
            <span className={`w-2.5 h-2.5 rounded-full border border-neutral-950 ${getSorenessColor(muscles.find(m => m.id === 'lower-back')?.soreness || 'mild').dot}`} />
          </button>

          {/* Quads */}
          <button
            onClick={() => setSelectedId('quads')}
            className={`absolute top-[62%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-8 h-4 flex justify-between px-1 transition-all ${
              selectedId === 'quads' ? 'scale-125' : 'hover:scale-110'
            }`}
          >
            <div className="relative w-3.5 h-3.5">
              <span className={`absolute w-3.5 h-3.5 rounded-full opacity-75 animate-ping ${getSorenessColor(muscles.find(m => m.id === 'quads')?.soreness || 'mild').dot}`} />
              <span className={`w-2.5 h-2.5 rounded-full border border-neutral-950 ${getSorenessColor(muscles.find(m => m.id === 'quads')?.soreness || 'mild').dot}`} />
            </div>
            <div className="relative w-3.5 h-3.5">
              <span className={`absolute w-3.5 h-3.5 rounded-full opacity-75 animate-ping ${getSorenessColor(muscles.find(m => m.id === 'quads')?.soreness || 'mild').dot}`} />
              <span className={`w-2.5 h-2.5 rounded-full border border-neutral-950 ${getSorenessColor(muscles.find(m => m.id === 'quads')?.soreness || 'mild').dot}`} />
            </div>
          </button>

          {/* Calves */}
          <button
            onClick={() => setSelectedId('calves')}
            className={`absolute top-[78%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-8 h-4 flex justify-between px-1 transition-all ${
              selectedId === 'calves' ? 'scale-125' : 'hover:scale-110'
            }`}
          >
            <div className="relative w-3.5 h-3.5">
              <span className={`absolute w-3.5 h-3.5 rounded-full opacity-75 animate-ping ${getSorenessColor(muscles.find(m => m.id === 'calves')?.soreness || 'mild').dot}`} />
              <span className={`w-2.5 h-2.5 rounded-full border border-neutral-950 ${getSorenessColor(muscles.find(m => m.id === 'calves')?.soreness || 'mild').dot}`} />
            </div>
            <div className="relative w-3.5 h-3.5">
              <span className={`absolute w-3.5 h-3.5 rounded-full opacity-75 animate-ping ${getSorenessColor(muscles.find(m => m.id === 'calves')?.soreness || 'mild').dot}`} />
              <span className={`w-2.5 h-2.5 rounded-full border border-neutral-950 ${getSorenessColor(muscles.find(m => m.id === 'calves')?.soreness || 'mild').dot}`} />
            </div>
          </button>

          <span className="absolute bottom-2 text-[8px] font-mono text-neutral-600">INTERACTIVE HEATMAP</span>
        </div>

        {/* Right Side: Soreness List (Col 7) */}
        <div className="md:col-span-7 flex flex-col gap-3">
          {muscles.map((muscle) => {
            const colors = getSorenessColor(muscle.soreness);
            const isSelected = muscle.id === selectedId;

            return (
              <div
                key={muscle.id}
                onClick={() => setSelectedId(muscle.id)}
                className={`group cursor-pointer rounded-2xl p-3 border transition-all ${
                  isSelected
                    ? 'bg-neutral-900 border-neutral-700 shadow-lg'
                    : 'bg-neutral-950/40 border-neutral-900/60 hover:bg-neutral-900/50 hover:border-neutral-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleComplete(muscle.id);
                      }}
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                        muscle.completed
                          ? 'bg-emerald-500 border-emerald-400 text-neutral-950'
                          : 'border-neutral-700 hover:border-neutral-500'
                      }`}
                    >
                      {muscle.completed && <CheckCircle2 className="w-4.5 h-4.5 stroke-[3]" />}
                    </button>
                    <div>
                      <span className={`text-sm font-bold transition-all ${muscle.completed ? 'line-through text-neutral-600' : 'text-neutral-200'}`}>
                        {muscle.name}
                      </span>
                      <span className="text-[9px] text-neutral-500 font-mono block">
                        Est: {muscle.durationMinutes} min
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-md border font-mono tracking-wider ${colors.bg}`}>
                      {muscle.soreness}
                    </span>
                    <ChevronRight className={`w-4 h-4 text-neutral-600 group-hover:text-neutral-400 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Target prescriptions panel for selected group */}
      {selectedMuscle && (
        <div className="mt-5 p-4 rounded-2xl bg-neutral-950/80 border border-neutral-900 animate-fadeIn">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold font-mono tracking-wider text-neutral-300 uppercase">
                {selectedMuscle.name} recovery routing
              </h4>
            </div>
            <div className="text-[10px] text-neutral-500 font-mono">
              Duration: <span className="text-cyan-400 font-bold">{selectedMuscle.durationMinutes}m</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {selectedMuscle.prescriptions.map((prescription, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-neutral-900/60 border border-neutral-800/40 text-xs text-neutral-400">
                <div className="mt-0.5 p-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Play className="w-2.5 h-2.5 fill-current" />
                </div>
                <div className="flex-1 leading-relaxed">
                  {prescription}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
