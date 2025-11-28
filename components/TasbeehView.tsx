
import React, { useState, useEffect } from 'react';
import { RotateCcw, Activity, Calendar, Award, ChevronRight } from 'lucide-react';
import { TASBEEH_TYPES, incrementTasbeehCount, getStats } from '../services/tasbeehService';

const TasbeehView: React.FC = () => {
  const [activeDhikrId, setActiveDhikrId] = useState(TASBEEH_TYPES[0].id);
  const [sessionCount, setSessionCount] = useState(0);
  const [stats, setStats] = useState({ today: 0, streak: 0, month: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  // Load stats on mount or change
  useEffect(() => {
    setStats(getStats(activeDhikrId));
    setSessionCount(0);
  }, [activeDhikrId]);

  const handleTap = () => {
    // Haptic Feedback
    if (navigator.vibrate) navigator.vibrate(15);
    
    // Animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 100);

    // Update Data
    setSessionCount(prev => prev + 1);
    const newStats = incrementTasbeehCount(activeDhikrId);
    setStats(newStats);
  };

  const handleResetSession = () => {
    if (navigator.vibrate) navigator.vibrate(50);
    setSessionCount(0);
  };

  const activeDhikr = TASBEEH_TYPES.find(t => t.id === activeDhikrId) || TASBEEH_TYPES[0];

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-3 md:gap-6 h-[calc(100dvh-130px)] md:h-[800px] min-h-[500px] animate-in fade-in duration-500">
      
      {/* 1. Dhikr Selector (Horizontal Scroll) */}
      <div className="w-full relative px-1 flex-shrink-0">
         <div className="overflow-x-auto pb-2 scrollbar-hide flex gap-2 snap-x">
            {TASBEEH_TYPES.map((type) => (
               <button
                  key={type.id}
                  onClick={() => setActiveDhikrId(type.id)}
                  className={`flex-shrink-0 snap-center px-4 py-2 rounded-full border transition-all text-xs font-medium uppercase tracking-wider ${
                     activeDhikrId === type.id
                     ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-100 shadow-lg shadow-emerald-900/20'
                     : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:text-white/60'
                  }`}
               >
                  {type.label}
               </button>
            ))}
         </div>
      </div>

      {/* 2. Main Counter Display (OLED Style) */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center min-h-0">
          
          {/* Card Container */}
          <div className="relative w-full h-full bg-[#0F2027] rounded-[2.5rem] md:rounded-[3rem] border border-white/10 shadow-2xl flex flex-col items-center justify-between p-6 md:p-8 overflow-hidden group">
              
              {/* Background Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none"></div>

              {/* Top Text */}
              <div className="text-center z-10 mt-2 space-y-1 md:space-y-2 flex-shrink-0">
                  <p className="font-arabic text-2xl md:text-5xl text-white drop-shadow-md leading-relaxed py-2" dir="rtl">
                     {activeDhikr.arabic}
                  </p>
                  <p className="text-[10px] md:text-sm text-emerald-200/60 font-medium tracking-widest uppercase truncate max-w-[280px]">
                     {activeDhikr.transliteration}
                  </p>
              </div>

              {/* The Mechanical Button / Counter */}
              <button 
                  onClick={handleTap}
                  className={`relative w-44 h-44 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-[#1a2f38] to-[#091418] border-8 border-[#203A43] shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_5px_15px_rgba(255,255,255,0.05)] flex items-center justify-center group active:scale-[0.98] transition-all duration-100 outline-none select-none z-20 touch-manipulation my-4 ${isAnimating ? 'scale-[0.98] border-emerald-500/30' : ''}`}
                  style={{ touchAction: 'manipulation' }}
              >
                  {/* Digital Display Effect */}
                  <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full bg-black/60 shadow-[inset_0_2px_10px_rgba(0,0,0,1)] flex flex-col items-center justify-center border border-white/5">
                      <span className="text-5xl md:text-6xl font-mono font-bold text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)] tracking-tighter tabular-nums">
                         {sessionCount}
                      </span>
                      <span className="text-[9px] text-emerald-500/30 uppercase tracking-[0.2em] mt-1">Count</span>
                  </div>
                  
                  {/* Outer Ring Decoration */}
                  <div className="absolute inset-0 rounded-full border border-white/5 pointer-events-none"></div>
                  <div className="absolute inset-2 rounded-full border border-white/5 pointer-events-none opacity-50"></div>
              </button>

              {/* Bottom Controls */}
              <div className="w-full flex items-center justify-between z-10 px-2 md:px-4 mb-1 md:mb-2 flex-shrink-0">
                 <div className="text-xs text-white/30 font-medium flex flex-col">
                    <span className="uppercase tracking-wider text-[9px] opacity-60">Today</span>
                    <span className="font-mono text-lg text-emerald-100/80">{stats.today}</span>
                 </div>

                 <button 
                    onClick={handleResetSession}
                    className="p-3 rounded-full bg-white/5 text-white/40 hover:text-red-400 hover:bg-white/10 border border-white/5 transition-all"
                    title="Reset Session"
                 >
                    <RotateCcw size={16} />
                 </button>
              </div>

          </div>
      </div>

      {/* 3. Stats Dashboard */}
      <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-2 px-1 flex-shrink-0 pb-2 md:pb-0">
          {/* Streak */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center justify-center gap-0.5">
             <div className="p-1.5 rounded-full bg-amber-500/20 text-amber-300 mb-0.5"><Activity size={14} /></div>
             <span className="text-lg md:text-2xl font-bold text-white font-mono">{stats.streak}</span>
             <span className="text-[9px] uppercase tracking-widest text-white/30">Streak</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center justify-center gap-0.5">
             <div className="p-1.5 rounded-full bg-blue-500/20 text-blue-300 mb-0.5"><Calendar size={14} /></div>
             <span className="text-lg md:text-2xl font-bold text-white font-mono">{stats.month}</span>
             <span className="text-[9px] uppercase tracking-widest text-white/30">Month</span>
          </div>

          <div className="col-span-2 md:col-span-1 p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between md:justify-center md:flex-col gap-1 cursor-pointer hover:bg-white/10 transition-colors group">
              <div className="flex items-center gap-3 md:flex-col md:gap-0.5">
                  <div className="p-1.5 rounded-full bg-purple-500/20 text-purple-300"><Award size={14} /></div>
                  <div className="flex flex-col md:items-center">
                     <span className="text-xs md:text-sm font-medium text-white group-hover:text-emerald-300 transition-colors">Total Stats</span>
                     <span className="text-[9px] uppercase tracking-widest text-white/30 hidden md:block">Coming Soon</span>
                  </div>
              </div>
              <ChevronRight size={14} className="text-white/20 md:hidden" />
          </div>
      </div>
    </div>
  );
};

export default TasbeehView;
