import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "./components/ThemeContext.jsx";

// Lazy load components for better performance
const Layout = React.lazy(() => import("./Layout.jsx"));
const Home = React.lazy(() => import("./Pages/Home.jsx"));
const Blog = React.lazy(() => import("./Pages/Blog.jsx"));
const Dashboard = React.lazy(() => import("./Pages/Dashboard.jsx"));
const TermsOfService = React.lazy(() => import("./Pages/TermsOfService.jsx"));
const PrivacyPolicy = React.lazy(() => import("./Pages/PrivacyPolicy.jsx"));
const Privacy = React.lazy(() => import("./Privacy.jsx"));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <React.Suspense fallback={<LoadingSpinner />}>
          <App />
        </React.Suspense>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);

console.log("ANFA Pro - React app starting...");

const routes = [
  { path: "/", element: <Home />, name: "Home" },
  { path: "/dashboard", element: <Dashboard />, name: "Dashboard" },
  { path: "/blog", element: <Blog />, name: "Blog" },
  { path: "/privacy", element: <Privacy />, name: "Privacy" },
  { path: "/terms", element: <TermsOfService />, name: "Terms of Service" },
  { path: "/privacy-policy", element: <PrivacyPolicy />, name: "Privacy Policy" },
];

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Handle PWA install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // Show install button if needed
  const installButton = document.getElementById('install-button');
  if (installButton) {
    installButton.style.display = 'block';
    installButton.addEventListener('click', () => {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
        installButton.style.display = 'none';
      });
    });
  }
}); 