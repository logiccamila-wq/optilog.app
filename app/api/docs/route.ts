import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const docsDir = path.join(process.cwd(), 'docs');
    const files = await fs.readdir(docsDir);
    const mdFiles = files.filter((f) => f.endsWith('.md'));

    const items = await Promise.all(
      mdFiles.map(async (f) => {
        const fullPath = path.join(docsDir, f);
        const content = await fs.readFile(fullPath, 'utf-8');
        const titleMatch = content.match(/^#\s+(.*)$/m);
        const title = titleMatch ? titleMatch[1].trim() : f;
        return {
          id: f.replace(/\.md$/, ''),
          file: f,
          title,
          // Limitamos preview para evitar payloads gigantes
          preview: content.slice(0, 2000),
        };
      })
    );

    return NextResponse.json({ items });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Erro ao listar docs' }, { status: 500 });
  }
}
