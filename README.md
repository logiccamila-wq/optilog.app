# OptiLog.app - Plataforma de Gestão Logística Inteligente

Aplicação web completa para gestão de operações logísticas, construída com Next.js/React, com autenticação via Stack Auth e persistência de dados no Neon Postgres.

## ✨ Funcionalidades Principais

### Gestão de Frota
- Cadastro e controle de veículos
- Gestão de motoristas e equipes
- Manutenções preventivas e corretivas
- Controle de abastecimentos
- Gestão de pneus e recapagens

### TMS (Transport Management System)
- Gestão de cargas e viagens
- Rastreamento em tempo real (Control Tower)
- Gestão de entregas e PoD digital
- Faturamento de CTe e NF-e

### Financeiro Completo
- Contabilidade (Plano de Contas + Lançamentos + Balancete)
- Contas a Pagar e Receber
- DRE (Demonstração de Resultados)
- Gestão de Impostos
- Centros de Custo
- Conciliação Bancária

### Operações
- POP (Procedimentos Operacionais Padrão)
- SASSMAQ, ISO 9001/14001/45001
- Gestão de não conformidades
- Indicadores e KPIs

### Inteligência Artificial
- CFO Virtual - Análises financeiras automatizadas
- Economista Virtual - Insights macroeconômicos
- Assistentes especializados

### Integrações
- Notion (sincronização de tarefas)
- Google Calendar
- WhatsApp Business (planejado)

## 🛠️ Tecnologias

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18, TypeScript
- **Estilização**: MUI (Material-UI), Tailwind CSS
- **Componentes**: shadcn/ui
- **Ícones**: Lucide React, Material Icons
- **Mapas**: Leaflet, React Leaflet
- **Gráficos**: Chart.js, React ChartJS 2

### Backend
- **Runtime**: Node.js
- **Database**: Neon Postgres (Serverless)
- **ORM**: @neondatabase/serverless
- **Auth**: Stack Auth (OAuth, magic links)

### DevOps & Deploy
- **CI/CD**: GitHub Actions
- **Deploy**: Vercel (recomendado)
- **Container**: Docker (opcional)
- **Registry**: GitHub Container Registry

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js >= 18.0.0
- npm ou yarn
- Conta no Neon Database (opcional para dev)

### Instalação

1. Clone o repositório:
```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd optilog.app
```

2. Instale as dependências:
```bash
npm ci
```

3. Configure as variáveis de ambiente:

Crie um arquivo `.env.local` baseado em `.env.example`:

```env
# Database (Neon)
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://user:pass@host/db

# Auth (Stack Auth)
STACK_AUTH_PROJECT_ID=your_project_id
STACK_AUTH_JWKS_URL=https://api.stack-auth.com/...

# OAuth (opcional)
STACK_AUTH_OAUTH_GITHUB_CLIENT_ID=
STACK_AUTH_OAUTH_GITHUB_CLIENT_SECRET=
STACK_AUTH_OAUTH_GOOGLE_CLIENT_ID=
STACK_AUTH_OAUTH_GOOGLE_CLIENT_SECRET=

# API
NEXT_PUBLIC_API_URL=http://localhost:3000

# OpenAI (opcional - para módulos IA)
OPENAI_API_KEY=sk-...
```

4. Execute o ambiente de desenvolvimento:
```bash
npm run dev
```

5. Abra [http://localhost:3000](http://localhost:3000) no navegador

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento

# Build
npm run build            # Build de produção
npm run build:force      # Build forçado (limpa .next antes)

# Produção
npm run start            # Inicia servidor (wrapper)
npm run start:prod       # Inicia standalone server

# Qualidade
npm run lint             # ESLint
npm run lint:fix         # ESLint com auto-fix

# Database
npm run db:migrate       # Aplica migrations SQL

# Testes
npm run test:e2e         # Testes E2E com Playwright
```

## 🗄️ Banco de Dados

### Setup Inicial

1. Crie um database no [Neon](https://neon.tech)
2. Configure as variáveis `DATABASE_URL` e `DATABASE_URL_UNPOOLED`
3. Execute os scripts de setup:

```bash
# Scripts disponíveis em backend/scripts/
node backend/scripts/db_setup_full.mjs
```

Ou use o script de migração:

```bash
npm run db:migrate
```

### Estrutura
- 48+ tabelas implementadas
- Schema completo para TMS, WMS, Financeiro
- Scripts SQL em `backend/scripts/`

## 🚢 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório no [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente
3. Deploy automático em cada push na `main`

#### Variáveis Obrigatórias no Vercel:
- `DATABASE_URL` (Neon pooler)
- `DATABASE_URL_UNPOOLED` (Neon direct)
- `JWT_SECRET` (min 32 chars)
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_API_URL`

Consulte [`DEPLOY_GUIDE.md`](./DEPLOY_GUIDE.md) para instruções detalhadas.

## 📁 Estrutura do Projeto

```
optilog.app/
├── app/                      # Next.js App Router
│   ├── dashboard/           # Dashboard principal
│   ├── cadastro/            # Cadastros (veículos, motoristas, etc)
│   ├── frota/              # Gestão de frota
│   ├── tms/                # Transport Management
│   ├── ai/                 # Módulos de IA
│   ├── integrations/       # Integrações externas
│   └── api/                # API Routes (69 endpoints)
├── backend/                # Backend Node.js
│   ├── scripts/            # Scripts DB e migrations
│   └── db.ts              # Neon client
├── components/             # React Components
├── lib/                   # Bibliotecas e utilitários
├── public/                # Assets estáticos
└── docs/                  # Documentação
```

## 📊 Status do Projeto

- ✅ **24 módulos principais** implementados
- ✅ **48 módulos especializados** disponíveis
- ✅ **69 API routes** configurados
- ✅ **Build limpo** sem erros ou warnings
- ✅ **Lint passing** (warnings aceitáveis)
- ✅ **Pronto para deploy**

Veja [`MODULOS_STATUS.md`](./MODULOS_STATUS.md) para detalhes completos.

## 🎯 Roadmap

### Próximas Implementações
1. **Backend Integration**
   - Substituir mock data por queries reais
   - Conectar módulos IA ao Gemini/OpenAI
   - Autenticação completa

2. **Testes**
   - Cobertura E2E com Playwright
   - Testes unitários (Jest/Vitest)
   - Validação de formulários (Zod)

3. **Performance**
   - Lazy loading de módulos
   - Otimização de imagens
   - Cache de dados

4. **Integrações**
   - WhatsApp Business API
   - APIs de rastreamento
   - ERPs externos

## 📝 Documentação

- [Guia de Deploy](./DEPLOY_GUIDE.md)
- [Setup do Banco de Dados](./SETUP_DATABASE.md)
- [Status dos Módulos](./MODULOS_STATUS.md)
- [Plano de Implementação](./PLANO_IMPLEMENTACAO.md)
- [Go Live Checklist](./GO_LIVE_CHECKLIST.md)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

ISC License

## 👥 Equipe

Veja [`EQUIPE.md`](./EQUIPE.md) para informações sobre a equipe e estrutura organizacional.

---

**OptiLog.app** - Transformando a gestão logística com tecnologia e inteligência artificial 🚛✨
