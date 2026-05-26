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
  ArrowUpRight
} from 'lucide-react';
import MacroSlider from '@/components/recovery/MacroSlider';
import MobilityMap from '@/components/recovery/MobilityMap';
import BioMetricsPanel from '@/components/recovery/BioMetricsPanel';

export default function AthleteRecoveryDashboard() {
  const [useMock, setUseMock] = useState(false);
  const [mockLoading, setMockLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Set up Vercel AI SDK hook
  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
    api: '/api/chat',
    onError: (err: any) => {
      console.warn('API error (most likely missing GROQ_API_KEY):', err);
      // Auto-fallback to mock to make it 100% stable
      setUseMock(true);
    }
  } as any) as any;

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, mockLoading]);

  // List of pre-configured suggestions
  const suggestions = [
    {
      label: "Leg Recovery",
      prompt: "I am feeling severe soreness in my quadriceps and moderate stiffness in my lower back after a heavy leg workout today.",
    },
    {
      label: "Carb Load Plan",
      prompt: "What is my optimal protein/carb macro ratio for an upcoming peak intensity training cycle? I weigh 82kg.",
    },
    {
      label: "Hydration Plan",
      prompt: "I just finished a 90 minute high sweat workout in 82 degree heat. Generate my hydration and sleep recovery metrics.",
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
      
      // We manually build a submit or set input
      const inputElement = document.getElementById('chat-input') as HTMLInputElement;
      if (inputElement) {
        inputElement.value = promptText;
        // Trigger manual synthetic change
        const changeEvent = { target: { value: promptText } } as React.ChangeEvent<HTMLInputElement>;
        handleInputChange(changeEvent);
        
        // Wait a tiny fraction of a second for state synchronization
        setTimeout(() => {
          handleSubmit(fakeEvent);
        }, 50);
      }
    }
  };

  // Mock handler for immediate demonstration if API key is not present
  const triggerMockResponse = async (promptText: string) => {
    // Add user message
    const userMsgId = Date.now().toString();
    const newUserMessage = { id: userMsgId, role: 'user' as const, content: promptText };
    
    setMessages((prev: any[]) => [...prev, newUserMessage]);
    setMockLoading(true);

    // Simulate elite sports scientist thinking delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const assistantMsgId = (Date.now() + 1).toString();
    let assistantMessage;

    if (promptText.toLowerCase().includes('quad') || promptText.toLowerCase().includes('back') || promptText.toLowerCase().includes('leg')) {
      assistantMessage = {
        id: assistantMsgId,
        role: 'assistant' as const,
        content: "Based on your reported localized soreness in the **Quadriceps** and **Lower Back**, I have formulated a targeted myofascial release and neuromuscular activation prescription. Heavy squat loads often trigger high tone in the rectus femoris and erector spinae. Execute these drills in order to downregulate sympathetic drive and accelerate local blood flow.",
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
                    'Half-kneeling hip flexor stretch with slight pelvic posterior tilt (2m hold)',
                    'Passive leg compression or high-resistance band distraction'
                  ],
                  durationMinutes: 12
                },
                {
                  id: 'lower-back',
                  name: 'Erector Spinae & QL',
                  soreness: 'moderate',
                  prescriptions: [
                    'Prone cobra or sphinx pose breathing (5 slow diaphragmatic cycles)',
                    'Supine lower back rotational twist (90 seconds per side)',
                    'Hanging bar decompression with full body exhale'
                  ],
                  durationMinutes: 8
                }
              ]
            },
            result: { status: 'success' }
          }
        ]
      };
    } else if (promptText.toLowerCase().includes('calf') || promptText.toLowerCase().includes('cramp') || promptText.toLowerCase().includes('tight')) {
      assistantMessage = {
        id: assistantMsgId,
        role: 'assistant' as const,
        content: "High-intensity sprint repeats create high eccentric shear on the gastrocnemius and soleus complexes. Cramping suggests micro-tearing combined with electrolyte depletion. I've designed an active calf mobilization and trigger release routine to alleviate the hypertonicity and encourage recovery.",
        toolInvocations: [
          {
            state: 'result' as const,
            toolCallId: 'call-mob-2',
            toolName: 'prescribe_mobility',
            args: {
              muscleGroups: [
                {
                  id: 'calves',
                  name: 'Gastrocnemius & Soleus',
                  soreness: 'severe',
                  prescriptions: [
                    'Lacrosse ball micro-trigger release on the lateral soleus insertion (2m each)',
                    'Elevated heel calf stretch off step, holding deep stretch (3 sets x 60s)',
                    'Slow ankle circles clockwise/counterclockwise (20 reps each)'
                  ],
                  durationMinutes: 10
                }
              ]
            },
            result: { status: 'success' }
          }
        ]
      };
    } else if (promptText.toLowerCase().includes('hydration') || promptText.toLowerCase().includes('sweat') || promptText.toLowerCase().includes('heat')) {
      assistantMessage = {
        id: assistantMsgId,
        role: 'assistant' as const,
        content: "High ambient temperatures significantly accelerate sweat rate and sodium excretion in elite decathletes, leading to accelerated muscle fatigue and potential cramping. I have initialized the fluid and sleep calculation model below to optimize your biological rehydration and recovery window.",
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
    } else {
      // Default to macro slider suggestion
      assistantMessage = {
        id: assistantMsgId,
        role: 'assistant' as const,
        content: "I have calculated your optimal macronutrient allocation for a **Peak Volume / Intensity** training block. At 82kg, your metabolic expenditure will demand heightened carbohydrate availability to maintain glycogen saturation, while keeping protein elevated to sustain muscle protein synthesis (MPS). Use the interactive model below to customize your protein bias.",
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
      // Clear input
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

        {/* Mock/API Toggle Switch */}
        <div className="flex items-center gap-3">
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

      {/* Main Content Dashboard Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Side Panel (Athlete profile and stats) - Col 4 */}
        <aside className="lg:col-span-4 bg-neutral-950/20 border-r border-neutral-900/60 p-6 flex flex-col gap-6 overflow-y-auto hidden lg:flex">
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

          {/* Real-time Bio Stats Panel */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[10px] font-bold text-neutral-500 tracking-widest font-mono uppercase">PHYSIOLOGICAL PROFILE</h3>
            
            {/* Recovery Ring Score */}
            <div className="rounded-3xl p-4 bg-neutral-950/50 border border-neutral-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-300 block">Recovery Score</span>
                  <span className="text-[9px] text-neutral-500 font-mono">Optimal strain headroom</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black font-mono text-emerald-400">88%</span>
                <span className="text-[9px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono font-bold">PEAK</span>
              </div>
            </div>

            {/* Heart Rate */}
            <div className="rounded-3xl p-4 bg-neutral-950/50 border border-neutral-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <Heart className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-300 block">Resting HR</span>
                  <span className="text-[9px] text-neutral-500 font-mono">Last 7-day average</span>
                </div>
              </div>
              <span className="text-lg font-bold font-mono text-neutral-200">48 <span className="text-[10px] text-neutral-500 font-normal">bpm</span></span>
            </div>

            {/* Sleep Performance */}
            <div className="rounded-3xl p-4 bg-neutral-950/50 border border-neutral-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-300 block">Restorative Sleep</span>
                  <span className="text-[9px] text-neutral-500 font-mono">Deep + REM ratio high</span>
                </div>
              </div>
              <span className="text-lg font-bold font-mono text-neutral-200">8.2 <span className="text-[10px] text-neutral-500 font-normal">hrs</span></span>
            </div>
          </div>

          {/* Quick Instructions / Info Banner */}
          <div className="mt-auto p-4 rounded-2xl bg-neutral-950 border border-neutral-900 text-xs text-neutral-500 leading-relaxed relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 text-neutral-700">
              <Info className="w-4 h-4" />
            </div>
            <p className="font-semibold text-neutral-400 mb-1">Elite Recovery Coaching</p>
            Mention feeling sore, tight, or fatigued in specific muscle groups, or ask about training fuel models. The AI will immediately formulate and output dynamic, interactive sliders or mobility checksheets.
          </div>
        </aside>

        {/* Right Side Chat Stream - Col 8 */}
        <main className="lg:col-span-8 flex flex-col h-full overflow-hidden bg-neutral-950/10">
          
          {/* Scrollable Chat Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-36">
            {messages.length === 0 && !mockLoading ? (
              /* Welcome screen for new chat */
              <div className="max-w-md mx-auto text-center mt-12 animate-fadeIn">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 mx-auto mb-4">
                  <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-neutral-200">Consult your Sports Scientist</h3>
                <p className="text-xs text-neutral-500 mt-2 leading-relaxed max-w-sm mx-auto">
                  Type a prompt below about your current athletic fatigue, muscle soreness, or nutrition ratio requirements.
                </p>

                {/* Suggestions grid */}
                <div className="mt-8 flex flex-col gap-2">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion.prompt)}
                      className="group w-full p-3 rounded-2xl bg-neutral-950 hover:bg-neutral-900/60 border border-neutral-900 hover:border-neutral-800 transition-all text-left text-xs flex justify-between items-center"
                    >
                      <span className="text-neutral-400 group-hover:text-neutral-200 transition-colors font-medium">
                        "{suggestion.prompt}"
                      </span>
                      <span className="text-[10px] font-bold text-neutral-600 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800/80 uppercase font-mono group-hover:text-emerald-400 group-hover:border-emerald-500/20 flex items-center gap-1">
                        {suggestion.label} <ArrowUpRight className="w-2.5 h-2.5" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Conversation messages stream */
              <div className="space-y-6 max-w-2xl mx-auto">
                {messages.map((message: any) => {
                  const isUser = message.role === 'user';
                  return (
                    <div
                      key={message.id}
                      className={`flex flex-col gap-2.5 animate-fadeIn ${
                        isUser ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold font-mono tracking-wider text-neutral-600 uppercase">
                          {isUser ? 'Alexander Cole' : 'ELITE SCIENTIST'}
                        </span>
                      </div>
                      
                      {/* Text Bubble */}
                      <div
                        className={`text-sm leading-relaxed p-4 rounded-3xl max-w-full ${
                          isUser
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-neutral-200 rounded-tr-none'
                            : 'bg-neutral-900/60 border border-neutral-800 text-neutral-300 rounded-tl-none'
                        }`}
                      >
                        {message.content}
                      </div>

                      {/* Tool Invocations Rendering */}
                      {message.toolInvocations?.map((toolInvocation: any) => {
                        const { toolName, toolCallId, args } = toolInvocation;

                        if (toolName === 'suggest_macros') {
                          return (
                            <div key={toolCallId} className="w-full mt-2 animate-fadeIn">
                              <MacroSlider
                                initialWeight={args.weight}
                                initialTrainingLoad={args.trainingLoad}
                                initialProteinRatio={args.proteinRatio}
                              />
                            </div>
                          );
                        }

                        if (toolName === 'prescribe_mobility') {
                          return (
                            <div key={toolCallId} className="w-full mt-2 animate-fadeIn">
                              <MobilityMap
                                initialMuscleGroups={args.muscleGroups}
                              />
                            </div>
                          );
                        }

                        if (toolName === 'calculate_hydration') {
                          return (
                            <div key={toolCallId} className="w-full mt-2 animate-fadeIn">
                              <BioMetricsPanel
                                initialWorkoutDuration={args.durationMinutes}
                                initialTemperature={args.ambientTemp}
                                initialSweatRate={args.sweatRate}
                              />
                            </div>
                          );
                        }

                        return null;
                      })}
                    </div>
                  );
                })}

                {/* Loading state indicator */}
                {mockLoading && (
                  <div className="flex flex-col items-start gap-2.5 animate-pulse">
                    <span className="text-[9px] font-bold font-mono tracking-wider text-neutral-600 uppercase">
                      ELITE SCIENTIST IS ANALYZING...
                    </span>
                    <div className="h-10 w-48 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center gap-1.5 text-xs text-neutral-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce delay-150" />
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce delay-300" />
                    </div>
                  </div>
                )}

                <div ref={chatBottomRef} />
              </div>
            )}
          </div>

          {/* Fixed Bottom Input Bar Area */}
          <div className="absolute bottom-0 left-0 lg:left-[33.33%] right-0 p-6 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent border-t border-neutral-950">
            <div className="max-w-2xl mx-auto">
              {/* Form Input Container */}
              <form onSubmit={handleFormSubmit} className="relative flex items-center group">
                {/* Glow Backdrop */}
                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-20 blur-md group-focus-within:opacity-35 transition-opacity" />
                
                {/* Rounded Pill Input Box */}
                <div className="relative flex-1 flex items-center bg-neutral-950/90 border border-neutral-800 rounded-full py-1.5 pl-5 pr-2 backdrop-blur-md">
                  <input
                    id="chat-input"
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder={
                      useMock 
                        ? "Demo mode active... Type something (e.g. 'Leg soreness')" 
                        : "Ask about recovery soreness, training intensity, macros..."
                    }
                    className="flex-1 bg-transparent text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none pr-4 font-medium"
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    className="p-3.5 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-neutral-950 shadow-md transition-all active:scale-95 flex items-center justify-center cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Technical Notice / Status */}
              <div className="mt-2 text-center text-[10px] text-neutral-600 font-mono">
                {useMock 
                  ? "⚡ RUNNING IN OFFLINE DEMO MODE (IDEAL FOR DIRECT UI PREVIEW)"
                  : "🌐 CONNECTED TO GROQ SPEEDWAY ROUTING · VERCEL AI SDK STREAM"}
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
