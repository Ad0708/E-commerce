import React from 'react';

interface LoaderProps {
  mode?: 'screen' | 'container';
  size?: 'sm' | 'md' | 'lg';
}

export default function Loader({ mode = 'container', size = 'md' }: LoaderProps) {
  // Sizing map handles the dimensions of the container
  const sizeMap = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-20 w-20',
  };

  // Border thickness map to keep the scale looking right at different sizes
  const borderMap = {
    sm: 'border-2',
    md: 'border-[3px]',
    lg: 'border-4',
  };

  const layoutClass = mode === 'screen' 
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md dark:bg-zinc-950/80'
    : 'flex min-h-[200px] w-full items-center justify-center p-8';

  return (
    <div className={layoutClass}>
      {/* 1. The parent container now holds the actual width and height */}
      <div className={`relative ${sizeMap[size]}`}>
        
        {/* Modern Design Element 1: The Ambient Outer Glow */}
        <div 
          className={`absolute inset-0 rounded-full border-indigo-500/30 blur-[4px] animate-pulse ${borderMap[size]}`} 
        />
        
        {/* Modern Design Element 2: The Subtle Background Track */}
        <div 
          className={`absolute inset-0 rounded-full border-slate-100 dark:border-zinc-800 ${borderMap[size]}`} 
        />
        
        {/* Modern Design Element 3: The High-End Spinning Accent Line */}
        <div
          className={`
            absolute 
            inset-0 
            rounded-full 
            border-transparent 
            border-t-indigo-600 
            border-r-purple-500 
            dark:border-t-indigo-400 
            dark:border-r-purple-400 
            animate-spin
            ${borderMap[size]}
          `}
          style={{ 
            animationDuration: '0.75s',
            animationTimingFunction: 'cubic-bezier(0.4, 0.1, 0.2, 1)' 
          }}
        />
        
      </div>
    </div>
  );
}