"use client";
import React from 'react';

export default function SimpleDonutChart({ labels, values, colors }: { labels: string[]; values: number[]; colors?: string[] }) {
  const total = values.reduce((a, b) => a + b, 0) || 1;
  const size = 120;
  const stroke = 16;
  const radius = (size - stroke) / 2;
  const center = size / 2;
  let cumulative = 0;

  const arcs = values.map((v, i) => {
    const frac = v / total;
    const start = cumulative * 2 * Math.PI;
    cumulative += frac;
    const end = cumulative * 2 * Math.PI;
    const x1 = center + radius * Math.cos(start);
    const y1 = center + radius * Math.sin(start);
    const x2 = center + radius * Math.cos(end);
    const y2 = center + radius * Math.sin(end);
    const largeArc = end - start > Math.PI ? 1 : 0;
    const d = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
    return { d, color: colors?.[i] || ['#43a047', '#ffb300', '#e53935', '#1976d2'][i % 4] };
  });

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={center} cy={center} r={radius} stroke="#222" strokeWidth={stroke} fill="none" />
        {arcs.map((a, i) => (
          <path key={i} d={a.d} stroke={a.color} strokeWidth={stroke} fill="none" />
        ))}
      </svg>
      <div style={{ display: 'grid', gap: 6 }}>
        {labels.map((l, i) => (
          <div key={l} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ width: 12, height: 12, background: colors?.[i] || ['#43a047', '#ffb300', '#e53935', '#1976d2'][i % 4] }} />
            <small style={{ color: '#ddd' }}>{l}: {values[i]?.toFixed(2) ?? '0.00'}</small>
          </div>
        ))}
      </div>
    </div>
  );
}