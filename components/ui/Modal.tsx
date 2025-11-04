'use client';

import React, { useEffect, useRef } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  closeOnOverlayClick?: boolean;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  className = '',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div 
        ref={modalRef}
        className={`modal modal--${size} ${className}`}
        tabIndex={-1}
      >
        {title && (
          <div className="modal__header">
            <h2 id="modal-title" className="modal__title">{title}</h2>
            <button
              onClick={onClose}
              className="modal__close"
              aria-label="Fechar modal"
              type="button"
            >
              ✕
            </button>
          </div>
        )}

        <div className="modal__body">
          {children}
        </div>

        {footer && (
          <div className="modal__footer">
            {footer}
          </div>
        )}

        <style jsx>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: var(--spacing-4);
            animation: fadeIn 0.2s ease;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .modal {
            background-color: var(--color-background-primary);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-xl);
            display: flex;
            flex-direction: column;
            max-height: 90vh;
            animation: slideUp 0.3s ease;
            outline: none;
          }

          @keyframes slideUp {
            from {
              transform: translateY(20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          .modal--sm { width: 100%; max-width: 400px; }
          .modal--md { width: 100%; max-width: 600px; }
          .modal--lg { width: 100%; max-width: 900px; }
          .modal--full { width: 95vw; max-width: none; height: 90vh; }

          .modal__header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: var(--spacing-6) var(--spacing-6) var(--spacing-4);
            border-bottom: 1px solid var(--color-border);
          }

          .modal__title {
            font-size: var(--font-size-xl);
            font-weight: var(--font-weight-semibold);
            color: var(--color-text-primary);
            margin: 0;
            line-height: var(--line-height-tight);
          }

          .modal__close {
            background: none;
            border: none;
            padding: var(--spacing-2);
            cursor: pointer;
            font-size: 20px;
            line-height: 1;
            color: var(--color-text-secondary);
            border-radius: var(--radius-sm);
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .modal__close:hover {
            background-color: var(--color-background-hover);
            color: var(--color-text-primary);
          }

          .modal__close:focus-visible {
            outline: 2px solid var(--color-primary);
            outline-offset: 2px;
          }

          .modal__body {
            padding: var(--spacing-6);
            overflow-y: auto;
            flex: 1;
          }

          .modal__footer {
            padding: var(--spacing-4) var(--spacing-6) var(--spacing-6);
            border-top: 1px solid var(--color-border);
            display: flex;
            gap: var(--spacing-3);
            justify-content: flex-end;
          }

          @media (max-width: 768px) {
            .modal-overlay { padding: 0; }
            .modal {
              width: 100%;
              height: 100%;
              max-height: 100vh;
              border-radius: 0;
            }
            .modal--sm, .modal--md, .modal--lg { max-width: none; }
            .modal__header, .modal__body, .modal__footer {
              padding-left: var(--spacing-4);
              padding-right: var(--spacing-4);
            }
            .modal__title { font-size: var(--font-size-lg); }
          }
        `}</style>
      </div>
    </div>
  );
};

Commit message: feat: add Modal component with accessibility and animations
