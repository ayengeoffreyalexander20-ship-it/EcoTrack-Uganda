
import React, { useState, useEffect, useMemo } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './screens/Dashboard';
import Calculator from './screens/Calculator';
import Videos from './screens/Videos';
import Community from './screens/Community';
import LiveAssistant from './components/LiveAssistant';
import DynamicBackground from './components/DynamicBackground';
import MainNatureBackground from './components/MainNatureBackground';
import ActivityLogger from './components/ActivityLogger';
import { api } from './services/api';
import { Activity, User, UserType, DailyFootprint, AppLanguage } from './types';
import { UGANDA_DISTRICTS } from './constants';
import { LANGUAGE_NAMES } from './services/translations';
import { LanguageContext, getTranslator } from './services/LanguageContext';

const UgandaSeal: React.FC = () => (
  <div className="relative w-16 h-16 opacity-40 hover:opacity-100 transition-opacity duration-1000 animate-[spin_60s_linear_infinite]">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" />
      <path d="M50,2 A48,48 0 0,1 50,98 A48,48 0 0,1 50,2" fill="none" stroke="#000" strokeWidth="4" />
      <circle cx="50" cy="50" r="40" fill="none" stroke="#FCDC04" strokeWidth="4" />
      <circle cx="50" cy="50" r="32" fill="none" stroke="#D90000" strokeWidth="4" />
      <circle cx="50" cy="50" r="24" fill="none" stroke="#000" strokeWidth="4" />
      <circle cx="50" cy="50" r="16" fill="none" stroke="#FCDC04" strokeWidth="4" />
      <path 
        d="M45,35 L55,35 L60,45 L55,55 L50,65 L40,60 L35,50 Z" 
        fill="white" 
        className="drop-shadow-sm"
      />
    </svg>
  </div>
);

const EcoLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const dimensions = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-48 h-48 sm:w-56 sm:h-56'
  };

  const fontSize = {
    sm: '12px',
    md: '18px',
    lg: '28px sm:32px'
  };

  return (
    <div className={`${dimensions[size]} relative flex items-center justify-center`}>
      <svg viewBox="0 0 400 400" className="absolute w-full h-full animate-[spin_12s_linear_infinite]">
        <defs>
          <path id="circlePathLarge" d="M 200, 200 m -160, 0 a 160,160 0 1,1 320,0 a 160,160 0 1,1 -320,0" />
        </defs>
        <text style={{ fontSize: fontSize[size], fontWeight: 900, fill: '#065F28', letterSpacing: '0.1em' }}>
          <textPath xlinkHref="#circlePathLarge" startOffset="0%" className="uppercase">
            Track • Reduce • Impact
          </textPath>
        </text>
      </svg>

      <div className={`${size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-14 h-14' : 'w-24 h-24 sm:w-28 sm:h-28'} relative z-10 animate-zoom`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
          <defs>
            <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
              <feOffset dx="1" dy="1" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle cx="50" cy="50" r="48" fill="white" className="opacity-60" />
          <g transform="translate(50,50)" filter="url(#shadow)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((rot) => (
              <path
                key={rot}
                d="M0 -32 Q 12 -18 0 0 Q -12 -18 0 -32"
                fill="url(#leafGrad)"
                transform={`rotate(${rot}) translate(0, -8)`}
                className="opacity-95"
              />
            ))}
            <circle r="10" fill="#064E3B" />
            <path d="M-4 0 L-1 3 L5 -3" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </div>
    </div>
  );
};

const GoogleButton: React.FC<{ onClick: () => void; loading?: boolean; text: string }> = ({ onClick, loading, text }) => (
  <button 
    onClick={onClick}
    disabled={loading}
    className="w-full bg-white text-slate-700 font-bold py-4 sm:py-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-3"
  >
    {loading ? (
      <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
    ) : (
      <>
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span className="text-xs uppercase tracking-widest">{text}</span>
      </>
    )}
  </button>
);

const LanguageSelector: React.FC<{ variant?: 'header' | 'profile' }> = ({ variant = 'header' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const context = React.useContext(LanguageContext);
  if (!context) return null;
  const { language, setLanguage, t } = context;

  const options = Object.entries(LANGUAGE_NAMES).map(([code, name]) => ({
    code: code as AppLanguage,
    name
  }));

  if (variant === 'header') {
    return (
      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white/90 backdrop-blur-md hover:bg-white transition-colors px-3 py-2 rounded-xl sm:px-4 sm:py-2.5 sm:rounded-2xl border border-white/20 flex items-center space-x-2 shadow-lg"
        >
          <span className="text-[10px] font-black uppercase text-emerald-900">{language}</span>
          <svg className={`w-3 h-3 text-emerald-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
        </button>
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-emerald-50 overflow-hidden min-w-[140px] z-50 animate-in fade-in zoom-in-95 duration-200">
            {options.map((opt) => (
              <button
                key={opt.code}
                onClick={() => {
                  setLanguage(opt.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-wider hover:bg-emerald-50 transition-colors ${language === opt.code ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500'}`}
              >
                {opt.name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-[2.5rem] sm:rounded-[3rem] border border-emerald-50 shadow-sm space-y-4">
      <div className="flex items-center space-x-3 mb-2 px-1">
        <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9c-.83-2.082-1.919-4.43-3.056-6.388M12 5V3m1.048 9.5A18.515 18.515 0 0117 8.5" /></svg>
        </div>
        <h3 className="text-xs font-black text-emerald-950 uppercase tracking-widest">{t('changeLanguage')}</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => (
          <button
            key={opt.code}
            onClick={() => setLanguage(opt.code)}
            className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${language === opt.code ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-emerald-200'}`}
          >
            {opt.name}
          </button>
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [authStep, setAuthStep] = useState<'welcome' | 'login' | 'register'>('welcome');
  const [userType, setUserType] = useState<UserType>(UserType.INDIVIDUAL);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [newAvatarInput, setNewAvatarInput] = useState('');
  const [avatarType, setAvatarType] = useState<'seed' | 'url'>('seed');
  const [appLanguage, setAppLanguage] = useState<AppLanguage>(AppLanguage.ENGLISH);
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  const t = useMemo(() => getTranslator(appLanguage), [appLanguage]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Safety timeout for initialization splash screen
    const splashTimeout = setTimeout(() => {
      if (isInitializing) {
        console.warn("Auth initialization safety timeout reached.");
        setIsInitializing(false);
      }
    }, 8000);

    // Subscribe to Firebase Auth state
    const unsubscribe = api.onAuthChange((userData) => {
      setUser(userData);
      if (userData?.language) setAppLanguage(userData.language as AppLanguage);
      if (userData) {
        refreshActivities();
      }
      setIsInitializing(false);
      clearTimeout(splashTimeout);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribe();
      clearTimeout(splashTimeout);
    };
  }, []);

  const refreshActivities = async () => {
    if (api.isAuthenticated()) {
      try {
        const acts = await api.getActivities();
        setActivities(acts || []);
      } catch (err) {
        console.error("Dashboard data fetch failed:", err);
      }
    }
  };

  const getAvatarUrl = (userObj: User | null) => {
    if (!userObj) return '';
    const avatar = userObj.avatar || userObj.id;
    if (avatar.startsWith('http')) return avatar;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatar}`;
  };

  const todayFootprint = useMemo((): DailyFootprint => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayActs = activities.filter(a => a.timestamp.startsWith(todayStr));
    return todayActs.reduce((acc, act) => {
      const cat = act.category.toLowerCase() as keyof Omit<DailyFootprint, 'date' | 'total'>;
      acc[cat] = (acc[cat] || 0) + act.co2e;
      acc.total += act.co2e;
      return acc;
    }, { date: todayStr, transport: 0, energy: 0, food: 0, shopping: 0, total: 0 } as DailyFootprint);
  }, [activities]);

  const weeklyComparison = useMemo(() => {
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const thisWeekStart = new Date(now.getTime() - (7 * oneDay));
    const thisWeekTotal = activities.filter(a => new Date(a.timestamp) >= thisWeekStart).reduce((sum, a) => sum + a.co2e, 0);
    const lastWeekStart = new Date(now.getTime() - (14 * oneDay));
    const lastWeekEnd = thisWeekStart;
    const lastWeekTotal = activities.filter(a => {
        const d = new Date(a.timestamp);
        return d >= lastWeekStart && d < lastWeekEnd;
      }).reduce((sum, a) => sum + a.co2e, 0);
    return lastWeekTotal === 0 ? 0 : ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100;
  }, [activities]);

  const handleGoogleLogin = async () => {
    setIsLoadingAuth(true);
    try {
      await api.googleLogin();
    } catch (err: any) {
      alert("Google Login failed: " + (err.message || "Unknown error"));
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    setIsLoadingAuth(true);
    try {
      if (authStep === 'register') {
        const payload: any = { 
          email, 
          password, 
          district: formData.get('district') as string, 
          language: appLanguage 
        };
        if (userType === UserType.ORGANIZATION) {
          payload.organization_name = formData.get('orgName') as string;
          payload.contact_person = formData.get('contactPerson') as string;
          payload.phone_number = formData.get('phone') as string;
          payload.website = formData.get('website') as string;
          payload.organization_size = formData.get('orgSize') as string;
          await api.registerOrganization(payload);
        } else {
          payload.name = formData.get('name') as string;
          payload.location = formData.get('location') as string;
          payload.age = Number(formData.get('age'));
          payload.occupation = formData.get('occupation') as string;
          await api.register(payload);
        }
      } else {
        await api.login(email, password);
      }
    } catch (err: any) {
      alert(err.message || "Authentication failed.");
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const logout = async () => {
    try { await api.logout(); } finally {
      setUser(null);
      setActivities([]);
      setAuthStep('welcome');
    }
  };

  const handleAddActivity = async (activity: Omit<Activity, 'id' | 'timestamp'>) => {
    try {
      const newActivity = await api.createActivity(activity);
      setActivities(prev => [{ ...newActivity, isSynced: true }, ...prev]);
      setIsLoggerOpen(false);
    } catch (err) {
      alert("Failed to log activity. Please check your connection.");
    }
  };

  const handleDeleteActivity = async (id: string) => {
    try {
      await api.deleteActivity(id);
      setActivities(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      alert("Failed to delete activity.");
    }
  };

  const updateAvatar = async () => {
    if (!user || !newAvatarInput.trim()) return;
    setIsLoadingAuth(true);
    try {
      await api.updateProfile({ avatar: newAvatarInput });
      setUser({ ...user, avatar: newAvatarInput });
      setIsEditingAvatar(false);
    } catch (err) {
      alert("Failed to update profile.");
    } finally {
      setIsLoadingAuth(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#16A34A] flex flex-col items-center justify-center text-white text-center">
        <div className="animate-pulse-soft flex flex-col items-center justify-center">
          <EcoLogo size="md" />
          <h1 className="text-4xl font-black tracking-tighter mt-6">EcoTrack</h1>
          <p className="text-emerald-100 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">Sustainable Uganda</p>
        </div>
      </div>
    );
  }

  const contextValue = {
    language: appLanguage,
    setLanguage: setAppLanguage,
    t
  };

  if (!user) {
    return (
      <LanguageContext.Provider value={contextValue}>
        <DynamicBackground>
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
            <LanguageSelector variant="header" />
          </div>

          <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
            <div className={`w-full ${authStep === 'welcome' ? 'max-w-md' : 'max-w-4xl h-auto'} transition-all duration-700`}>
              {authStep === 'welcome' ? (
                <div className="text-center space-y-10 sm:space-y-12 animate-in fade-in zoom-in duration-500 flex flex-col items-center">
                  <div className="space-y-6 flex flex-col items-center">
                    <EcoLogo size="lg" />
                    <div>
                      <h1 className="text-5xl sm:text-6xl font-black tracking-tighter text-white drop-shadow-2xl">EcoTrack</h1>
                      <p className="text-emerald-50 font-bold uppercase tracking-[0.4em] text-[10px] mt-2 opacity-90">Uganda's Green Shield</p>
                    </div>
                  </div>
                  <div className="space-y-4 w-full px-4">
                    <button onClick={() => setAuthStep('register')} className="w-full bg-white text-emerald-900 font-black py-4 sm:py-5 rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl text-xs uppercase tracking-widest active:scale-95 transition-all">{t('startJourney')}</button>
                    <GoogleButton onClick={handleGoogleLogin} loading={isLoadingAuth} text={t('googleRegister')} />
                    <button onClick={() => setAuthStep('login')} className="w-full bg-emerald-800/40 backdrop-blur-md text-white font-black py-4 sm:py-5 rounded-[1.5rem] sm:rounded-[2rem] border border-white/20 text-xs uppercase tracking-widest active:scale-95 transition-all">{t('haveAccount')}</button>
                  </div>
                  
                  <div className="pt-12 flex flex-col items-center space-y-2 opacity-60">
                    <UgandaSeal />
                    <span className="text-[8px] font-black text-white/50 uppercase tracking-[0.3em]">Proudly Ugandan</span>
                  </div>
                </div>
              ) : (
                <div className="bg-white/95 backdrop-blur-3xl rounded-[2.5rem] sm:rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col md:flex-row overflow-hidden border border-white/40 animate-in slide-in-from-bottom-10 duration-700">
                  <div className="hidden md:flex w-1/3 bg-[#064E3B] p-12 flex-col justify-between text-white relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><EcoLogo size="lg" /></div>
                    <div className="relative z-10">
                      <h2 className="text-4xl font-black tracking-tighter uppercase leading-none mb-4">Western<br/>Uganda<br/>Green Hub</h2>
                      <p className="text-emerald-300 font-bold uppercase tracking-widest text-[10px]">Focused on the heart of the Pearl</p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3"><div className="w-2 h-2 rounded-full bg-emerald-400"></div><span className="text-xs font-bold text-emerald-100">Localized District Tracking</span></div>
                        <div className="flex items-center space-x-3"><div className="w-2 h-2 rounded-full bg-emerald-400"></div><span className="text-xs font-bold text-emerald-100">Western Community Challenges</span></div>
                    </div>
                  </div>
                  <div className="flex-1 p-6 sm:p-8 md:p-12 overflow-y-auto max-h-[90vh] sm:max-h-none no-scrollbar relative">
                    <button onClick={() => setAuthStep('welcome')} className="absolute top-6 left-6 text-slate-400 hover:text-emerald-600 transition-all z-10">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7"/></svg>
                    </button>
                    
                    <div className="flex flex-col h-full pt-4">
                      <div className="text-center mb-8">
                        <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-emerald-950 uppercase">{authStep === 'register' ? t('joinMovement') : t('login')}</h2>
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2">{authStep === 'register' ? t('createProfile') : t('enterPortal')}</p>
                      </div>

                      <form onSubmit={handleAuth} className="space-y-5 flex-1">
                        {authStep === 'register' && (
                          <div className="flex bg-slate-100 p-1 rounded-xl sm:rounded-2xl">
                            <button type="button" onClick={() => setUserType(UserType.INDIVIDUAL)} className={`flex-1 py-2.5 sm:py-3 text-[10px] font-black rounded-lg sm:rounded-xl uppercase tracking-widest transition-all ${userType === UserType.INDIVIDUAL ? 'bg-white shadow-md text-emerald-600' : 'text-slate-500'}`}>{t('individual')}</button>
                            <button type="button" onClick={() => setUserType(UserType.ORGANIZATION)} className={`flex-1 py-2.5 sm:py-3 text-[10px] font-black rounded-lg sm:rounded-xl uppercase tracking-widest transition-all ${userType === UserType.ORGANIZATION ? 'bg-white shadow-md text-emerald-600' : 'text-slate-500'}`}>{t('organization')}</button>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          {authStep === 'register' && userType === UserType.INDIVIDUAL && (
                            <><input type="text" name="name" required className="auth-input" placeholder={`${t('fullName')} *`} /><input type="text" name="location" required className="auth-input" placeholder={`${t('location')} *`} /><select name="district" required className="auth-input appearance-none bg-white"><option value="">{t('district')} *</option>{UGANDA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}</select><input type="number" name="age" className="auth-input" placeholder={t('age')} /></>
                          )}
                          {authStep === 'register' && userType === UserType.ORGANIZATION && (
                            <><input type="text" name="orgName" required className="auth-input" placeholder={`${t('orgName')} *`} /><input type="text" name="contactPerson" required className="auth-input" placeholder={`${t('contactPerson')} *`} /><input type="tel" name="phone" required className="auth-input" placeholder={`${t('phone')} *`} /><select name="district" required className="auth-input appearance-none bg-white"><option value="">{t('district')} *</option>{UGANDA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}</select></>
                          )}
                          <input type="email" name="email" required className="auth-input" placeholder={`${t('email')} *`} /><input type="password" name="password" required className="auth-input" placeholder={`${t('password')} *`} />
                        </div>

                        <div className="space-y-4 pt-4">
                          <button type="submit" disabled={isLoadingAuth} className="w-full bg-emerald-600 text-white font-black py-4 sm:py-5 rounded-xl sm:rounded-2xl shadow-xl shadow-emerald-100 uppercase tracking-widest text-xs flex items-center justify-center">
                            {isLoadingAuth ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (authStep === 'register' ? t('launchProfile') : t('signIn'))}
                          </button>
                          <div className="flex items-center space-x-4 my-2">
                            <div className="h-[1px] flex-1 bg-slate-100"></div>
                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">OR</span>
                            <div className="h-[1px] flex-1 bg-slate-100"></div>
                          </div>
                          <GoogleButton onClick={handleGoogleLogin} loading={isLoadingAuth} text={authStep === 'register' ? t('googleRegister') : t('googleLogin')} />
                        </div>
                      </form>
                      <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest mt-8">
                        {authStep === 'register' ? t('alreadyHave') : t('newToEco')} 
                        <button onClick={() => setAuthStep(authStep === 'register' ? 'login' : 'register')} className="ml-2 text-emerald-600 hover:underline font-black">
                          {authStep === 'register' ? t('signIn') : t('joinNow')}
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <style>{`.auth-input { @apply w-full p-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-sm placeholder:text-slate-300 text-emerald-950; }`}</style>
        </DynamicBackground>
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      <MainNatureBackground>
        {!isOnline && (
          <div className="fixed top-0 inset-x-0 z-[200] p-3 text-center text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 bg-emerald-600 text-white shadow-lg">
            🌱 Offline Mode Active • Local data will sync later
          </div>
        )}
        <div className="min-h-screen w-full flex flex-col relative overflow-hidden selection:bg-emerald-100">
          <header className="hidden md:flex bg-white/80 backdrop-blur-md border-b border-emerald-50 p-6 justify-between items-center sticky top-0 z-40">
            <EcoLogo size="sm" />
            <div className="flex space-x-8">
              <button onClick={() => setCurrentTab('dashboard')} className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${currentTab === 'dashboard' ? 'text-emerald-600' : 'text-slate-400 hover:text-emerald-400'}`}>{t('dashboard')}</button>
              <button onClick={() => setCurrentTab('calculator')} className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${currentTab === 'calculator' ? 'text-emerald-600' : 'text-slate-400 hover:text-emerald-400'}`}>{t('tracker')}</button>
              <button onClick={() => setCurrentTab('videos')} className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${currentTab === 'videos' ? 'text-emerald-600' : 'text-slate-400 hover:text-emerald-400'}`}>{t('academy')}</button>
              <button onClick={() => setCurrentTab('community')} className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${currentTab === 'community' ? 'text-emerald-600' : 'text-slate-400 hover:text-emerald-400'}`}>{t('community')}</button>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector variant="header" />
              <div className="flex items-center space-x-3 bg-emerald-50/50 p-1.5 rounded-2xl pr-4 border border-emerald-100 backdrop-blur-sm">
                <img src={getAvatarUrl(user)} className="w-8 h-8 rounded-xl border-2 border-white bg-white shadow-sm" />
                <span className="font-black text-[9px] uppercase tracking-widest text-emerald-900">{user.name.split(' ')[0]}</span>
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 w-full max-w-7xl mx-auto overflow-y-auto no-scrollbar">
            {currentTab === 'dashboard' && <Dashboard activities={activities} weeklyComparison={weeklyComparison} todayFootprint={todayFootprint} onQuickLog={() => setIsLoggerOpen(true)} user={user} language={appLanguage} />}
            {currentTab === 'calculator' && <Calculator activities={activities} onAddActivity={handleAddActivity} onDeleteActivity={handleDeleteActivity} />}
            {currentTab === 'videos' && <Videos user={user} language={appLanguage} activities={activities} />}
            {currentTab === 'community' && <Community />}
            {currentTab === 'profile' && (
              <div className="space-y-8 pb-24 animate-in slide-in-from-right-4 duration-300">
                <header className="flex justify-between items-center">
                  <h1 className="text-3xl font-black text-emerald-950 uppercase tracking-tighter">{t('myProfile')}</h1>
                  <div className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200">
                    {user.points} {t('points')}
                  </div>
                </header>
                <div className="bg-white/90 backdrop-blur-md p-8 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] border border-emerald-100 text-center shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-3 bg-emerald-600"></div>
                    <div className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto mb-6 group/avatar">
                      <div className="absolute inset-0 rounded-[2.5rem] bg-emerald-500/10 animate-pulse scale-105 group-hover/avatar:scale-110 transition-transform"></div>
                      <img src={getAvatarUrl(user)} className="w-full h-full rounded-[2.5rem] border-4 border-white shadow-2xl bg-emerald-50 object-cover relative z-10" />
                      <button onClick={() => setIsEditingAvatar(true)} className="absolute bottom-2 right-2 z-20 bg-emerald-600 text-white p-3 rounded-2xl shadow-lg border-4 border-white transition-all hover:scale-110 active:scale-95"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth={2.5}/></svg></button>
                    </div>
                    <h2 className="text-2xl font-black text-emerald-950 uppercase tracking-tighter">{user.name}</h2>
                    <p className="text-emerald-600 font-black text-[10px] uppercase tracking-widest mt-1">Sustainability Steward</p>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-8">
                      <div className="bg-emerald-50/50 p-4 sm:p-5 rounded-3xl border border-emerald-100/50">
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">{t('location')}</p>
                        <p className="text-xs font-black text-emerald-900 uppercase truncate">{user.district}</p>
                      </div>
                      <div className="bg-emerald-50/50 p-4 sm:p-5 rounded-3xl border border-emerald-100/50">
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">{t('joined')}</p>
                        <p className="text-xs font-black text-emerald-900 uppercase">
                          {user.joinedDate ? new Date(user.joinedDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : '2024'}
                        </p>
                      </div>
                    </div>
                </div>
                <LanguageSelector variant="profile" />
                <div className="space-y-3">
                    <button onClick={logout} className="w-full bg-rose-50/90 backdrop-blur-sm p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-rose-100 font-black text-rose-600 text-xs flex justify-between items-center hover:bg-rose-100 transition-all shadow-sm">
                      <span className="uppercase tracking-widest">{t('signOut')}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7" strokeWidth={3}/></svg>
                    </button>
                </div>
              </div>
            )}
          </main>
          {isEditingAvatar && (
            <div className="fixed inset-0 bg-emerald-950/70 backdrop-blur-xl z-[150] flex items-center justify-center p-6 animate-in fade-in duration-300">
              <div className="bg-white w-full max-w-md rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-10 space-y-8 animate-in zoom-in duration-300">
                <div className="text-center">
                  <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 uppercase tracking-tight">Edit Identity</h2>
                  <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest">Update your profile image</p>
                </div>
                <div className="flex p-1 bg-slate-100 rounded-xl sm:rounded-2xl">
                    <button onClick={() => setAvatarType('seed')} className={`flex-1 py-2.5 sm:py-3 text-[10px] font-black rounded-lg sm:rounded-xl transition-all ${avatarType === 'seed' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400'}`}>Seed</button>
                    <button onClick={() => setAvatarType('url')} className={`flex-1 py-2.5 sm:py-3 text-[10px] font-black rounded-lg sm:rounded-xl transition-all ${avatarType === 'url' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400'}`}>URL</button>
                </div>
                <input 
                  type="text" 
                  value={newAvatarInput} 
                  onChange={(e) => setNewAvatarInput(e.target.value)} 
                  placeholder={avatarType === 'url' ? "Paste image link here..." : "Enter word"}
                  className="w-full p-4 sm:p-5 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all" 
                />
                <div className="flex space-x-3">
                  <button onClick={() => setIsEditingAvatar(false)} className="flex-1 bg-slate-100 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500">Cancel</button>
                  <button onClick={updateAvatar} className="flex-[2] bg-emerald-600 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-[10px] uppercase shadow-xl shadow-emerald-100 tracking-widest transition-all active:scale-95">Save Changes</button>
                </div>
              </div>
            </div>
          )}
          {isLoggerOpen && <ActivityLogger onAddActivity={handleAddActivity} onClose={() => setIsLoggerOpen(false)} />}
          <LiveAssistant language={appLanguage} isPremium={true} />
          <Navigation currentTab={currentTab} setTab={setCurrentTab} />
        </div>
      </MainNatureBackground>
    </LanguageContext.Provider>
  );
};

export default App;
