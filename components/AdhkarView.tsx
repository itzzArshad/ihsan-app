
import React, { useState, useEffect, useRef } from 'react';
import { AdhkarItem } from '../types';
import { Check, ChevronRight, ChevronLeft, RefreshCw, Sun, Moon, Sparkles, Play, Pause, List as ListIcon, LayoutTemplate, ArrowLeft } from 'lucide-react';
import { fetchAdhkarFromApi } from '../services/contentService';

interface AdhkarViewProps {
  onStreakUpdate: () => void;
}

const AdhkarView: React.FC<AdhkarViewProps> = ({ onStreakUpdate }) => {
  const [timeOfDay, setTimeOfDay] = useState<'Morning' | 'Evening'>('Morning');
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [list, setList] = useState<AdhkarItem[]>([]);
  const [count, setCount] = useState(0);
  const [completedIndices, setCompletedIndices] = useState<number[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [adhkarStreak, setAdhkarStreak] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load Streak & Determine Initial Time
  useEffect(() => {
    const currentHour = new Date().getHours();
    const suggestedTime = currentHour >= 18 || currentHour < 5 ? 'Evening' : 'Morning';
    if (suggestedTime !== timeOfDay) {
        setTimeOfDay(suggestedTime);
    }
    
    const storedStreak = parseInt(localStorage.getItem('adhkar_streak') || '0');
    setAdhkarStreak(storedStreak);
  }, []);

  // Update List when time changes
  useEffect(() => {
    let isMounted = true;
    const loadAdhkar = async () => {
        try {
            const data = await fetchAdhkarFromApi(timeOfDay);
            if (isMounted) {
                setList(data);
                setCurrentIndex(0);
                setCount(0);
                setCompletedIndices([]);
            }
        } catch (error) {
            console.error("Failed to load Adhkar", error);
        }
    };
    loadAdhkar();
    return () => { isMounted = false; };
  }, [timeOfDay]);

  // Reset View on Index Change
  useEffect(() => {
    // Scroll to top when changing dhikr
    if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
    }
  }, [currentIndex]);

  // Audio Reset
  useEffect(() => {
     if (audio) {
         audio.pause();
         setIsPlaying(false);
     }
     const currentUrl = list[currentIndex]?.audioUrl;
     if (currentUrl) {
         const newAudio = new Audio(currentUrl);
         newAudio.onended = () => setIsPlaying(false);
         setAudio(newAudio);
     } else {
         setAudio(null);
     }
  }, [currentIndex, list]);

  const toggleAudio = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent counting when clicking audio
      if (!audio) return;
      if (isPlaying) {
          audio.pause();
      } else {
          audio.play();
      }
      setIsPlaying(!isPlaying);
  };

  const currentAdhkar = list[currentIndex];

  const handleTap = () => {
    if (completedIndices.includes(currentIndex)) return;
    if (navigator.vibrate) navigator.vibrate(10); 
    const newCount = count + 1;
    setCount(newCount);
    if (newCount >= currentAdhkar.targetCount) {
        handleComplete();
    }
  };

  const handleComplete = () => {
    if (completedIndices.includes(currentIndex)) return;
    const newCompleted = [...completedIndices, currentIndex];
    setCompletedIndices(newCompleted);
    setShowCelebration(true);
    if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
    if (newCompleted.length === list.length) {
       handleSessionCompletion();
    }
    setTimeout(() => {
      setShowCelebration(false);
      if (currentIndex < list.length - 1 && viewMode === 'card') {
        handleNext();
      }
    }, 1500);
  };

  const handleSessionCompletion = () => {
     const today = new Date().toDateString();
     const lastCompletion = localStorage.getItem('last_adhkar_date');
     if (lastCompletion !== today) {
        const newStreak = adhkarStreak + 1;
        localStorage.setItem('adhkar_streak', newStreak.toString());
        localStorage.setItem('last_adhkar_date', today);
        setAdhkarStreak(newStreak);
        if (onStreakUpdate) onStreakUpdate();
     }
  };

  const handleNext = () => {
    if (currentIndex < list.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setCount(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setCount(0);
    }
  };

  const handleSelectDhikr = (index: number) => {
     setCurrentIndex(index);
     setCount(0);
     setViewMode('card');
  };

  if (!currentAdhkar) return <div className="text-white/60 text-center py-20 flex flex-col items-center gap-2"><RefreshCw className="animate-spin" /> Loading Authentic Adhkar...</div>;

  const progress = Math.min((count / currentAdhkar.targetCount) * 100, 100);
  const isDone = completedIndices.includes(currentIndex);
  const remaining = currentAdhkar.targetCount - count;
  const overallProgress = list.length > 0 ? Math.round((completedIndices.length / list.length) * 100) : 0;

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-4 h-[85vh] md:h-[800px]">
      
      {/* Top Controls Container */}
      <div className="w-full flex flex-col gap-3 px-1">
          {/* Row 1: Time, Streak, View Toggle */}
          <div className="flex justify-between items-center w-full">
             <div className="flex bg-black/30 p-1 rounded-full border border-white/5 backdrop-blur-md">
                <button onClick={() => setTimeOfDay('Morning')} className={`px-3 md:px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-medium transition-all ${timeOfDay === 'Morning' ? 'bg-amber-500/20 text-amber-200 shadow-sm border border-amber-500/30' : 'text-white/40 hover:text-white/60'}`}><Sun size={14} /> Morning</button>
                <button onClick={() => setTimeOfDay('Evening')} className={`px-3 md:px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-medium transition-all ${timeOfDay === 'Evening' ? 'bg-indigo-500/20 text-indigo-200 shadow-sm border border-indigo-500/30' : 'text-white/40 hover:text-white/60'}`}><Moon size={14} /> Evening</button>
             </div>
             
             <div className="flex gap-2">
                 <div className="flex items-center gap-1.5 text-xs text-emerald-200/80 font-medium bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                    <RefreshCw size={10} className={completedIndices.length === list.length ? "animate-spin text-emerald-400" : ""} /> Streak: <span className="text-white">{adhkarStreak}</span>
                 </div>
                 
                 <div className="flex bg-black/30 p-1 rounded-full border border-white/5 backdrop-blur-md">
                    <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-full transition-all ${viewMode === 'list' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/60'}`} title="List View"><ListIcon size={16} /></button>
                    <button onClick={() => setViewMode('card')} className={`p-1.5 rounded-full transition-all ${viewMode === 'card' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/60'}`} title="Card View"><LayoutTemplate size={16} /></button>
                 </div>
             </div>
          </div>
          
          {/* Row 2: Overall Progress */}
          <div className="w-full px-1">
              <div className="flex justify-between text-[10px] text-white/40 uppercase tracking-widest mb-1.5">
                 <span>Session Progress</span>
                 <span>{completedIndices.length} / {list.length} Completed</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden flex items-center">
                 <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-500" style={{ width: `${overallProgress}%` }}></div>
              </div>
          </div>
      </div>

      {/* Main Content Area */}
      <div className="relative w-full flex-1 flex flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0F2027] shadow-2xl transition-all duration-500 group">
         
         {/* Background Ambience */}
         <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-emerald-900/20 pointer-events-none"></div>
         {timeOfDay === 'Morning' 
            ? <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px]"></div>
            : <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]"></div>
         }

         {viewMode === 'list' ? (
             // --- LIST VIEW ---
             <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                 {list.map((item, index) => {
                      const isCompleted = completedIndices.includes(index);
                      return (
                          <div 
                              key={item.id} 
                              onClick={() => handleSelectDhikr(index)}
                              className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer active:scale-[0.98]
                                  ${isCompleted ? 'bg-emerald-900/10 border-emerald-500/20' : 'bg-white/5 border-white/5 hover:bg-white/10'}
                              `}
                          >
                              {/* Left: Status / Count */}
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all flex-shrink-0
                                  ${isCompleted ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-900/20' : 'bg-white/5 border-white/10 text-white/40 group-hover:border-white/30'}
                              `}>
                                  {isCompleted ? <Check size={18} className="text-white" strokeWidth={3} /> : <span className="text-xs font-bold font-mono">x{item.targetCount}</span>}
                              </div>

                              {/* Middle: Content Preview */}
                              <div className="flex-1 min-w-0 flex flex-col gap-1">
                                  <div className="flex justify-between items-baseline">
                                      <span className="text-[10px] text-white/30 font-medium uppercase tracking-widest">#{index + 1}</span>
                                      <p className="font-arabic text-right text-lg text-white/90 truncate w-full pl-4" dir="rtl">{item.arabicText}</p>
                                  </div>
                                  <p className="text-xs text-white/50 truncate font-serif leading-relaxed">{item.englishTranslation}</p>
                              </div>
                              
                              {/* Right: Chevron */}
                              <ChevronRight size={18} className="text-white/20 group-hover:text-white/60 transition-colors" />
                          </div>
                      )
                 })}
                 <div className="h-10"></div>
             </div>
         ) : (
             // --- CARD VIEW ---
             <>
                 {/* Card Header */}
                 <div className="relative z-20 pt-6 px-6 flex justify-between items-center bg-gradient-to-b from-[#0F2027]/80 to-transparent">
                    <button onClick={() => setViewMode('list')} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors text-white/60 flex items-center gap-1 group">
                       <div className="p-1 rounded-full bg-white/5 group-hover:bg-white/10 border border-white/5"><ArrowLeft size={14}/></div>
                       <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">List</span>
                    </button>
                    
                    <div className="flex gap-2">
                        <button onClick={handlePrev} disabled={currentIndex === 0} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/5 hover:bg-white/10 disabled:opacity-20 transition-colors text-white/80"><ChevronLeft size={16}/></button>
                        <button onClick={handleNext} disabled={currentIndex === list.length - 1} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/5 hover:bg-white/10 disabled:opacity-20 transition-colors text-white/80"><ChevronRight size={16}/></button>
                    </div>
                 </div>

                 {/* Scrollable Content Area */}
                 <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 relative z-10 scrollbar-hide pb-64">
                     
                     {/* 1. Arabic Section */}
                     <div className="text-center w-full mb-8 relative" dir="rtl">
                         <p 
                             className="font-arabic font-bold text-2xl md:text-4xl text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] py-4 select-none"
                             style={{ lineHeight: '2.9' }}
                         >
                            {currentAdhkar.arabicText}
                         </p>
                         
                         {/* Audio Player Inline */}
                         {currentAdhkar.audioUrl && (
                            <div className="flex justify-center mt-6" dir="ltr">
                               <button onClick={toggleAudio} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-emerald-300 text-xs uppercase tracking-wider">
                                  {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                                  {isPlaying ? "Pause" : "Listen"}
                               </button>
                            </div>
                         )}
                     </div>

                     {/* English / Urdu Section */}
                     <div className="flex flex-col gap-6 text-center max-w-lg mx-auto">
                        
                        {/* 2. Transliteration (Glass Card) */}
                        {currentAdhkar.transliteration && (
                            <div className="px-5 py-5 rounded-2xl bg-white/5 border border-white/5 text-emerald-100/90 text-sm md:text-base font-medium leading-loose tracking-wide break-words shadow-sm">
                                {currentAdhkar.transliteration}
                            </div>
                        )}

                        {/* 3. Translation/Meaning (Serif Text) */}
                        <p className="text-white/90 text-lg md:text-xl font-serif leading-relaxed break-words px-2">
                            "{currentAdhkar.englishTranslation}"
                        </p>

                        {/* 4. Benefit Badge */}
                        {currentAdhkar.benefit && (
                            <div className="flex flex-col items-center gap-2 mt-2">
                                <div className="h-px w-20 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
                                <div className="flex items-start gap-2 text-amber-200/90 text-xs md:text-sm text-left bg-amber-900/20 p-4 rounded-xl border border-amber-500/20 shadow-sm">
                                   <Sparkles size={16} className="mt-0.5 flex-shrink-0 text-amber-400" />
                                   <span className="leading-relaxed">{currentAdhkar.benefit}</span>
                                </div>
                            </div>
                        )}
                        
                        {/* 5. Reference */}
                        <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-widest pb-4 break-words">
                            {currentAdhkar.reference}
                        </p>
                     </div>
                 </div>

                 {/* Fixed Bottom Tap Zone */}
                 <div 
                    className="absolute bottom-0 left-0 w-full z-30 h-32 bg-gradient-to-t from-black via-[#0F2027] to-transparent flex flex-col items-center justify-end pb-0 cursor-pointer select-none active:scale-[0.99] transition-transform"
                    onClick={handleTap}
                 >
                     {/* Fill Animation Background */}
                     <div className="absolute bottom-0 left-0 w-full h-24 bg-emerald-600/20 origin-bottom transition-all duration-300 ease-out" style={{ transform: `scaleY(${count / currentAdhkar.targetCount})` }}></div>
                     
                     {/* Separator Line */}
                     <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-auto"></div>

                     <div className="relative z-10 w-full h-24 flex items-center justify-center gap-4">
                         {isDone ? (
                            <div className="flex items-center gap-3 animate-in zoom-in duration-300">
                                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                                    <Check className="text-white" size={20} strokeWidth={4} />
                                </div>
                                <span className="text-xl font-bold text-emerald-100 tracking-tight">Completed</span>
                            </div>
                         ) : (
                            <div className="text-center">
                                <div className="text-5xl font-mono font-bold text-white drop-shadow-xl tracking-tight leading-none">
                                   {count}<span className="text-2xl text-white/30 ml-1">/{currentAdhkar.targetCount}</span>
                                </div>
                                <span className="text-[9px] text-white/40 uppercase tracking-[0.4em] mt-1 block">Tap to Count</span>
                            </div>
                         )}
                     </div>
                 </div>

                 {/* Celebration Overlay */}
                 {showCelebration && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50 bg-black/40 backdrop-blur-[2px]">
                       <div className="scale-150 text-6xl animate-bounce duration-1000">✨</div>
                    </div>
                 )}
             </>
         )}
      </div>

      <div className="text-center opacity-40">
         <p className="text-[10px] text-white">
            {viewMode === 'list' ? "Select a Dhikr to recite" : (remaining > 0 ? `${remaining} more to go` : "MashaAllah! Proceed to next")}
         </p>
      </div>
    </div>
  );
};
export default AdhkarView;
