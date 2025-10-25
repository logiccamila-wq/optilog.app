import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/db';

export const runtime = 'nodejs';

function parseDate(s: string | null): string | null {
  if (!s) return null;
  const d = new Date(s);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

export async function GET(req: NextRequest) {
  try {
    const sql = getSql();
    const { searchParams } = new URL(req.url);
    const processIdRaw = searchParams.get('process_id');
    const process_id = processIdRaw ? parseInt(String(processIdRaw), 10) : null;
    const from = parseDate(searchParams.get('from'));
    const to = parseDate(searchParams.get('to'));

    // Base filters
    const whereProc = process_id ? sql`WHERE id = ${process_id}` : sql``;
    const whereOcc = sql`${process_id ? sql`process_id = ${process_id}` : sql``}${from ? sql`${process_id ? sql` AND ` : sql``} happened_at >= ${from}` : sql``}${to ? sql`${process_id || from ? sql` AND ` : sql``} happened_at <= ${to}` : sql``}`;
    const whereEval = sql`${process_id ? sql`process_id = ${process_id}` : sql``}${from ? sql`${process_id ? sql` AND ` : sql``} evaluated_at >= ${from}` : sql``}${to ? sql`${process_id || from ? sql` AND ` : sql``} evaluated_at <= ${to}` : sql``}`;

    // Totais
    const [procCountRow] = await sql`SELECT count(*)::int as total FROM pop_processes ${whereProc}`;
    const [kpiCountRow] = await sql`SELECT count(*)::int as total FROM pop_kpis ${process_id ? sql`WHERE process_id = ${process_id}` : sql``}`;

    // Ocorrências por severidade
    const occWhereClause = whereOcc?.sql?.trim() ? sql`WHERE ${whereOcc}` : sql``;
    const occSeverityRows = await sql`SELECT COALESCE(severity,'indefinido') as severity, count(*)::int as count FROM pop_occurrences ${occWhereClause} GROUP BY severity ORDER BY severity`;

    // Avaliações: média por processo e últimas N
    const evalWhereClause = whereEval?.sql?.trim() ? sql`WHERE ${whereEval}` : sql``;
    const evalAvgRows = await sql`SELECT process_id, avg(score)::float as avg_score, count(*)::int as count FROM pop_evaluations ${evalWhereClause} GROUP BY process_id ORDER BY process_id`;
    const latestEvaluations = await sql`SELECT id, process_id, evaluator, score, notes, evaluated_at FROM pop_evaluations ${evalWhereClause} ORDER BY evaluated_at DESC NULLS LAST, id DESC LIMIT 10`;

    // Processos para mapeamento
    const processes = await sql`SELECT id, name, status FROM pop_processes ${whereProc}`;

    return NextResponse.json({
      filters: { process_id, from, to },
      totals: { processes: procCountRow?.total ?? 0, kpis: kpiCountRow?.total ?? 0 },
      occurrencesBySeverity: occSeverityRows,
      evaluations: { averages: evalAvgRows, latest: latestEvaluations },
      processes
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Erro interno' }, { status: 500 });
  }
}