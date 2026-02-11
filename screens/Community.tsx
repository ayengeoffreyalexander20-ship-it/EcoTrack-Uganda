
import React, { useState, useEffect } from 'react';
import { User, UserType } from '../types';
import { api } from '../services/api';
import { useTranslation } from '../services/LanguageContext';

const Community: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<'ALL' | UserType>('ALL');
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const data = await api.getLeaderboard();
        setUsers(data);
      } catch (err) {
        console.error("Leaderboard fetch failed");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const filteredUsers = filter === 'ALL' 
    ? users 
    : users.filter(u => u.type === filter);

  const topThree = users.slice(0, 3);
  const rest = filteredUsers.slice(filter === 'ALL' ? 3 : 0);

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-700">
      <header className="pt-2 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-emerald-950 tracking-tighter uppercase">{t('community')}</h1>
          <p className="text-emerald-600/60 font-black uppercase text-[10px] tracking-widest">{t('leaderboard')}</p>
        </div>
        <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100 flex items-center space-x-2">
           <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
           <span className="text-[10px] font-black text-emerald-900 uppercase">{users.length} Active Members</span>
        </div>
      </header>

      {/* Top 3 Podium (Only shown when viewing all) */}
      {filter === 'ALL' && topThree.length > 0 && (
        <section className="grid grid-cols-3 gap-3 items-end pt-8 pb-4">
          {/* #2 */}
          {topThree[1] && (
            <div className="flex flex-col items-center space-y-3 animate-in slide-in-from-bottom-8 duration-500 delay-150">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-4 border-slate-200 shadow-lg bg-white">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[1].avatar || topThree[1].id}`} alt={topThree[1].name} />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-slate-300 text-slate-800 text-[10px] font-black w-6 h-6 rounded-lg flex items-center justify-center border-2 border-white">2</div>
              </div>
              <div className="text-center">
                <p className="text-[9px] font-black text-emerald-950 uppercase truncate w-24">{topThree[1].name.split(' ')[0]}</p>
                <p className="text-[10px] font-black text-emerald-600">{topThree[1].points} PTS</p>
              </div>
            </div>
          )}

          {/* #1 */}
          {topThree[0] && (
            <div className="flex flex-col items-center space-y-4 animate-in slide-in-from-bottom-12 duration-700">
              <div className="relative">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl animate-bounce">👑</div>
                <div className="w-24 h-24 rounded-[2.5rem] overflow-hidden border-4 border-amber-400 shadow-2xl bg-white scale-110">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[0].avatar || topThree[0].id}`} alt={topThree[0].name} />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-amber-400 text-white text-xs font-black w-8 h-8 rounded-xl flex items-center justify-center border-4 border-white">1</div>
              </div>
              <div className="text-center">
                <p className="text-xs font-black text-emerald-950 uppercase">{topThree[0].name}</p>
                <div className="bg-emerald-600 text-white px-3 py-1 rounded-full text-[10px] font-black mt-1 shadow-lg shadow-emerald-100">
                  {topThree[0].points} PTS
                </div>
              </div>
            </div>
          )}

          {/* #3 */}
          {topThree[2] && (
            <div className="flex flex-col items-center space-y-3 animate-in slide-in-from-bottom-8 duration-500 delay-300">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-4 border-emerald-100 shadow-lg bg-white">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[2].avatar || topThree[2].id}`} alt={topThree[2].name} />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#CD7F32] text-white text-[10px] font-black w-6 h-6 rounded-lg flex items-center justify-center border-2 border-white">3</div>
              </div>
              <div className="text-center">
                <p className="text-[9px] font-black text-emerald-950 uppercase truncate w-24">{topThree[2].name.split(' ')[0]}</p>
                <p className="text-[10px] font-black text-emerald-600">{topThree[2].points} PTS</p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Filter Tabs */}
      <div className="flex p-1.5 bg-white/80 backdrop-blur-md rounded-2xl border border-emerald-50 shadow-sm sticky top-24 z-30">
        <button 
          onClick={() => setFilter('ALL')} 
          className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${filter === 'ALL' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400'}`}
        >
          All
        </button>
        <button 
          onClick={() => setFilter(UserType.INDIVIDUAL)} 
          className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${filter === UserType.INDIVIDUAL ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400'}`}
        >
          {t('individual')}
        </button>
        <button 
          onClick={() => setFilter(UserType.ORGANIZATION)} 
          className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${filter === UserType.ORGANIZATION ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400'}`}
        >
          {t('organization')}
        </button>
      </div>

      {/* Leaderboard List */}
      <section className="space-y-4">
        {loading ? (
          <div className="py-20 flex flex-col items-center space-y-4">
            <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-emerald-800/30 uppercase tracking-widest">Compiling Rankings...</p>
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-md rounded-[2.5rem] border border-emerald-50 shadow-xl shadow-emerald-900/[0.02] overflow-hidden">
            {rest.map((user, index) => {
              const rank = users.indexOf(user) + 1;
              return (
                <div key={user.id} className="flex items-center justify-between p-5 border-b border-emerald-50 hover:bg-emerald-50/30 transition-colors last:border-0 group">
                  <div className="flex items-center space-x-5">
                    <span className="text-[10px] font-black text-slate-300 w-4 group-hover:text-emerald-400 transition-colors">#{rank}</span>
                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 shadow-sm group-hover:scale-105 transition-transform">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar || user.id}`} alt={user.name} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-emerald-950 uppercase tracking-tight">{user.name}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-[8px] font-black text-emerald-600/60 uppercase tracking-widest">{user.district}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        <span className={`text-[8px] font-black uppercase tracking-widest ${user.type === UserType.ORGANIZATION ? 'text-blue-500' : 'text-slate-400'}`}>
                          {user.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-emerald-900">{user.points}</p>
                    <p className="text-[8px] font-black text-slate-300 uppercase">PTS</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Community;
