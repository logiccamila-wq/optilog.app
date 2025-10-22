import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/db';

export const runtime = 'nodejs';

function toCSV(rows: any[]): string {
  if (!rows || rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const escape = (val: any) => {
    if (val == null) return '';
    const s = String(val).replace(/"/g, '""');
    return `"${s}"`;
  };
  const lines = [headers.join(',')];
  for (const r of rows) {
    lines.push(headers.map(h => escape(r[h])).join(','));
  }
  return lines.join('\n');
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const entity = (searchParams.get('entity') || 'process').trim();
    const sql = getSql();

    if (entity === 'process') {
      const rows = await sql`SELECT id, name, description, owner, status, created_at, updated_at FROM pop_processes ORDER BY id`;
      const csv = toCSV(rows as any[]);
      return new NextResponse(csv, { status: 200, headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename=pop_processes.csv' } });
    }
    if (entity === 'occurrence') {
      const rows = await sql`SELECT id, process_id, title, severity, description, happened_at, created_at, updated_at FROM pop_occurrences ORDER BY happened_at DESC NULLS LAST, id`;
      const csv = toCSV(rows as any[]);
      return new NextResponse(csv, { status: 200, headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename=pop_occurrences.csv' } });
    }

    return NextResponse.json({ error: 'entity inválido' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Erro interno' }, { status: 500 });
  }
}