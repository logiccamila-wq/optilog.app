'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface TooltipProps {
  children: React.ReactElement;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  delay = 200,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const tooltipId = useRef(`tooltip-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const childWithProps = React.cloneElement(children, {
    onMouseEnter: (e: React.MouseEvent) => {
      showTooltip();
      children.props.onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      hideTooltip();
      children.props.onMouseLeave?.(e);
    },
    onFocus: (e: React.FocusEvent) => {
      showTooltip();
      children.props.onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent) => {
      hideTooltip();
      children.props.onBlur?.(e);
    },
    'aria-describedby': isVisible ? tooltipId.current : undefined,
  });

  return (
    <div className="tooltip-wrapper">
      {childWithProps}
      {isVisible && (
        <div
          id={tooltipId.current}
          role="tooltip"
          className={`tooltip tooltip--${position} ${className}`}
        >
          <div className="tooltip__content">{content}</div>
          <div className="tooltip__arrow" />
        </div>
      )}

      <style jsx>{`
        .tooltip-wrapper {
          position: relative;
          display: inline-block;
        }

        .tooltip {
          position: absolute;
          z-index: 9999;
          padding: var(--spacing-2) var(--spacing-3);
          background-color: #1F2937;
          color: white;
          font-size: var(--font-size-sm);
          line-height: var(--line-height-normal);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          white-space: nowrap;
          animation: tooltipFadeIn 0.15s ease;
          pointer-events: none;
        }

        @keyframes tooltipFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .tooltip__content {
          position: relative;
          z-index: 2;
        }

        .tooltip__arrow {
          position: absolute;
          width: 8px;
          height: 8px;
          background-color: #1F2937;
          transform: rotate(45deg);
          z-index: 1;
        }

        .tooltip--top {
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
        }

        .tooltip--top .tooltip__arrow {
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
        }

        .tooltip--bottom {
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
        }

        .tooltip--bottom .tooltip__arrow {
          top: -4px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
        }

        .tooltip--left {
          right: calc(100% + 8px);
          top: 50%;
          transform: translateY(-50%);
        }

        .tooltip--left .tooltip__arrow {
          right: -4px;
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
        }

        .tooltip--right {
          left: calc(100% + 8px);
          top: 50%;
          transform: translateY(-50%);
        }

        .tooltip--right .tooltip__arrow {
          left: -4px;
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
        }

        @media (hover: none) {
          .tooltip {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};
