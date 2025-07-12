import React, { useState, useEffect } from 'react';
import { Button } from './ui/button.jsx';
import { Card, CardContent } from './ui/card.jsx';
import { 
  Download, 
  Smartphone, 
  Monitor, 
  X,
  CheckCircle,
  Globe,
  Zap
} from 'lucide-react';

export default function InstallPrompt({ isDarkMode }) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

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
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <Card className={`shadow-2xl border-0 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Install ANFA Pro App
              </h3>
              <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Get the full experience! Install our app for faster access, offline support, and native features.
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-green-500" />
                  <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Faster Loading
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Offline Support
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-purple-500" />
                  <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Mobile Optimized
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Monitor className="w-4 h-4 text-orange-500" />
                  <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Desktop App
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-3">
                <Button
                  onClick={handleInstall}
                  disabled={isInstalling || !deferredPrompt}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  {isInstalling ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Installing...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Download className="w-4 h-4 mr-2" />
                      Install App
                    </div>
                  )}
                </Button>
                <Button
                  onClick={handleDismiss}
                  variant="outline"
                  size="sm"
                  className="px-3"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 