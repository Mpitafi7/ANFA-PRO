import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "./src/utils/index.js";
import { 
  Home, 
  BarChart3, 
  MessageSquare, 
  LogOut, 
  Sun, 
  Moon, 
  User as UserIcon,
  Link as LinkIcon,
  Menu,
  X
} from "lucide-react";
import { Button } from "./src/components/ui/button.jsx";
import { User } from "./src/entities/User.js";
import AuthModal from "./src/components/AuthModal.jsx";

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const location = useLocation();

  useEffect(() => {
    checkUser();
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Check for PWA install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setShowInstallButton(true);
      
      // Store the event for later use
      window.deferredPrompt = e;
    });
  }, []);

  const checkUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      setUser(null);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const handleAuthClose = () => {
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    await User.logout();
    setUser(null);
  };

  const handleInstallApp = async () => {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      const { outcome } = await window.deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setShowInstallButton(false);
      }
      window.deferredPrompt = null;
    }
  };

  const navigationItems = [
    { name: "Home", path: "Home", icon: Home },
    { name: "Dashboard", path: "Dashboard", icon: BarChart3, requiresAuth: true },
    { name: "Blog", path: "Blog", icon: MessageSquare },
  ];

  const isLandingPage = currentPageName === "Home";

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          :root {
            --primary-blue: #3b82f6;
            --primary-blue-dark: #2563eb;
            --primary-blue-light: #60a5fa;
            --secondary-gray: #6b7280;
            --light-gray: #f3f4f6;
            --dark-gray: #1f2937;
          }
          
          * {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          }
          
          .glass-effect {
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .dark .glass-effect {
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          
          .custom-shadow {
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
          
          .hover-lift {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          
          .hover-lift:hover {
            transform: translateY(-5px);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }
        `}
      </style>

      {/* Navigation */}
      <nav className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-800/95 border-gray-700 backdrop-blur-md' 
          : 'bg-white/95 border-gray-200 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <LinkIcon className="w-5 h-5 text-white" />
              </div>
              <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                ANFA Pro
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => {
                if (item.requiresAuth && !user) return null;
                return (
                  <Link
                    key={item.name}
                    to={createPageUrl(item.path)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                      location.pathname === createPageUrl(item.path)
                        ? isDarkMode 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-blue-50 text-blue-700'
                        : isDarkMode
                          ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className={`rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              {/* User Menu */}
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                    isDarkMode 
                      ? 'text-gray-300' 
                      : 'text-gray-600'
                  }`}>
                    <UserIcon className="w-4 h-4" />
                    <span className="font-medium">{user.full_name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className={`rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="ghost" 
                    className="font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200" 
                    onClick={() => handleAuthClick('login')}
                  >
                    Login
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" 
                    onClick={() => handleAuthClick('register')}
                  >
                    Sign Up
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className={`md:hidden border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigationItems.map((item) => {
                  if (item.requiresAuth && !user) return null;
                  return (
                    <Link
                      key={item.name}
                      to={createPageUrl(item.path)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                        location.pathname === createPageUrl(item.path)
                          ? isDarkMode 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-blue-50 text-blue-700'
                          : isDarkMode
                            ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={handleAuthClose}
        onSuccess={handleAuthSuccess}
      />

      {/* Footer */}
      {isLandingPage && (
        <footer className={`border-t transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <LinkIcon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    ANFA Pro
                  </span>
                </div>
                <p className={`text-sm leading-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your modern AI-powered URL shortener. Create, track, and optimize your links with intelligent analytics and fun AI feedback.
                </p>
                <div className="mt-4">
                  <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    About ANFA Tech
                  </h4>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Building the future of link management with AI.
                  </p>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Quick Links
                </h4>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link to={createPageUrl("Home")} className={`text-sm hover:underline ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to={createPageUrl("Blog")} className={`text-sm hover:underline ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className={`text-sm hover:underline ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy-policy" className={`text-sm hover:underline ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Social Links */}
              <div>
                <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Follow Us
                </h4>
                <div className="mt-4 flex flex-col space-y-2">
                  <a href="https://twitter.com" className={`text-sm hover:underline ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                    X (Twitter)
                  </a>
                  <a href="https://youtube.com" className={`text-sm hover:underline ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                    YouTube
                  </a>
                  <a href="https://instagram.com" className={`text-sm hover:underline ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                    Instagram
                  </a>
                  <a href="https://facebook.com" className={`text-sm hover:underline ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                    Facebook
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className={`mt-8 pt-8 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                © 2024 ANFA Tech. All rights reserved. Built with ❤️ for the future of link management.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}