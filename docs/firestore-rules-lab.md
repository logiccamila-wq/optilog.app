# Laboratório de Testes de Regras – Firestore

Este guia mostra como executar testes automatizados de regras de segurança do Firestore para o Optilog.

## Pré‑requisitos

- Node `>=20` (já configurado no projeto).
- Instalar dependências de teste: `vitest` e `@firebase/rules-unit-testing`.

## Instalação

1) Instale as dependências de desenvolvimento:

```
npm i -D vitest @firebase/rules-unit-testing
```

2) Scripts no `package.json`:

```
"test:rules": "vitest run --config vitest.config.ts"
```

## Executar testes

```
npm run test:rules
```

Os testes usam `initializeTestEnvironment` e carregam as regras a partir de `firestore.rules`. Eles cobrem permissões de `users`, `posts`, `shipments`, `veiculos` e `invoices`.

## Emulador (opcional)

Caso prefira executar os testes com o emulador manualmente:

1) Instale as ferramentas: `npm i -g firebase-tools`
2) Inicie apenas o Firestore:

```
firebase emulators:start --only firestore
```

Em seguida, rode `npm run test:rules` em outro terminal.

## Dicas

- Use `testEnv.withSecurityRulesDisabled` para semear dados iniciais quando necessário.
- Mantenha o modelo de ownership consistente (`userId === auth.uid`).
- Evite índices compostos desnecessários; para consultas mais complexas, crie índices em `firestore.indexes.json`.