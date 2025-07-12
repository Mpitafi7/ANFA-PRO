import React, { useState, useEffect } from 'react';
import { Button } from './ui/button.jsx';
import { 
  Download, 
  X,
  Smartphone,
  Monitor,
  Globe,
  Zap
} from 'lucide-react';

export default function InstallPrompt({ isDarkMode }) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      console.log('App installed');
      setIsInstalled(true);
      setShowPrompt(false);
    };

    // Check if we should show the prompt
    const shouldShowPrompt = () => {
      // Don't show if already installed
      if (window.matchMedia('(display-mode: standalone)').matches) {
        return false;
      }
      
      // Don't show if dismissed in this session
      if (sessionStorage.getItem('pwa-prompt-dismissed')) {
        return false;
      }
      
      // Show if we have a deferred prompt
      return !!deferredPrompt;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if we should show prompt on mount
    if (shouldShowPrompt()) {
      setShowPrompt(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [deferredPrompt]);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      console.log('No deferred prompt available');
      return;
    }

    setIsInstalling(true);
    try {
      console.log('Prompting for installation...');
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('Installation outcome:', outcome);
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setShowPrompt(false);
      }
    } catch (error) {
      console.error('Error during installation:', error);
    } finally {
      setIsInstalling(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Don't show if already installed or dismissed
  if (!showPrompt || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Download Icon */}
      <div className="relative">
        <Button
          onClick={handleInstall}
          disabled={isInstalling || !deferredPrompt}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={`
            w-14 h-14 rounded-full shadow-2xl 
            bg-gradient-to-r from-blue-600 to-purple-600 
            hover:from-blue-700 hover:to-purple-700 
            text-white border-0
            ${isInstalling ? 'animate-pulse' : 'animate-bounce'}
            transition-all duration-300
          `}
          title="Install ANFA Pro App"
        >
          {isInstalling ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          ) : (
            <Download className="w-6 h-6" />
          )}
        </Button>

        {/* Dismiss Button */}
        <Button
          onClick={handleDismiss}
          variant="ghost"
          size="sm"
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white p-0"
        >
          <X className="w-3 h-3" />
        </Button>

        {/* Tooltip */}
        {showTooltip && (
          <div className={`
            absolute bottom-full right-0 mb-2 p-3 rounded-lg shadow-xl
            ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
            border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
            w-64
          `}>
            <div className="text-sm font-semibold mb-2">Install ANFA Pro App</div>
            <div className="text-xs mb-3 opacity-80">
              Get the full experience with offline support and native features.
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-1">
                <Zap className="w-3 h-3 text-green-500" />
                <span>Faster Loading</span>
              </div>
              <div className="flex items-center space-x-1">
                <Globe className="w-3 h-3 text-blue-500" />
                <span>Offline Support</span>
              </div>
              <div className="flex items-center space-x-1">
                <Smartphone className="w-3 h-3 text-purple-500" />
                <span>Mobile Optimized</span>
              </div>
              <div className="flex items-center space-x-1">
                <Monitor className="w-3 h-3 text-orange-500" />
                <span>Desktop App</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 