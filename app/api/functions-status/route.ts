import { NextResponse } from 'next/server';

export async function GET() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const region = 'us-central1';
  const functionName = 'openaiProxy';

  if (!projectId) {
    return NextResponse.json({ ok: false, error: 'Missing projectId env' }, { status: 200 });
  }

  const url = `https://${region}-${projectId}.cloudfunctions.net/${functionName}`;
  try {
    // Health-check via CORS preflight handled by the function (returns 204 on success)
    const res = await fetch(url, { method: 'OPTIONS' });
    const ok = res.status === 204;
    return NextResponse.json({ ok, status: res.status, url });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e), url }, { status: 200 });
  }
}