'use client';
import React from 'react';

export default function Table({ columns, data }: { columns: string[]; data: any[] }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col}
              style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '8px' }}
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {columns.map((col) => (
              <td key={col} style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
                {String(row[col] ?? '')}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
