import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const LoadingSpinner = ({ size = 'md', className = '', message = 'Processing...' }) => {
  const sizes = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-16 w-16 border-4'
  };

  return (
    <div className={twMerge(clsx('flex flex-col items-center justify-center space-y-4 p-8', className))}>
      <div className={twMerge(clsx(
        'animate-spin rounded-full border-blue-100 border-t-blue-600',
        sizes[size]
      ))}></div>
      {message && <p className="text-sm font-medium text-gray-500 animate-pulse">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
