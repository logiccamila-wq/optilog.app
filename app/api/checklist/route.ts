import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const saved = {
      id: `${Date.now()}`,
      ...data,
      savedAt: new Date().toISOString(),
    };
    return NextResponse.json({ ok: true, checklist: saved }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || 'Invalid payload' },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: 'Checklist endpoint ready' }, { status: 200 });
}
