# Dashboard Kit

Objetivo: acelerar criação de painéis (KPIs, tabelas, gráficos) baseada em MUI/Chart.js.

## Páginas

- `app/dashboard/` -> layout com cards KPI (usar `components/Card.tsx`)
- `app/dashboard2/` -> variação com tabelas e filtros

## Componentes sugeridos

- KpiCard genérico
- Tabela com paginação simples e busca
- Gráficos: linha, barra, pizza

## Exemplo de tabela

```tsx
import { useEffect, useState } from 'react';

export default function SimpleTable() {
  const [rows, setRows] = useState<any[]>([]);
  const [q, setQ] = useState('');
  useEffect(() => {
    fetch(`/api/vehicles?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then(setRows);
  }, [q]);
  return (
    <div>
      <input placeholder="Buscar" value={q} onChange={(e) => setQ(e.target.value)} />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Placa</th>
            <th>Modelo</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.plate}</td>
              <td>{r.model}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## Observações

- combinar com `kits/frontend/ui-kit.md` para estilos
- usar `cache: 'no-store'` nas requisições para dados atualizados
