"use client";
import React from 'react';

export default function SimpleBarChart({ labels, values, colors }: { labels: string[]; values: number[]; colors?: string[] }) {
  const max = Math.max(...values, 1);
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {labels.map((l, i) => {
        const v = values[i] ?? 0;
        const pct = Math.round((v / max) * 100);
        return (
          <div key={l} style={{ display: 'grid', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <small style={{ color: '#aaa' }}>{l}</small>
              <small style={{ color: '#ddd' }}>{v.toFixed(2)}</small>
            </div>
            <div style={{ background: '#222', borderRadius: 6, height: 10, overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: 10, background: colors?.[i] || '#1976d2' }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}