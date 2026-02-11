
import React, { useState } from 'react';
import { EMISSION_FACTORS } from '../constants';
import { Activity } from '../types';

interface ActivityLoggerProps {
  onAddActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  onClose: () => void;
}

const ActivityLogger: React.FC<ActivityLoggerProps> = ({ onAddActivity, onClose }) => {
  const [category, setCategory] = useState<keyof typeof EMISSION_FACTORS | null>(null);
  const [subcategory, setSubcategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [value, setValue] = useState<number>(0);

  const categories = [
    { id: 'Transport', icon: '🚗', label: 'Transport' },
    { id: 'Energy', icon: '⚡', label: 'Energy' },
    { id: 'Food', icon: '🍽️', label: 'Food' },
    { id: 'Shopping', icon: '🛍️', label: 'Shopping' }
  ] as const;

  const handleLog = () => {
    if (!category || !subcategory || value <= 0 || !description.trim()) return;

    const factor = (EMISSION_FACTORS[category] as any)[subcategory] || 0;
    const co2e = value * factor;

    onAddActivity({
      category,
      subcategory,
      description,
      value,
      unit: category === 'Transport' ? 'km' : (category === 'Energy' ? 'Units' : 'Qty'),
      co2e,
      details: {}
    });
  };

  return (
    <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-t-[3rem] sm:rounded-[3rem] p-8 space-y-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-emerald-950 uppercase tracking-tight leading-none">Activity Logger</h2>
            <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest mt-1">Real-time impact tracking</p>
          </div>
          <button onClick={onClose} className="text-slate-200 hover:text-slate-400 transition-colors">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {!category ? (
          <div className="grid grid-cols-2 gap-4 py-4">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className="p-6 rounded-[2rem] border border-emerald-50 bg-white hover:border-emerald-500 transition-all flex flex-col items-center justify-center space-y-3 group shadow-sm active:scale-95"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                <span className="font-black text-[10px] uppercase tracking-widest text-emerald-900">{cat.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setCategory(null)} 
              className="flex items-center space-x-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
              <span>Change Type</span>
            </button>

            <div className="space-y-5">
              <div>
                <label className="block text-[9px] font-black text-emerald-900 uppercase tracking-widest mb-3 opacity-40 px-1">Specific Subcategory</label>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(EMISSION_FACTORS[category]).map(sub => (
                    <button
                      key={sub}
                      onClick={() => setSubcategory(sub)}
                      className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                        subcategory === sub 
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-100' 
                          : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-emerald-200'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description (e.g. Work Commute)"
                  className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-bold placeholder:text-slate-300"
                />
                <div className="relative">
                   <input
                    type="number"
                    value={value || ''}
                    onChange={(e) => setValue(Number(e.target.value))}
                    placeholder="Enter amount"
                    className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-black"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                    {category === 'Transport' ? 'Kilometers' : (category === 'Energy' ? 'Units' : 'Qty')}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLog}
                disabled={!subcategory || !description || value <= 0}
                className="w-full bg-emerald-600 text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-emerald-100 disabled:opacity-20 active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-xs"
              >
                Log to Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogger;
