import React from 'react';

export function Card({ className = '', ...props }) {
  return (
    <div 
      className={`rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm ${className}`} 
      {...props} 
    />
  );
}

export function CardContent({ className = '', ...props }) {
  return <div className={`p-6 ${className}`} {...props} />;
}

export function CardHeader({ className = '', ...props }) {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 border-b border-gray-200 dark:border-gray-700 ${className}`} {...props} />
  );
}

export function CardTitle({ className = '', ...props }) {
  return (
    <h3 className={`text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-white ${className}`} {...props} />
  );
} 