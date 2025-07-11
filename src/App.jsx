import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout.jsx';
import Home from './Pages/Home.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import Blog from './Pages/Blog.jsx';
import Profile from './Pages/Profile.jsx';
import PrivacyPolicy from './Pages/PrivacyPolicy.jsx';
import TermsOfService from './Pages/TermsOfService.jsx';
import RedirectHandler from './components/RedirectHandler.jsx';
import { auth } from './firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import Link from './entities/Link.js';
import Pricing from './Pages/Pricing.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Preload recently visited links from sessionStorage
    const preloadRecentLinks = () => {
      try {
        const recentLinks = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && key.startsWith('redirect_')) {
            const shortCode = key.replace('redirect_', '');
            recentLinks.push(shortCode);
          }
        }
        
        // Preload first few recent links
        recentLinks.slice(0, 5).forEach(shortCode => {
          Link.getByShortCode(shortCode).catch(console.error);
        });
      } catch (error) {
        console.error('Error preloading links:', error);
      }
    };

    // Preload after a short delay to not block initial load
    setTimeout(preloadRecentLinks, 1000);

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
    <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/blog" element={<Layout><Blog /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/privacy" element={<Layout><PrivacyPolicy /></Layout>} />
        <Route path="/terms" element={<Layout><TermsOfService /></Layout>} />
        <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
        <Route path="/:shortCode" element={<RedirectHandler />} />
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Router>
  );
} 

export default App; 