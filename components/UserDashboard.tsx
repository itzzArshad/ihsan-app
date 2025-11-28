
import React, { useState, useEffect } from 'react';
import { X, Heart, History, Flame } from 'lucide-react';
import { ContentItem } from '../types';
import { dbService } from '../services/db';

interface UserDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
  onSelectContent: (item: ContentItem) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ isOpen, onClose, streak, onSelectContent }) => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'history'>('favorites');
  const [favorites, setFavorites] = useState<ContentItem[]>([]);
  const [history, setHistory] = useState<ContentItem[]>([]);
  
  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, activeTab]);

  const loadData = async () => {
    const favs = await dbService.getFavorites();
    const hist = await dbService.getHistory();
    
    setFavorites(favs.reverse());
    setHistory(hist.reverse().slice(0, 50));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full max-w-md h-full bg-[#0F2027] border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header with Streak */}
        <div className="p-6 border-b border-white/5 bg-gradient-to-r from-emerald-900/40 to-[#0F2027]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif text-emerald-100">Your Journey</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="text-white/60" />
            </button>
          </div>

          {/* Streak Card */}
          <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden group">
            <div className="absolute inset-0 bg-amber-500/10 blur-xl group-hover:bg-amber-500/20 transition-all duration-700"></div>
            <div className="relative z-10 flex items-center gap-4">
               <div className="p-3 bg-amber-500/20 rounded-full ring-2 ring-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse">
                  <Flame className="text-amber-400 fill-amber-400" size={24} />
               </div>
               <div>
                  <div className="text-3xl font-bold text-amber-100 leading-none">{streak}</div>
                  <div className="text-xs text-amber-200/70 uppercase tracking-widest font-medium mt-1">App Streak</div>
               </div>
            </div>
            <div className="relative z-10 text-right">
              <span className="text-xs text-amber-100/60 block">Daily Visit</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5 p-2 bg-black/20">
          {[
            { id: 'favorites', icon: Heart, label: 'Saved' },
            { id: 'history', icon: History, label: 'History' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id 
                ? 'bg-white/10 text-emerald-200 shadow-sm' 
                : 'text-white/40 hover:text-white/70'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10">
          
          {/* LIST ITEMS */}
          {(activeTab === 'favorites' ? favorites : history).length === 0 ? (
             <div className="flex flex-col items-center justify-center h-40 text-white/20">
                <div className="mb-2 p-3 rounded-full bg-white/5">
                   {activeTab === 'favorites' ? <Heart /> : <History />}
                </div>
                <p className="text-sm">No items yet</p>
             </div>
          ) : (
            (activeTab === 'favorites' ? favorites : history).map((item, idx) => (
              <div 
                key={`${item.id}-${idx}`}
                onClick={() => {
                   onSelectContent(item);
                   onClose();
                }}
                className="group relative p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-emerald-500/30 transition-all cursor-pointer flex gap-3 items-start"
              >
                 <div className="mt-1 text-emerald-500/50 group-hover:text-emerald-400">
                    <History size={18} />
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="font-serif text-emerald-100 text-sm line-clamp-2 leading-relaxed">"{item.englishTranslation}"</p>
                    <div className="flex items-center justify-between mt-2">
                       <span className="text-[10px] text-white/30 uppercase tracking-wider">{item.type} • {item.reference.slice(0, 15)}...</span>
                    </div>
                 </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
