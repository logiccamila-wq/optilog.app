import { NextResponse } from 'next/server';
import { getSql } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const sql = getSql();
    const rows = await sql<{
      id: number;
      slug: string;
      title: string;
      content: string | null;
      is_published: boolean;
      author_id: string | null;
      created_at: string;
    }[]>`
      SELECT id, slug, title, content, is_published, author_id, created_at
      FROM posts
      WHERE slug = ${params.slug} AND is_published = TRUE
      LIMIT 1
    `;

    if (!rows.length) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Falha ao buscar post', details: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}