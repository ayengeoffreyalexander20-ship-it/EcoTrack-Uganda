
import React, { useState } from 'react';
import { useTranslation } from '../services/LanguageContext';
import { Video } from '../types';

interface VideoUploadModalProps {
  onClose: () => void;
  onUpload: (video: Partial<Video>) => void;
}

const VideoUploadModal: React.FC<VideoUploadModalProps> = ({ onClose, onUpload }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [thumbnail, setThumbnail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['General', 'Transport', 'Energy', 'Waste', 'Food'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !thumbnail) return;
    
    setIsSubmitting(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onUpload({
      title,
      description,
      category,
      thumbnail,
      author: 'Member Organization',
      duration: '3:45',
      views: 0,
      likes: 0
    });
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[3rem] p-8 space-y-6 shadow-2xl animate-in zoom-in duration-300 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600"></div>
        
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-emerald-950 uppercase tracking-tight leading-none">{t('uploadVideo')}</h2>
            <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest mt-1">Share sustainability insights</p>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-emerald-600 transition-colors">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2">{t('videoTitle')}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Solar Cooking in Western Uganda"
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2">{t('videoDesc')}</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Share more details about this initiative..."
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-bold h-24 resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2">{t('videoCat')}</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-bold appearance-none"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2">{t('thumbnailUrl')}</label>
                <input
                  type="url"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-bold"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-emerald-100 uppercase tracking-[0.2em] text-xs flex items-center justify-center space-x-2 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  <span>{t('publish')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VideoUploadModal;
