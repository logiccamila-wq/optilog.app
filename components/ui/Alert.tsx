'use client';

import React from 'react';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  icon,
  onClose,
  className = '',
}) => {
  const getDefaultIcon = () => {
    switch (variant) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '✕';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  const getRole = () => {
    if (variant === 'error') return 'alert';
    return 'status';
  };

  const displayIcon = icon || getDefaultIcon();

  return (
    <div
      className={`alert alert--${variant} ${className}`}
      role={getRole()}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
    >
      <div className="alert__icon" aria-hidden="true">
        {displayIcon}
      </div>
      
      <div className="alert__content">
        {title && <div className="alert__title">{title}</div>}
        <div className="alert__message">{children}</div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="alert__close"
          aria-label="Fechar alerta"
          type="button"
        >
          ✕
        </button>
      )}

      <style jsx>{`
        .alert {
          display: flex;
          gap: var(--spacing-3);
          padding: var(--spacing-4);
          border-radius: var(--radius-md);
          border-left: 4px solid;
          position: relative;
        }

        .alert--info {
          background-color: #E3F2FD;
          border-left-color: #2196F3;
          color: #0D47A1;
        }

        .alert--success {
          background-color: #E8F5E9;
          border-left-color: #4CAF50;
          color: #1B5E20;
        }

        .alert--warning {
          background-color: #FFF3E0;
          border-left-color: #FF9800;
          color: #E65100;
        }

        .alert--error {
          background-color: #FFEBEE;
          border-left-color: #F44336;
          color: #B71C1C;
        }

        .alert__icon {
          font-size: 20px;
          line-height: 1;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          font-weight: var(--font-weight-bold);
        }

        .alert__content {
          flex: 1;
          min-width: 0;
        }

        .alert__title {
          font-weight: var(--font-weight-semibold);
          font-size: var(--font-size-base);
          margin-bottom: var(--spacing-1);
          line-height: var(--line-height-tight);
        }

        .alert__message {
          font-size: var(--font-size-sm);
          line-height: var(--line-height-normal);
        }

        .alert__close {
          background: none;
          border: none;
          padding: var(--spacing-1);
          cursor: pointer;
          font-size: 18px;
          line-height: 1;
          color: currentColor;
          opacity: 0.7;
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
          transition: all 0.2s ease;
        }

        .alert__close:hover {
          opacity: 1;
          background-color: rgba(0, 0, 0, 0.05);
        }

        .alert__close:focus-visible {
          outline: 2px solid currentColor;
          outline-offset: 2px;
          opacity: 1;
        }

        @media (max-width: 768px) {
          .alert {
            padding: var(--spacing-3);
            gap: var(--spacing-2);
          }

          .alert__icon {
            width: 20px;
            height: 20px;
            font-size: 16px;
          }

          .alert__title {
            font-size: var(--font-size-sm);
          }

          .alert__message {
            font-size: var(--font-size-xs);
          }
        }
      `}</style>
    </div>
  );
};
