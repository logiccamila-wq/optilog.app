import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

function baseDirFromParam(baseParam?: string) {
  const base = (baseParam || '').trim().toLowerCase();
  if (base === 'documentos') {
    // caminho absoluto informado pelo usuário
    return 'c\\Users\\Pichau\\devoptilog-app\\documentos'.replace(/\\/g, path.sep);
  }
  // padrão: pasta docs dentro do projeto
  return path.join(process.cwd(), 'docs');
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = (searchParams.get('slug') || '').trim();
    const list = searchParams.get('list');
    const baseParam = searchParams.get('base') || '';

    const baseDir = baseDirFromParam(baseParam);

    if (list === '1') {
      const files = fs.readdirSync(baseDir).filter((f) => {
        const lower = f.toLowerCase();
        if (baseParam === 'documentos') return lower.endsWith('.pdf');
        return lower.endsWith('.md') || lower.endsWith('.mdx');
      });
      const items = files.map((f) => ({ slug: f, path: f }));
      return NextResponse.json(items, { status: 200 });
    }

    if (!slug) return NextResponse.json({ error: 'slug é obrigatório' }, { status: 400 });
    const safeSlug = slug.replace(/\/+|\\+/g, '');
    const filePath = path.join(baseDir, safeSlug);
    const normalizedBase = path.resolve(baseDir);
    const normalizedFile = path.resolve(filePath);
    if (!normalizedFile.startsWith(normalizedBase))
      return NextResponse.json({ error: 'slug inválido' }, { status: 400 });
    if (!fs.existsSync(normalizedFile))
      return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 });

    const ext = path.extname(normalizedFile).toLowerCase();
    if (ext === '.pdf') {
      const buf = fs.readFileSync(normalizedFile);
      return new NextResponse(buf, { status: 200, headers: { 'Content-Type': 'application/pdf' } });
    }

    const content = fs.readFileSync(normalizedFile, 'utf-8');
    return new NextResponse(content, {
      status: 200,
      headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Erro interno' }, { status: 500 });
  }
}
