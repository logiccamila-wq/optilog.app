import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number;
  trend: 'up' | 'down';
}

const KPICard: React.FC<KPICardProps> = ({ title, value, trend }) => {
  const trendIndicator = trend === 'up' ? (
    <TrendingUp color="green" />
  ) : (
    <TrendingDown color="red" />
  );

  return (
    <div className={`kpi-card ${trend}`}> 
      <h3>{title}</h3>
      <div className="kpi-value">{value}</div>
      <div className="trend-indicator">{trendIndicator}</div>
    </div>
  );
};

export default KPICard;