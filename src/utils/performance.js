// Performance monitoring utility
export const initPerformanceMonitoring = () => {
  // Monitor Core Web Vitals
  if ('PerformanceObserver' in window) {
    // First Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('FCP:', entry.startTime);
        if (entry.startTime > 2000) {
          console.warn('FCP is slow:', entry.startTime);
        }
      }
    }).observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('LCP:', entry.startTime);
        if (entry.startTime > 2500) {
          console.warn('LCP is slow:', entry.startTime);
        }
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Cumulative Layout Shift
    new PerformanceObserver((list) => {
      let cls = 0;
      for (const entry of list.getEntries()) {
        cls += entry.value;
      }
      console.log('CLS:', cls);
      if (cls > 0.1) {
        console.warn('CLS is poor:', cls);
      }
    }).observe({ entryTypes: ['layout-shift'] });

    // First Input Delay
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('FID:', entry.processingStart - entry.startTime);
        if (entry.processingStart - entry.startTime > 100) {
          console.warn('FID is slow:', entry.processingStart - entry.startTime);
        }
      }
    }).observe({ entryTypes: ['first-input'] });
  }

  // Monitor resource loading
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.initiatorType === 'script' && entry.duration > 1000) {
        console.warn('Slow script:', entry.name, entry.duration);
      }
    }
  });
  observer.observe({ entryTypes: ['resource'] });
};

// Preload critical resources
export const preloadCriticalResources = () => {
  const criticalResources = [
    '/src/components/ui/button.jsx',
    '/src/components/ui/input.jsx',
    '/src/components/Logo.jsx'
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    link.as = 'script';
    document.head.appendChild(link);
  });
};

// Optimize images
export const optimizeImages = () => {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.loading) {
      img.loading = 'lazy';
    }
    if (!img.decoding) {
      img.decoding = 'async';
    }
  });
}; 