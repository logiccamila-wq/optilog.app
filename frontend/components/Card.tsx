'use client';
import React from 'react';
import { useTheme } from '../../app/providers/ThemeProvider';

export default function Card({ title, value }: { title: string; value: number | string }) {
  const { effectiveMode } = useTheme();
  const isDark = effectiveMode === 'dark';

  const styles = {
    card: {
      border: `1px solid ${isDark ? '#333' : '#ddd'}`,
      borderRadius: '8px',
      padding: '1.25rem',
      background: isDark ? '#1a1a1a' : '#ffffff',
      color: isDark ? '#ffffff' : '#000000',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      boxShadow: isDark 
        ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
        : '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    title: {
      marginTop: 0,
      marginBottom: '0.5rem',
      color: isDark ? '#9ca3af' : '#4b5563',
      fontSize: '0.875rem',
      fontWeight: 500
    },
    value: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: isDark ? '#ffffff' : '#111827'
    }
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{title}</h3>
      <div style={styles.value}>{String(value)}</div>
    </div>
  );
}
