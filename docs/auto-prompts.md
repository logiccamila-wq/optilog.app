# OptiLog.app – Pacote de Prompts e Execução

Este pacote organiza prompts prontos e passos de execução para gerar código com OpenAI, cobrindo backend (Express + SQLite + JWT), frontend (Next.js) e IA/ML.

## Variáveis de ambiente

Crie um arquivo `.env` na pasta `backend/` com:

```
OPENAI_API_KEY=SEU_TOKEN_AQUI
JWT_SECRET=uma-chave-secreta-forte
PORT=3001
```

E no `.env.local` do Next.js:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_DISABLE_FIREBASE=1
```

## Backend – Prompts prontos

Use o endpoint POST `http://localhost:3001/gerar-endpoint` com `{"prompt": "..."}`.

- Backend completo:

```
Crie um backend completo em Node.js usando Express e SQLite para o projeto OptiLog.
Inclua: autenticação JWT com bcrypt para login e registro; CRUD completo para entidades clientes, produtos, pedidos; endpoints de upload/download de arquivos na pasta /uploads; estrutura modular com pastas routes, controllers e models; pronto para rodar localmente.
```

- CRUD Clientes:

```
Crie endpoints Express com SQLite para clientes: listar, criar, atualizar e remover. Valide campos obrigatórios. Responda apenas com código.
```

- CRUD Produtos:

```
Crie endpoints Express com SQLite para produtos com campos name, sku, price. Inclua validação e tratamento de erros. Responda apenas com código.
```

- CRUD Pedidos:

```
Crie endpoints Express para pedidos relacionando customers e products (FK), com quantity, listando com JOIN para retornar nomes. Responda apenas com código.
```

- Upload/Download:

```
Crie endpoints de upload usando multer salvando em /uploads e disponibilize arquivos com estático. Responda apenas com código.
```

## Frontend – Prompts prontos

Você pode usar o mesmo endpoint com prompts focados em Next.js:

- Frontend completo:

```
Crie um frontend em Next.js (App Router) para OptiLog com páginas: Login (JWT), Dashboard, CRUD de clientes e produtos, integração com backend via fetch, formulários com validação, layout responsivo simples, botões para upload/download. Responda apenas com código.
```

- Página Clientes:

```
Crie uma página Next.js que consome /customers (GET/POST/PUT/DELETE) com formulário e tabela simples. Use Authorization Bearer token. Responda apenas com código.
```

- Página Produtos:

```
Crie uma página Next.js que consome /products (GET/POST/PUT/DELETE) com formulário e tabela simples. Use Authorization Bearer token. Responda apenas com código.
```

## IA/ML – Prompts prontos

- Módulo FastAPI básico:

```
Crie um módulo FastAPI com endpoint /ai-ping e /gerar-logica que recebe texto e retorna validações simples. Responda apenas com código.
```

- Script Node de validação:

```
Crie um módulo Node.js que exporta funções de validação de entradas (email, telefone, preço) e integração simples com backend. Responda apenas com código.
```

## Passos de execução

- Backend:

```
cd backend
npm install
node app.js
```

- Frontend (já existente no projeto):

```
# ajuste .env.local com NEXT_PUBLIC_BACKEND_URL
yarn dev
# acesse http://localhost:3000/clientes e http://localhost:3000/produtos
```

## Notas de deploy (Render/Railway)

- Backend: Node 20, Start Command `node app.js`, env `OPENAI_API_KEY`, `JWT_SECRET`, `PORT`.
- Frontend: Node 20, Build `yarn build`, Start `yarn start`, env `NEXT_PUBLIC_BACKEND_URL` apontando para o serviço do backend.
- ML: serviço separado (FastAPI/Node) se optar.
