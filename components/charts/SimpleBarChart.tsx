'use client';
import React from 'react';

export default function SimpleBarChart({
  labels,
  values,
  colors,
}: {
  labels: string[];
  values: number[];
  colors?: string[];
}) {
  const max = Math.max(...values, 1);
  const brand = 'var(--color-brand)';
  const text = 'var(--color-text)';
  const secondary = 'var(--color-secondary)';
  const radius = 'var(--radius)';
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {labels.map((l, i) => {
        const v = values[i] ?? 0;
        const pct = Math.round((v / max) * 100);
        return (
          <div key={l} style={{ display: 'grid', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <small style={{ color: text, opacity: 0.8 }}>{l}</small>
              <small style={{ color: text, opacity: 0.7 }}>{v.toFixed(2)}</small>
            </div>
            <div style={{ background: secondary, borderRadius: radius, height: 10, overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: 10, background: colors?.[i] || brand }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
