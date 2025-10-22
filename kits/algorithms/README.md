# Algoritmos Modernos (Kit)

Objetivo: coleções de algoritmos úteis para logística/transporte.

## Exemplos

- Dijkstra/A* para rotas
- Clustering (K-Means) para agrupamento de entregas
- Heurísticas de VRP (Vehicle Routing Problem)

## Esqueleto (TypeScript util)

```ts
export function dijkstra(graph: Record<string, Record<string, number>>, start: string) {
  const dist: Record<string, number> = {}; const visited = new Set<string>();
  Object.keys(graph).forEach(n => dist[n] = n === start ? 0 : Infinity);
  while (visited.size < Object.keys(graph).length) {
    const [u] = Object.entries(dist).filter(([n]) => !visited.has(n)).sort((a,b) => a[1]-b[1])[0] || [];
    if (!u) break; visited.add(u);
    for (const [v, w] of Object.entries(graph[u] || {})) {
      if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
    }
  }
  return dist;
}
```

## Observações

- colocar utils em `lib/utils.ts` ou módulos específicos
- validar inputs e testar com `vitest`