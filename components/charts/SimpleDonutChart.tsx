'use client';
import React, { useMemo } from 'react';

export default function SimpleDonutChart({
  labels,
  values,
  colors,
}: {
  labels: string[];
  values: number[];
  colors?: string[];
}) {
  const total = values.reduce((a, b) => a + b, 0) || 1;
  const size = 120;
  const stroke = 16;
  const radius = (size - stroke) / 2;
  const center = size / 2;

  const brandHex =
    typeof window !== 'undefined'
      ? getComputedStyle(document.documentElement).getPropertyValue('--color-brand').trim() ||
        '#1976d2'
      : '#1976d2';
  const text = 'var(--color-text)';
  const secondary = 'var(--color-secondary)';

  const hexToRgb = (hex: string) => {
    const h = hex.replace('#', '');
    const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  };
  const rgbToHex = (r: number, g: number, b: number) =>
    '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
  const lighten = (hex: string, amt: number) => {
    const { r, g, b } = hexToRgb(hex);
    const lr = Math.min(255, Math.round(r + (255 - r) * amt));
    const lg = Math.min(255, Math.round(g + (255 - g) * amt));
    const lb = Math.min(255, Math.round(b + (255 - b) * amt));
    return rgbToHex(lr, lg, lb);
  };
  const darken = (hex: string, amt: number) => {
    const { r, g, b } = hexToRgb(hex);
    const lr = Math.max(0, Math.round(r * (1 - amt)));
    const lg = Math.max(0, Math.round(g * (1 - amt)));
    const lb = Math.max(0, Math.round(b * (1 - amt)));
    return rgbToHex(lr, lg, lb);
  };

  const palette = useMemo(
    () => [brandHex, lighten(brandHex, 0.25), lighten(brandHex, 0.45), darken(brandHex, 0.15)],
    [brandHex]
  );

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
    return { d, color: colors?.[i] || palette[i % 4] };
  });

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={secondary}
          strokeWidth={stroke}
          fill="none"
        />
        {arcs.map((a, i) => (
          <path key={i} d={a.d} stroke={a.color} strokeWidth={stroke} fill="none" />
        ))}
      </svg>
      <div style={{ display: 'grid', gap: 6 }}>
        {labels.map((l, i) => (
          <div key={l} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span
              style={{
                width: 12,
                height: 12,
                background: colors?.[i] || palette[i % 4],
              }}
            />
            <small style={{ color: text }}>
              {l}: {values[i]?.toFixed(2) ?? '0.00'}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}
