import React from 'react';
import { useTheme } from '@/app/providers/ThemeProvider';
import { lightColors, darkColors } from '@/types/theme';
import type { Colors } from '@/types/theme';
import type { Alert } from '@/types/system';

interface AlertCardProps {
  alert: Alert;
  onAcknowledge?: (id: string) => void;
  onResolve?: (id: string) => void;
  className?: string;
}

export function AlertCard({
  alert,
  onAcknowledge,
  onResolve,
  className = ''
}: AlertCardProps) {
  const { effectiveMode } = useTheme();
  const colors: Colors = effectiveMode === 'dark' ? darkColors : lightColors;

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return { bg: '#fef2f2', border: '#ef4444', text: '#b91c1c' };
      case 'error':
        return { bg: '#fef2f2', border: '#f87171', text: '#b91c1c' };
      case 'warning':
        return { bg: '#fefce8', border: '#eab308', text: '#854d0e' };
      case 'info':
        return { bg: '#f0f9ff', border: '#0ea5e9', text: '#0369a1' };
    }
  };

  const colors = getSeverityColor(alert.severity);

  return (
    <div className={`alert-card ${className}`}>
      <div className="alert-header">
        <div className="alert-title">
          <div className="severity-indicator" />
          <h4>{alert.title}</h4>
        </div>
        <span className="alert-time">
          {new Date(alert.timestamp).toLocaleString()}
        </span>
      </div>

      <p className="alert-description">{alert.description}</p>

      <div className="alert-meta">
        <span className="alert-source">Fonte: {alert.source}</span>
        <span className="alert-status">Status: {alert.status}</span>
      </div>

      <div className="alert-actions">
        {alert.status === 'new' && onAcknowledge && (
          <button 
            className="btn-acknowledge"
            onClick={() => onAcknowledge(alert.id)}
          >
            Reconhecer
          </button>
        )}
        
        {(alert.status === 'new' || alert.status === 'acknowledged') && onResolve && (
          <button 
            className="btn-resolve"
            onClick={() => onResolve(alert.id)}
          >
            Resolver
          </button>
        )}
      </div>

      <style jsx>{`
        .alert-card {
          padding: 16px;
          background: ${colors.bg};
          border: 1px solid ${colors.border};
          border-radius: 8px;
          transition: all 0.2s;
        }

        .alert-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .alert-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .severity-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${colors.border};
        }

        h4 {
          margin: 0;
          font-size: 0.875rem;
          font-weight: 600;
          color: ${colors.text};
        }

        .alert-time {
          font-size: 0.75rem;
          color: ${colors.text}80;
        }

        .alert-description {
          margin: 0 0 12px;
          font-size: 0.875rem;
          color: ${colors.text};
          line-height: 1.4;
        }

        .alert-meta {
          display: flex;
          gap: 16px;
          margin-bottom: 12px;
          font-size: 0.75rem;
          color: ${colors.text}80;
        }

        .alert-actions {
          display: flex;
          gap: 8px;
        }

        .alert-actions button {
          padding: 4px 12px;
          border-radius: 4px;
          border: 1px solid;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-acknowledge {
          background: transparent;
          border-color: ${colors.text};
          color: ${colors.text};
        }

        .btn-acknowledge:hover {
          background: ${colors.text}10;
        }

        .btn-resolve {
          background: ${colors.text};
          border-color: ${colors.text};
          color: white;
        }

        .btn-resolve:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}