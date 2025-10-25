import { NextRequest, NextResponse } from 'next/server';
import { extractBearer, verifyToken } from '@/lib/jwt';
import { getSql } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const base = process.env.NEON_DATA_API_URL;
  const slug = params.slug;
  const bearer = await extractBearer(req);
  if (bearer) {
    const verified = await verifyToken(bearer);
    if (!verified) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }
  }

  // Com token, usa Data API (RLS/claims); sem token, fallback ao driver e filtra publicado
  if (bearer) {
    if (!base) {
      return NextResponse.json({ error: 'NEON_DATA_API_URL não definido' }, { status: 500 });
    }
    const url = `${base.replace(/\/$/, '')}/posts?slug=eq.${encodeURIComponent(slug)}&select=id,slug,title,content,is_published,author_id,created_at&limit=1`;

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
      const row = Array.isArray(data) ? data[0] : data;
      if (!row) return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 });
      return NextResponse.json(row, { status: 200 });
    } catch (err: any) {
      return NextResponse.json(
        { error: 'Erro de rede ao Data API', details: err?.message ?? String(err) },
        { status: 500 }
      );
    }
  }

  // Fallback: publicado somente
  try {
    const sql = await getSql();
    const rows = await sql`SELECT id, slug, title, content, is_published, author_id, created_at
                            FROM posts
                            WHERE slug = ${slug} AND is_published = true
                            LIMIT 1`;
    const row = Array.isArray(rows) ? rows[0] : rows[0];
    if (!row) return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 });
    return NextResponse.json(row, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Falha no fallback DB', details: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
