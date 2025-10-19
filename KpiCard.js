const KpiCard = ({ title, value, change, changeType = 'increase' }) => {
  const changeColor = changeType === 'increase' ? 'text-[var(--color-success,#16a34a)]' : 'text-[var(--color-danger,#ef4444)]';
  const arrow = changeType === 'increase' ? '↑' : '↓';

  return (
    <div className="bg-[var(--color-secondary)] text-[var(--color-text)] p-6 rounded-[var(--radius)] shadow-md border border-[var(--color-border)]">
      <h3 className="text-sm font-medium opacity-70">{title}</h3>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      {change && (
        <p className={`mt-1 text-sm ${changeColor}`}>
          <span className="font-semibold">
            {arrow} {change}
          </span>
          <span className="ml-1 opacity-70">vs. mês anterior</span>
        </p>
      )}
    </div>
  );
};

export default KpiCard;
