import React from 'react';
import { useTheme } from '@/app/providers/ThemeProvider';
import { lightColors, darkColors } from '@/types/theme';
import type { Colors } from '@/types/theme';
import type { KPI } from '@/types/system';

interface KpiCardProps {
  kpi: KPI;
  showTrend?: boolean;
  showTarget?: boolean;
  className?: string;
}

export function KpiCard({ 
  kpi, 
  showTrend = true, 
  showTarget = true,
  className = ''
}: KpiCardProps) {
  const { effectiveMode } = useTheme();
  const colors: Colors = effectiveMode === 'dark' ? darkColors : lightColors;

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      case 'stable':
        return '→';
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return '#22c55e';
      case 'down':
        return '#ef4444';
      case 'stable':
        return colors.textMuted;
    }
  };

  const getProgressColor = (value: number, target: number) => {
    const ratio = value / target;
    if (ratio >= 1) return '#22c55e';
    if (ratio >= 0.8) return '#eab308';
    return '#ef4444';
  };

  return (
    <div className={`kpi-card ${className}`}>
      <div className="kpi-header">
        <h3>{kpi.name}</h3>
        {showTrend && (
          <div 
            className="trend"
            style={{ color: getTrendColor(kpi.trend) }}
          >
            {getTrendIcon(kpi.trend)}
            {((kpi.value / kpi.target - 1) * 100).toFixed(1)}%
          </div>
        )}
      </div>

      <div className="kpi-value">
        {kpi.value.toFixed(2)} <span className="unit">{kpi.unit}</span>
      </div>

      {showTarget && (
        <div className="target-section">
          <div className="target-bar">
            <div 
              className="progress"
              style={{
                width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%`,
                backgroundColor: getProgressColor(kpi.value, kpi.target)
              }}
            />
          </div>
          <div className="target-value">
            Meta: {kpi.target} {kpi.unit}
          </div>
        </div>
      )}

      <style jsx>{`
        .kpi-card {
          padding: 16px;
          background: ${colors.surface};
          border: 1px solid ${colors.border};
          border-radius: 8px;
          transition: all 0.2s;
        }

        .kpi-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }

        .kpi-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        h3 {
          margin: 0;
          font-size: 0.875rem;
          color: ${colors.textMuted};
          font-weight: 500;
        }

        .trend {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .kpi-value {
          font-size: 1.5rem;
          font-weight: 600;
          color: ${colors.text};
          margin-bottom: 12px;
        }

        .unit {
          font-size: 0.875rem;
          color: ${colors.textMuted};
          font-weight: 400;
        }

        .target-section {
          margin-top: 8px;
        }

        .target-bar {
          height: 4px;
          background: ${colors.border};
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 4px;
        }

        .progress {
          height: 100%;
          transition: width 0.3s ease;
        }

        .target-value {
          font-size: 0.75rem;
          color: ${colors.textMuted};
        }
      `}</style>
    </div>
  );
}