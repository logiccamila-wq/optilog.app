# ML/AI Kit (Modelos, IA e Preditiva)

Objetivo: acelerar integrações com serviços de ML e IA para previsão/preditiva.

## Componentes existentes

- `ml-service/` (Python Flask) para treinos e inferência
- `streamlit-app/` para visualização rápida

## Estrutura sugerida

- `models_registry(id, name, version, path, created_at, updated_at)`
- `predictions(id, model_name, version, input_json, output_json, created_at, updated_at)`

## Endpoints

- `POST /api/ml/predict` -> chama `ml-service`
- `GET /api/ml/models` -> lista modelos registrados

## Exemplo de chamada (Next.js)

```ts
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const input = body?.input ?? {};
  const res = await fetch(process.env.ML_SERVICE_URL + '/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input }),
  });
  const data = await res.json();
  return new Response(JSON.stringify(data), { status: 200 });
}
```

## Observações

- usar `kits/backend/api-kit.md` para padronizar API
- logs e auditoria em `predictions`
