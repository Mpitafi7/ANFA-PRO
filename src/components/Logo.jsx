import React from 'react';

const Logo = ({ className = "", size = "default", showText = true, showTagline = true }) => {
  const sizeClasses = {
    small: "w-24 h-8",
    default: "w-32 h-10", 
    large: "w-40 h-12",
    xlarge: "w-48 h-14"
  };

  return (
    <div className={`flex items-center ${className}`}>
      {/* Logo SVG */}
      <div className={`${sizeClasses[size] || sizeClasses.default} flex-shrink-0`}>
        <svg viewBox="0 0 200 60" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="logoGlowGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity="1" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.8" />
            </radialGradient>
            <filter id="logoSoftGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Background circle */}
          <circle cx="30" cy="30" r="25" fill="url(#logoGlowGradient)" filter="url(#logoSoftGlow)"/>
          
          {/* Link Icon Shape */}
          <g transform="translate(15, 15) scale(1.2)">
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
          
          {/* ANFA PRO Text */}
          {showText && (
            <g transform="translate(70, 0)">
              {/* ANFA */}
              <text x="0" y="25" fontFamily="'Times New Roman', serif" fontSize="22" fontWeight="700" fill="currentColor" className="text-gray-800 dark:text-white">
                ANFA
              </text>
              
              {/* PRO */}
              <text x="0" y="45" fontFamily="'Times New Roman', serif" fontSize="16" fontWeight="600" fill="#3b82f6">
                PRO
              </text>
              
              {/* Tagline */}
              {showTagline && (
                <text x="0" y="55" fontFamily="'Times New Roman', serif" fontSize="10" fontWeight="400" fill="#6b7280" opacity="0.8">
                  URL Shortener
                </text>
              )}
            </g>
          )}
          
          {/* Decorative elements */}
          <circle cx="180" cy="15" r="2" fill="#3b82f6" opacity="0.3"/>
          <circle cx="185" cy="25" r="1.5" fill="#3b82f6" opacity="0.2"/>
          <circle cx="175" cy="45" r="1" fill="#3b82f6" opacity="0.4"/>
        </svg>
      </div>
    </div>
  );
};

export default Logo; 