import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../Layout.jsx";
import Home from "../Pages/Home.jsx";
import Dashboard from "../Pages/Dashboard.jsx";
import Blog from "../Pages/Blog.jsx";
import Privacy from "../Privacy.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import "./index.css";

const routes = [
  { path: "/", element: <Home />, name: "Home" },
  { path: "/dashboard", element: <ProtectedRoute><Dashboard /></ProtectedRoute>, name: "Dashboard" },
  { path: "/blog", element: <Blog />, name: "Blog" },
  { path: "/privacy", element: <Privacy />, name: "Privacy" },
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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <Layout currentPageName={route.name}>{route.element}</Layout>
            }
          />
        ))}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
); 