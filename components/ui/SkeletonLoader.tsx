import React from 'react';

interface SkeletonLoaderProps {
  variant?: 'table' | 'card' | 'list' | 'text';
  rows?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ variant = 'text', rows = 3 }) => {
  if (variant === 'table') {
    return (
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
        ))}
      </div>
    );
  }

  // Default text variant
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
      ))}
    </div>
  );
};

export default SkeletonLoader;
