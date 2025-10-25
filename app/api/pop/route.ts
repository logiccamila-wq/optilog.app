import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/db';

export const runtime = 'nodejs';

async function ensureTables() {
  const sql = getSql();
  await sql`create table if not exists pop_processes (
    id bigserial primary key,
    name text not null,
    description text,
    owner text,
    status text, -- ativo, inativo
    created_at timestamptz default now(),
    updated_at timestamptz default now()
  )`;
  await sql`create table if not exists pop_kpis (
    id bigserial primary key,
    process_id bigint references pop_processes(id) on delete cascade,
    name text not null,
    target numeric, -- meta
    unit text, -- % , h, unid, etc
    created_at timestamptz default now(),
    updated_at timestamptz default now()
  )`;
  await sql`create table if not exists pop_occurrences (
    id bigserial primary key,
    process_id bigint references pop_processes(id) on delete cascade,
    title text not null,
    severity text, -- baixa, media, alta
    description text,
    happened_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
  )`;
  await sql`create table if not exists pop_evaluations (
    id bigserial primary key,
    process_id bigint references pop_processes(id) on delete cascade,
    evaluator text,
    score numeric, -- 0..100
    notes text,
    evaluated_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
  )`;
  await sql`create table if not exists pop_audit (
    id bigserial primary key,
    entity text not null,
    entity_id bigint not null,
    action text not null, -- create/update/delete
    data jsonb,
    at timestamptz default now()
  )`;
}

async function audit(entity: string, entity_id: number, action: string, data: any) {
  try {
    const sql = getSql();
    await sql`insert into pop_audit (entity, entity_id, action, data) values (${entity}, ${entity_id}, ${action}, ${data})`;
  } catch {}
}

export async function GET(req: NextRequest) {
  try {
    await ensureTables();
    const { searchParams } = new URL(req.url);
    const entity = (searchParams.get('entity') || 'process').trim();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '50', 10)));
    const offset = (page - 1) * pageSize;
    const q = (searchParams.get('q') || '').trim();
    const sql = getSql();

    if (entity === 'process') {
      const where = q
        ? sql`WHERE name ILIKE ${'%' + q + '%'} OR owner ILIKE ${'%' + q + '%'}`
        : sql``;
      const totalRows = await sql`SELECT count(*)::int as total FROM pop_processes ${where}`;
      const total = Array.isArray(totalRows)
        ? (totalRows[0]?.total ?? 0)
        : (totalRows?.[0]?.total ?? 0);
      const rows =
        await sql`SELECT id, name, description, owner, status, created_at, updated_at FROM pop_processes ${where} ORDER BY created_at DESC LIMIT ${pageSize} OFFSET ${offset}`;
      return new NextResponse(JSON.stringify(rows), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'X-Total-Count': String(total) },
      });
    }

    if (entity === 'kpi') {
      const rows =
        await sql`SELECT id, process_id, name, target, unit, created_at, updated_at FROM pop_kpis ORDER BY created_at DESC LIMIT ${pageSize} OFFSET ${offset}`;
      return NextResponse.json(rows);
    }

    if (entity === 'occurrence') {
      const rows =
        await sql`SELECT id, process_id, title, severity, description, happened_at, created_at, updated_at FROM pop_occurrences ORDER BY happened_at DESC NULLS LAST, created_at DESC LIMIT ${pageSize} OFFSET ${offset}`;
      return NextResponse.json(rows);
    }

    if (entity === 'evaluation') {
      const rows =
        await sql`SELECT id, process_id, evaluator, score, notes, evaluated_at, created_at, updated_at FROM pop_evaluations ORDER BY evaluated_at DESC NULLS LAST, created_at DESC LIMIT ${pageSize} OFFSET ${offset}`;
      return NextResponse.json(rows);
    }

    return NextResponse.json({ error: 'entity inválido' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Erro interno' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureTables();
    const body = await req.json();
    const entity = (body?.entity || 'process').trim();
    const sql = getSql();

    if (entity === 'process') {
      const name = (body?.name || '').trim();
      if (!name) return NextResponse.json({ error: 'name é obrigatório' }, { status: 400 });
      const description = (body?.description || '').trim();
      const owner = (body?.owner || '').trim();
      const status = (body?.status || 'ativo').trim();
      const rows =
        await sql`INSERT INTO pop_processes (name, description, owner, status) VALUES (${name}, ${description || null}, ${owner || null}, ${status}) RETURNING id`;
      const id = Array.isArray(rows) ? rows[0]?.id : rows?.[0]?.id;
      await audit('process', id, 'create', body);
      return NextResponse.json({ ok: true, id });
    }

    if (entity === 'kpi') {
      const process_id = parseInt(String(body?.process_id), 10);
      const name = (body?.name || '').trim();
      const target = body?.target != null ? parseFloat(String(body.target)) : null;
      const unit = (body?.unit || '').trim();
      if (!process_id || !name)
        return NextResponse.json({ error: 'process_id e name são obrigatórios' }, { status: 400 });
      const rows =
        await sql`INSERT INTO pop_kpis (process_id, name, target, unit) VALUES (${process_id}, ${name}, ${target}, ${unit || null}) RETURNING id`;
      const id = Array.isArray(rows) ? rows[0]?.id : rows?.[0]?.id;
      await audit('kpi', id, 'create', body);
      return NextResponse.json({ ok: true, id });
    }

    if (entity === 'occurrence') {
      const process_id = parseInt(String(body?.process_id), 10);
      const title = (body?.title || '').trim();
      const severity = (body?.severity || '').trim();
      const description = (body?.description || '').trim();
      const happened_at = (body?.happened_at || '').trim();
      if (!process_id || !title)
        return NextResponse.json({ error: 'process_id e title são obrigatórios' }, { status: 400 });
      const rows =
        await sql`INSERT INTO pop_occurrences (process_id, title, severity, description, happened_at) VALUES (${process_id}, ${title}, ${severity || null}, ${description || null}, ${happened_at || null}) RETURNING id`;
      const id = Array.isArray(rows) ? rows[0]?.id : rows?.[0]?.id;
      await audit('occurrence', id, 'create', body);
      return NextResponse.json({ ok: true, id });
    }

    if (entity === 'evaluation') {
      const process_id = parseInt(String(body?.process_id), 10);
      const evaluator = (body?.evaluator || '').trim();
      const score = body?.score != null ? parseFloat(String(body.score)) : null;
      const notes = (body?.notes || '').trim();
      const evaluated_at = (body?.evaluated_at || '').trim();
      if (!process_id || !evaluator || score == null)
        return NextResponse.json(
          { error: 'process_id, evaluator e score são obrigatórios' },
          { status: 400 }
        );
      const rows =
        await sql`INSERT INTO pop_evaluations (process_id, evaluator, score, notes, evaluated_at) VALUES (${process_id}, ${evaluator}, ${score}, ${notes || null}, ${evaluated_at || null}) RETURNING id`;
      const id = Array.isArray(rows) ? rows[0]?.id : rows?.[0]?.id;
      await audit('evaluation', id, 'create', body);
      return NextResponse.json({ ok: true, id });
    }

    return NextResponse.json({ error: 'entity inválido' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Erro interno' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await ensureTables();
    const body = await req.json();
    const entity = (body?.entity || 'process').trim();
    const id = body?.id != null ? parseInt(String(body.id), 10) : null;
    if (!id) return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 });
    const sql = getSql();

    if (entity === 'process') {
      const name = body?.name ?? null;
      const description = body?.description ?? null;
      const owner = body?.owner ?? null;
      const status = body?.status ?? null;
      const rows =
        await sql`UPDATE pop_processes SET name = COALESCE(${name}, name), description = COALESCE(${description}, description), owner = COALESCE(${owner}, owner), status = COALESCE(${status}, status), updated_at = now() WHERE id = ${id} RETURNING id`;
      if (!rows || rows.length === 0)
        return NextResponse.json({ error: 'Registro não encontrado' }, { status: 404 });
      await audit('process', id, 'update', body);
      return NextResponse.json({ ok: true, id });
    }

    if (entity === 'kpi') {
      const process_id = body?.process_id ?? null;
      const name = body?.name ?? null;
      const target = body?.target != null ? parseFloat(String(body.target)) : null;
      const unit = body?.unit ?? null;
      const rows =
        await sql`UPDATE pop_kpis SET process_id = COALESCE(${process_id}, process_id), name = COALESCE(${name}, name), target = COALESCE(${target}, target), unit = COALESCE(${unit}, unit), updated_at = now() WHERE id = ${id} RETURNING id`;
      if (!rows || rows.length === 0)
        return NextResponse.json({ error: 'Registro não encontrado' }, { status: 404 });
      await audit('kpi', id, 'update', body);
      return NextResponse.json({ ok: true, id });
    }

    if (entity === 'occurrence') {
      const process_id = body?.process_id ?? null;
      const title = body?.title ?? null;
      const severity = body?.severity ?? null;
      const description = body?.description ?? null;
      const happened_at = body?.happened_at ?? null;
      const rows =
        await sql`UPDATE pop_occurrences SET process_id = COALESCE(${process_id}, process_id), title = COALESCE(${title}, title), severity = COALESCE(${severity}, severity), description = COALESCE(${description}, description), happened_at = COALESCE(${happened_at}, happened_at), updated_at = now() WHERE id = ${id} RETURNING id`;
      if (!rows || rows.length === 0)
        return NextResponse.json({ error: 'Registro não encontrado' }, { status: 404 });
      await audit('occurrence', id, 'update', body);
      return NextResponse.json({ ok: true, id });
    }

    if (entity === 'evaluation') {
      const process_id = body?.process_id ?? null;
      const evaluator = body?.evaluator ?? null;
      const score = body?.score != null ? parseFloat(String(body.score)) : null;
      const notes = body?.notes ?? null;
      const evaluated_at = body?.evaluated_at ?? null;
      const rows =
        await sql`UPDATE pop_evaluations SET process_id = COALESCE(${process_id}, process_id), evaluator = COALESCE(${evaluator}, evaluator), score = COALESCE(${score}, score), notes = COALESCE(${notes}, notes), evaluated_at = COALESCE(${evaluated_at}, evaluated_at), updated_at = now() WHERE id = ${id} RETURNING id`;
      if (!rows || rows.length === 0)
        return NextResponse.json({ error: 'Registro não encontrado' }, { status: 404 });
      await audit('evaluation', id, 'update', body);
      return NextResponse.json({ ok: true, id });
    }

    return NextResponse.json({ error: 'entity inválido' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await ensureTables();
    const { searchParams } = new URL(req.url);
    const entity = (searchParams.get('entity') || 'process').trim();
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 });
    const idNum = parseInt(String(id), 10);
    const sql = getSql();

    if (entity === 'process') {
      const rows = await sql`DELETE FROM pop_processes WHERE id = ${idNum} RETURNING id`;
      if (!rows || rows.length === 0)
        return NextResponse.json({ error: 'Registro não encontrado' }, { status: 404 });
      await audit('process', idNum, 'delete', { id: idNum });
      return NextResponse.json({ ok: true, id: idNum });
    }
    if (entity === 'kpi') {
      const rows = await sql`DELETE FROM pop_kpis WHERE id = ${idNum} RETURNING id`;
      if (!rows || rows.length === 0)
        return NextResponse.json({ error: 'Registro não encontrado' }, { status: 404 });
      await audit('kpi', idNum, 'delete', { id: idNum });
      return NextResponse.json({ ok: true, id: idNum });
    }
    if (entity === 'occurrence') {
      const rows = await sql`DELETE FROM pop_occurrences WHERE id = ${idNum} RETURNING id`;
      if (!rows || rows.length === 0)
        return NextResponse.json({ error: 'Registro não encontrado' }, { status: 404 });
      await audit('occurrence', idNum, 'delete', { id: idNum });
      return NextResponse.json({ ok: true, id: idNum });
    }
    if (entity === 'evaluation') {
      const rows = await sql`DELETE FROM pop_evaluations WHERE id = ${idNum} RETURNING id`;
      if (!rows || rows.length === 0)
        return NextResponse.json({ error: 'Registro não encontrado' }, { status: 404 });
      await audit('evaluation', idNum, 'delete', { id: idNum });
      return NextResponse.json({ ok: true, id: idNum });
    }

    return NextResponse.json({ error: 'entity inválido' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Erro interno' }, { status: 500 });
  }
}
