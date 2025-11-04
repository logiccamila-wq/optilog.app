import { HTMLAttributes } from 'react';

export interface LoadingSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
  count?: number;
}

export function LoadingSkeleton({ variant = 'text', width, height, animation = 'pulse', count = 1, className = '', style, ...props }: LoadingSkeletonProps) {
  const baseClasses = 'bg-gray-200';
  const variantClasses = { text: 'h-4 rounded', circular: 'rounded-full', rectangular: '', rounded: 'rounded-lg' };
  const animationClasses = { pulse: 'animate-pulse', wave: 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]', none: '' };
  const skeletonStyle = { width: typeof width === 'number' ? `${width}px` : width, height: typeof height === 'number' ? `${height}px` : height || (variant === 'text' ? '1rem' : undefined), ...style };
  const skeletonClasses = `${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`;

  if (count > 1) {
    return <>{Array.from({ length: count }).map((_, i) => (<div key={i} className={`${skeletonClasses} ${i < count - 1 ? 'mb-2' : ''}`} style={skeletonStyle} aria-hidden="true" {...props} />))}</>;
  }

  return <div className={skeletonClasses} style={skeletonStyle} aria-hidden="true" {...props} />;
}

export default LoadingSkeleton;