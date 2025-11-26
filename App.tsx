import React, { useState, useRef, useEffect, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { RefreshCw, Download, Share2, Loader2, Info, MessageCircle, Moon, Heart, Compass, Search, Grid, X, Check, Copy } from 'lucide-react';
import ReminderCard from './components/ReminderCard';
import { MOCK_CONTENT, fetchRandomQuranVerse, fetchRandomHadith, getContentByType, getDuasByTag } from './services/contentService';
import { ContentItem, ContentType } from './types';

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
  
  const cardRef = useRef<HTMLDivElement>(null);

  // Initial Fetch on Mount
  useEffect(() => {
     handleNewReflection(ContentType.QURAN, false);
  }, []);

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
    handleNewReflection(activeTab, true);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === ContentType.DUA) {
      handleNewReflection(ContentType.DUA, true);
    }
  }, [selectedFeeling]);

  const handleNewReflection = useCallback(async (forcedType?: ContentType, isTabChange: boolean = false) => {
    const typeToFetch = forcedType || activeTab;
    
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


  const generateCardImage = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    
    try {
      // Ensure fonts are loaded
      await document.fonts.ready;
      
      // Dynamic scale logic
      const pixelRatio = window.devicePixelRatio || 1;
      const safeScale = pixelRatio > 2 ? 2 : pixelRatio; // Cap at 2x for iOS stability

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0F2027', 
        scale: safeScale,
        useCORS: true,
        allowTaint: false, // CRITICAL: Must be false for iOS export
        logging: false,
        ignoreElements: (element) => {
           if (element.tagName === 'BUTTON' || element.getAttribute('data-html2canvas-ignore')) {
             return true;
           }
           return false;
        },
      });
      
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png');
      });
    } catch (err) {
      console.error("Canvas generation failed", err);
      return null;
    }
  };

  const isMobileDevice = () => {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  };

  const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback or ignore
        return false;
    }
  };

  const handleDownload = async () => {
    if (isCapturing) return;
    setIsCapturing(true);

    try {
      const blob = await generateCardImage();
      if (!blob) throw new Error("Failed to generate image");

      if (isMobileDevice() && navigator.canShare) {
        // --- MOBILE (IOS/ANDROID) ---
        // Create file
        const file = new File([blob], `ihsan-card.png`, { type: 'image/png' });
        
        // Share ONLY the file. No title, no text.
        // This forces the "Save Image" option to appear reliably in iOS Share Sheet.
        if (navigator.canShare({ files: [file] })) {
             await navigator.share({
               files: [file],
             });
             setShowToast({ visible: true, message: 'Saved!' });
        } else {
             // Fallback if files not supported
             downloadBlob(blob);
        }
      } else {
        // --- DESKTOP ---
        downloadBlob(blob);
        setShowToast({ visible: true, message: 'Image Saved!' });
      }
    } catch (e) {
      console.error("Save failed", e);
      // Last resort fallback
      alert("Could not save automatically. Please screenshot the card.");
    } finally {
      setIsCapturing(false);
    }
  };

  const downloadBlob = (blob: Blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ihsan-${currentContent.type.toLowerCase()}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
  };

  const handleWhatsAppShare = async () => {
    if (isCapturing) return;
    setIsCapturing(true);

    const appUrl = window.location.href;
    const shareText = `*Daily Islamic Reminder via Ihsan App*\n\n"${currentContent.englishTranslation}"\n\n${currentContent.reference}\n\nRead more at: ${appUrl}`;
    
    try {
      // 1. Copy text to clipboard immediately
      await copyToClipboard(shareText);
      
      // 2. Generate Image
      const blob = await generateCardImage();
      if (!blob) throw new Error("Image generation failed");

      const file = new File([blob], `ihsan-reminder.png`, { type: 'image/png' });

      // 3. Share Logic
      if (isMobileDevice() && navigator.canShare && navigator.canShare({ files: [file] })) {
        // MOBILE: Share FILE ONLY. 
        // We do NOT attach text here to avoid iOS conflicts.
        // User relies on the clipboard copy from step 1.
        setShowToast({ visible: true, message: 'Caption copied! Select WhatsApp.' });
        
        await navigator.share({
            files: [file] 
        });
      } else {
        // DESKTOP: Download + Open Web
        downloadBlob(blob);
        setShowToast({ visible: true, message: 'Image saved! Text copied.' });
        
        const whatsappUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 1000);
      }

    } catch (err) {
      console.error("Share failed", err);
      // Fallback
      setShowToast({ visible: true, message: 'Share failed. Image saved.' });
      const blob = await generateCardImage();
      if(blob) downloadBlob(blob);
    } finally {
      setIsCapturing(false);
    }
  };

  // Logic for List Modal
  const getListItems = () => {
    return getContentByType(ContentType.NAMES_OF_ALLAH).filter(item => 
       item.englishTranslation.toLowerCase().includes(searchQuery.toLowerCase()) || 
       item.urduTranslation.toLowerCase().includes(searchQuery.toLowerCase()) || 
       item.arabicText.includes(searchQuery)
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#0F2027] bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364] flex flex-col items-center justify-center p-4 md:p-8 font-sans text-slate-100 relative overflow-hidden">
      
      {/* Toast Notification */}
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${showToast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="bg-emerald-500/90 text-white px-6 py-3 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 border border-emerald-400/50">
            <Check size={18} strokeWidth={3} />
            <span className="font-medium text-sm">{showToast.message}</span>
        </div>
      </div>

      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-emerald-900/20 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2 mt-4 md:mt-0">
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

        {/* Navigation Tabs - Horizontal Scrollable on Mobile */}
        <div className="w-full flex justify-center items-center gap-2">
           <div className="overflow-x-auto pb-2 scrollbar-hide w-full flex justify-center">
              <div className="flex p-1 space-x-1 bg-black/20 backdrop-blur-md rounded-2xl border border-white/5 w-max">
              {Object.values(ContentType).map((type) => (
                 <button
                    key={type}
                    onClick={() => setActiveTab(type)}
                    className={`px-4 md:px-6 py-2 rounded-xl text-xs md:text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    activeTab === type
                       ? 'bg-emerald-500/20 text-emerald-100 shadow-sm border border-emerald-500/30'
                       : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                    }`}
                 >
                    {type}
                 </button>
              ))}
              </div>
           </div>
           
           {/* Browse Button for 99 Names - Main Button next to tabs */}
           {activeTab === ContentType.NAMES_OF_ALLAH && (
              <button 
                 onClick={() => setIsListOpen(true)}
                 className="p-3 mb-2 rounded-2xl bg-black/20 hover:bg-white/10 border border-white/5 text-emerald-200 transition-all active:scale-95 flex-shrink-0"
                 title="View List"
              >
                 <Grid size={20} />
              </button>
           )}
        </div>

        {/* Feelings Carousel Selector (Only for Dua) */}
        {activeTab === ContentType.DUA && (
          <div className="w-full animate-in fade-in slide-in-from-top-4 duration-500">
             <div className="flex flex-col items-center gap-3">
                <span className="text-xs text-emerald-200/50 uppercase tracking-widest flex items-center gap-1">
                   <Heart size={10} /> How are you feeling?
                </span>
                
                {/* Horizontal Scroll Carousel with Gradient Masks */}
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

        {/* The Card */}
        <div className="w-full transform transition-all duration-500 px-1 md:px-0">
            <ReminderCard 
              ref={cardRef} 
              content={currentContent} 
              onViewList={activeTab === ContentType.NAMES_OF_ALLAH ? () => setIsListOpen(true) : undefined}
            />
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full">
          {/* New Reflection */}
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
            {/* Download */}
            <button
              onClick={handleDownload}
              disabled={isCapturing}
              className="flex-1 md:flex-none group flex items-center justify-center space-x-2 px-6 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all active:scale-95"
            >
              <Download size={20} className="text-emerald-200" />
              <span className="font-medium text-white">Save</span>
            </button>

            {/* WhatsApp Share */}
            <button
              onClick={handleWhatsAppShare}
              disabled={isCapturing}
              className="flex-1 md:flex-none group flex items-center justify-center space-x-2 px-6 py-4 rounded-full bg-green-600/90 hover:bg-green-500/90 border border-green-400/30 backdrop-blur-md transition-all active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
            >
              {isCapturing ? (
                 <Loader2 size={20} className="animate-spin text-white" />
              ) : (
                 <MessageCircle size={20} className="text-white" />
              )}
              <span className="font-medium text-white">WhatsApp</span>
            </button>
          </div>
        </div>
        
        {/* Footer Info */}
        <div className="mt-8 text-center flex flex-col items-center gap-3 pb-8">
           <div className="flex items-center gap-1.5 text-xs text-emerald-400/30">
             <Info size={12} />
             <span>Content provided by AlQuran Cloud & Sunnah.com</span>
           </div>
           
           <div className="h-px w-12 bg-white/10"></div>
           
           <div className="flex flex-col items-center gap-1">
             <a href="#" className="text-sm font-medium text-emerald-200/70 hover:text-emerald-200 transition-colors tracking-wide">
               www.ihsan-app.com
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
               {/* Modal Header */}
               <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#0F2027]">
                  <h2 className="text-2xl font-serif text-emerald-100">99 Names of Allah</h2>
                  <button onClick={() => setIsListOpen(false)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                     <X size={24} className="text-white/60" />
                  </button>
               </div>
               
               {/* Search Bar */}
               <div className="p-6 pt-0 mt-6">
                  <div className="relative">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                     <input 
                        type="text" 
                        placeholder="Search names (e.g., Rahman, King, merciful)..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-emerald-100 placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 transition-all"
                     />
                  </div>
               </div>

               {/* Grid Content */}
               <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 scrollbar-thin scrollbar-thumb-emerald-900/50 scrollbar-track-transparent">
                  {getListItems().map((item) => (
                     <button 
                        key={item.id}
                        onClick={() => {
                           setCurrentContent(item);
                           setIsListOpen(false);
                        }}
                        className="group flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-amber-200/20 transition-all duration-300"
                     >
                        <span className="text-2xl font-arabic text-amber-100 mb-2 group-hover:scale-110 transition-transform">{item.arabicText}</span>
                        <span className="text-sm font-semibold text-emerald-200">{item.englishTranslation}</span>
                        <span className="text-xs text-white/40 mt-1">{item.urduTranslation}</span>
                        <span className="text-[10px] text-white/20 mt-2">{item.reference.split('.')[0]}</span>
                     </button>
                  ))}
                  {getListItems().length === 0 && (
                     <div className="col-span-full flex flex-col items-center justify-center py-12 text-white/30">
                        <Search size={48} className="mb-4 opacity-50" />
                        <p>No names found matching "{searchQuery}"</p>
                     </div>
                  )}
               </div>
            </div>
         </div>
      )}

    </div>
  );
};

export default App;