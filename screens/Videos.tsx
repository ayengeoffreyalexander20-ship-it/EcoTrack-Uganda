
import React, { useState, useEffect, useMemo } from 'react';
import { SAMPLE_VIDEOS } from '../constants';
import { askEcoExpert, findLocalInitiatives } from '../services/gemini';
import { api } from '../services/api';
import { User, Activity, Video, AppLanguage } from '../types';
import { useTranslation } from '../services/LanguageContext';
import VideoUploadModal from '../components/VideoUploadModal';

interface VideosProps {
  user: User;
  language: AppLanguage;
  activities: Activity[];
}

const Videos: React.FC<VideosProps> = ({ user, language, activities }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string, imageUrl?: string}[]>([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [videos, setVideos] = useState<Video[]>(SAMPLE_VIDEOS);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [initiatives, setInitiatives] = useState<{text: string, sources: any[]}>({ text: '', sources: [] });
  const [loadingSearch, setLoadingSearch] = useState(false);
  const { t } = useTranslation();

  // Determine top category from activities
  const userFocusCategory = useMemo(() => {
    if (activities.length === 0) return null;
    const counts: Record<string, number> = {};
    activities.forEach(a => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  }, [activities]);

  const recommendedVideos = useMemo(() => {
    if (!userFocusCategory) return videos.slice(0, 2);
    // Prefer matching category, then fill with others
    const matched = videos.filter(v => v.category === userFocusCategory);
    if (matched.length > 0) return matched;
    return videos.slice(0, 2);
  }, [videos, userFocusCategory]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await api.getVideos();
        if (data.length > 0) setVideos(data);
      } catch (err) {
        console.warn("Using sample videos");
      }
    };
    fetchVideos();
  }, []);

  const categories = ['All', 'Transport', 'Energy', 'Waste', 'Food'];
  const filteredVideos = activeCategory === 'All' 
    ? videos 
    : videos.filter(v => v.category === activeCategory);

  const handleAsk = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoadingChat(true);
    
    const context = `User is a ${user.type} from ${user.district}. Current points: ${user.points}. Tracking sustainability activities in Western Uganda. Top focus: ${userFocusCategory || 'None'}.`;
    
    const aiResp = await askEcoExpert(userMsg, context, language);
    setChatHistory(prev => [...prev, { role: 'ai', text: aiResp.text, imageUrl: aiResp.imageUrl }]);
    setLoadingChat(false);
  };

  const handleDiscover = async () => {
    setLoadingSearch(true);
    const result = await findLocalInitiatives(user.district, language);
    setInitiatives(result);
    setLoadingSearch(false);
  };

  const handleVideoUpload = async (newVideoData: Partial<Video>) => {
    try {
      const response = await api.uploadVideo(newVideoData);
      setVideos(prev => [response, ...prev]);
    } catch (error) {
      const demoVideo: Video = {
        id: Math.random().toString(36).substr(2, 9),
        title: newVideoData.title || 'Untitled',
        description: newVideoData.description || '',
        category: newVideoData.category || 'General',
        thumbnail: newVideoData.thumbnail || 'https://picsum.photos/400/250',
        views: 0,
        likes: 0,
        duration: '3:45',
        author: user.name
      };
      setVideos(prev => [demoVideo, ...prev]);
    }
    setIsUploadModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-32 relative">
      <header className="pt-2 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-emerald-950 tracking-tighter uppercase">{t('academy')}</h1>
          <p className="text-emerald-600/60 font-black uppercase text-[10px] tracking-widest">Localized Western Insights</p>
        </div>
      </header>

      {/* Recommended Section - New activity-based content */}
      <section className="space-y-4">
        <div className="flex items-end justify-between px-1">
          <div>
            <h2 className="text-sm font-black text-emerald-900 uppercase tracking-widest">Recommended for You</h2>
            {userFocusCategory ? (
              <p className="text-[10px] text-emerald-600/70 font-bold uppercase tracking-tight">Based on your {userFocusCategory} tracking</p>
            ) : (
              <p className="text-[10px] text-emerald-600/70 font-bold uppercase tracking-tight">Trending in {user.district}</p>
            )}
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
        </div>
        
        <div className="flex space-x-4 overflow-x-auto no-scrollbar py-2 px-1">
          {recommendedVideos.map(video => (
            <div key={`rec-${video.id}`} className="min-w-[280px] bg-white/90 backdrop-blur-md rounded-[2rem] overflow-hidden border border-emerald-100 shadow-md group active:scale-95 transition-all">
              <div className="relative aspect-video">
                <img src={video.thumbnail} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-emerald-600/90 backdrop-blur-md text-white text-[8px] px-2.5 py-1 rounded-lg font-black tracking-widest uppercase shadow-lg">
                  Top Choice
                </div>
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[9px] px-2 py-0.5 rounded-lg font-bold">
                  {video.duration}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-black text-emerald-950 text-xs uppercase tracking-tight leading-tight mb-1 line-clamp-1">{video.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-black text-emerald-600 uppercase">{video.category}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">{video.views.toLocaleString()} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Floating Action Button for Upload */}
      <button 
        onClick={() => setIsUploadModalOpen(true)}
        className="fixed bottom-24 left-6 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-[0_10px_30px_-5px_rgba(5,150,105,0.4)] z-[60] flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-4 border-white/50 backdrop-blur-sm group"
        aria-label="Upload Video"
      >
        <svg className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <section className="bg-emerald-600 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
           <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16z"/></svg>
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-1 uppercase tracking-tighter">Local Projects</h2>
          <p className="text-emerald-100 text-xs mb-6 font-bold uppercase tracking-widest">Discover Green Initiatives</p>
          <button 
            onClick={handleDiscover}
            disabled={loadingSearch}
            className="bg-white text-emerald-600 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 disabled:opacity-50"
          >
            {loadingSearch ? 'AI Searching...' : 'Discover Now'}
          </button>
        </div>

        {initiatives.text && (
          <div className="mt-8 bg-white/10 backdrop-blur-xl rounded-[1.5rem] p-6 animate-in fade-in duration-500 border border-white/20">
             <p className="text-xs text-white mb-6 whitespace-pre-line font-medium leading-relaxed">{initiatives.text}</p>
             <div className="space-y-2">
                {initiatives.sources.map((s, i) => (
                  <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-xs text-white bg-white/20 p-3 rounded-xl hover:bg-white/30 transition-all">
                    <span className="truncate font-bold uppercase tracking-tight">{s.title}</span>
                  </a>
                ))}
             </div>
          </div>
        )}
      </section>

      <section className="bg-white/90 backdrop-blur-md p-6 rounded-[2.5rem] border border-emerald-100 shadow-xl shadow-emerald-900/[0.03]">
        <div className="flex items-center space-x-3 mb-5 px-2">
          <div className="bg-emerald-600 p-2.5 rounded-xl text-white shadow-lg shadow-emerald-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h2 className="font-black text-emerald-950 uppercase text-xs tracking-widest">{t('expert')}</h2>
            <p className="text-[8px] font-black text-emerald-600 uppercase">Pro Intelligence • Nano Visuals</p>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto mb-5 space-y-4 px-2 no-scrollbar">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[90%] p-4 rounded-3xl text-xs shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
              }`}>
                {msg.imageUrl && (
                  <div className="mb-3 overflow-hidden rounded-2xl border border-emerald-50">
                    <img src={msg.imageUrl} alt="AI Generation" className="w-full h-auto animate-in zoom-in-95 duration-500" />
                  </div>
                )}
                <div className="whitespace-pre-line leading-relaxed font-bold tracking-tight">
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          {loadingChat && (
            <div className="flex items-center space-x-3 pl-2">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce delay-150"></div>
              </div>
              <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Consulting Knowledge Base...</span>
            </div>
          )}
        </div>

        <div className="relative group">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="Ask a question or 'Generate an image of...'"
            className="w-full pl-6 pr-14 py-5 rounded-[2rem] bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white text-xs font-bold transition-all"
          />
          <button 
            onClick={handleAsk} 
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-100 active:scale-90 hover:scale-105 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </div>
      </section>

      <div className="flex space-x-2 overflow-x-auto no-scrollbar py-2 px-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
              activeCategory === cat 
                ? 'bg-emerald-600 text-white border-emerald-600' 
                : 'bg-white text-slate-500 border-slate-100 hover:border-emerald-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <section className="grid gap-6">
        <h2 className="text-sm font-black text-emerald-900 uppercase tracking-widest px-1">Video Library</h2>
        {filteredVideos.map(video => (
          <div key={video.id} className="bg-white/90 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-emerald-50 shadow-sm animate-in fade-in duration-500">
            <div className="relative aspect-video">
              <img src={video.thumbnail} className="w-full h-full object-cover" />
              <div className="absolute bottom-4 right-4 bg-emerald-950/80 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full font-black tracking-widest">
                {video.duration}
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-black text-emerald-950 text-lg uppercase tracking-tight leading-tight flex-1">{video.title}</h3>
                <span className="text-[8px] font-black uppercase tracking-[0.2em] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg border border-emerald-100">
                  {video.category}
                </span>
              </div>
              <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">{video.author} • {video.views.toLocaleString()} Views</p>
              {video.description && (
                <p className="mt-3 text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-2">{video.description}</p>
              )}
            </div>
          </div>
        ))}
      </section>

      {isUploadModalOpen && (
        <VideoUploadModal 
          onClose={() => setIsUploadModalOpen(false)} 
          onUpload={handleVideoUpload} 
        />
      )}
    </div>
  );
};

export default Videos;
