
import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { ContentItem, ContentType } from '../types';
import { Quote, Sparkles, Play, Pause, List, Heart } from 'lucide-react';

interface ReminderCardProps {
  content: ContentItem;
  className?: string;
  onViewList?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (item: ContentItem) => void;
}

const ReminderCard = forwardRef<HTMLDivElement, ReminderCardProps>(({ content, className, onViewList, isFavorite, onToggleFavorite }, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Local animation state for heart click
  const [heartAnim, setHeartAnim] = useState(false);

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
  
  const handleFavoriteClick = () => {
     if (onToggleFavorite) {
        setHeartAnim(true);
        setTimeout(() => setHeartAnim(false), 300);
        onToggleFavorite(content);
     }
  };

  const isNameOfAllah = content.type === ContentType.NAMES_OF_ALLAH;

  return (
    <div
      ref={ref}
      className={`relative w-full max-w-xl mx-auto overflow-hidden rounded-3xl border border-white/10 shadow-2xl backdrop-blur-2xl transition-all duration-500 ${className}`}
      style={{ padding: '16px' }}
      id="card-capture-area"
    >
      {/* Inner Border Container for Premium Feel */}
      <div className="relative h-full w-full rounded-2xl border border-amber-200/20 bg-gradient-to-b from-white/10 to-emerald-900/40 p-6 md:p-8 shadow-inner min-h-[500px] flex flex-col justify-center overflow-hidden">
        
        {/* Subtle Islamic Geometric Pattern Overlay */}
        <div className="absolute inset-0 z-0 bg-islamic-pattern opacity-100 pointer-events-none"></div>

        {/* Decorative Gradients */}
        <div className="absolute -top-24 -left-24 h-56 w-56 rounded-full bg-emerald-400/20 blur-[80px]"></div>
        <div className="absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-amber-200/10 blur-[80px]"></div>
        
        {/* ACTION BUTTONS (TOP RIGHT) */}
        <div className="absolute top-4 right-4 z-30 flex gap-2">
           {/* Favorite Button */}
           <button 
             onClick={handleFavoriteClick}
             data-html2canvas-ignore="true"
             className={`p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 group ${
                isFavorite 
                ? 'bg-red-500/20 border-red-500/40 text-red-400' 
                : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-red-400'
             } ${heartAnim ? 'scale-125' : 'scale-100'}`}
           >
              <Heart size={18} fill={isFavorite ? "currentColor" : "none"} className={isFavorite ? "drop-shadow-[0_0_8px_rgba(248,113,113,0.6)]" : ""} />
           </button>
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center w-full">
          
          {/* Header Icon */}
          <div className="mb-4 md:mb-6 flex flex-col items-center justify-center text-amber-100/70 relative w-full gap-3">
            {isNameOfAllah ? (
                 <Sparkles size={32} className="text-amber-200 animate-pulse" />
            ) : (
              <div className="flex items-center justify-center w-full">
                <Sparkles size={24} strokeWidth={1.5} className="mr-2 opacity-60 flex-shrink-0" />
                <Quote size={32} className="opacity-90 flex-shrink-0" />
                <Sparkles size={24} strokeWidth={1.5} className="ml-2 opacity-60 flex-shrink-0" />
              </div>
            )}
          </div>

          {/* Type Badge */}
          {!isNameOfAllah && (
            <span className="relative z-20 mb-4 inline-flex items-center rounded-full border border-amber-200/20 bg-emerald-950/40 px-6 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-200/90 shadow-sm backdrop-blur-md whitespace-nowrap mx-auto">
              {content.type}
            </span>
          )}

          {/* Arabic Text Section */}
          <div className="mb-6 w-full text-center relative group" dir="rtl">
            <p 
              className={`font-arabic font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] 
              ${isNameOfAllah 
                ? 'text-6xl md:text-7xl py-6 text-amber-100' 
                : 'text-2xl md:text-4xl py-4'}`}
              style={{ lineHeight: isNameOfAllah ? '2.2' : '2.9' }} 
            >
              {content.arabicText}
            </p>
            
            {/* Audio Button */}
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

          {/* Description */}
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
            
            {/* View List Button - MOVED HERE */}
            {isNameOfAllah && onViewList && (
               <div className="pt-2">
                   <button 
                     onClick={onViewList} 
                     className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-semibold bg-white/5 px-3 py-1.5 rounded-full text-emerald-200/60 hover:text-emerald-200 hover:bg-white/10 transition-all border border-white/5"
                     data-html2canvas-ignore="true" 
                   >
                     <List size={10} /> View All Names
                   </button>
               </div>
            )}
          </div>
          
          {/* Watermark */}
          <div className="mt-6 flex items-center justify-center opacity-70">
            <p className="text-[9px] uppercase tracking-[0.3em] text-white font-light whitespace-nowrap">
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
