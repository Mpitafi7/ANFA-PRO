export function createPageUrl(page) {
  switch (page) {
    case 'Home':
      return '/';
    case 'Dashboard':
      return '/dashboard';
    case 'Blog':
      return '/blog';
    case 'Profile':
      return '/profile';
    case 'Privacy':
      return '/privacy';
    case 'AdminPanel':
      return '/admin';
    default:
      return '/';
  }
}

// Get current domain for live URLs
const getCurrentDomain = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:5174'; // fallback for SSR
};

// Create live URL based on current domain
export const createLiveUrl = (shortCode) => {
  const domain = getCurrentDomain();
  return `${domain}/${shortCode}`;
}; 