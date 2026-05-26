'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Activity, TrendingUp, Sparkles, Volume2 } from 'lucide-react';

interface HeartZonesProps {
  initialRestingHr?: number;
  initialAge?: number;
  initialTrainingType?: 'aerobic' | 'anaerobic' | 'recovery';
}

export default function HeartZones({
  initialRestingHr = 48,
  initialAge = 24,
  initialTrainingType = 'recovery',
}: HeartZonesProps) {
  const [restingHr, setRestingHr] = useState(initialRestingHr);
  const [age, setAge] = useState(initialAge);
  const [trainingType, setTrainingType] = useState<'aerobic' | 'anaerobic' | 'recovery'>(initialTrainingType);

  const maxHr = 220 - age;
  const hrReserve = maxHr - restingHr;

  // Karvonen formula zone percentages
  const zones = [
    { name: 'Zone 1: Active Recovery', min: 0.50, max: 0.60, color: 'bg-emerald-500', text: 'text-emerald-400', desc: 'Promotes blood circulation & glycogen replacement.' },
    { name: 'Zone 2: Aerobic Endurance', min: 0.60, max: 0.70, color: 'bg-cyan-500', text: 'text-cyan-400', desc: 'Builds mitochondrial density & fat oxidation.' },
    { name: 'Zone 3: Aerobic Power (Tempo)', min: 0.70, max: 0.80, color: 'bg-amber-500', text: 'text-amber-400', desc: 'Improves lactate threshold & aerobic pacing.' },
    { name: 'Zone 4: Anaerobic Threshold', min: 0.80, max: 0.90, color: 'bg-orange-500', text: 'text-orange-400', desc: 'Enhances high-intensity fatigue tolerance.' },
    { name: 'Zone 5: VO2 Max (Redline)', min: 0.90, max: 1.00, color: 'bg-rose-500', text: 'text-rose-400', desc: 'Maximizes stroke volume & anaerobic power.' },
  ];

  // Synthesize EKG heart audio tone on resting HR changes (Web Audio API)
  const playHeartTone = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Double beat "lub-dub"
      const playBeat = (time: number, freq: number, dur: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        
        gain.gain.setValueAtTime(0.001, time);
        gain.gain.exponentialRampToValueAtTime(0.15, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
        
        osc.start(time);
        osc.stop(time + dur);
      };

      const now = audioCtx.currentTime;
      playBeat(now, 55, 0.12); // Lub
      playBeat(now + 0.15, 50, 0.15); // Dub
    } catch (e) {
      console.warn('Audio synthesis failed:', e);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl p-6 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-800 shadow-2xl text-neutral-100 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <Heart className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-wide bg-gradient-to-r from-neutral-100 to-neutral-400 bg-clip-text text-transparent">
              CARDIO ZONING CONTROLLER
            </h3>
            <p className="text-xs text-neutral-500 font-mono">KARVONEN METABOLIC SIMULATION</p>
          </div>
        </div>
        <button
          onClick={playHeartTone}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[10px] font-bold text-neutral-400 hover:text-rose-400 transition-all cursor-pointer"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>SYNTH BEAT</span>
        </button>
      </div>

      {/* Grid Controls */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-900">
          <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-2 font-mono">
            Resting HR (bpm)
          </label>
          <div className="flex items-center justify-between">
            <input
              type="number"
              value={restingHr}
              onChange={(e) => setRestingHr(Math.max(35, Math.min(110, Number(e.target.value) || 50)))}
              className="w-16 bg-transparent text-xl font-bold font-mono focus:outline-none text-neutral-100 border-b border-transparent focus:border-rose-500"
            />
            <span className="text-[10px] font-bold text-neutral-600 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800 uppercase font-mono">
              Reserve
            </span>
          </div>
          <span className="text-[9px] text-neutral-600 font-mono block mt-1">Reserve: {hrReserve} bpm</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-900">
          <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-2 font-mono">
            Athlete Age
          </label>
          <div className="flex items-center justify-between">
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(Math.max(14, Math.min(90, Number(e.target.value) || 25)))}
              className="w-16 bg-transparent text-xl font-bold font-mono focus:outline-none text-neutral-100 border-b border-transparent focus:border-rose-500"
            />
            <span className="text-[9px] text-rose-500/80 font-mono">Max: {maxHr} bpm</span>
          </div>
          <span className="text-[9px] text-neutral-600 font-mono block mt-1">Ages: 14 to 90 years</span>
        </div>
      </div>

      {/* Animated EKG pulse Wave */}
      <div className="mb-6 p-4 rounded-2xl bg-neutral-950/80 border border-neutral-900 relative overflow-hidden flex items-center justify-center min-h-[90px]">
        {/* Animated Heartbeat Line */}
        <svg className="absolute inset-0 w-full h-full text-rose-500/15" viewBox="0 0 300 80" fill="none" preserveAspectRatio="none">
          <path
            d="M0 40H80L90 20L100 60L105 10L112 55L120 40H300"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              animation: `dash 1.8s linear infinite`,
              strokeDasharray: '300',
              strokeDashoffset: '300',
            }}
          />
        </svg>
        <style>{`
          @keyframes dash {
            to {
              strokeDashoffset: 0;
            }
          }
        `}</style>
        
        {/* Neon EKG pulsing line */}
        <svg className="absolute inset-0 w-full h-full text-rose-400" viewBox="0 0 300 80" fill="none" preserveAspectRatio="none">
          <path
            d="M0 40H80L90 20L100 60L105 10L112 55L120 40H300"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]"
            style={{
              animation: `dash ${60 / restingHr}s cubic-bezier(0.2, 0.8, 0.2, 1) infinite`,
              strokeDasharray: '600',
              strokeDashoffset: '600',
            }}
          />
        </svg>

        <div className="z-10 flex flex-col items-center gap-1">
          <div className="text-sm font-bold text-neutral-400 tracking-wider font-mono">DYNAMIC RECOVERY EKG</div>
          <div className="text-[10px] text-neutral-600 font-mono tracking-widest uppercase">
            TEMPO COMPLIANT · {restingHr} BPM BEATRATE
          </div>
        </div>
      </div>

      {/* Target Zone Rows */}
      <div className="space-y-2">
        {zones.map((zone, idx) => {
          // Karvonen formula calculation: Zone HR = (HRR * %intensity) + restingHR
          const minZoneHr = Math.round(hrReserve * zone.min) + restingHr;
          const maxZoneHr = Math.round(hrReserve * zone.max) + restingHr;
          
          return (
            <div key={idx} className="p-3 rounded-2xl bg-neutral-950/40 border border-neutral-900 hover:bg-neutral-950/80 transition-colors flex items-center justify-between">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${zone.color}`} />
                  <span className="text-xs font-black text-neutral-200">{zone.name}</span>
                </div>
                <span className="text-[10px] text-neutral-500 block leading-normal mt-0.5">{zone.desc}</span>
              </div>
              <div className="text-right">
                <span className={`text-sm font-black font-mono ${zone.text}`}>{minZoneHr} - {maxZoneHr}</span>
                <span className="text-[9px] text-neutral-600 block font-mono">BPM ({Math.round(zone.min*100)}-{Math.round(zone.max*100)}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
