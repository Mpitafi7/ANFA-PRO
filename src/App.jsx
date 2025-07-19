import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeContext.jsx";
import { AccessibilityProvider } from "./components/AccessibilityProvider.jsx";
import Layout from "./Layout.jsx";
import Home from "./Pages/Home.jsx";
import Pricing from "./Pages/Pricing.jsx";
import PublicProfile from "./Pages/PublicProfile.jsx";
import { LazyDashboard, LazyBlog, LoadingFallback } from "./components/LazyComponents.jsx";
import NotFound from "./Pages/NotFound.jsx";
// import { initializeConnectionMonitoring } from "./utils/firebaseConnection.js";

// Initialize Firebase connection monitoring
// Temporarily disabled to prevent connection errors
// if (typeof window !== 'undefined') {
//   initializeConnectionMonitoring();
// }

function App() {
  return (
    <React.StrictMode>
      <AccessibilityProvider>
        <ThemeProvider>
          <Router>
            <Layout>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/dashboard" element={<LazyDashboard />} />
                  <Route path="/blog" element={<LazyBlog />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/u/:publicId" element={<PublicProfile />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </Layout>
          </Router>
        </ThemeProvider>
      </AccessibilityProvider>
    </React.StrictMode>
  );
} 

export default App; 