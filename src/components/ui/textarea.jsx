import React from 'react';

export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none ${className}`}
      {...props}
    />
  );
} 