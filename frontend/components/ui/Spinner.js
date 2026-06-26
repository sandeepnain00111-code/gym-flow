import React from 'react';

export default function Spinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-t-emerald-500 border-r-transparent border-b-emerald-800 border-l-transparent animate-spin`}
      />
    </div>
  );
}
