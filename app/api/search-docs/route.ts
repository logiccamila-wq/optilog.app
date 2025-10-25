import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const qRaw = (searchParams.get('q') || '').trim();
    const q = qRaw.toLowerCase();
    const topN = Math.max(1, Math.min(10, parseInt(searchParams.get('topN') || '3', 10)));
    const docsDir = path.join(process.cwd(), 'docs');
    const files = await fs.readdir(docsDir);
    const mdFiles = files.filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));

    // Lista simples quando sem consulta
    if (!q) {
      const items = await Promise.all(
        mdFiles.map(async (f) => {
          const fullPath = path.join(docsDir, f);
          const content = await fs.readFile(fullPath, 'utf-8');
          const titleMatch = content.match(/^#\s+(.*)$/m);
          const title = titleMatch ? titleMatch[1].trim() : f;
          return { id: f.replace(/\.(md|mdx)$/, ''), title, file: f };
        })
      );
      return NextResponse.json({ items, q: qRaw });
    }

    const terms = q.split(/\s+/).filter(Boolean);

    // Pré-calcular IDF por termo
    const termDocCount: Record<string, number> = {};
    const fileContents: Record<string, string> = {};
    for (const f of mdFiles) {
      const fullPath = path.join(docsDir, f);
      const content = await fs.readFile(fullPath, 'utf-8');
      fileContents[f] = content;
      const lower = content.toLowerCase();
      const hits = new Set<string>();
      for (const t of terms) {
        if (lower.includes(t)) hits.add(t);
      }
      for (const h of hits) termDocCount[h] = (termDocCount[h] || 0) + 1;
    }
    const N = mdFiles.length || 1;
    const idf: Record<string, number> = {};
    for (const t of terms) {
      const df = termDocCount[t] || 0.5; // evitar zero
      idf[t] = Math.log(N / df);
    }

    const items = [] as Array<{
      id: string;
      title: string;
      snippets: string[];
      file: string;
      score: number;
    }>;

    for (const f of mdFiles) {
      const content = fileContents[f];
      const titleMatch = content.match(/^#\s+(.*)$/m);
      const title = titleMatch ? titleMatch[1].trim() : f;
      const lower = content.toLowerCase();

      // TF simples por termo
      let score = 0;
      for (const t of terms) {
        let tf = 0;
        let idx = lower.indexOf(t);
        while (idx >= 0) {
          tf += 1;
          idx = lower.indexOf(t, idx + t.length);
        }
        score += tf * (idf[t] || 0);
      }
      if (score <= 0) continue;

      // Snippets: coletar até topN janelas ao redor das primeiras ocorrências
      const positions: number[] = [];
      for (const t of terms) {
        let idx = lower.indexOf(t);
        while (idx >= 0) {
          positions.push(idx);
          if (positions.length >= topN) break;
          idx = lower.indexOf(t, idx + t.length);
        }
        if (positions.length >= topN) break;
      }
      positions.sort((a, b) => a - b);
      const window = 280;
      const snippets = positions.slice(0, topN).map((p) => {
        const start = Math.max(0, p - Math.floor(window / 2));
        const end = Math.min(content.length, p + Math.floor(window / 2));
        return content.slice(start, end).replace(/\n/g, ' ').trim();
      });

      items.push({ id: f.replace(/\.(md|mdx)$/, ''), title, snippets, file: f, score });
    }

    items.sort((a, b) => b.score - a.score);
    return NextResponse.json({ q: qRaw, items });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Erro ao buscar docs' }, { status: 500 });
  }
}
