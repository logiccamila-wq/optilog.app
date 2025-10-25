import { NextRequest, NextResponse } from 'next/server';
import { extractBearer, verifyToken } from '@/lib/jwt';
import { getSql } from '@/lib/db';

export async function POST(req: NextRequest) {
  const bearer = await extractBearer(req);
  if (!bearer) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  const verified = await verifyToken(bearer);
  if (!verified) return NextResponse.json({ ok: false, error: 'Invalid token' }, { status: 401 });
  const allowedEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const p = verified.payload || {};
  const isAdminClaim = !!p.admin || (!!p.role && p.role === 'admin');
  const isAllowedEmail = !!p.email && allowedEmails.includes(p.email);
  if (!(isAdminClaim || isAllowedEmail)) {
    return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: false, error: 'DATABASE_URL not set' }, { status: 500 });
  }

  const body = await req.json();
  const { uid } = body || {};
  if (!uid) return NextResponse.json({ ok: false, error: 'uid é obrigatório' }, { status: 400 });

  const sql = getSql();
  await sql`create table if not exists users (
    uid text primary key,
    email text unique,
    display_name text,
    role text,
    phone_number text,
    disabled boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
  )`;

  await sql`delete from users where uid = ${uid}`;

  return NextResponse.json({ ok: true, deleted: uid });
}

export async function OPTIONS() {
  return new Response('', {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
