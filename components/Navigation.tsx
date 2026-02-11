
import React from 'react';

interface NavProps {
  currentTab: string;
  setTab: (tab: string) => void;
}

const Navigation: React.FC<NavProps> = ({ currentTab, setTab }) => {
  const tabs = [
    { id: 'dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Home' },
    { id: 'calculator', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z', label: 'Track' },
    { id: 'videos', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z', label: 'Academy' },
    { id: 'community', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', label: 'Social' },
    { id: 'profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', label: 'Me' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-emerald-100 py-2 sm:py-3 pb-safe-offset-4 px-2 sm:px-8 flex justify-around sm:justify-between items-center z-[100] md:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setTab(tab.id)}
          className={`relative flex flex-col items-center space-y-1 group transition-all duration-300 min-w-[54px] ${
            currentTab === tab.id ? 'text-emerald-600 scale-105' : 'text-slate-400'
          }`}
        >
          {currentTab === tab.id && (
            <span className="absolute -top-1 w-1 h-1 bg-emerald-600 rounded-full animate-ping"></span>
          )}
          <svg className="w-5 h-5 sm:w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={currentTab === tab.id ? 2.5 : 2} d={tab.icon} />
          </svg>
          <span className={`text-[7.5px] sm:text-[9px] font-black uppercase tracking-tight ${currentTab === tab.id ? 'opacity-100' : 'opacity-60'}`}>
            {tab.label}
          </span>
        </button>
      ))}
      <style>{`
        .pb-safe-offset-4 {
          padding-bottom: calc(0.5rem + env(safe-area-inset-bottom, 0px));
        }
        @media (min-width: 640px) {
          .pb-safe-offset-4 {
            padding-bottom: calc(0.75rem + env(safe-area-inset-bottom, 0px));
          }
        }
      `}</style>
    </nav>
  );
};

export default Navigation;
