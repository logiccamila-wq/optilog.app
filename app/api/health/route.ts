import { NextResponse } from 'next/server';
import { getSql } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  const env = {
    databaseUrl: !!process.env.DATABASE_URL,
    dataApiUrl: !!process.env.NEON_DATA_API_URL,
    jwksUrl: !!process.env.NEON_AUTH_JWKS_URL,
  };

  try {
    const sql = getSql();
    const rows = await sql`select 1 as ok`;
    const ok = Array.isArray(rows) && rows[0]?.ok === 1;
    return NextResponse.json({ ok, env }, { status: ok ? 200 : 500 });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, env, error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}