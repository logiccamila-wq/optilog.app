'use client';
import React, { useEffect, useMemo, useState } from 'react';

type Column = {
  field: string;
  headerName: string;
  flex?: number;
  width?: number;
  valueGetter?: (row: any) => any;
  valueFormatter?: (value: any, row?: any) => string | number | null;
};

type Props = {
  rows: any[];
  columns: Column[];
  height?: number | string;
  pageSizeOptions?: number[];
  density?: 'compact' | 'standard' | 'comfortable';
  exportFileName?: string;
};

export default function GridLite({
  rows,
  columns,
  height = 420,
  pageSizeOptions = [10, 25, 50],
  density = 'compact',
  exportFileName = 'export',
}: Props) {
  const [xlsxReady, setXlsxReady] = useState<boolean>(false);

  useEffect(() => {
    // Check if xlsx is available (optional dependency)
    import('xlsx').then(() => setXlsxReady(true)).catch(() => setXlsxReady(false));
  }, []);

  const processedRows = useMemo(() => {
    return rows.map((r, idx) => ({ id: r.id ?? idx, ...r }));
  }, [rows]);

  // Always render the simple table fallback to avoid heavy DataGrid dependency
  return (
    <div
      style={{
        maxHeight: typeof height === 'number' ? `${height}px` : height,
        overflow: 'auto',
        borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.12)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: 8 }}>
        <button
          onClick={() => exportCSV(processedRows, columns, `${exportFileName}.csv`)}
          style={{ border: '1px solid #333', borderRadius: 6, padding: '4px 8px' }}
        >
          Exportar CSV
        </button>
        {xlsxReady && (
          <button
            onClick={() => exportXLSX(processedRows, columns, `${exportFileName}.xlsx`)}
            style={{ border: '1px solid #333', borderRadius: 6, padding: '4px 8px' }}
          >
            Exportar XLSX
          </button>
        )}
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.field}
                style={{
                  textAlign: 'left',
                  padding: 8,
                  borderBottom: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                {c.headerName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {processedRows.map((r) => (
            <tr key={r.id}>
              {columns.map((c) => {
                const raw = c.valueGetter ? c.valueGetter(r) : r[c.field];
                const val = c.valueFormatter ? c.valueFormatter(raw, r) : raw;
                return (
                  <td
                    key={c.field}
                    style={{ padding: 8, borderBottom: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    {val as any}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function exportCSV(rows: any[], columns: Column[], filename: string) {
  const headers = columns.map((c) => c.headerName);
  const lines = rows.map((r) =>
    columns
      .map((c) => {
        const raw = c.valueGetter ? c.valueGetter(r) : r[c.field];
        const val = c.valueFormatter ? c.valueFormatter(raw, r) : raw;
        const s = val === null || typeof val === 'undefined' ? '' : String(val);
        // escape quotes and wrap
        const escaped = '"' + s.replace(/"/g, '""') + '"';
        return escaped;
      })
      .join(',')
  );
  const csv = [headers.join(','), ...lines].join('\n');
  downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), filename);
}

async function exportXLSX(rows: any[], columns: Column[], filename: string) {
  try {
    const XLSX = await import('xlsx');
    const data = rows.map((r) => {
      const obj: Record<string, any> = {};
      columns.forEach((c) => {
        const raw = c.valueGetter ? c.valueGetter(r) : r[c.field];
        obj[c.headerName] = c.valueFormatter ? c.valueFormatter(raw, r) : raw;
      });
      return obj;
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Dados');
    const blob = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
    downloadBlob(
      new Blob([blob], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),
      filename
    );
  } catch (e) {
    // fallback: CSV
    exportCSV(rows, columns, filename.replace(/\.xlsx$/, '.csv'));
  }
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
