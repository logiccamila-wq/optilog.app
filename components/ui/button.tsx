'use client';
import { cn } from '@/lib/utils';
import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
};

export default function Button({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-lg shadow-sm hover:shadow-md transition-colors transition-shadow focus:outline-none disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    default: 'bg-[var(--color-brand)] text-[var(--color-on-brand)] hover:opacity-90 border border-transparent',
    outline: 'border border-[var(--color-brand)] text-[var(--color-brand)] hover:bg-[var(--color-secondary)]',
    ghost: 'bg-transparent text-[var(--color-text)] hover:bg-[var(--color-secondary)] border border-transparent',
  } as const;
  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  } as const;
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}
