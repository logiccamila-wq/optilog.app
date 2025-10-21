import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const plate = (body?.plate || '').trim();
    const model = (body?.model || '').trim();
    const year = body?.year != null && body.year !== '' ? parseInt(String(body.year), 10) : null;
    const odometer = body?.odometer != null && body.odometer !== '' ? parseInt(String(body.odometer), 10) : null;

    if (!plate) {
      return NextResponse.json({ error: 'plate é obrigatório' }, { status: 400 });
    }

    const sql = getSql();
    await sql`create table if not exists vehicles (
      id bigserial primary key,
      plate text not null,
      model text,
      year int,
      odometer int,
      created_at timestamptz default now()
    )`;

    const rows = await sql`insert into vehicles (plate, model, year, odometer)
                           values (${plate}, ${model || null}, ${year}, ${odometer})
                           returning id, plate, model, year, odometer, created_at`;
    const vehicle = Array.isArray(rows) ? rows[0] : rows?.[0];
    return NextResponse.json({ ok: true, vehicle }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Erro interno' }, { status: 500 });
  }
}