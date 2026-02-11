
import React from 'react';
import { Challenge } from '../types';

interface ChallengeCardProps {
  challenge: Challenge;
  onJoin?: () => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onJoin }) => {
  const progressPercentage = (challenge.userProgress / challenge.target) * 100;

  return (
    <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-900/[0.03] space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500 relative overflow-hidden">
      {challenge.isJoined && (
        <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[8px] font-black px-4 py-1.5 rounded-bl-xl uppercase tracking-widest shadow-sm">
          Joined
        </div>
      )}
      
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-2xl flex-shrink-0 ${challenge.isJoined ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-600'}`}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-black text-emerald-950 leading-tight mb-1 truncate">
            {challenge.title}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
            {challenge.description}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
            Progress: {progressPercentage.toFixed(0)}%
          </span>
          <span className="text-[10px] font-bold text-slate-400">
            {challenge.userProgress.toFixed(1)} / {challenge.target.toFixed(1)} kg CO₂e
          </span>
        </div>
        <div className="w-full bg-emerald-50 h-2.5 rounded-full overflow-hidden border border-emerald-100/50">
          <div 
            className="bg-emerald-600 h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center py-1">
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-[10px] font-bold text-slate-500">
            <svg className="w-3.5 h-3.5 mr-1 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            {challenge.participants.toLocaleString()}
          </div>
          <div className="flex items-center text-[10px] font-bold text-slate-500">
            <svg className="w-3.5 h-3.5 mr-1 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {challenge.daysRemaining} Days Left
          </div>
        </div>
        <div className="bg-emerald-50 px-2 py-1 rounded-lg">
          <span className="text-[10px] font-black text-emerald-600">+{challenge.points} PTS</span>
        </div>
      </div>

      <button 
        onClick={onJoin}
        disabled={challenge.isJoined}
        className={`w-full font-black py-3 rounded-2xl text-xs uppercase tracking-[0.15em] transition-all shadow-lg active:scale-[0.98] ${
          challenge.isJoined 
            ? 'bg-slate-100 text-slate-400 cursor-default shadow-none' 
            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100'
        }`}
      >
        {challenge.isJoined ? 'Accepted' : 'Join Challenge'}
      </button>
    </div>
  );
};

export default ChallengeCard;
