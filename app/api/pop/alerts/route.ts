import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/db';

export const runtime = 'nodejs';

function parseIntOrNull(v: string | null): number | null {
  if (!v) return null;
  const n = parseInt(String(v), 10);
  return isNaN(n) ? null : n;
}

export async function GET(req: NextRequest) {
  try {
    const sql = getSql();
    const { searchParams } = new URL(req.url);
    const process_id = parseIntOrNull(searchParams.get('process_id'));
    const days = parseIntOrNull(searchParams.get('days')) ?? 30;
    const evalThreshold = parseIntOrNull(searchParams.get('evaluation_threshold')) ?? 60;

    const sinceExpr = sql`now() - (${days}::int * interval '1 day')`;

    // Ocorrências severas (alta) no período
    const occWhereBase = process_id ? sql`process_id = ${process_id}` : sql``;
    const occWhere = occWhereBase?.sql?.trim() ? sql`WHERE ${occWhereBase} AND severity = 'alta' AND happened_at >= ${sinceExpr}` : sql`WHERE severity = 'alta' AND happened_at >= ${sinceExpr}`;
    const severeOccurrences = await sql`SELECT id, process_id, title, severity, happened_at FROM pop_occurrences ${occWhere} ORDER BY happened_at DESC NULLS LAST, id DESC LIMIT 50`;

    // Avaliações abaixo do limiar no período
    const evalWhereBase = process_id ? sql`process_id = ${process_id}` : sql``;
    const evalWhere = evalWhereBase?.sql?.trim() ? sql`WHERE ${evalWhereBase} AND score < ${evalThreshold} AND evaluated_at >= ${sinceExpr}` : sql`WHERE score < ${evalThreshold} AND evaluated_at >= ${sinceExpr}`;
    const lowEvaluations = await sql`SELECT id, process_id, evaluator, score, evaluated_at FROM pop_evaluations ${evalWhere} ORDER BY evaluated_at DESC NULLS LAST, id DESC LIMIT 50`;

    // KPIs sem meta definida
    const kpiWhere = process_id ? sql`WHERE process_id = ${process_id} AND target IS NULL` : sql`WHERE target IS NULL`;
    const kpisNoTarget = await sql`SELECT id, process_id, name, unit FROM pop_kpis ${kpiWhere} ORDER BY id DESC LIMIT 50`;

    const alerts: Array<{ type: string; message: string; data: any }> = [];

    if (severeOccurrences.length > 0) {
      alerts.push({ type: 'occurrence', message: `Ocorrências com severidade alta nos últimos ${days} dias`, data: severeOccurrences });
    }
    if (lowEvaluations.length > 0) {
      alerts.push({ type: 'evaluation', message: `Avaliações abaixo de ${evalThreshold} nos últimos ${days} dias`, data: lowEvaluations });
    }
    if (kpisNoTarget.length > 0) {
      alerts.push({ type: 'kpi', message: 'KPIs sem meta definida', data: kpisNoTarget });
    }

    return NextResponse.json({ filters: { process_id, days, evaluation_threshold: evalThreshold }, alerts });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Erro interno' }, { status: 500 });
  }
}