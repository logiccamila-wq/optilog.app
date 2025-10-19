import { NextResponse } from 'next/server';

export async function GET() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const functionName = 'openaiProxy';
  const regions = ['us-central1', 'europe-west1', 'southamerica-east1'];

  if (!projectId) {
    return NextResponse.json({ ok: false, error: 'Missing projectId env' }, { status: 200 });
  }

  const attempts = await Promise.allSettled(
    regions.map(async (region) => {
      const url = `https://${region}-${projectId}.cloudfunctions.net/${functionName}`;
      try {
        const res = await fetch(url, { method: 'OPTIONS' });
        const ok = res.status === 204;
        return { region, url, ok, status: res.status };
      } catch (e: any) {
        return { region, url, ok: false, status: null as any, error: e?.message || String(e) };
      }
    })
  );

  const results = attempts.map((r, i) =>
    r.status === 'fulfilled'
      ? r.value
      : {
          region: regions[i],
          url: `https://${regions[i]}-${projectId}.cloudfunctions.net/${functionName}`,
          ok: false,
          status: null,
          error: (r as any)?.reason || 'unknown error',
        }
  );
  const firstOk = results.find((r: any) => r.ok);
  const ok = !!firstOk;
  const url = firstOk?.url || results[0]?.url;
  const status = firstOk?.status || results[0]?.status || 0;

  return NextResponse.json({ ok, url, status, projectId, functionName, results }, { status: 200 });
}
