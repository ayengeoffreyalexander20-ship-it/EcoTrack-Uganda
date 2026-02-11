
import React, { useMemo } from 'react';

const LEAF_PATHS = [
  "M20,50 Q40,0 60,50 T100,50", // Simple leaf
  "M10,90 Q50,10 90,90 Z", // Wide leaf
  "M30,100 C10,80 10,20 50,0 C90,20 90,80 70,100 L50,80 Z" // Monstera-like
];

interface LeafProps {
  delay: number;
  duration: number;
  left: number;
  size: number;
  path: string;
  opacity: number;
}

const DriftingLeaf: React.FC<LeafProps> = ({ delay, duration, left, size, path, opacity }) => {
  return (
    <div 
      className="absolute pointer-events-none select-none animate-nature-drift"
      style={{
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
        opacity: opacity,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        top: '-10%',
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
        <path 
          d={path} 
          fill="currentColor" 
          className="text-emerald-700/20"
          transform={`rotate(${Math.random() * 360} 50 50)`}
        />
      </svg>
    </div>
  );
};

const MainNatureBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const leaves = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      delay: i * -5, // Start at different times
      duration: 35 + Math.random() * 25,
      left: Math.random() * 100,
      size: 40 + Math.random() * 80,
      path: LEAF_PATHS[Math.floor(Math.random() * LEAF_PATHS.length)],
      opacity: 0.05 + Math.random() * 0.1
    }));
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#F5FDF8] overflow-hidden">
      {/* Soft Sunlight Rays */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle_at_20%_20%,rgba(52,211,153,0.1)_0%,transparent_50%)] animate-pulse-slow"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-[linear-gradient(135deg,rgba(255,255,255,0.4)_0%,transparent_40%)] opacity-30"></div>
      </div>

      {/* Drifting Elements Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {leaves.map(leaf => (
          <DriftingLeaf key={leaf.id} {...leaf} />
        ))}
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>

      <style>{`
        @keyframes nature-drift {
          0% {
            transform: translateY(0vh) translateX(0) rotate(0deg);
            top: -10%;
          }
          25% {
            transform: translateY(30vh) translateX(40px) rotate(45deg);
          }
          50% {
            transform: translateY(60vh) translateX(-40px) rotate(90deg);
          }
          75% {
            transform: translateY(90vh) translateX(40px) rotate(135deg);
          }
          100% {
            transform: translateY(120vh) translateX(0) rotate(180deg);
            top: 100%;
          }
        }
        .animate-nature-drift {
          animation-name: nature-drift;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 15s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default MainNatureBackground;
