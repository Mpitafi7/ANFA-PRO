import React, { Suspense } from 'react';

// Lazy load heavy components
export const LazyDashboard = React.lazy(() => import('../Pages/Dashboard.jsx'));
export const LazyBlog = React.lazy(() => import('../Pages/Blog.jsx'));
export const LazyProfileModal = React.lazy(() => import('./ProfileModal.jsx'));
export const LazyHelpChat = React.lazy(() => import('./HelpChat.jsx'));

// Loading fallback component
export const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

// Lazy component wrapper
export const LazyComponent = ({ component: Component, ...props }) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component {...props} />
  </Suspense>
); 