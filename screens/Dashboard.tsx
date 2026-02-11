
import React, { useState, useEffect } from 'react';
import { Activity, Recommendation, DailyFootprint, Challenge, User, AppLanguage } from '../types';
import { getEcoRecommendations, generateAIChallenges } from '../services/gemini';
import { api } from '../services/api';
import ChallengeCard from '../components/ChallengeCard';
import FootprintChart from '../components/FootprintChart';
import RecommendationCard from '../components/RecommendationCard';
import { useTranslation } from '../services/LanguageContext';

interface DashboardProps {
  activities: Activity[];
  weeklyComparison: number;
  todayFootprint: DailyFootprint;
  onQuickLog: () => void;
  user?: User; 
  language: AppLanguage;
}

const Dashboard: React.FC<DashboardProps> = ({ activities, weeklyComparison, todayFootprint, onQuickLog, user, language }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingChallenges, setLoadingChallenges] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchAI = async () => {
      setLoadingAI(true);
      const district = user?.district || 'Western Uganda';
      const recs = await getEcoRecommendations(activities.slice(-10), district, language);
      setRecommendations(recs);
      setLoadingAI(false);
    };
    fetchAI();
  }, [activities, user?.district, language]);

  useEffect(() => {
    const fetchChallenges = async () => {
      setLoadingChallenges(true);
      const district = user?.district || 'Western Uganda';
      try {
        const aiChallenges = await generateAIChallenges(district, language);
        if (aiChallenges && aiChallenges.length > 0) {
          setChallenges(aiChallenges);
        }
      } catch (err) {
        console.warn("AI Challenges failed");
      } finally {
        setLoadingChallenges(false);
      }
    };
    fetchChallenges();
  }, [user?.district, language]);

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      await api.joinChallenge(challengeId);
      setChallenges(prev => prev.map(c => 
        c.id === challengeId 
          ? { ...c, isJoined: true, participants: c.participants + 1 } 
          : c
      ));
    } catch (err) {
      setChallenges(prev => prev.map(c => 
        c.id === challengeId 
          ? { ...c, isJoined: true, participants: c.participants + 1 } 
          : c
      ));
    }
  };

  const comparisonColor = weeklyComparison <= 0 ? 'text-emerald-500' : 'text-rose-500';
  const comparisonLabel = weeklyComparison <= 0 ? t('reduction') : t('increase');

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-700">
      <header className="flex justify-between items-center pt-2">
        <div>
          <h1 className="text-3xl font-black text-emerald-950 tracking-tighter uppercase">{t('mirembe')}</h1>
          <div className="flex items-center space-x-2">
            <p className="text-emerald-600/60 text-xs font-bold uppercase tracking-wider">{t('weeklyImpact')}:</p>
            <span className={`text-xs font-black uppercase ${comparisonColor}`}>
              {Math.abs(weeklyComparison).toFixed(1)}% {comparisonLabel}
            </span>
          </div>
        </div>
        <div className="bg-emerald-600 text-white px-5 py-3 rounded-2xl text-sm font-black shadow-lg shadow-emerald-100 flex flex-col items-center">
          <span className="text-[10px] opacity-70 uppercase tracking-widest leading-none mb-1">{t('impactScore')}</span>
          {user?.points || 0}
        </div>
      </header>

      <FootprintChart todayFootprint={todayFootprint} />

      <section className="bg-white/80 backdrop-blur-md p-6 rounded-[2.5rem] border border-emerald-50 shadow-xl shadow-emerald-900/[0.02] flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          </div>
          <div>
            <h3 className="font-black text-emerald-950 text-sm uppercase tracking-tight">{t('trackNewEffort')}</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Western Uganda Green Hub</p>
          </div>
        </div>
        <button 
          onClick={onQuickLog}
          className="bg-emerald-600 text-white font-black text-[10px] px-6 py-3 rounded-xl uppercase tracking-widest shadow-lg shadow-emerald-100 active:scale-95 transition-all"
        >
          {t('quickLog')}
        </button>
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-black text-emerald-900 uppercase tracking-widest">{t('smartTips')}</h2>
          {loadingAI && <div className="animate-spin h-4 w-4 border-2 border-emerald-500 border-t-transparent rounded-full"></div>}
        </div>
        
        <div className="grid gap-4">
          {recommendations.length > 0 ? (
            recommendations.map((rec, i) => (
              <RecommendationCard key={i} recommendation={rec} />
            ))
          ) : (
            <div className="bg-white/80 backdrop-blur-sm p-10 rounded-[2.5rem] border border-dashed border-emerald-100 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-300 mb-4 animate-bounce">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <p className="text-xs font-black text-emerald-900/30 uppercase tracking-[0.2em] leading-relaxed max-w-[200px]">
                {loadingAI ? 'AI thinking...' : 'Add activities for personalized tips'}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-black text-emerald-900 uppercase tracking-widest">{t('challenges')}</h2>
          {loadingChallenges && <div className="animate-spin h-4 w-4 border-2 border-emerald-500 border-t-transparent rounded-full"></div>}
        </div>
        <div className="grid gap-5">
          {challenges.length > 0 ? (
            challenges.map(challenge => (
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge} 
                onJoin={() => handleJoinChallenge(challenge.id)} 
              />
            ))
          ) : (
            <div className="bg-white/80 backdrop-blur-sm p-12 rounded-[2.5rem] border border-emerald-50 text-center">
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                 {loadingChallenges ? 'AI Generator Training...' : 'No challenges found.'}
               </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
