
import React, { useState } from 'react';
import { EMISSION_FACTORS } from '../constants';
import { Activity } from '../types';
import { useTranslation } from '../services/LanguageContext';

interface CalculatorProps {
  activities: Activity[];
  onAddActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  onDeleteActivity: (id: string) => void;
}

const Calculator: React.FC<CalculatorProps> = ({ activities, onAddActivity, onDeleteActivity }) => {
  const [category, setCategory] = useState<keyof typeof EMISSION_FACTORS | null>(null);
  const [subcategory, setSubcategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [value, setValue] = useState<number>(0);
  const { t } = useTranslation();

  const categories = [
    { id: 'Transport', icon: '🚗', label: t('Transport') || 'Transport' },
    { id: 'Energy', icon: '⚡', label: t('Energy') || 'Energy' },
    { id: 'Food', icon: '🍽️', label: t('Food') || 'Food' },
    { id: 'Shopping', icon: '🛍️', label: t('Shopping') || 'Shopping' }
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
      co2e
    });

    setSubcategory('');
    setDescription('');
    setValue(0);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="pt-2">
        <h1 className="text-2xl font-black text-emerald-900 tracking-tighter uppercase">{t('trackNewEffort')}</h1>
        <p className="text-emerald-700/60 font-bold text-xs uppercase tracking-widest">Western Uganda Green Hub</p>
      </header>

      {/* Activity Type Selection */}
      <section className="space-y-3">
        <h2 className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">{t('individual')} Activity Type</h2>
        <div className="grid grid-cols-2 gap-3">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setCategory(cat.id);
                setSubcategory('');
              }}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center space-y-1 ${
                category === cat.id 
                  ? 'border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-100' 
                  : 'border-emerald-100 bg-white/80 backdrop-blur-sm text-emerald-800 hover:border-emerald-200'
              }`}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="font-black text-xs uppercase tracking-tight">{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {category && (
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-emerald-50 space-y-5 animate-in fade-in zoom-in duration-300">
          <div>
            <label className="block text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-3">Specific Activity</label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(EMISSION_FACTORS[category]).map(sub => (
                <button
                  key={sub}
                  onClick={() => setSubcategory(sub)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${
                    subcategory === sub 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          <div>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (e.g. Bus to town)"
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-bold"
            />
          </div>

          <div>
            <input
              type="number"
              value={value || ''}
              onChange={(e) => setValue(Number(e.target.value))}
              placeholder="Amount (km / units)"
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-black"
            />
          </div>

          <button
            onClick={handleLog}
            disabled={!subcategory || !description || value <= 0}
            className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-100 disabled:opacity-50 active:scale-[0.97] transition-all uppercase tracking-widest text-xs"
          >
            {t('submit')}
          </button>
        </div>
      )}

      {/* History Section */}
      <section className="space-y-4">
        <h2 className="text-[10px] font-black text-emerald-800 uppercase tracking-widest flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          {t('history')}
        </h2>
        {activities.length > 0 ? (
          <div className="space-y-3">
            {[...activities].reverse().slice(0, 10).map(act => (
              <div key={act.id} className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-emerald-50 shadow-sm flex items-center justify-between group relative overflow-hidden">
                {!act.isSynced && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
                )}
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-lg">
                    {categories.find(c => c.id === act.category)?.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 leading-none mb-1 truncate max-w-[140px]">{act.description}</h4>
                    <div className="flex items-center space-x-2">
                       <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight">{act.subcategory}</p>
                       {!act.isSynced && <span className="text-[8px] font-black text-amber-600 uppercase">Offline</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="block font-black text-slate-800 text-sm">+{act.co2e.toFixed(1)}</span>
                    <span className="text-[8px] text-slate-400 font-bold uppercase">kg</span>
                  </div>
                  <button onClick={() => onDeleteActivity(act.id)} className="p-2 text-slate-200 hover:text-red-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-emerald-100 flex flex-col items-center">
            <p className="text-[10px] text-emerald-800/30 font-black uppercase tracking-widest">Start tracking today</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Calculator;
