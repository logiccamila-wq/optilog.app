# Compliance Kit: ISO & POP

Objetivo: padronizar processos (ISO) e POPs (Procedimentos Operacionais Padrão).

## Estrutura recomendada

- `compliance_policies(id, code, title, version, created_at, updated_at)`
- `pop_documents(id, code, title, area, effective_at, created_at, updated_at)`
- `pop_steps(id, pop_id, step_no, description, created_at, updated_at)`

## Padrões sugeridos

- ISO 9001 (qualidade), ISO 27001 (segurança), ISO 14001 (meio ambiente)
- Vincular POPs a áreas: WMS, TMS, OMS etc.

## Endpoints

- `POST /api/compliance/policies`
- `POST /api/compliance/pops`
- `GET /api/compliance/pops?q&page&area`

## Observações

- versionamento por `version` e auditoria com `updated_at`
- permitir anexos com armazenamento (ex.: Supabase Storage / Firebase)