# Instruções de Correção

## Correções Críticas

1. Imports UI (shadcn)
- Padronizar todos os imports de componentes UI para seguir o padrão shadcn
- Exemplo:
  ```typescript
  // De:
  import { Card, Button, Input } from '@/components/ui';
  
  // Para:
  import { Card } from '@/components/ui/card';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  ```

2. React Hooks (Erros Críticos)
- Mover todas as chamadas de hooks para o topo dos componentes
- Remover hooks condicionais
- Adicionar todas as dependências faltantes nos arrays de dependências dos useEffect/useMemo

3. Empty Block Statements
- Implementar tratamento adequado de erro ou remover blocos vazios
- Adicionar logs de erro quando apropriado

4. Unused Variables
- Remover importações não utilizadas
- Remover variáveis declaradas mas não utilizadas
- Adicionar prefixo _ em parâmetros não utilizados em callbacks

## Correções por Arquivo

### app/driver/page.tsx
- Remover imports não utilizados (Link, MOPPChecklist)
- Mover hooks para topo do componente
- Implementar todos os handlers vazios
- Adicionar dependência wsService ao useEffect

### app/control-tower/page.tsx
- Remover imports não utilizados de componentes UI
- Implementar ou remover estados não utilizados (setRoutes, setSearchTerm)
- Adicionar fetchDashboardData nas dependências do useEffect

### components/InteractiveMap.tsx
- Implementar ou remover funções não utilizadas
- Adicionar todas as dependências faltantes nos useEffect
- Considerar usar useCallback nos handlers passados como props

### hooks/useWebSocket.ts
- Corrigir cleanup function do useEffect
- Guardar referência do wsService.current em uma variável no início do efeito

## Correções de Tipagem

1. Google Maps
- @types/google.maps já instalado ✅
- lib/global.d.ts já atualizado ✅

2. Neon/SQL
- lib/db.ts já usando any como solução temporária ✅

3. Firebase Auth
- firebaseClient.ts já usando any | null como tipo de retorno ✅

## Próximos Passos

1. Corrigir imports UI seguindo padrão shadcn (em andamento)
2. Resolver erros de hooks React (prioridade alta)
3. Implementar ou remover blocos vazios (catch blocks)
4. Remover código não utilizado
5. Corrigir dependências de useEffect/useMemo
6. Resolver warnings do ESLint
7. Executar formatação final com Prettier

## Comandos Úteis

```bash
# Verificar erros TypeScript
npx tsc --noEmit

# Rodar ESLint com autofix
npx eslint . --ext .ts,.tsx --fix

# Formatar código
npx prettier --write "**/*.{ts,tsx}"
```

## Notas Adicionais

1. Os erros de hooks React são os mais críticos e devem ser resolvidos primeiro
2. Muitos blocos catch vazios podem esconder erros - implementar tratamento adequado
3. Estados não utilizados podem indicar funcionalidades incompletas ou abandonadas
4. Considerar o uso de eslint-disable em casos específicos onde o warning não se aplica
5. Alguns imports não utilizados podem ser de funcionalidades futuras - verificar antes de remover