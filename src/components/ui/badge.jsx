import React from 'react';

export function Badge({ children, className = '', variant = 'default', ...props }) {
  let base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';
  
  let variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
    outline: 'text-foreground',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-0',
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-0',
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-0',
  };
  
  return (
    <span className={`${base} ${variants[variant] || variants.default} ${className}`} {...props}>
      {children}
    </span>
  );
} 