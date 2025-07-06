import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Clock, SkipForward } from 'lucide-react';

const AdOverlay = ({ isVisible, onClose, onContinue, destinationUrl }) => {
  const [countdown, setCountdown] = useState(5);
  const [canSkip, setCanSkip] = useState(false);

  // Ad content rotation
  const adContent = [
    {
      title: "Boost Your Productivity",
      description: "Discover tools that help you work smarter, not harder.",
      cta: "Learn More",
      color: "bg-blue-500",
      icon: "⚡"
    },
    {
      title: "Stay Connected",
      description: "Keep your team in sync with our collaboration platform.",
      cta: "Try Free",
      color: "bg-green-500",
      icon: "🤝"
    },
    {
      title: "Secure Your Data",
      description: "Protect your business with enterprise-grade security.",
      cta: "Get Started",
      color: "bg-purple-500",
      icon: "🔒"
    },
    {
      title: "Scale Your Business",
      description: "Grow faster with our comprehensive business solutions.",
      cta: "Explore Now",
      color: "bg-orange-500",
      icon: "📈"
    }
  ];

  const [currentAd, setCurrentAd] = useState(0);

  useEffect(() => {
    if (isVisible) {
      // Check if user has seen an ad in the last 24 hours
      const lastAdTime = localStorage.getItem('lastAdTime');
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;

      if (lastAdTime && (now - parseInt(lastAdTime)) < oneDay) {
        // Skip ad if shown recently
        onContinue();
        return;
      }

      // Set random ad
      setCurrentAd(Math.floor(Math.random() * adContent.length));
      
      // Start countdown
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Allow skip after 3 seconds
      setTimeout(() => setCanSkip(true), 3000);

      return () => clearInterval(timer);
    }
  }, [isVisible]);

  const handleSkip = () => {
    if (canSkip) {
      onClose();
      onContinue();
    }
  };

  const handleContinue = () => {
    // Record ad view time
    localStorage.setItem('lastAdTime', Date.now().toString());
    onClose();
    onContinue();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Redirecting in {countdown}s
            </span>
          </div>
          {canSkip && (
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex items-center space-x-1"
            >
              <SkipForward className="h-4 w-4" />
              <span className="text-sm">Skip</span>
            </button>
          )}
        </div>

        {/* Ad Content */}
        <div className="p-6">
          <div className={`${adContent[currentAd].color} rounded-lg p-6 text-white mb-6`}>
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">{adContent[currentAd].icon}</span>
              <h3 className="text-xl font-bold">
                {adContent[currentAd].title}
              </h3>
            </div>
            <p className="text-white/90 mb-4">
              {adContent[currentAd].description}
            </p>
            <button className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              {adContent[currentAd].cta}
            </button>
          </div>

          {/* Destination Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <ExternalLink className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                You're being redirected to:
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 break-all">
              {destinationUrl}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {canSkip && (
              <button
                onClick={handleSkip}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Skip Ad
              </button>
            )}
            <button
              onClick={handleContinue}
              disabled={countdown > 0}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {countdown > 0 ? `Continue (${countdown}s)` : 'Continue'}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-1">
          <div 
            className="bg-blue-500 h-1 transition-all duration-1000 ease-linear"
            style={{ width: `${((5 - countdown) / 5) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default AdOverlay; 