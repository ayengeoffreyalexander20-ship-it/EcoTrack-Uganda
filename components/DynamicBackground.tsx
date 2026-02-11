
import React, { useEffect, useState, useRef } from 'react';

interface FloatingItem {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  icon: string;
}

const ECO_ICONS = ['🌱', '☁️', '💧', '🌿', '🍃', '☀️', '🌍', '🐢', '🦋'];

const DynamicBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<FloatingItem[]>([]);
  const requestRef = useRef<number>(null);

  // Initialize particles
  useEffect(() => {
    const initialItems = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 110,
      size: Math.random() * 25 + 15,
      speed: Math.random() * 0.04 + 0.015,
      opacity: Math.random() * 0.12 + 0.04,
      icon: ECO_ICONS[Math.floor(Math.random() * ECO_ICONS.length)]
    }));
    setItems(initialItems);
  }, []);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      setItems(prevItems => 
        prevItems.map(item => {
          let newY = item.y - item.speed;
          let newX = item.x + Math.sin(newY / 10) * 0.02; // Add subtle sway
          // Reset particle if it goes off screen
          if (newY < -15) {
            newY = 115;
            newX = Math.random() * 100;
          }
          return { ...item, y: newY, x: newX };
        })
      );
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#065F28]">
      {/* Layer 1: Animated Gradient - Richer emerald shades */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#16A34A] via-[#065F28] to-[#043316] animate-gradient-shift"></div>
      
      {/* Layer 2: Floating Icons */}
      <div className="absolute inset-0 z-1 pointer-events-none">
        {items.map(item => (
          <div
            key={item.id}
            className="absolute select-none"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              fontSize: `${item.size}px`,
              opacity: item.opacity,
              filter: 'brightness(1.5) drop-shadow(0 0 10px rgba(255,255,255,0.2))',
              transform: `translate(-50%, -50%)`,
              transition: 'none'
            }}
          >
            {item.icon}
          </div>
        ))}
      </div>

      {/* Layer 3: Content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {children}
      </div>

      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-shift {
          background-size: 240% 240%;
          animation: gradient-shift 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default DynamicBackground;
