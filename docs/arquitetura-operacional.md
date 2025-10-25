# Arquitetura Operacional — Fluxo de Autorizações e Execução

Este documento formaliza a estrutura conceitual de fluxo operacional e hierárquico para ordens de manutenção.

## 1. Níveis Hierárquicos e Permissões

- **Mecânico**
  - Responsabilidade: Executa serviço e registra ordem de manutenção.
  - Permissões: Criar ordem, anexar fotos, atualizar status técnico.
- **Encarregado**
  - Responsabilidade: Supervisiona equipe; valida tecnicamente; aprova ou devolve.
  - Permissões: Aprovar serviço, solicitar ajustes, encaminhar para Diretor.
- **Diretor Operacional**
  - Responsabilidade: Valida operações, custos e prioridades.
  - Permissões: Autorizar execução, autorizar compra, cancelar ordem (auditar motivo).
- **Financeiro**
  - Responsabilidade: Gerencia orçamentos e pagamentos.
  - Permissões: Liberar verba, efetuar pagamento, registrar notas fiscais, cancelar ordem (auditar motivo).
- **Administrador**
  - Responsabilidade: Governança e segurança.
  - Permissões: Excluir registro (apenas soft delete), manter histórico e auditoria.

## 2. Cadeia de Processos (Workflow)

1. **Abertura da Ordem**
   - Mecânico registra problema; sistema gera protocolo automaticamente.
2. **Validação Técnica**
   - Encarregado revisa; pode aprovar ou devolver com observações.
3. **Autorização Operacional**
   - Diretor analisa custo/impacto; autoriza execução/compra ou cancela.
4. **Financeiro**
   - Executa pagamento, registra notas, atualiza status final.
5. **Notificação/Chatbot**
   - Alertas e resumos por setor; aprovações rápidas; consolidação para diretoria.

## 3. Regras do Sistema e Auditorias

- Cada ação tem **permissão mínima**:
  - Criar ordem → Mecânico (gera protocolo).
  - Aprovar serviço → Encarregado (pode adicionar observações).
  - Autorizar compra → Diretor (gera registro contábil).
  - Efetuar pagamento → Financeiro (necessita de autorização anterior).
  - Cancelar ordem → Diretor/Financeiro (**motivo obrigatório**).
  - Excluir registro → Administrador (**soft delete**; histórico mantido no log).
- **Auditoria** em todas as transições: usuário, papel, timestamp, ação, motivo.
- **Validações** e **máscaras** aplicadas em entradas (CNH, Placa, Telefone).

## 4. Metas, Indicadores (KPIs) e Alertas

- **Oficina**
  - Indicador: Ordens concluídas/dia.
  - Alerta: Ordem parada > 48h.
- **Operacional**
  - Indicador: Taxa de autorização.
  - Alerta: Pendências acima de limite.
- **Financeiro**
  - Indicador: Pagamentos aprovados.
  - Alerta: Solicitação sem nota fiscal.
- **Diretoria**
  - Indicador: Custos gerais/mês.
  - Alerta: Meta orçamentária excedida.

## 5. Chatbot e Comunicação Integrada

- Canais: WhatsApp, Telegram ou painel interno.
- Funcionalidades:
  - Envia alertas e indicadores diários por setor.
  - Aprovação rápida (ex.: “Aprovar ordem #234?” ✅❌).
  - Resumo consolidado para diretoria.

## 6. Resumo do Fluxo

Mecânico → (cria)
↓
Encarregado → (valida)
↓
Diretor → (autoriza)
↓
Financeiro → (executa)
↓
Chatbot → (notifica e consolida)

---

Referência visual: ver `docs/fluxo-operacional.md` (Mermaid) para o fluxograma.