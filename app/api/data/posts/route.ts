import { NextRequest, NextResponse } from 'next/server';
import { extractBearer, verifyToken } from '@/lib/jwt';
import { getSql } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const base = process.env.NEON_DATA_API_URL;
  const { searchParams } = new URL(req.url);
  const featuredParam = searchParams.get('featured');
  const featured = featuredParam === 'true' || featuredParam === '1';
  const limitParam = searchParams.get('limit');
  const limit = Math.min(Math.max(parseInt(limitParam ?? '50', 10) || 50, 1), 100);
  // Optional JWT verification: if present and invalid, reject; if absent, allow anon (RLS via DB fallback)
  const bearer = await extractBearer(req);
  if (bearer) {
    const verified = await verifyToken(bearer);
    if (!verified) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }
  }

  // If we have a bearer token, prefer Data API (RLS enforced). Otherwise, fallback to serverless driver.
  if (bearer) {
    if (!base) {
      return NextResponse.json({ error: 'NEON_DATA_API_URL não definido' }, { status: 500 });
    }
    const url = `${base.replace(/\/$/, '')}/posts?select=id,slug,title,content,is_published,is_featured,author_id,created_at${featured ? '&is_featured=eq.true' : ''}&order=created_at.desc&limit=${limit}`;

    try {
      const res = await fetch(url, {
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${bearer}`,
        },
        cache: 'no-store',
      });
      if (!res.ok) {
        const text = await res.text();
        return NextResponse.json(
          { error: 'Falha no Data API', details: text },
          { status: res.status }
        );
      }
      const data = await res.json();
      return NextResponse.json(data, { status: 200 });
    } catch (err: any) {
      return NextResponse.json(
        { error: 'Erro de rede ao Data API', details: err?.message ?? String(err) },
        { status: 500 }
      );
    }
  }

  // Fallback: query only published posts via Neon serverless driver
  try {
    const sql = await getSql();
    const rows = featured
      ? await sql`SELECT id, slug, title, content, is_published, is_featured, author_id, created_at
                            FROM posts
                            WHERE is_published = true AND is_featured = true
                            ORDER BY created_at DESC
                            LIMIT ${limit}`
      : await sql`SELECT id, slug, title, content, is_published, is_featured, author_id, created_at
                            FROM posts
                            WHERE is_published = true
                            ORDER BY created_at DESC
                            LIMIT ${limit}`;
    return NextResponse.json(rows, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Falha no fallback DB', details: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
