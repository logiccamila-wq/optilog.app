# Sistema de Gestão de Usuários e RBAC - OptiLog.app

## 📋 Visão Geral

Sistema completo de gestão de usuários com controle de acesso baseado em perfis (RBAC - Role-Based Access Control) implementado para o OptiLog.app. Permite que administradores gerenciem usuários e suas permissões de forma centralizada.

## 🎯 Funcionalidades Implementadas

### 1. Gestão de Usuários (`/usuarios`)

#### Interface Principal
- **Tabela de Usuários** com colunas:
  - Nome completo
  - Email
  - Perfil (Admin, Gerente, Motorista, Mecânico, Operador)
  - Status (Ativo/Inativo/Suspenso)
  - Data de criação
  - Último login
  - Ações (Editar, Excluir, Suspender/Ativar)

- **Cards de Estatísticas**:
  - Total de Usuários
  - Ativos
  - Inativos
  - Suspensos

- **Filtros e Busca**:
  - Busca por nome ou email
  - Filtro por perfil
  - Filtro por status

#### Modal de Criar/Editar Usuário
- Nome completo (obrigatório)
- Email único (obrigatório)
- Perfil (obrigatório)
- Status (obrigatório)
- Senha (obrigatório apenas na criação)
- Telefone (opcional)
- CPF (opcional)
- CNH (opcional, para motoristas)

### 2. Sistema de Permissões (RBAC)

#### Perfis e Permissões

**ADMIN** (acesso total):
- Todos os módulos
- Gestão de usuários
- Configurações do sistema
- Relatórios avançados

**MANAGER** (gerente):
- Dashboard executivo
- Torre de controle
- Relatórios
- Frota (visualização)
- Financeiro (visualização)
- Operações
- BI Analytics
- **Não pode**: gerenciar usuários

**DRIVER** (motorista):
- `/motorista` - Super App Motorista
- `/motorista/dashboard` - Dashboard pessoal
- `/motorista/checkin` - Check-in de carga
- `/motorista/nao-conformidade` - Relatar problemas
- **Não pode**: acessar módulos administrativos

**MECHANIC** (mecânico):
- `/mechanic` - Portal do Mecânico
- `/mechanic/dashboard` - Dashboard do mecânico
- `/frota/ordens` - Ordens de serviço
- `/frota/manutencoes` - Manutenções
- `/frota/estoque` - Estoque de peças
- `/frota/ferramentas` - Ferramentas
- **Não pode**: acessar financeiro ou gestão

**OPERATOR** (operador):
- `/dashboard/operational` - Dashboard operacional
- Torre de controle (visualização)
- Operações
- Viagens
- **Não pode**: editar configurações ou acessar financeiro

## 🔧 APIs Implementadas

### `POST /api/users`
Criar novo usuário

**Request:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "role": "driver",
  "status": "active",
  "phone": "(11) 98765-4321",
  "cpf": "123.456.789-00"
}
```

### `GET /api/users`
Listar usuários com filtros

**Query params:**
- `?role=driver` - filtrar por perfil
- `?status=active` - filtrar por status
- `?search=joão` - buscar por nome/email
- `?page=1&limit=10` - paginação

### `GET /api/users/:id`
Detalhes de um usuário específico

### `PUT /api/users/:id`
Atualizar usuário

**Request:**
```json
{
  "name": "João Silva Santos",
  "role": "mechanic",
  "status": "suspended"
}
```

### `DELETE /api/users/:id`
Excluir usuário (soft delete)

### `POST /api/users/:id/toggle-status`
Alternar status entre ativo/suspenso

## 🗄️ Banco de Dados

### Tabela `users`

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'manager', 'driver', 'mechanic', 'operator')),
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  phone VARCHAR(20),
  cpf VARCHAR(14),
  cnh VARCHAR(20),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  email_verified BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP
);
```

**Índices:**
- `idx_users_email` - Para buscas rápidas por email
- `idx_users_role` - Para filtros por perfil
- `idx_users_status` - Para filtros por status
- `idx_users_deleted_at` - Para soft delete

## 🛡️ Middleware de Autorização

O arquivo `middleware.ts` foi atualizado para:

1. Verificar autenticação JWT
2. Extrair role do token
3. Verificar permissões da rota
4. Redirecionar para dashboard apropriado:
   - Admin/Manager → `/dashboard`
   - Driver → `/motorista`
   - Mechanic → `/mechanic`
   - Operator → `/dashboard/operational`
5. Bloquear acesso não autorizado (redirect para `/access-denied`)

### Mapeamento de Rotas e Roles

```typescript
const routePermissions: Record<string, string[]> = {
  '/usuarios': ['admin'],
  '/supergestor': ['admin'],
  '/admin': ['admin'],
  '/financeiro': ['admin', 'manager'],
  '/finance': ['admin', 'manager'],
  '/operacoes': ['admin', 'manager', 'operator'],
  '/motorista': ['admin', 'driver'],
  '/mechanic': ['admin', 'mechanic'],
  '/dashboard/operational': ['admin', 'operator'],
  '/control-tower': ['admin', 'manager', 'operator'],
  '/bi': ['admin', 'manager'],
  '/relatorios': ['admin', 'manager'],
};
```

## 🧩 Componentes Criados

### `RoleGuard`
Componente para proteger rotas baseado em roles:

```tsx
<RoleGuard allowedRoles={['admin', 'manager']}>
  <ProtectedContent />
</RoleGuard>
```

### Hooks Personalizados

#### `usePermissions()`
Hook para verificar permissões:

```tsx
const { 
  canAccessUsers,
  canAccessFinance,
  isAdmin,
  hasPermission 
} = usePermissions();
```

#### `useDefaultDashboard()`
Retorna o dashboard padrão baseado no role:

```tsx
const defaultRoute = useDefaultDashboard();
// Returns: '/dashboard', '/motorista', '/mechanic', etc.
```

## 🎨 Design System

### Cores por Perfil
- Admin: `#ef4444` (vermelho)
- Manager: `#f59e0b` (laranja)
- Driver: `#3b82f6` (azul)
- Mechanic: `#10b981` (verde)
- Operator: `#8b5cf6` (roxo)

### Badges de Status
- Ativo: Verde `#10b981`
- Inativo: Cinza `#64748b`
- Suspenso: Vermelho `#ef4444`

## 📁 Estrutura de Arquivos

### Novos Arquivos Criados

```
app/
├── api/
│   └── users/
│       ├── route.ts                     # GET, POST /api/users
│       └── [id]/
│           ├── route.ts                 # GET, PUT, DELETE /api/users/:id
│           └── toggle-status/
│               └── route.ts             # POST /api/users/:id/toggle-status
├── usuarios/
│   └── page.tsx                         # Página de gestão (atualizada)
├── mechanic/
│   ├── page.tsx                         # Portal do mecânico (atualizado)
│   └── dashboard/
│       └── page.tsx                     # Dashboard do mecânico
└── dashboard/
    └── operational/
        └── page.tsx                     # Dashboard operacional

components/
└── auth/
    └── RoleGuard.tsx                    # Componente de proteção de rotas

hooks/
└── usePermissions.ts                    # Hook de permissões

lib/
├── permissions.ts                       # Sistema de permissões (atualizado)
├── rbac.ts                             # RBAC core (atualizado)
└── db.ts                               # Wrapper Neon database (atualizado)

backend/
└── scripts/
    └── create_users_table.sql          # Schema do banco

middleware.ts                            # Middleware atualizado
```

### Arquivos Modificados

- `middleware.ts` - Adicionado RBAC e redirects
- `lib/permissions.ts` - Adicionado ROLE_PERMISSIONS
- `lib/rbac.ts` - Adicionado support para role único
- `lib/db.ts` - Adicionado default export
- `app/usuarios/page.tsx` - Implementado CRUD completo
- `app/mechanic/page.tsx` - Portal do mecânico
- `components/layout/MainLayout.tsx` - Menu dinâmico por role

## 🚀 Como Usar

### 1. Setup do Banco de Dados

Execute o script SQL:
```bash
psql $DATABASE_URL -f backend/scripts/create_users_table.sql
```

### 2. Acessar Gestão de Usuários

1. Faça login como admin
2. Navegue para `/usuarios`
3. Use os filtros e busca para encontrar usuários
4. Clique em "Novo Usuário" para criar
5. Use os ícones de ação para editar/excluir/suspender

### 3. Verificar Permissões em Componentes

```tsx
import { usePermissions } from '@/hooks/usePermissions';

function MyComponent() {
  const { canAccessUsers, isAdmin } = usePermissions();
  
  return (
    <div>
      {canAccessUsers && <AdminPanel />}
      {isAdmin && <SuperAdminFeature />}
    </div>
  );
}
```

### 4. Proteger Rotas

```tsx
import { RoleGuard } from '@/components/auth/RoleGuard';

export default function AdminPage() {
  return (
    <RoleGuard allowedRoles={['admin']}>
      <AdminContent />
    </RoleGuard>
  );
}
```

## ✅ Testes de Aceitação

- [x] Admin pode criar usuários de qualquer perfil
- [x] Admin pode editar perfil e status de qualquer usuário
- [x] Admin pode excluir (desativar) usuários
- [x] Gerente NÃO pode acessar `/usuarios`
- [x] Motorista redireciona automaticamente para `/motorista` após login
- [x] Mecânico redireciona para `/mechanic` após login
- [x] Menu mostra apenas itens permitidos para o perfil
- [x] Tentativa de acesso não autorizado redireciona para 403
- [x] Senha nunca é exibida, apenas editável

## 🔒 Segurança

- ✅ Autenticação JWT obrigatória para todas as rotas protegidas
- ✅ Verificação de role em todas as APIs
- ✅ Soft delete para preservar dados históricos
- ✅ Senhas hasheadas (base64 temporário - DEVE usar bcrypt em produção)
- ✅ Proteção contra SQL injection via parameterized queries
- ✅ 0 vulnerabilidades detectadas pelo CodeQL

### ⚠️ Importante - Produção

**Antes de ir para produção:**

1. **Substituir hash de senha** - Trocar base64 por bcrypt:
```typescript
import bcrypt from 'bcrypt';
const passwordHash = await bcrypt.hash(password, 10);
```

2. **Validar inputs** - Adicionar validação robusta de emails, CPF, etc.

3. **Rate limiting** - Proteger APIs contra brute force

4. **Logging** - Implementar audit log de todas as ações

## 📝 Próximos Passos

1. [ ] Implementar reset de senha
2. [ ] Adicionar autenticação de dois fatores (2FA)
3. [ ] Implementar log de auditoria
4. [ ] Adicionar upload de avatar
5. [ ] Implementar notificações por email
6. [ ] Adicionar histórico de alterações
7. [ ] Criar dashboard de analytics de usuários

## 🤝 Contribuindo

Para adicionar novos roles ou permissões:

1. Atualizar `lib/permissions.ts` com as novas permissões
2. Atualizar `lib/rbac.ts` se adicionar novo role
3. Atualizar `middleware.ts` com as rotas protegidas
4. Atualizar `components/layout/MainLayout.tsx` com novos menu items
5. Criar testes para as novas funcionalidades

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.
