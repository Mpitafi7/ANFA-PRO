import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "./utils/index.js";
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
  X,
  User,
  Settings,
  FileText,
  Lock,
  QrCode,
  ExternalLink
} from "lucide-react";
import { Button } from "./components/ui/button.jsx";
import { User as UserEntity } from "./entities/User.js";
import AuthModal from "./components/AuthModal.jsx";
import HelpChat from "./components/HelpChat.jsx";
import InstallPrompt from "./components/InstallPrompt.jsx";
import { useTheme } from "./components/ThemeContext.jsx";
import ProfileModal from './components/ProfileModal.jsx';
import Logo from './components/Logo.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Memoized navigation items
  const navigationItems = useMemo(() => [
    { name: "Home", path: "Home", icon: Home },
    { name: "Dashboard", path: "Dashboard", icon: BarChart3 },
    { name: "Blog", path: "Blog", icon: MessageSquare },
  ], []);

  useEffect(() => {
    checkUser();
    // Remove beforeinstallprompt event handling from Layout
    // Let InstallPrompt handle it
  }, []);

  useEffect(() => {
    // Check auth state from localStorage or token to prevent lock icon flash
    const checkAuthStatus = () => {
      // You can customize this logic as per your auth implementation
      // For Firebase, you might check firebase.auth().currentUser
      // Here, we check if user exists in localStorage/session or user state
      return !!(user && (user.email || user.uid));
    };
    setIsLoggedIn(checkAuthStatus());
  }, [user]);

  const checkUser = useCallback(async () => {
    try {
      const userData = await UserEntity.me();
      console.log('User data loaded:', userData);
      setUser(userData);
    } catch (error) {
      console.log('No user found:', error);
      setUser(null);
    }
  }, []);

  const handleAuthClick = useCallback((mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  }, []);

  const handleAuthSuccess = useCallback((userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setShowAuthModal(false);
    // Redirect after login if needed
    const redirectPath = localStorage.getItem('redirectAfterLogin');
    if (redirectPath) {
      navigate(redirectPath);
      localStorage.removeItem('redirectAfterLogin');
    }
  }, [navigate]);

  const handleAuthClose = useCallback(() => {
    setShowAuthModal(false);
  }, []);

  const handleLogout = useCallback(async () => {
    await UserEntity.logout();
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  const handleInstallApp = useCallback(async () => {
    // Remove this function, not needed anymore
  }, []);

  const handleProfileClick = () => {
    if (user) {
      setShowProfileModal(true);
    } else {
      setAuthMode('login');
      setShowAuthModal(true);
    }
  };

  const handlePublicProfileClick = () => {
    if (user && user.publicId) {
      window.open(`/u/${user.publicId}`, '_blank');
    }
  };

  const handleDashboardClick = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowAccessModal(true);
      localStorage.setItem('redirectAfterLogin', '/dashboard');
      return;
    }
    // Simulate fetching user plan (replace with real logic)
    const plan = user.plan || 'basic'; // e.g., 'basic', 'pro', 'team', null
    if (!plan || plan === 'expired') {
      setToastMessage('⚠️ Your subscription has expired. Please choose a plan to continue using ANFA PRO.');
      navigate('/pricing');
      return;
    }
    // Always navigate to /dashboard regardless of plan
    navigate('/dashboard');
  };

  // Memoized navigation links
  const navigationLinks = useMemo(() => {
    return navigationItems.map((item) => {
      if (item.requiresAuth && !user) return null;
      if (item.name === 'Dashboard') {
        return (
          <button
            key={item.name}
            onClick={handleDashboardClick}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
              location.pathname.startsWith('/dashboard')
                ? isDarkMode 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-blue-50 text-blue-700 shadow-sm'
                : isDarkMode
                  ? 'text-gray-200 hover:text-white hover:bg-gray-700 hover:shadow-md border border-gray-600'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 hover:shadow-sm border border-gray-300'
            }`}
          >
            {!isLoggedIn ? (
              <React.Fragment>
                <item.icon className="w-5 h-5" />
                <span className="font-semibold flex items-center">Dashboard <Lock className="w-4 h-4 ml-1 text-gray-400" /></span>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <item.icon className="w-5 h-5" />
                <span className="font-semibold">Dashboard</span>
              </React.Fragment>
            )}
          </button>
        );
      }
      return (
        <Link
          key={item.name}
          to={createPageUrl(item.path)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            location.pathname === createPageUrl(item.path)
              ? isDarkMode 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-blue-50 text-blue-700 shadow-sm'
              : isDarkMode
                ? 'text-gray-300 hover:text-white hover:bg-gray-700 hover:shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-sm'
          }`}
        >
          <item.icon className="w-4 h-4" />
          <span className="font-medium">{item.name}</span>
        </Link>
      );
    }).filter(Boolean);
  }, [navigationItems, user, location.pathname, isDarkMode, isLoggedIn]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 border-b backdrop-blur-md ${
        isDarkMode 
          ? 'bg-gray-800/90 border-gray-700' 
          : 'bg-white/90 border-gray-200'
      }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center flex-shrink-0">
              <Logo size="default" showTagline={false} />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
              {navigationLinks}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className={`rounded-full ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL} alt={user.displayName} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                          {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleProfileClick}>
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    {user.publicId && (
                      <DropdownMenuItem onClick={handlePublicProfileClick}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        <span>Public Profile</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="outline" onClick={() => setShowAuthModal(true)}>
                  Login
                </Button>
              )}
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`md:hidden rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                aria-label="Open menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className={`md:hidden border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="px-4 py-3 space-y-2">
              {/* User Info in Mobile Menu */}
              {user && (
                <button
                  onClick={() => {
                    handleProfileClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded-lg ${
                    isDarkMode 
                      ? 'bg-gray-700 text-white' 
                      : 'bg-gray-100 text-gray-700'
                  } mb-2 block w-full text-left`}
                >
                  <div className="flex items-center space-x-2">
                    <UserIcon className="w-4 h-4" />
                    <span className="font-medium text-sm">
                      {user.full_name || user.username || user.email || 'User'}
                    </span>
                  </div>
                </button>
              )}
              {navigationItems.map((item) => {
                if (item.requiresAuth && !user) return null;
                if (item.name === 'Dashboard') {
                  return (
                    <button
                      key={item.name}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                        location.pathname.startsWith('/dashboard')
                          ? isDarkMode 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'bg-blue-50 text-blue-700 shadow-sm'
                          : isDarkMode
                            ? 'text-gray-200 hover:text-white hover:bg-gray-700 hover:shadow-md border border-gray-600'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 hover:shadow-sm border border-gray-300'
                      }`}
                      onClick={(e) => { handleDashboardClick(e); setIsMobileMenuOpen(false); }}
                    >
                      {!isLoggedIn ? (
                        <React.Fragment>
                          <item.icon className="w-5 h-5" />
                          <span className="font-semibold flex items-center">Dashboard <Lock className="w-4 h-4 ml-1 text-gray-400" /></span>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <item.icon className="w-5 h-5" />
                          <span className="font-semibold">Dashboard</span>
                        </React.Fragment>
                      )}
                    </button>
                  );
                }
                return (
                  <Link
                    key={item.name}
                    to={createPageUrl(item.path)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                      location.pathname === createPageUrl(item.path)
                        ? isDarkMode 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'bg-blue-50 text-blue-700 shadow-sm'
                        : isDarkMode
                          ? 'text-gray-300 hover:text-white hover:bg-gray-700 hover:shadow-md'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-sm'
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

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
      />

      {/* Help Chat */}
      <HelpChat />

      {/* Install Prompt */}
      <InstallPrompt isDarkMode={isDarkMode} />

      {/* Access Denied Modal */}
      {showAccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-8 text-center">
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">🛑</span>
              <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Access Denied</h2>
              <p className="mb-6 text-gray-700 dark:text-gray-300">Please login to access your dashboard. Only users with a valid plan can proceed.</p>
              <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                <button
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                  onClick={() => { setShowAccessModal(false); setShowAuthModal(true); }}
                >
                  Login Now
                </button>
                <button
                  className="w-full sm:w-auto px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                  onClick={() => { setShowAccessModal(false); navigate('/pricing'); }}
                >
                  View Plans
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast for expired plan */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-yellow-500 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce">
          {toastMessage}
          <button className="ml-4 text-white font-bold" onClick={() => setToastMessage("")}>×</button>
        </div>
      )}

      {/* Footer */}
      <footer className={`border-t ${
        isDarkMode 
          ? 'bg-gray-900/95 border-gray-700' 
          : 'bg-white/95 border-gray-200'
      }`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Company Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <LinkIcon className="w-3 h-3 text-white" />
                </div>
                <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  ANFA Pro
                </span>
              </div>
              <p className={`text-xs leading-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                AI-powered URL shortener with intelligent analytics and real-time insights.
              </p>
              <div className="flex space-x-3">
                <a 
                  href="https://twitter.com" 
                  className={`p-2 rounded-lg ${
                    isDarkMode 
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a 
                  href="https://youtube.com" 
                  className={`p-2 rounded-lg ${
                    isDarkMode 
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a 
                  href="https://instagram.com" 
                  className={`p-2 rounded-lg ${
                    isDarkMode 
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="https://facebook.com" 
                  className={`p-2 rounded-lg ${
                    isDarkMode 
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Quick Links
              </h4>
              <div className="space-y-2">
                <Link 
                  to={createPageUrl("Home")} 
                  className={`block text-sm ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Home
                </Link>
                <Link 
                  to={createPageUrl("Blog")} 
                  className={`block text-sm ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Blog
                </Link>
                <Link 
                  to={createPageUrl("Dashboard")}
                  className={`block text-sm ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Dashboard
                </Link>
              </div>
            </div>

            {/* More (Profile, Privacy Policy, Terms of Service) */}
            <div className="space-y-3">
              <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>More</h4>
              <div className="space-y-2">
                {user && (
                  <>
                    <button 
                      onClick={handleProfileClick}
                      className={`block text-sm text-left w-full ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      Profile
                    </button>
                    <button 
                      onClick={handlePublicProfileClick}
                      className={`block text-sm text-left w-full ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      Public Profile
                    </button>
                  </>
                )}
                {!user && (
                  <button 
                    onClick={() => handleAuthClick('login')}
                    className={`block text-sm text-left w-full ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Profile (Login Required)
                  </button>
                )}
                <Link 
                  to="/terms" 
                  className={`block text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Terms of Service
                </Link>
                <Link 
                  to="/privacy"
                  className={`block text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Privacy Policy
                </Link>
                <Link 
                  to="/pricing"
                  className={`block text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Pricing
                </Link>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="space-y-3">
              <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <QrCode className="w-4 h-4 inline mr-2" />
                QR Code
              </h4>
              <div className="space-y-2">
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Scan to visit ANFA Pro
                </p>
                <div className="bg-white p-2 rounded-lg inline-block">
                  <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <button 
                  onClick={() => {
                    // Generate QR code for current page
                    const currentUrl = window.location.href;
                    // You can implement QR code generation here
                    alert('QR Code feature coming soon!');
                  }}
                  className={`text-xs ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                >
                  Generate QR Code
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className={`text-xs text-center sm:text-left ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>© 2024 ANFA Pro. All rights reserved.</p>
              <div className="flex space-x-4 mt-4 sm:mt-0">
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Version 1.0.0</span>
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Made with ❤️ in Pakistan</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}