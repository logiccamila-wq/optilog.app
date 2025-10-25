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

  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) {
    return NextResponse.json({ ok: false, error: 'CSV file missing' }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const text = buf.toString('utf-8');

  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) {
    return NextResponse.json({ ok: false, error: 'Empty CSV' }, { status: 400 });
  }

  const header = lines[0].split(',').map((s) => s.trim());
  const required = ['email'];
  for (const r of required) {
    if (!header.includes(r)) {
      return NextResponse.json(
        { ok: false, error: `Missing required column: ${r}` },
        { status: 400 }
      );
    }
  }

  const idx = (name: string) => header.indexOf(name);
  const iEmail = idx('email');
  const iDisplay = idx('displayName');
  const iRole = idx('role');
  const iDisabled = idx('disabled');
  const iPhone = idx('phoneNumber');

  const sql = getSql();

  await sql`create table if not exists users (
    uid text primary key,
    email text unique not null,
    display_name text,
    role text,
    phone_number text,
    disabled boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
  )`;

  let inserted = 0;
  for (let li = 1; li < lines.length; li++) {
    const cols = lines[li].split(',');
    const email = (cols[iEmail] || '').trim();
    if (!email) continue;
    const uid = email; // Use email como uid
    const displayName = iDisplay >= 0 ? (cols[iDisplay] || '').trim() : null;
    const role = iRole >= 0 ? (cols[iRole] || '').trim() : null;
    const phoneNumber = iPhone >= 0 ? (cols[iPhone] || '').trim() : null;
    const disabledRaw = iDisabled >= 0 ? (cols[iDisabled] || '').trim().toLowerCase() : '';
    const disabled = ['1', 'true', 'yes', 'y'].includes(disabledRaw);

    await sql`insert into users (uid, email, display_name, role, phone_number, disabled)
              values (${uid}, ${email}, ${displayName}, ${role}, ${phoneNumber}, ${disabled})
              on conflict (uid) do update set
                email = excluded.email,
                display_name = excluded.display_name,
                role = excluded.role,
                phone_number = excluded.phone_number,
                disabled = excluded.disabled,
                updated_at = now()`;
    inserted++;
  }

  return NextResponse.json({ ok: true, inserted });
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
