'use client';
import React from 'react';

export default function Card({ title, value }: { title: string; value: number | string }) {
  return (
    <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: '1rem', background: 'var(--color-secondary)', color: 'var(--color-text)' }}>
      <h3 style={{ marginTop: 0, opacity: 0.7 }}>{title}</h3>
      <div style={{ fontSize: 24, fontWeight: 'bold' }}>{String(value)}</div>
    </div>
  );
}
