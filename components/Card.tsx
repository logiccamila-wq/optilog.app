'use client';
import React from 'react';

export default function Card({ title, value }: { title: string; value: number | string }) {
  return (
    <div
      style={{
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius)',
        padding: '1rem',
        background: 'var(--color-secondary)',
        color: 'var(--color-text)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
        ':hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
        },
        ':active': {
          transform: 'translateY(0)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }
      }}
    >
      <h3 style={{ marginTop: 0, opacity: 0.7, animation: 'fadeIn 0.5s ease-out' }}>{title}</h3>
      <div style={{ fontSize: 24, fontWeight: 'bold', animation: 'fadeIn 0.5s ease-out' }}>{String(value)}</div>
    </div>
  );
}
