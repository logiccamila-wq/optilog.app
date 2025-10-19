# Roadmap de Módulos (TMS, CRM, TPMS, ERP, Frota, Logística) e IA

Este documento organiza os módulos desejados (TMS, CRM, TPMS, ERP, Frota, Logística/Transportes) e como eles se conectam à arquitetura atual do projeto, incluindo diferenciais como ML/IA e chatbots. Serve como referência prática para evolução do produto e padronização da UI/UX com internacionalização.

## Mapeamento para o Projeto (Next.js)

- Rotas locais em `app/dashboard/[module]`:
  - `visao-geral`: Visão Geral
  - `pedidos`: Pedidos (TMS/ERP)
  - `crm`: CRM
  - `logistica`: Logística (TMS)
  - `estoque`: Estoque (ERP)
  - `frota`: Gestão de Frota (TPMS e manutenção)
  - `financeiro`: Financeiro (ERP)
  - `analise`: Análise (BI/IA)
- Atalhos/Apps: `driver` (Motorista), `mechanic` (Mecânico), `usuarios`, `cadastro/*`
- Diferenciais atuais:
  - `ai/cfo`: CFO Assistido por IA
  - `ai/economista`: Economista Assistido por IA
  - `finance/fpa`: Planejamento e Análise Financeira (FP&A)

## TMS (Transportation Management System)

- Planejamento de cargas e rotas.
- Tabelas de frete, SLA e promessas de entrega.
- Tracking em tempo real (GPS, eventos de viagem). 
- Janela de coleta/entrega, consolidado e desconsolidado.
- Documentos de transporte (CT-e, MDF-e), integrações fiscais (quando aplicável).
- Auditoria de custos logísticos (pedágio, diesel, diárias) e simulações.
- KPIs: OTIF, lead time, cumprimento de SLA, custo por km, custo por entrega.

## CRM

- Cadastro de clientes, contatos, oportunidades e contratos.
- Produtos/serviços, listas de preço e condições comerciais.
- Funil de vendas, pipelines e metas.
- Relacionamento pós-venda e satisfação (NPS/CSAT).
- Relatórios de conversão e receita por cliente.

## TPMS / Gestão de Pneus (parte de Frota)

- Registro de pneus por posição, marca, vida útil, recapagens.
- Inspeções periódicas e aferições de profundidade.
- Alertas de baixa vida útil e substituição preventiva.
- Controle de estoque de pneus, ordens de compra e custos.
- KPIs: custo por km, vida média, taxa de recapagem, pneus por veículo.

## ERP (Financeiro/Estoque/Compras)

- Financeiro: contas a pagar/receber, conciliações, fluxo de caixa.
- Faturamento e notas (serviço/produto), centro de custos.
- Compras: requisições, pedidos e recebimento.
- Estoque: níveis, ponto de reposição, rupturas, inventário.
- Integrações fiscais/contábeis conforme jurisdição.

## Gestão de Frota

- Cadastro de veículos (placa, modelo, ano, odômetro).
- Manutenções preventivas e corretivas, checklist e ordens de serviço.
- Rastreamento, consumo, média km/l, disponibilidade.
- Alertas de revisão e recall.
- KPIs: disponibilidade, custo por km, manutenção por veículo.

## Logística / Transportes

- Planejamento de rotas, last-mile, consolidação e hubs.
- Cálculo de custos e simulações (multi-parâmetro).
- Visibilidade ponta a ponta: coleta → transferência → entrega.
- Governança: devoluções, danos, reentregas.

## ML, IA e Chatbots

- Copilots especializados (CFO, Economista, Operações).
- Modelos de previsão: demanda, rupturas e custos (Vertex AI/Gemini).
- Anomalias em KPIs (OTIF, lead time, custo).
- Chatbots para suporte e busca semântica em documentos (Políticas/SLAs).
- Genkit/Google AI para pipelines e orquestração.

## UI/UX Padronizada com i18n

- Idiomas: PT, EN, ES com selector no Header.
- Termos padronizados por módulo (ex.: Pedidos/Orders/Pedidos).
- Paleta e tokens de design já definidos em `ThemeProvider`.
- Navegação coerente entre dashboard, cadastro e apps.

## Próximos Passos Recomendados

1. Definir coleções Firestore por módulo (clientes, pedidos, veículos, pneus, faturas, estoque).
2. Especificar permissões e perfis (Admin, Operador, Financeiro, Motorista, Mecânico).
3. Desenhar eventos operacionais (embarque, ocorrência, chegada, entrega) e webhooks.
4. Integrar dados externos (GPS/telemática, ERPs, gateways fiscais).
5. Evoluir BI: painéis por função + alertas e insights com IA.

## Particularidades do Seu Projeto

- Páginas de IA (`/ai/cfo`, `/ai/economista`) e FP&A (`/finance/fpa`).
- Rotas de módulo já preparadas no dashboard com placeholders e tabelas.
- Suporte a PWA (Service Worker + SWUpdateSnackbar) e tema escuro.
- Configuração otimizada de desenvolvimento (Turbopack, cache em memória).