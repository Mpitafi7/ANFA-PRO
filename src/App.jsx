import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout.jsx";
import Home from "./Pages/Home.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import Blog from "./Pages/Blog.jsx";
import Privacy from "./Privacy.jsx";
import TermsOfService from "./Pages/TermsOfService.jsx";
import PrivacyPolicy from "./Pages/PrivacyPolicy.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const routes = [
  { path: "/", element: <Home />, name: "Home" },
  { path: "/dashboard", element: <ProtectedRoute><Dashboard /></ProtectedRoute>, name: "Dashboard" },
  { path: "/blog", element: <Blog />, name: "Blog" },
  { path: "/terms", element: <TermsOfService />, name: "Terms of Service" },
  { path: "/privacy", element: <Privacy />, name: "Privacy" },
  { path: "/privacy-policy", element: <PrivacyPolicy />, name: "Privacy Policy" },
];

export default function App() {
  return (
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
  );
} 