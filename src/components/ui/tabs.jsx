import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

export const Tabs = TabsPrimitive.Root;

export const TabsList = React.forwardRef(({ className = '', ...props }, ref) => (
  <TabsPrimitive.List 
    ref={ref} 
    className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 dark:bg-gray-800 dark:text-gray-400 ${className}`}
    {...props} 
  />
));
TabsList.displayName = 'TabsList';

export const TabsTrigger = React.forwardRef(({ className = '', ...props }, ref) => (
  <TabsPrimitive.Trigger 
    ref={ref} 
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm dark:ring-offset-gray-950 dark:focus-visible:ring-gray-800 dark:data-[state=active]:bg-gray-950 dark:data-[state=active]:text-gray-50 ${className}`}
    {...props} 
  />
));
TabsTrigger.displayName = 'TabsTrigger';

export const TabsContent = React.forwardRef(({ className = '', ...props }, ref) => (
  <TabsPrimitive.Content 
    ref={ref} 
    className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-800 ${className}`}
    {...props} 
  />
));
TabsContent.displayName = 'TabsContent'; 