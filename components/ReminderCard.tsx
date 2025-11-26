import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { ContentItem, ContentType } from '../types';
import { Quote, Sparkles, Play, Pause, List } from 'lucide-react';

interface ReminderCardProps {
  content: ContentItem;
  className?: string;
  onViewList?: () => void;
}

const ReminderCard = forwardRef<HTMLDivElement, ReminderCardProps>(({ content, className, onViewList }, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Reset audio state when content changes
  useEffect(() => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [content.id]);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const isNameOfAllah = content.type === ContentType.NAMES_OF_ALLAH;

  return (
    <div
      ref={ref}
      className={`relative w-full max-w-xl mx-auto overflow-hidden rounded-3xl border border-white/10 p-1 shadow-2xl backdrop-blur-2xl transition-all duration-500 ${className}`}
    >
      {/* Inner Border Container for Premium Feel */}
      <div className="relative h-full w-full rounded-2xl border border-amber-200/20 bg-gradient-to-b from-white/10 to-emerald-900/40 p-6 md:p-8 shadow-inner min-h-[500px] flex flex-col justify-center">
        
        {/* Subtle Islamic Geometric Pattern Overlay */}
        <div className="absolute inset-0 z-0 bg-islamic-pattern opacity-100 pointer-events-none"></div>

        {/* Decorative Gradients */}
        <div className="absolute -top-24 -left-24 h-56 w-56 rounded-full bg-emerald-400/20 blur-[80px]"></div>
        <div className="absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-amber-200/10 blur-[80px]"></div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center w-full">
          
          {/* Header Icon */}
          <div className="mb-4 md:mb-6 flex justify-center text-amber-100/70 relative w-full">
            {isNameOfAllah ? (
               <div className="flex flex-col items-center">
                 <Sparkles size={32} className="text-amber-200 animate-pulse" />
                 {/* Optional Button to open List inside the card (rendered only if prop provided) */}
                 {onViewList && (
                   <button 
                     onClick={onViewList} 
                     className="absolute right-0 top-0 flex items-center gap-1 text-[10px] bg-white/10 px-2 py-1 rounded-full text-emerald-200 hover:bg-white/20 transition-colors"
                     data-html2canvas-ignore="true" // Don't include this button in screenshot
                   >
                     <List size={12} /> View All
                   </button>
                 )}
               </div>
            ) : (
              <div className="flex items-center">
                <Sparkles size={24} strokeWidth={1.5} className="mr-2 opacity-60" />
                <Quote size={32} className="opacity-90" />
                <Sparkles size={24} strokeWidth={1.5} className="ml-2 opacity-60" />
              </div>
            )}
          </div>

          {/* Type Badge */}
          {!isNameOfAllah && (
            <span className="mb-4 inline-flex items-center rounded-full border border-amber-200/20 bg-emerald-950/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-200/80 shadow-sm backdrop-blur-sm">
              {content.type}
            </span>
          )}

          {/* Arabic Text Section */}
          <div className="mb-8 w-full text-center relative group" dir="rtl">
            {/* 
                CRITICAL FIX: 
                Reduced line-height from 4 to 2.9 to close the gap between lines while still preventing collision.
            */}
            <p 
              className={`font-arabic font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] 
              ${isNameOfAllah 
                ? 'text-6xl md:text-7xl py-6 text-amber-100' 
                : 'text-2xl md:text-4xl py-4'}`}
              style={{ lineHeight: isNameOfAllah ? '2.2' : '2.9' }}
            >
              {content.arabicText}
            </p>
            
            {/* Audio Button - Only for Quran or items with audioUrl */}
            {content.audioUrl && (
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 md:-left-4" dir="ltr">
                <button 
                  onClick={toggleAudio}
                  className="p-2 rounded-full bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-400/30 text-emerald-100 transition-all hover:scale-110 active:scale-95"
                  title="Play Recitation"
                  data-html2canvas-ignore="true"
                >
                  {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                </button>
                <audio ref={audioRef} src={content.audioUrl} onEnded={handleAudioEnded} className="hidden" />
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="mb-6 flex items-center justify-center w-full opacity-60">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-200 to-transparent"></div>
            <div className="mx-2 h-1.5 w-1.5 rounded-full bg-amber-200/60"></div>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-200 to-transparent"></div>
          </div>

          {/* Translations Section */}
          
          {/* Urdu */}
          <div className="mb-4 w-full text-center" dir="rtl">
            <p className="font-urdu text-lg md:text-2xl text-emerald-100/95 leading-loose drop-shadow-sm">
              {content.urduTranslation}
            </p>
          </div>

          {/* English */}
          <div className="mb-6 md:mb-8 w-full text-center px-2 md:px-4">
            <p className={`font-serif italic leading-relaxed text-white/90 ${isNameOfAllah ? 'text-xl md:text-3xl font-semibold not-italic' : 'text-base md:text-xl'}`}>
              "{content.englishTranslation}"
            </p>
          </div>

          {/* Description (For Names of Allah or Context) */}
          {content.description && (
             <div className="mb-8 w-full text-center px-4 md:px-6 py-4 bg-emerald-950/20 rounded-xl border border-white/5">
                <p className="text-sm text-emerald-100/80 leading-relaxed font-light tracking-wide">
                  <span className="font-semibold text-amber-200/80 block mb-1 text-xs uppercase tracking-widest">Benefit & Meaning</span>
                  {content.description}
                </p>
             </div>
          )}

          {/* Reference / Footer */}
          <div className="flex flex-col items-center justify-center space-y-2 mt-auto">
            <p className="text-xs md:text-sm font-medium tracking-wide text-emerald-200">
              {content.reference}
            </p>
            {content.tags && content.tags.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap justify-center">
                {content.tags.map(tag => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-white/40 border border-white/5">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Watermark */}
          <div className="mt-6 flex items-center justify-center opacity-70">
            <p className="text-[9px] uppercase tracking-[0.3em] text-white font-light">
              Ihsan App | Daily Reminder
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

ReminderCard.displayName = 'ReminderCard';

export default ReminderCard;