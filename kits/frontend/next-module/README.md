# Next.js Module Kit

Página padrão com CRUD simples e tabela usando MUI.

## Uso
1. Copie `page.template.tsx` para `app/dashboard/nova-feature/page.tsx`.
2. Ajuste endpoints (`/items`) no backend.
3. Adicione a nova entrada no array `modules` em `app/dashboard/[module]/page.tsx` (se necessário).

## Dependências
- Next.js 14, React 18, MUI 5.
- Helper `apiFetch` em `utils/api.ts`.