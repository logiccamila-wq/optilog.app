'use client';

import React from 'react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  className?: string;
}

/**
 * EmptyState Component
 * 
 * Displays a friendly message when there's no data to show.
 * Follows accessibility best practices and design system tokens.
 * 
 * @example
 * ```tsx
 * <EmptyState
 *   icon={<PackageIcon />}
 *   title="Nenhuma rota encontrada"
 *   description="Comece criando sua primeira rota de entrega"
 *   action={{
 *     label: "Criar Rota",
 *     onClick: () => router.push('/rotas/nova')
 *   }}
 * />
 * ```
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`empty-state ${className}`}
      role="status"
      aria-live="polite"
    >
      {icon && (
        <div className="empty-state__icon" aria-hidden="true">
          {icon}
        </div>
      )}
      
      <h3 className="empty-state__title">{title}</h3>
      
      {description && (
        <p className="empty-state__description">{description}</p>
      )}
      
      {action && (
        <button
          onClick={action.onClick}
          className={`empty-state__button empty-state__button--${action.variant || 'primary'}`}
          type="button"
        >
          {action.label}
        </button>
      )}

      <style jsx>{`
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: var(--spacing-8) var(--spacing-4);
          min-height: 320px;
        }

        .empty-state__icon {
          width: 80px;
          height: 80px;
          margin-bottom: var(--spacing-4);
          color: var(--color-text-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
        }

        .empty-state__icon :global(svg) {
          width: 100%;
          height: 100%;
        }

        .empty-state__title {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-semibold);
          color: var(--color-text-primary);
          margin: 0 0 var(--spacing-2) 0;
          line-height: var(--line-height-tight);
        }

        .empty-state__description {
          font-size: var(--font-size-base);
          color: var(--color-text-secondary);
          margin: 0 0 var(--spacing-6) 0;
          max-width: 400px;
          line-height: var(--line-height-normal);
        }

        .empty-state__button {
          padding: var(--spacing-3) var(--spacing-6);
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-medium);
          border-radius: var(--radius-md);
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .empty-state__button--primary {
          background-color: var(--color-primary);
          color: white;
        }

        .empty-state__button--primary:hover {
          background-color: var(--color-primary-dark);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .empty-state__button--primary:active {
          transform: translateY(0);
        }

        .empty-state__button--secondary {
          background-color: var(--color-background-tertiary);
          color: var(--color-text-primary);
        }

        .empty-state__button--secondary:hover {
          background-color: var(--color-background-hover);
        }

        .empty-state__button:focus-visible {
          outline: 2px solid var(--color-primary);
          outline-offset: 2px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .empty-state {
            padding: var(--spacing-6) var(--spacing-3);
            min-height: 280px;
          }

          .empty-state__icon {
            width: 64px;
            height: 64px;
            font-size: 40px;
          }

          .empty-state__title {
            font-size: var(--font-size-lg);
          }

          .empty-state__description {
            font-size: var(--font-size-sm);
          }
        }
      `}</style>
    </div>
  );
};
