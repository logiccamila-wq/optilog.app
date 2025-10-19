'use client';
import { cn } from '@/lib/utils';
import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
  error?: string;
};

export default function Input({ className, label, helperText, error, ...props }: InputProps) {
  return (
    <div className={cn('grid gap-1', className)}>
      {label && <label className="text-sm text-slate-300">{label}</label>}
      <input
        className={cn(
          'h-10 rounded-md border border-border bg-[#0b1320] px-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0E539A] focus:border-transparent',
          error && 'border-red-500'
        )}
        {...props}
      />
      {helperText && !error && <span className="text-xs text-slate-400">{helperText}</span>}
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
