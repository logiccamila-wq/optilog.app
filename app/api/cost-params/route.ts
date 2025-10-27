import { NextResponse } from 'next/server';
import costParams from './cost-params.json';

export async function GET() {
  try {
    return NextResponse.json(costParams);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Erro ao carregar parâmetros' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  // Em uma implementação real, você precisaria usar um banco de dados ou serviço de armazenamento
  // ao invés de tentar salvar em arquivo no Edge Runtime
  return NextResponse.json(
    { error: 'Operação não suportada no Edge Runtime. Use um banco de dados.' },
    { status: 501 }
  );
}
