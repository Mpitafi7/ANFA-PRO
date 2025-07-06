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