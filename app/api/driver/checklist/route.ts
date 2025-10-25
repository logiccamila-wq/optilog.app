import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const REMOTE_PDF_URL =
  'https://lundinmining.com.br/wp-content/uploads/2024/06/CHECK-LIST-TRANSPORTE-PRODUTOS-PERIGOSOS.pdf';

export async function GET(_req: NextRequest) {
  try {
    const res = await fetch(REMOTE_PDF_URL, { cache: 'no-store' });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return new NextResponse(
        JSON.stringify({ error: 'Falha ao obter checklist', details: text }),
        {
          status: res.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    const buf = Buffer.from(await res.arrayBuffer());
    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Erro interno ao obter checklist' },
      { status: 500 }
    );
  }
}
