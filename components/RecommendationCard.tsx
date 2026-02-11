
import React from 'react';
import { Recommendation } from '../types';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const getDifficultyStyles = () => {
    switch (recommendation.difficulty) {
      case 'easy':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'medium':
        return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'hard':
        return 'bg-rose-50 text-rose-600 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getCategoryIcon = () => {
    switch (recommendation.category?.toLowerCase()) {
      case 'transport':
        return '🚗';
      case 'energy':
        return '⚡';
      case 'food':
        return '🍽️';
      case 'shopping':
        return '🛍️';
      default:
        return '💡';
    }
  };

  return (
    <div className="bg-white p-5 rounded-[2rem] border border-emerald-100 shadow-xl shadow-emerald-900/[0.03] space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center space-x-5">
        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-emerald-100/50">
          {getCategoryIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-black text-emerald-950 leading-tight mb-1 truncate">
            {recommendation.title}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
            {recommendation.description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center space-x-3">
          <span className={`px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${getDifficultyStyles()}`}>
            {recommendation.difficulty}
          </span>
          <div className="flex items-center space-x-1.5 text-emerald-700 font-bold">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 011.512-.306c.736.06 1.39.321 1.964.734.57.412.926 1.058.981 1.794.052.705-.205 1.346-.57 1.79-.364.444-.848.752-1.39.87a2.64 2.64 0 01-1.25.04c-.11.23-.332.428-.624.576-.3.151-.71.26-1.168.272a2.642 2.642 0 01-1.352-.27c-.453-.243-.76-.583-.902-.958-.143-.374-.15-.818-.024-1.233.111-.363.313-.655.57-.837.256-.182.573-.284.92-.32a2.637 2.637 0 011.025-.035 31.25 31.25 0 01.37-3.882c.238-1.02.533-2.036.883-2.903a11.127 11.127 0 011.002-1.928 6.138 6.138 0 011.446-1.63 3 3 0 013.267.31c.366.28.604.66.716 1.058.113.4.114.83.003 1.253a1 1 0 001.938.486c.245-.98.243-1.932-.016-2.846a5 5 0 00-1.783-2.607z" clipRule="evenodd" />
            </svg>
            <span className="text-[10px] uppercase tracking-wider">
              Save {recommendation.potentialSaving?.toFixed(1)} kg/week
            </span>
          </div>
        </div>
        <button className="text-emerald-400 hover:text-emerald-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default RecommendationCard;
