import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_HOSTS = ['lundinmining.com.br', 'www.lundinmining.com.br'];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawUrl = searchParams.get('url');
    if (!rawUrl) {
      return new Response(JSON.stringify({ error: 'missing_url_param' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const decoded = decodeURIComponent(rawUrl);
    const target = new URL(decoded);

    if (target.protocol !== 'https:' && target.protocol !== 'http:') {
      return new Response(JSON.stringify({ error: 'invalid_protocol' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const isAllowed = ALLOWED_HOSTS.some((host) => target.hostname === host || target.hostname.endsWith('.' + host));
    if (!isAllowed) {
      return new Response(JSON.stringify({ error: 'host_not_allowed', host: target.hostname }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch(target.toString(), { cache: 'no-store' });
    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'fetch_failed', status: res.status }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const buf = await res.arrayBuffer();

    return new Response(buf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Cache-Control': 'public, max-age=86400',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'unexpected_error', detail: String(err?.message || err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}