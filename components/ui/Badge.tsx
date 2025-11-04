'use client';

import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) => {
  return (
    <span className={`badge badge--${variant} badge--${size} ${className}`}> 
      {dot && <span className="badge__dot" aria-hidden="true" />}
      <span className="badge__text">{children}</span>

      <style jsx>{`
        .badge {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-1);
          font-weight: var(--font-weight-medium);
          border-radius: var(--radius-full);
          white-space: nowrap;
          line-height: 1;
          vertical-align: middle;
        }

        .badge--sm {
          padding: 2px 8px;
          font-size: var(--font-size-xs);
        }

        .badge--md {
          padding: 4px 12px;
          font-size: var(--font-size-sm);
        }

        .badge--lg {
          padding: 6px 16px;
          font-size: var(--font-size-base);
        }

        .badge--default {
          background-color: var(--color-background-tertiary);
          color: var(--color-text-secondary);
        }

        .badge--primary {
          background-color: #E3F2FD;
          color: #1976D2;
        }

        .badge--success {
          background-color: #E8F5E9;
          color: #2E7D32;
        }

        .badge--warning {
          background-color: #FFF3E0;
          color: #F57C00;
        }

        .badge--error {
          background-color: #FFEBEE;
          color: #C62828;
        }

        .badge--info {
          background-color: #E1F5FE;
          color: #0277BD;
        }

        .badge__dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: currentColor;
          flex-shrink: 0;
        }

        .badge--sm .badge__dot {
          width: 4px;
          height: 4px;
        }

        .badge--lg .badge__dot {
          width: 8px;
          height: 8px;
        }

        .badge__text {
          line-height: 1;
        }

        @media (max-width: 768px) {
          .badge--lg {
            padding: 4px 12px;
            font-size: var(--font-size-sm);
          }
        }
      `}</style>
    </span>
  );
};