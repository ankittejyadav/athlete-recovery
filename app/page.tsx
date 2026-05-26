'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import {
  Send,
  Flame,
  Dumbbell,
  Sparkles,
  MessageSquare,
  TrendingUp,
  Compass,
  Activity,
  Heart,
  Moon,
  Info,
  Layers,
  ArrowUpRight,
  User,
  Settings,
  Shield,
  Zap,
  Volume2
} from 'lucide-react';
import MacroSlider from '@/components/recovery/MacroSlider';
import MobilityMap from '@/components/recovery/MobilityMap';
import BioMetricsPanel from '@/components/recovery/BioMetricsPanel';
import HeartZones from '@/components/recovery/HeartZones';

export default function AthleteRecoveryDashboard() {
  const [useMock, setUseMock] = useState(false);
  const [mockLoading, setMockLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Shared state for interactive sidebar & cockpit sync
  const [recoveryScore, setRecoveryScore] = useState(88);
  const [restingHr, setRestingHr] = useState(48);
  const [sleepHours, setSleepHours] = useState(8.2);
  const [hydrationLevel, setHydrationLevel] = useState(72);
  const [isSidebarGlowing, setIsSidebarGlowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'recovery' | 'fuel' | 'cardio'>('recovery');

  // Highlights to indicate AI-updated widgets
  const [highlightWidget, setHighlightWidget] = useState<string | null>(null);

  const playHeartTone = (restingBpm = 48) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const playBeat = (time: number, freq: number, dur: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        
        gain.gain.setValueAtTime(0.001, time);
        gain.gain.exponentialRampToValueAtTime(0.12, time + 0.02);
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

  // Set up Vercel AI SDK hook
  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
    api: '/api/chat',
    onError: (err: any) => {
      console.warn('API error (most likely missing GROQ_API_KEY):', err);
      // Auto-fallback to mock to make it 100% stable
      setUseMock(true);
    }
  } as any) as any;

  // Scroll to bottom when new messages arrive in the chat dock
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, mockLoading]);

  // List of pre-configured suggestions
  const suggestions = [
    {
      label: "Leg Recovery Routine",
      prompt: "I am feeling severe soreness in my quadriceps and moderate stiffness in my lower back after a heavy leg workout today.",
    },
    {
      label: "Hydration Metrics",
      prompt: "I just finished a 90 minute high sweat workout in 82 degree heat. Generate my hydration and sleep recovery metrics.",
    },
    {
      label: "Cardio Recovery Zones",
      prompt: "What are my optimal aerobic heart rate recovery zones for Zone 1 and Zone 2? My resting HR is 48.",
    }
  ];

  const handleSuggestionClick = (promptText: string) => {
    if (useMock) {
      triggerMockResponse(promptText);
    } else {
      // Simulate submission in the Vercel AI SDK input
      const fakeEvent = {
        preventDefault: () => {},
      } as React.FormEvent<HTMLFormElement>;
      
      const inputElement = document.getElementById('chat-input') as HTMLInputElement;
      if (inputElement) {
        inputElement.value = promptText;
        const changeEvent = { target: { value: promptText } } as React.ChangeEvent<HTMLInputElement>;
        handleInputChange(changeEvent);
        
        setTimeout(() => {
          handleSubmit(fakeEvent);
        }, 50);
      }
    }
  };

  // Mock handler for immediate demonstration if API key is not present
  const triggerMockResponse = async (promptText: string) => {
    const userMsgId = Date.now().toString();
    const newUserMessage = { id: userMsgId, role: 'user' as const, content: promptText };
    
    setMessages((prev: any[]) => [...prev, newUserMessage]);
    setMockLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const assistantMsgId = (Date.now() + 1).toString();
    let assistantMessage;

    if (promptText.toLowerCase().includes('quad') || promptText.toLowerCase().includes('back') || promptText.toLowerCase().includes('leg')) {
      setActiveTab('recovery');
      setHighlightWidget('mobility');
      setTimeout(() => setHighlightWidget(null), 3000);
      
      assistantMessage = {
        id: assistantMsgId,
        role: 'assistant' as const,
        content: "I have identified high muscle tension in your **Quadriceps** and **Lower Back**. I've updated the **Active Mobility Preview** in your center console with targeted myofascial foam rolling and decompressions. Check off each drill as you complete it to sync your Recovery Score.",
        toolInvocations: [
          {
            state: 'result' as const,
            toolCallId: 'call-mob-1',
            toolName: 'prescribe_mobility',
            args: {
              muscleGroups: [
                {
                  id: 'quads',
                  name: 'Quadriceps (Outer & Rectus)',
                  soreness: 'severe',
                  prescriptions: [
                    'Targeted foam roll with high oscillation (3 sets x 45 seconds per side)',
                    'Half-kneeling hip flexor stretch with slight pelvic posterior tilt (2m hold)'
                  ],
                  durationMinutes: 12
                },
                {
                  id: 'lower-back',
                  name: 'Erector Spinae & QL',
                  soreness: 'moderate',
                  prescriptions: [
                    'Prone cobra or sphinx pose breathing (5 slow diaphragmatic cycles)',
                    'Supine lower back rotational twist (90 seconds per side)'
                  ],
                  durationMinutes: 8
                }
              ]
            },
            result: { status: 'success' }
          }
        ]
      };
    } else if (promptText.toLowerCase().includes('hydration') || promptText.toLowerCase().includes('sweat') || promptText.toLowerCase().includes('heat')) {
      setActiveTab('fuel');
      setHighlightWidget('hydration');
      setTimeout(() => setHighlightWidget(null), 3000);

      assistantMessage = {
        id: assistantMsgId,
        role: 'assistant' as const,
        content: "High thermal strain detected. I have updated your **Hydration & Biometric Tuner** in the center panel for a 90-minute high sweat session. Use the 'Log Fluid Intake' button on the widget to immediately update your hydration level.",
        toolInvocations: [
          {
            state: 'result' as const,
            toolCallId: 'call-hyd-1',
            toolName: 'calculate_hydration',
            args: {
              durationMinutes: 90,
              ambientTemp: 82,
              sweatRate: 'high'
            },
            result: { status: 'success' }
          }
        ]
      };
    } else if (promptText.toLowerCase().includes('cardio') || promptText.toLowerCase().includes('heart') || promptText.toLowerCase().includes('zone')) {
      setActiveTab('cardio');
      setHighlightWidget('cardio');
      setTimeout(() => setHighlightWidget(null), 3000);

      assistantMessage = {
        id: assistantMsgId,
        role: 'assistant' as const,
        content: "Calculated optimal cardiovascular zone metrics using the Karvonen formula. The **Cardio Zoning Controller** is now loaded with active recovery and endurance heart rate boundaries based on your resting HR of 48.",
        toolInvocations: [
          {
            state: 'result' as const,
            toolCallId: 'call-hrz-1',
            toolName: 'prescribe_aerobic_zones',
            args: {
              restingHr: 48,
              age: 24,
              trainingType: 'recovery'
            },
            result: { status: 'success' }
          }
        ]
      };
    } else {
      setActiveTab('fuel');
      setHighlightWidget('macros');
      setTimeout(() => setHighlightWidget(null), 3000);

      assistantMessage = {
        id: assistantMsgId,
        role: 'assistant' as const,
        content: "I have calculated your optimal macronutrient allocation for a **Peak Volume / Intensity** training block. Use the **Fuel Recovery Model** slider in the center panel to adjust your protein/carb bias based on fatigue.",
        toolInvocations: [
          {
            state: 'result' as const,
            toolCallId: 'call-mac-1',
            toolName: 'suggest_macros',
            args: {
              weight: 82,
              trainingLoad: 'high',
              proteinRatio: 30
            },
            result: { status: 'success' }
          }
        ]
      };
    }

    setMessages((prev: any[]) => [...prev, assistantMessage]);
    setMockLoading(false);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (useMock) {
      triggerMockResponse(input);
      const changeEvent = { target: { value: '' } } as React.ChangeEvent<HTMLInputElement>;
      handleInputChange(changeEvent);
    } else {
      handleSubmit(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#050505] text-neutral-100 overflow-hidden min-h-screen">
      {/* Premium Top Navigation Bar */}
      <header className="h-16 shrink-0 bg-neutral-950/60 border-b border-neutral-900 backdrop-blur-lg flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <h1 className="text-sm font-black tracking-widest uppercase bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              AESTHETIX ATHLETE LAB
            </h1>
            <p className="text-[9px] text-neutral-600 font-mono tracking-wider font-bold">RECOVERY ENGINE v1.2</p>
          </div>
        </div>

        {/* Engine mode controller */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-[10px] font-mono">
            <span className="text-neutral-500">ENGINE:</span>
            <button
              onClick={() => setUseMock(!useMock)}
              className={`px-2 py-0.5 rounded font-black transition-colors ${
                useMock ? 'bg-amber-500/15 border border-amber-500/30 text-amber-400' : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
              }`}
            >
              {useMock ? 'DEMO / OFFLINE' : 'LIVE GROQ AI'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Cockpit Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* LEFT COLUMN: Profile & Bio-metrics (Col 3) */}
        <aside className={`lg:col-span-3 bg-neutral-950/20 border-r border-neutral-900/60 p-5 flex flex-col gap-5 overflow-y-auto hidden lg:flex transition-all duration-300 ${
          isSidebarGlowing ? 'shadow-2xl shadow-cyan-500/15 border-r-cyan-500/30' : ''
        }`}>
          {/* Athlete Profile Card */}
          <div className="rounded-3xl p-5 bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors" />
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center overflow-hidden font-black text-emerald-400">
                AC
              </div>
              <div>
                <h2 className="text-sm font-black text-neutral-200">Alexander Cole</h2>
                <p className="text-[10px] text-neutral-500 font-mono">ELITE DECATHLETE</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-800/60 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-neutral-950/60 border border-neutral-900">
                <span className="text-[9px] text-neutral-500 font-mono block">VO2 MAX</span>
                <span className="font-bold text-neutral-200">64.5 ml/kg</span>
              </div>
              <div className="p-2 rounded-xl bg-neutral-950/60 border border-neutral-900">
                <span className="text-[9px] text-neutral-500 font-mono block">BODY FAT</span>
                <span className="font-bold text-neutral-200">8.4 %</span>
              </div>
            </div>
          </div>

          {/* Physiological Stats Cards */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-[10px] font-bold text-neutral-500 tracking-widest font-mono uppercase">PHYSIOLOGICAL PROFILE</h3>
            
            {/* Recovery Score */}
            <div className="rounded-2xl p-3.5 bg-neutral-950/50 border border-neutral-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-300 block">Recovery Score</span>
                  <span className="text-[9px] text-neutral-500 font-mono">Optimal headroom</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black font-mono text-emerald-400">{recoveryScore}%</span>
              </div>
            </div>

            {/* Resting Heart Rate (lub-dub beat interactive) */}
            <div
              onClick={() => playHeartTone(restingHr)}
              className="rounded-2xl p-3.5 bg-neutral-950/50 border border-neutral-900 flex items-center justify-between cursor-pointer hover:bg-neutral-900/60 hover:border-neutral-800 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:scale-105 transition-transform">
                  <Heart className="w-3.5 h-3.5 animate-pulse text-rose-500" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-300 block">Resting HR</span>
                  <span className="text-[9px] text-neutral-500 font-mono">Click to hear lub-dub</span>
                </div>
              </div>
              <span className="text-lg font-bold font-mono text-neutral-200">{restingHr} <span className="text-[10px] text-neutral-500 font-normal">bpm</span></span>
            </div>

            {/* Sleep Performance */}
            <div className="rounded-2xl p-3.5 bg-neutral-950/50 border border-neutral-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Moon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-300 block">Restorative Sleep</span>
                  <span className="text-[9px] text-neutral-500 font-mono">Deep + REM ratio</span>
                </div>
              </div>
              <span className="text-lg font-bold font-mono text-neutral-200">{sleepHours} <span className="text-[10px] text-neutral-500 font-normal">hrs</span></span>
            </div>

            {/* Hydration level */}
            <div className="rounded-2xl p-3.5 bg-neutral-950/50 border border-neutral-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-300 block">Hydration Level</span>
                  <span className="text-[9px] text-neutral-500 font-mono">Dynamic fluid level</span>
                </div>
              </div>
              <span className="text-lg font-bold font-mono text-cyan-300">{hydrationLevel}%</span>
            </div>
          </div>

          {/* Biomarker Stress Simulator panel */}
          <div className="flex flex-col gap-2.5 p-4 rounded-3xl bg-neutral-950/40 border border-neutral-900">
            <span className="text-[9px] font-bold text-neutral-500 tracking-widest font-mono uppercase">
              BIOMARKER STRESS SIMULATOR
            </span>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setRecoveryScore(65);
                  setRestingHr(58);
                  setHydrationLevel(48);
                  setIsSidebarGlowing(true);
                  handleSuggestionClick("I am feeling severe soreness in my quadriceps and moderate stiffness in my lower back after a heavy leg workout today.");
                  setTimeout(() => setIsSidebarGlowing(false), 2000);
                }}
                className="w-full py-2 px-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-left text-[11px] font-bold transition-all flex items-center justify-between cursor-pointer"
              >
                <span>🔴 POST-SQUAT FATIGUE</span>
                <span className="text-[9px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded font-mono uppercase font-black">LEGS</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRecoveryScore(70);
                  setRestingHr(54);
                  setHydrationLevel(35);
                  setIsSidebarGlowing(true);
                  handleSuggestionClick("I just finished a 90 minute high sweat workout in 82 degree heat. Generate my hydration and sleep recovery metrics.");
                  setTimeout(() => setIsSidebarGlowing(false), 2000);
                }}
                className="w-full py-2 px-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-left text-[11px] font-bold transition-all flex items-center justify-between cursor-pointer"
              >
                <span>🔵 DEHYDRATED HEATRUN</span>
                <span className="text-[9px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded font-mono uppercase font-black">FLUIDS</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRecoveryScore(80);
                  setRestingHr(48);
                  setHydrationLevel(85);
                  setIsSidebarGlowing(true);
                  handleSuggestionClick("What are my optimal aerobic heart rate recovery zones for Zone 1 and Zone 2? My resting HR is 48.");
                  setTimeout(() => setIsSidebarGlowing(false), 2000);
                }}
                className="w-full py-2 px-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-left text-[11px] font-bold transition-all flex items-center justify-between cursor-pointer"
              >
                <span>💓 CARDIO RECOVERY</span>
                <span className="text-[9px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded font-mono uppercase font-black">EKG</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRecoveryScore(96);
                  setRestingHr(43);
                  setHydrationLevel(98);
                  setIsSidebarGlowing(true);
                  setTimeout(() => setIsSidebarGlowing(false), 2000);
                }}
                className="w-full py-2 px-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-left text-[11px] font-bold transition-all flex items-center justify-between cursor-pointer"
              >
                <span>🟢 PEAK RECOVERED</span>
                <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono uppercase font-black">READY</span>
              </button>
            </div>
          </div>
        </aside>

        {/* CENTER COLUMN: The Primary Analytics Cockpit (Col 5) */}
        <main className="lg:col-span-5 border-r border-neutral-900/60 overflow-y-auto p-6 space-y-6">
          
          {/* Cockpit Navigation Tabs */}
          <div className="flex items-center justify-between pb-2 border-b border-neutral-900">
            <h3 className="text-sm font-black tracking-wider uppercase bg-gradient-to-r from-neutral-100 to-neutral-400 bg-clip-text text-transparent">
              ANALYTICS COCKPIT
            </h3>
            <div className="flex gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-900">
              {(['recovery', 'fuel', 'cardio'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 text-[10px] font-bold uppercase rounded-lg transition-all ${
                    activeTab === tab
                      ? 'bg-emerald-500 text-neutral-950 font-black shadow-md'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Cockpit Pre-rendered interactive cards based on tabs */}
          {activeTab === 'recovery' && (
            <div className={`space-y-6 transition-all duration-300 ${
              highlightWidget === 'mobility' ? 'ring-2 ring-cyan-500/50 rounded-3xl' : ''
            }`}>
              {/* Target check sheets with Body interactive SVG Heatmap */}
              <MobilityMap
                onToggleComplete={(muscleId: string, completed: boolean) => {
                  setRecoveryScore((prev: number) => {
                    const increment = completed ? 4 : -4;
                    return Math.max(0, Math.min(100, prev + increment));
                  });
                  setIsSidebarGlowing(true);
                  setTimeout(() => setIsSidebarGlowing(false), 850);
                }}
              />
            </div>
          )}

          {activeTab === 'fuel' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Macro Fueling Ratio Slider */}
              <div className={`transition-all duration-300 ${
                highlightWidget === 'macros' ? 'ring-2 ring-emerald-500/50 rounded-3xl' : ''
              }`}>
                <MacroSlider />
              </div>

              {/* Fluid Rehydration Tuner */}
              <div className={`transition-all duration-300 ${
                highlightWidget === 'hydration' ? 'ring-2 ring-cyan-500/50 rounded-3xl' : ''
              }`}>
                <BioMetricsPanel
                  onLogHydration={(oz: number) => {
                    setHydrationLevel((prev: number) => Math.min(100, prev + 18));
                    setRecoveryScore((prev: number) => Math.min(100, prev + 3));
                    setIsSidebarGlowing(true);
                    setTimeout(() => setIsSidebarGlowing(false), 850);
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 'cardio' && (
            <div className={`space-y-6 animate-fadeIn transition-all duration-300 ${
              highlightWidget === 'cardio' ? 'ring-2 ring-rose-500/50 rounded-3xl' : ''
            }`}>
              {/* EKG heart zone monitor */}
              <HeartZones initialRestingHr={restingHr} />
            </div>
          )}

        </main>

        {/* RIGHT COLUMN: Vertically docked AI Recovery Assistant (Col 4) */}
        <aside className="lg:col-span-4 flex flex-col h-full bg-neutral-950/20 overflow-hidden">
          
          {/* Assistant Header */}
          <div className="p-4 px-6 border-b border-neutral-900 flex items-center justify-between shrink-0 bg-neutral-950/60 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold font-mono tracking-widest text-neutral-300 uppercase">
                AI RECOVERY ASSISTANT
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
              ONLINE
            </div>
          </div>

          {/* Chat Stream (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {messages.length === 0 && !mockLoading ? (
              /* Slim welcome cards inside chat sidebar */
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-900 text-center">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-2 text-emerald-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-neutral-200">Consult Olympic Coach</h4>
                  <p className="text-[10px] text-neutral-500 leading-relaxed mt-1">
                    Explain your workout strain, muscle soreness, or cardiovascular fatigue. The AI will immediately recalibrate your cockpit metrics.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[8px] text-neutral-600 font-mono font-bold uppercase tracking-widest block ml-1">
                    COACHING PRESETS
                  </span>
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion.prompt)}
                      className="group w-full p-2.5 rounded-xl bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 transition-all text-left text-[11px] flex justify-between items-center cursor-pointer"
                    >
                      <span className="text-neutral-400 group-hover:text-neutral-200 transition-colors font-medium truncate pr-2">
                        {suggestion.label}
                      </span>
                      <ArrowUpRight className="w-3 h-3 text-neutral-600 group-hover:text-emerald-400 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Conversation elements inside chat sidebar */
              <div className="space-y-5">
                {messages.map((message: any) => {
                  const isUser = message.role === 'user';
                  return (
                    <div
                      key={message.id}
                      className={`flex flex-col gap-1.5 animate-fadeIn ${
                        isUser ? 'items-end' : 'items-start'
                      }`}
                    >
                      <span className="text-[8px] font-bold font-mono tracking-wider text-neutral-600 uppercase">
                        {isUser ? 'Alexander Cole' : 'ELITE COACH'}
                      </span>
                      
                      {/* Slim sidebar chat bubble */}
                      <div
                        className={`text-xs leading-relaxed p-3.5 rounded-2xl max-w-full ${
                          isUser
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-neutral-200 rounded-tr-none font-medium'
                            : 'bg-neutral-900/60 border border-neutral-850 text-neutral-300 rounded-tl-none'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  );
                })}

                {/* Thinking indicator inside chat sidebar */}
                {mockLoading && (
                  <div className="flex flex-col items-start gap-1.5 animate-pulse">
                    <span className="text-[8px] font-bold font-mono tracking-wider text-neutral-600 uppercase">
                      ANALYZING BIOMARKERS...
                    </span>
                    <div className="h-8 w-28 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center gap-1 text-[10px] text-neutral-500">
                      <div className="w-1 h-1 rounded-full bg-emerald-500 animate-bounce" />
                      <div className="w-1 h-1 rounded-full bg-emerald-500 animate-bounce delay-150" />
                      <div className="w-1 h-1 rounded-full bg-emerald-500 animate-bounce delay-300" />
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>
            )}
          </div>

          {/* Chat Input Area (Fixed to the bottom of the chat sidebar) */}
          <div className="p-4 bg-neutral-950/80 border-t border-neutral-900 shrink-0">
            <form onSubmit={handleFormSubmit} className="relative flex items-center group">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-20 blur group-focus-within:opacity-35 transition-opacity" />
              <div className="relative flex-1 flex items-center bg-neutral-950 border border-neutral-850 rounded-full py-1 pl-4 pr-1.5 backdrop-blur-md">
                <input
                  id="chat-input"
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask your coach..."
                  className="flex-1 bg-transparent text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none pr-3 font-semibold"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-neutral-950 shadow transition-all active:scale-95 flex items-center justify-center cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
            <div className="mt-2 text-center text-[8px] text-neutral-600 font-mono tracking-wider">
              {useMock 
                ? "⚡ OFFLINE COACH DIRECT MODULATION MODE"
                : "🌐 LIVE CHAT STREAM · VERCEL AI SDK"}
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
}
