import { NextResponse } from 'next/server';
import { getSql } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
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
      WHERE is_published = TRUE
      ORDER BY created_at DESC
      LIMIT 50
    `;

    return NextResponse.json(rows, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Falha ao listar posts', details: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}