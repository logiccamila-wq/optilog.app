import { NextResponse } from 'next/server';
import docsData from './docs-data.json';

export async function GET() {
  try {
    return NextResponse.json(docsData);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Erro ao listar docs' }, { status: 500 });
  }
}
