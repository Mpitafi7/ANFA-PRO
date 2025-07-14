import React from 'react';

const LogoIcon = ({ className = "", size = "default" }) => {
  const sizeClasses = {
    small: "w-6 h-6",
    default: "w-8 h-8",
    large: "w-10 h-10",
    xlarge: "w-12 h-12"
  };

  return (
    <div className={`${sizeClasses[size] || sizeClasses.default} flex-shrink-0 ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="1" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.8" />
          </radialGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background Circle */}
        <circle cx="50" cy="50" r="45" fill="url(#glowGradient)" filter="url(#softGlow)" />

        {/* Link Icon Shape */}
        <g transform="translate(28, 28) scale(1.5)">
          <path
            d="M8 10a4 4 0 014-4h6a4 4 0 010 8h-2"
            stroke="#ffffff"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M16 14a4 4 0 01-4 4H6a4 4 0 010-8h2"
            stroke="#ffffff"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
};

export default LogoIcon; 