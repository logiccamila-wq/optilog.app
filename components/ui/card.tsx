import { cn } from '@/lib/utils';
import React from 'react';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string;
  description?: string;
};

export default function Card({ className, children, title, description, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-secondary)] p-4 text-[var(--color-text)]',
        className
      )}
      {...props}
    >
      {(title || description) && (
        <div className="mb-3">
          {title && <h3 className="text-lg font-semibold leading-none tracking-tight">{title}</h3>}
          {description && <p className="text-sm opacity-70">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
