import { NextRequest, NextResponse } from 'next/server';
import { extractBearer, verifyToken } from '@/lib/jwt';
import { getSql } from '@/lib/db';

export async function POST(req: NextRequest) {
  const bearer = await extractBearer(req);
  if (!bearer) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const verified = await verifyToken(bearer);
  if (!verified) {
    return NextResponse.json({ ok: false, error: 'Invalid token' }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const {
    workingCapital,
    retainedEarnings,
    operatingIncome,
    marketValueEquity,
    sales,
    totalAssets,
    totalLiabilities,
  } = body || {};

  function isNumber(n: any) {
    return typeof n === 'number' && Number.isFinite(n);
  }

  if (
    ![
      workingCapital,
      retainedEarnings,
      operatingIncome,
      marketValueEquity,
      sales,
      totalAssets,
      totalLiabilities,
    ].every(isNumber)
  ) {
    return NextResponse.json({ ok: false, error: 'Missing or invalid numeric fields' }, { status: 400 });
  }
  if (totalAssets === 0 || totalLiabilities === 0) {
    return NextResponse.json({ ok: false, error: 'totalAssets and totalLiabilities must be > 0' }, { status: 400 });
  }

  const X1 = workingCapital / totalAssets;
  const X2 = retainedEarnings / totalAssets;
  const X3 = operatingIncome / totalAssets;
  const X4 = marketValueEquity / totalLiabilities;
  const X5 = sales / totalAssets;

  const z = 1.2 * X1 + 1.4 * X2 + 3.3 * X3 + 0.6 * X4 + 1.0 * X5;
  const zScore = Number(z.toFixed(3));
  const risk = zScore > 2.99 ? 'Baixo risco' : zScore >= 1.81 ? 'Risco moderado' : 'Alto risco';
  const explanation =
    risk === 'Baixo risco'
      ? 'Empresa com boa saúde financeira segundo Altman Z.'
      : risk === 'Risco moderado'
      ? 'Zona de atenção; recomenda-se análise mais detalhada.'
      : 'Risco elevado de insolvência; medidas corretivas recomendadas.';

  let dbReady = false;
  try {
    if (process.env.DATABASE_URL) {
      const sql = getSql();
      await sql`select 1 as ok`;
      dbReady = true;
    }
  } catch {
    dbReady = false;
  }

  return NextResponse.json({
    ok: true,
    result: {
      zScore,
      risk,
      explanation,
      inputs: {
        workingCapital,
        retainedEarnings,
        operatingIncome,
        marketValueEquity,
        sales,
        totalAssets,
        totalLiabilities,
      },
    },
    dbReady,
    user: verified.payload,
  });
}