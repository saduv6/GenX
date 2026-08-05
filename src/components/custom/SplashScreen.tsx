// ============================================================
// Interactive Splash Screen - Animated SVG laptop
// ============================================================

import { useState, useEffect } from 'react';
import { hasSplashSeen, setSplashSeen } from '@/lib/firebase';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<'idle' | 'zooming' | 'done'>('idle');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (hasSplashSeen()) {
      setVisible(false);
      onComplete();
    }
  }, [onComplete]);

  const handleClick = () => {
    if (phase !== 'idle') return;
    setPhase('zooming');
    setSplashSeen();

    setTimeout(() => {
      setPhase('done');
      setTimeout(() => {
        setVisible(false);
        onComplete();
      }, 100);
    }, 800);
  };

  if (!visible) return null;

  const zoomClass = phase === 'zooming'
    ? 'scale-[3] opacity-0 rotate-12'
    : phase === 'done'
    ? 'scale-[4] opacity-0'
    : 'scale-100 opacity-100 rotate-0';

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center cursor-pointer transition-opacity duration-100 ${phase === 'done' ? 'opacity-0' : 'opacity-100'}`}
      onClick={handleClick}
    >
      <div className={`transition-all duration-800 ease-out ${zoomClass}`}>
        {/* SVG Laptop Illustration */}
        <svg width="280" height="200" viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Laptop Base */}
          <rect x="20" y="140" width="240" height="12" rx="4" fill="#0a0a0a" stroke="#00ff00" strokeWidth="2" />
          <rect x="40" y="152" width="200" height="6" rx="2" fill="#0a0a0a" stroke="#00ff00" strokeWidth="1" />
          {/* Screen bezel */}
          <rect x="40" y="20" width="200" height="120" rx="8" fill="#0a0a0a" stroke="#00ff00" strokeWidth="2.5" />
          {/* Screen display area */}
          <rect x="52" y="32" width="176" height="96" rx="4" fill="#000000" />
          {/* Screen content - neon green elements */}
          <rect x="70" y="50" width="60" height="6" rx="2" fill="#00ff00" opacity="0.9" />
          <rect x="70" y="62" width="100" height="4" rx="1.5" fill="#00ff00" opacity="0.5" />
          <rect x="70" y="70" width="80" height="4" rx="1.5" fill="#00ff00" opacity="0.4" />
          <rect x="70" y="78" width="90" height="4" rx="1.5" fill="#00ff00" opacity="0.3" />
          {/* GenX Logo on screen */}
          <text x="140" y="105" textAnchor="middle" fill="#00ff00" fontFamily="monospace" fontSize="16" fontWeight="bold" letterSpacing="3">
            GenX
          </text>
          {/* Trackpad */}
          <rect x="100" y="144" width="80" height="4" rx="1.5" fill="#00ff00" opacity="0.2" />
          {/* Hinge */}
          <rect x="50" y="138" width="180" height="3" rx="1" fill="#00ff00" opacity="0.4" />
          {/* Glow effect on edges */}
          <circle cx="140" cy="80" r="70" fill="url(#glow)" opacity="0.08" />
          <defs>
            <radialGradient id="glow" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#00ff00" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <p className="text-white/60 text-sm mt-8 font-light tracking-widest animate-pulse">
        Click to enter
      </p>
    </div>
  );
}
