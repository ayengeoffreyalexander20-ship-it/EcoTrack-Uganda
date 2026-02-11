
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DailyFootprint } from '../types';

interface FootprintChartProps {
  todayFootprint: DailyFootprint;
}

const FootprintChart: React.FC<FootprintChartProps> = ({ todayFootprint }) => {
  const categoryData = [
    { name: 'Transport', value: todayFootprint.transport, color: '#2563eb' },
    { name: 'Energy', value: todayFootprint.energy, color: '#ea580c' },
    { name: 'Food', value: todayFootprint.food, color: '#16a34a' },
    { name: 'Shopping', value: todayFootprint.shopping, color: '#9333ea' },
  ].filter(d => d.value > 0);

  return (
    <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-emerald-900/[0.03] border border-emerald-50 space-y-6">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-xl font-black text-emerald-950 tracking-tight">Daily Impact</h2>
        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">Today</span>
      </div>
      
      <div className="h-64 relative">
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={6}
                dataKey="value"
                stroke="none"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '1.25rem', 
                  border: 'none', 
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                  padding: '16px'
                }}
                itemStyle={{ fontWeight: '900', fontSize: '12px', textTransform: 'uppercase' }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-emerald-200 space-y-3">
             <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
               <svg className="w-8 h-8 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
               </svg>
             </div>
             <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-800/30">No activities today</p>
          </div>
        )}
        
        {categoryData.length > 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Total</span>
            <span className="text-2xl font-black text-emerald-950">{todayFootprint.total.toFixed(1)}</span>
            <span className="text-[8px] font-bold text-slate-400 uppercase">kg CO₂e</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-3 justify-center pt-2">
        {[
          { name: 'Transport', color: '#2563eb' },
          { name: 'Energy', color: '#ea580c' },
          { name: 'Food', color: '#16a34a' },
          { name: 'Shopping', color: '#9333ea' },
        ].map((item) => (
          <div key={item.name} className="flex items-center space-x-2 bg-slate-50/50 px-3 py-1.5 rounded-full border border-slate-100">
            <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em]">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FootprintChart;
