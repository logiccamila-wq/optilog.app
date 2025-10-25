import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'config', 'cost.json');

export async function GET() {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    const json = JSON.parse(raw);
    return NextResponse.json(json);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Erro ao carregar parâmetros' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    // validação simples: garantir números
    const keys = [
      'depreciation_per_km',
      'capital_remuneration_per_month',
      'insurance_per_km',
      'licenses_fixed_per_month',
      'fuel_consumption_l_per_km',
      'fuel_price_per_l',
      'lubricants_per_km',
      'tires_per_km',
      'maintenance_per_km',
      'tolls_per_km_default',
      'labor_per_km',
      'admin_per_km',
      'margin_rate',
    ];
    for (const k of keys) {
      if (typeof body[k] !== 'number') {
        return NextResponse.json({ error: `Parâmetro inválido: ${k}` }, { status: 400 });
      }
    }
    await fs.writeFile(filePath, JSON.stringify(body, null, 2), 'utf-8');
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Erro ao salvar parâmetros' },
      { status: 500 }
    );
  }
}
