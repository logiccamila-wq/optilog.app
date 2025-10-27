'use client';
import React from 'react';
import { useTheme } from '../../app/providers/ThemeProvider';

export default function Table({ columns, data }: { columns: string[]; data: any[] }) {
  const { effectiveMode } = useTheme();
  const isDark = effectiveMode === 'dark';
  
  const styles = {
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const,
      background: isDark ? '#1a1a1a' : '#ffffff',
      borderRadius: '8px',
      overflow: 'hidden'
    },
    th: {
      textAlign: 'left' as const,
      borderBottom: `1px solid ${isDark ? '#333' : '#ddd'}`,
      padding: '12px',
      background: isDark ? '#242424' : '#f5f5f5',
      color: isDark ? '#ffffff' : '#000000'
    },
    tr: {
      backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
      transition: 'background-color 0.2s'
    },
    trHover: {
      backgroundColor: isDark ? '#242424' : '#f5f5f5'
    },
    td: {
      borderBottom: `1px solid ${isDark ? '#333' : '#eee'}`,
      padding: '12px',
      color: isDark ? '#ffffff' : '#000000'
    }
  };
  
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col} style={styles.th}>
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr
            key={idx}
            style={styles.tr}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, styles.trHover);
            }}
            onMouseLeave={(e) => {
              Object.assign(e.currentTarget.style, styles.tr);
            }}
          >
            {columns.map((col) => (
              <td key={col} style={styles.td}>
                {String(row[col] ?? '')}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
