# Fluxograma Operacional e Hierárquico — Ordem de Manutenção

Este fluxograma representa o fluxo digital de autorizações e execução entre os níveis: Mecânico → Encarregado → Diretor Operacional → Financeiro, com notificações via Chatbot.

```mermaid
flowchart TD
    MECH[Mecânico]
    FORE[Encarregado]
    DIR[Diretor Operacional]
    FIN[Financeiro]
    CB[Chatbot/Alertas]

    MECH -->|Cria ordem| ORD[Ordem Aberta]
    ORD -->|Protocolo automático| PROT[Protocolo]
    ORD -->|Enviar para revisão| REV[Validação Técnica]
    REV -->|Aprovar| AUTH[Autorização Operacional]
    REV -->|Devolver| MECH
    AUTH -->|Autoriza compra/execução| PUR[Compra Autorizada]
    AUTH -->|Cancelar| CANC[Cancelada]
    PUR -->|Pagamento| PAY[Pagamento Executado]
    PAY -->|Finaliza| DONE[Finalizada]

    REV -.notifica.-> CB
    AUTH -.notifica.-> CB
    FIN -.notifica.-> CB

    classDef state fill:#e8f5e9,stroke:#2e7d32,color:#1b5e20;
    class ORD,REV,AUTH,PUR,PAY,DONE state
```

Legenda

- Protocolo: gerado automaticamente ao criar a ordem.
- Devolver: Encarregado solicita ajustes ao Mecânico com observações.
- Cancelar: permitido ao Diretor ou Financeiro com motivo obrigatório (auditado).
- Chatbot: envia alertas diários, solicita aprovação rápida e consolida resumos.

Observações

- Cada transição é auditada (usuário, papel, horário, motivo).
- Regras de permissão por módulo variam conforme papel (ver documentação).
