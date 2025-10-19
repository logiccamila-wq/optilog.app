'use client';
import React from 'react';

export default function Card({ title, value }: { title: string; value: number | string }) {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem', background: '#fff' }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <div style={{ fontSize: 24, fontWeight: 'bold' }}>{String(value)}</div>
    </div>
  );
}
