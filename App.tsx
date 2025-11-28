
import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as htmlToImage from 'html-to-image';
import html2canvas from 'html2canvas';
import { RefreshCw, Download, MessageCircle, Loader2, Info, Moon, Check, User, Grid, Heart, Layers, X, Search, Activity } from 'lucide-react';
import ReminderCard from './components/ReminderCard';
import UserDashboard from './components/UserDashboard';
import { Analytics } from '@vercel/analytics/react';
import AdhkarView from './components/AdhkarView';
import TasbeehView from './components/TasbeehView';
import { MOCK_CONTENT, fetchRandomQuranVerse, fetchRandomHadith, getContentByType, getDuasByTag } from './services/contentService';
import { ContentItem, ContentType } from './types';
import { dbService } from './services/db';

// Enhanced Feelings Data with Emojis
const FEELINGS_DATA = [
  { label: 'All', emoji: '✨' },
  { label: 'Anxious', emoji: '🌧️' },
  { label: 'Sad', emoji: '💔' },
  { label: 'Happy', emoji: '☀️' },
  { label: 'Grateful', emoji: '🤲' },
  { label: 'Lost', emoji: '🧭' },
  { label: 'Travel', emoji: '✈️' },
  { label: 'Morning', emoji: '🌅' },
  { label: 'Family', emoji: '🏡' },
  { label: 'Stress', emoji: '⚡' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ContentType>(ContentType.QURAN);
  const [selectedFeeling, setSelectedFeeling] = useState<string>('All');
  
  // Initialize with a placeholder
  const [currentContent, setCurrentContent] = useState<ContentItem>(() => {
    return MOCK_CONTENT[0]; 
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });
  
  // State for 99 Names List View
  const [isListOpen, setIsListOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // USER ENGAGEMENT STATES
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [streak, setStreak] = useState(0);
  const [isCurrentFavorite, setIsCurrentFavorite] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);

  // --- STREAK LOGIC & INIT ---
  useEffect(() => {
     // 1. Calculate Streak
     const checkStreak = () => {
        const lastVisit = localStorage.getItem('last_visit_date');
        const currentStreak = parseInt(localStorage.getItem('streak_count') || '0');
        const today = new Date().toDateString();

        if (lastVisit === today) {
           setStreak(currentStreak);
        } else {
           const yesterday = new Date();
           yesterday.setDate(yesterday.getDate() - 1);
           
           if (lastVisit === yesterday.toDateString()) {
              const newStreak = currentStreak + 1;
              localStorage.setItem('streak_count', newStreak.toString());
              setStreak(newStreak);
              setShowToast({ visible: true, message: `🔥 Streak Increased! ${newStreak} Days` });
           } else {
              localStorage.setItem('streak_count', '1');
              setStreak(1);
           }
           localStorage.setItem('last_visit_date', today);
        }
     };
     checkStreak();
     
     // 2. Initial Content Load
     handleNewReflection(ContentType.QURAN, false);
  }, []);

  // Check Favorite Status when content changes
  useEffect(() => {
     if (currentContent && activeTab !== ContentType.ADHKAR && activeTab !== ContentType.TASBEEH) {
        dbService.addToHistory(currentContent).catch(console.error);
        dbService.isFavorite(currentContent.id).then(setIsCurrentFavorite);
     }
  }, [currentContent, activeTab]);

  // Toast Timer
  useEffect(() => {
    if (showToast.visible) {
      const timer = setTimeout(() => {
        setShowToast({ ...showToast, visible: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast.visible]);

  // Reset feeling when leaving Dua tab
  useEffect(() => {
    if (activeTab !== ContentType.DUA) {
      setSelectedFeeling('All');
    }
    if (activeTab !== ContentType.ADHKAR && activeTab !== ContentType.TASBEEH) {
       handleNewReflection(activeTab, true);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === ContentType.DUA) {
      handleNewReflection(ContentType.DUA, true);
    }
  }, [selectedFeeling]);

  const handleNewReflection = useCallback(async (forcedType?: ContentType, isTabChange: boolean = false) => {
    const typeToFetch = forcedType || activeTab;
    
    // Skip random fetch for Adhkar/Tasbeeh
    if (typeToFetch === ContentType.ADHKAR || typeToFetch === ContentType.TASBEEH) return;

    setIsLoading(true);
    
    try {
        if (typeToFetch === ContentType.QURAN) {
            const newContent = await fetchRandomQuranVerse();
            if (newContent) setCurrentContent(newContent);
        }
        else if (typeToFetch === ContentType.HADITH) {
            const newContent = await fetchRandomHadith();
            if (newContent) setCurrentContent(newContent);
        }
        else {
            let pool: ContentItem[] = [];
            if (typeToFetch === ContentType.DUA && selectedFeeling !== 'All') {
                pool = getDuasByTag(selectedFeeling);
                if (pool.length === 0) pool = getContentByType(typeToFetch);
            } else {
                pool = getContentByType(typeToFetch);
            }

            if (pool.length > 0) {
                const nextItem = pool.length > 1 
                    ? pool[Math.floor(Math.random() * pool.length)]
                    : pool[0];
                setCurrentContent(nextItem);
            }
        }
    } catch (e) {
        console.error("Error fetching content", e);
    } finally {
        setIsLoading(false);
    }
  }, [activeTab, selectedFeeling]);

  const toggleFavorite = async (item: ContentItem) => {
     if (isCurrentFavorite) {
        await dbService.removeFavorite(item.id);
        setIsCurrentFavorite(false);
        setShowToast({ visible: true, message: 'Removed from Favorites' });
     } else {
        await dbService.addFavorite(item);
        setIsCurrentFavorite(true);
        setShowToast({ visible: true, message: 'Added to Favorites ❤️' });
     }
  };

  // Platform Detection
  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  };

  const isAndroid = () => {
    return /Android/i.test(navigator.userAgent);
  };

  // HYBRID GENERATION STRATEGY
  const generateCardImage = async (returnType: 'blob' | 'dataUrl' = 'blob'): Promise<Blob | string | null> => {
    if (!cardRef.current) return null;
    await document.fonts.ready;

    try {
      if (isIOS()) {
        const options = {
            backgroundColor: '#0F2027', 
            pixelRatio: 2, 
            cacheBust: true,
            filter: (node: HTMLElement) => !node.hasAttribute?.('data-html2canvas-ignore')
        };
        if (returnType === 'dataUrl') return await htmlToImage.toPng(cardRef.current, options);
        else return await htmlToImage.toBlob(cardRef.current, options);
      } else {
        const canvas = await html2canvas(cardRef.current, {
            useCORS: true,
            allowTaint: false,
            backgroundColor: '#0F2027',
            scale: 3, 
            ignoreElements: (element) => element.hasAttribute('data-html2canvas-ignore')
        });
        if (returnType === 'dataUrl') return canvas.toDataURL('image/png');
        else return new Promise((resolve) => { canvas.toBlob((blob) => resolve(blob), 'image/png'); });
      }
    } catch (err) {
      console.error("Image generation failed", err);
      alert("Generation failed: " + (err instanceof Error ? err.message : String(err)));
      return null;
    }
  };

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
       navigator.clipboard.writeText(text).catch(err => console.warn("Clipboard failed", err));
    }
  };

  const downloadBlob = (blob: Blob, fileName: string) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
  };

  const handleSave = async () => {
    if (isCapturing) return;
    setIsCapturing(true);
    setShowToast({ visible: true, message: 'Generating...' });

    try {
      if (!isIOS()) {
         const blob = await generateCardImage('blob') as Blob;
         if (!blob) throw new Error("Generation failed");
         const fileName = `ihsan-card-${Date.now()}.png`;
         downloadBlob(blob, fileName);
         setShowToast({ visible: true, message: 'Downloaded!' });
      } else {
         const dataUrl = await generateCardImage('dataUrl') as string;
         if (!dataUrl) throw new Error("Generation failed");
         const win = window.open();
         if (win) {
             win.document.write(`<html><body style="margin:0;background:#0F2027;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;"><img src="${dataUrl}" style="max-width:90%;border-radius:12px;"/><div style="margin-top:20px;color:white;font-family:system-ui;padding:10px;">Long Press Image to Save 📸</div></body></html>`);
             setShowToast({ visible: true, message: 'Image Ready' });
         } else {
             window.location.href = dataUrl;
             setShowToast({ visible: true, message: 'Long Press to Save' });
         }
      }
    } catch (e: any) {
      console.error("Save failed", e);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleWhatsAppShare = async () => {
    if (isCapturing) return;
    setIsCapturing(true);
    setShowToast({ visible: true, message: 'Preparing...' });

    const appUrl = window.location.href;
    const shareText = `*Daily Islamic Reminder via Ihsan App*\n\n"${currentContent.englishTranslation}"\n\nRead more at: ${appUrl}`;
    const doTextFallback = () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        window.location.href = whatsappUrl;
    };

    try {
      copyToClipboard(shareText); 
      const blob = await generateCardImage('blob') as Blob;
      if (!blob) throw new Error("Image generation failed");
      
      const fileName = `ihsan-share-${Date.now()}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      if (isAndroid()) {
         if (navigator.share) {
            try {
               await navigator.share({ files: [file], title: 'Ihsan Reminder', text: shareText });
               setShowToast({ visible: true, message: 'Shared!' });
            } catch (err: any) {
               if (err.name === 'AbortError') return;
               try { await navigator.share({ files: [file] }); } 
               catch (e) { downloadBlob(blob, fileName); alert("Share failed. Image downloaded."); }
            }
         } else {
             downloadBlob(blob, fileName);
             alert("Sharing unavailable. Downloaded instead.");
         }
      } else if (isIOS()) {
         if (navigator.share) {
             try {
                 await navigator.share({ files: [file] });
                 setShowToast({ visible: true, message: 'Paste caption in chat!' });
             } catch (err: any) {
                 if (err.name === 'AbortError') return;
                 doTextFallback();
             }
         } else {
             doTextFallback();
         }
      } else {
        downloadBlob(blob, fileName);
        setShowToast({ visible: true, message: 'Image saved!' });
        const whatsappUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
        setTimeout(() => window.open(whatsappUrl, '_blank'), 1000);
      }
    } catch (err: any) {
      console.error("Share process error", err);
      doTextFallback();
    } finally {
      setIsCapturing(false);
    }
  };

  const getListItems = () => {
    return getContentByType(ContentType.NAMES_OF_ALLAH).filter(item => 
       item.englishTranslation.toLowerCase().includes(searchQuery.toLowerCase()) || 
       item.arabicText.includes(searchQuery)
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#0F2027] bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364] flex flex-col items-center justify-center p-4 md:p-8 font-sans text-slate-100 relative overflow-hidden">
      <Analytics />
      {/* Toast Notification */}
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${showToast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="bg-emerald-500/90 text-white px-6 py-3 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 border border-emerald-400/50">
            <Check size={18} strokeWidth={3} />
            <span className="font-medium text-sm">{showToast.message}</span>
        </div>
      </div>

      {/* USER DASHBOARD DRAWER */}
      <UserDashboard 
         isOpen={isDashboardOpen}
         onClose={() => setIsDashboardOpen(false)}
         streak={streak}
         onSelectContent={(item) => {
            setActiveTab(item.type);
            setCurrentContent(item);
         }}
      />

      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-emerald-900/20 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center space-y-6">
        
        {/* Header */}
        <div className="w-full flex justify-between items-start mt-4 md:mt-0 relative">
          <div className="w-10"></div>
          
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <Moon size={28} className="text-amber-200" fill="currentColor" fillOpacity={0.2} />
              <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 to-emerald-100 drop-shadow-lg">
                Ihsan
              </h1>
            </div>
            <p className="text-emerald-200/60 font-light tracking-[0.2em] text-xs md:text-sm uppercase">
              Excellence in Faith
            </p>
          </div>

          <button 
             onClick={() => setIsDashboardOpen(true)}
             className="relative p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all active:scale-95 group"
          >
             <User size={20} className="text-emerald-200" />
             {streak > 0 && (
                <div className="absolute -top-1 -right-1 bg-amber-500 text-[9px] font-bold text-black w-4 h-4 rounded-full flex items-center justify-center border border-[#0F2027]">
                   {streak}
                </div>
             )}
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="w-full flex justify-center items-center gap-2">
           <div className="overflow-x-auto pb-2 scrollbar-hide w-full flex justify-center">
              <div className="flex p-1 space-x-1 bg-black/20 backdrop-blur-md rounded-2xl border border-white/5 w-max">
              {[ContentType.QURAN, ContentType.HADITH, ContentType.DUA, ContentType.NAMES_OF_ALLAH, ContentType.ADHKAR, ContentType.TASBEEH].map((type) => (
                 <button
                    key={type}
                    onClick={() => setActiveTab(type)}
                    className={`px-4 md:px-6 py-2 rounded-xl text-xs md:text-sm font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                    activeTab === type
                       ? 'bg-emerald-500/20 text-emerald-100 shadow-sm border border-emerald-500/30'
                       : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                    }`}
                 >
                    {type === ContentType.ADHKAR && <Layers size={14} />}
                    {type === ContentType.TASBEEH && <Activity size={14} />}
                    {type}
                 </button>
              ))}
              </div>
           </div>
           
           {activeTab === ContentType.NAMES_OF_ALLAH && (
              <button onClick={() => setIsListOpen(true)} className="p-3 mb-2 rounded-2xl bg-black/20 hover:bg-white/10 border border-white/5 text-emerald-200 flex-shrink-0">
                 <Grid size={20} />
              </button>
           )}
        </div>

        {/* Feelings Carousel */}
        {activeTab === ContentType.DUA && (
          <div className="w-full animate-in fade-in slide-in-from-top-4 duration-500">
             <div className="flex flex-col items-center gap-3">
                <span className="text-xs text-emerald-200/50 uppercase tracking-widest flex items-center gap-1">
                   <Heart size={10} /> How are you feeling?
                </span>
                <div className="w-full relative group">
                   <div className="overflow-x-auto pb-4 pt-1 scrollbar-hide [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
                      <div className="flex gap-3 px-8 md:justify-center w-max md:w-full">
                         {FEELINGS_DATA.map(feeling => (
                            <button
                               key={feeling.label}
                               onClick={() => setSelectedFeeling(feeling.label)}
                               className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border backdrop-blur-sm shadow-lg active:scale-95 ${
                                  selectedFeeling === feeling.label
                                  ? 'bg-amber-100/20 text-amber-100 border-amber-200/40 shadow-amber-500/10 scale-105'
                                  : 'bg-white/5 text-white/60 border-white/5 hover:bg-white/10 hover:border-white/10 hover:text-white'
                               }`}
                            >
                               <span>{feeling.emoji}</span>
                               <span>{feeling.label}</span>
                            </button>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* CONTENT SWITCHER */}
        {activeTab === ContentType.ADHKAR ? (
           <div className="w-full animate-in fade-in duration-500">
              <AdhkarView 
                 onStreakUpdate={() => setShowToast({ visible: true, message: 'Adhkar Streak Updated! 🔥' })}
              />
           </div>
        ) : activeTab === ContentType.TASBEEH ? (
            <div className="w-full animate-in fade-in duration-500">
               <TasbeehView />
            </div>
        ) : (
           // STANDARD CARD VIEW
           <div className="w-full transform transition-all duration-500 px-1 md:px-0 flex flex-col items-center gap-6">
               <ReminderCard 
                 ref={cardRef} 
                 content={currentContent} 
                 onViewList={activeTab === ContentType.NAMES_OF_ALLAH ? () => setIsListOpen(true) : undefined}
                 isFavorite={isCurrentFavorite}
                 onToggleFavorite={toggleFavorite}
               />
               
               {/* Controls for Standard View */}
               <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full">
                  <button
                     onClick={() => handleNewReflection()}
                     disabled={isLoading}
                     className="w-full md:w-auto group flex items-center justify-center space-x-2 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all active:scale-95 disabled:opacity-50"
                  >
                     <RefreshCw size={20} className={`text-emerald-300 group-hover:rotate-180 transition-transform duration-700 ${isLoading ? 'animate-spin' : ''}`} />
                     <span className="font-medium text-white tracking-wide">
                        {activeTab === ContentType.NAMES_OF_ALLAH ? 'Next Name' : 'New Reflection'}
                     </span>
                  </button>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                     <button
                        onClick={handleSave}
                        disabled={isCapturing}
                        className="flex-1 md:flex-none group flex items-center justify-center space-x-2 px-6 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all active:scale-95"
                     >
                        <Download size={20} className="text-emerald-200" />
                        <span className="font-medium text-white">Save</span>
                     </button>

                     <button
                        onClick={handleWhatsAppShare}
                        disabled={isCapturing}
                        className="flex-1 md:flex-none group flex items-center justify-center space-x-2 px-6 py-4 rounded-full bg-green-600/90 hover:bg-green-500/90 border border-green-400/30 backdrop-blur-md transition-all active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                     >
                        {isCapturing ? <Loader2 size={20} className="animate-spin text-white" /> : <MessageCircle size={20} className="text-white" />}
                        <span className="font-medium text-white">WhatsApp</span>
                     </button>
                  </div>
               </div>
           </div>
        )}
        
        {/* Footer Info */}
        <div className="mt-8 text-center flex flex-col items-center gap-3 pb-8">
           <div className="flex items-center gap-1.5 text-xs text-emerald-400/30">
             <Info size={12} />
             <span>Content provided by AlQuran Cloud & Sunnah.com</span>
           </div>
           
           <div className="h-px w-12 bg-white/10"></div>
           
           <div className="flex flex-col items-center gap-1">
             <a href="#" className="text-sm font-medium text-emerald-200/70 hover:text-emerald-200 transition-colors tracking-wide">
               https://ihsan-app-five.vercel.app/
             </a>
             <p className="text-[10px] uppercase tracking-widest text-white/20">
               Built by Arshad
             </p>
           </div>
        </div>
      </div>

      {/* 99 Names Grid Modal */}
      {isListOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-4xl h-[90vh] bg-[#0F2027] border border-white/10 rounded-3xl overflow-hidden flex flex-col relative shadow-2xl">
               <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#0F2027]">
                  <h2 className="text-2xl font-serif text-emerald-100">99 Names of Allah</h2>
                  <button onClick={() => setIsListOpen(false)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                     <X size={24} className="text-white/60" />
                  </button>
               </div>
               <div className="p-6 pt-0 mt-6 relative">
                   <div className="absolute left-10 top-1/2 -translate-y-1/2 text-white/30"><Search size={20} /></div>
                   <input 
                      type="text" 
                      placeholder="Search names..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-emerald-100 placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 transition-all"
                   />
               </div>
               <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 scrollbar-thin">
                  {getListItems().map((item) => (
                     <button 
                        key={item.id}
                        onClick={() => {
                           setCurrentContent(item);
                           setIsListOpen(false);
                           setActiveTab(ContentType.NAMES_OF_ALLAH);
                        }}
                        className="group flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-emerald-500/30 transition-all active:scale-95"
                     >
                        <span className="text-2xl font-arabic text-amber-100 mb-2">{item.arabicText}</span>
                        <span className="text-xs text-emerald-100/70 text-center">{item.englishTranslation}</span>
                     </button>
                  ))}
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default App;
