# TMS Kit (Transport Management)

Objetivo: fornecer um esqueleto mínimo para cargas, rotas e faturas.

## Tabelas sugeridas

- shipments(id, ref, status, origin, destination, driver_id, vehicle_id, created_at, updated_at)
- loads(id, shipment_id, weight_kg, volume_m3, created_at, updated_at)
- route_plans(id, shipment_id, distance_km, eta, created_at, updated_at)

SQL exemplo:

```sql
create table if not exists shipments (
  id bigserial primary key,
  ref text not null,
  status text not null default 'draft',
  origin text not null,
  destination text not null,
  driver_id bigint,
  vehicle_id bigint,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_shipments_ref on shipments(ref);
```

## Endpoints (Next.js API)

- `POST /api/tms/shipments` cria embarque
- `GET /api/tms/shipments?page&search` lista com paginação
- `PUT /api/tms/shipments/[id]` atualiza status/rota
- `DELETE /api/tms/shipments/[id]` remove

Boilerplate:

```ts
import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/db';

export async function POST(req: NextRequest) {
  const sql = getSql();
  const body = await req.json();
  const ref = String(body?.ref || '').trim();
  const origin = String(body?.origin || '').trim();
  const destination = String(body?.destination || '').trim();
  if (!ref || !origin || !destination) {
    return NextResponse.json({ error: 'Campos obrigatórios: ref, origin, destination' }, { status: 400 });
  }
  await sql`create table if not exists shipments (
    id bigserial primary key,
    ref text not null,
    status text not null default 'draft',
    origin text not null,
    destination text not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
  )`;
  const rows = await sql`insert into shipments (ref, origin, destination) values (${ref}, ${origin}, ${destination}) returning *`;
  return NextResponse.json(rows?.[0], { status: 201 });
}
```

## Integrações

- relacionamento com `drivers` e `vehicles` já existentes
- cálculo de rota opcional via `kits/backend/ors-route-proxy`