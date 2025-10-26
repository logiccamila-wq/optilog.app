import streamlit as st
import pandas as pd

def render():
    st.header("Firestore — Coleções principais")
    
    collections = {
        "companies": {
            "fields": ["name", "cnpj", "address", "timezone", "fiscalSettings"],
            "description": "Informações da empresa"
        },
        "accounts": {
            "fields": ["companyId", "name", "type", "currency", "bankDetails", "balanceCached"],
            "description": "Conta contábil / financeira (caixa, banco, cartão)"
        },
        "payables": {
            "fields": ["companyId", "supplierId", "dueDate", "amount", "currency", "status", "invoiceRef", "createdAt", "paidAt", "method", "reconciliationInfo"],
            "description": "Contas a pagar"
        },
        "receivables": {
            "fields": ["companyId", "clientId", "dueDate", "amount", "status", "invoiceRef", "receivedAt", "method"],
            "description": "Contas a receber"
        },
        "transactions": {
            "fields": ["companyId", "accountId", "type", "amount", "category", "description", "sourceRef", "createdAt"],
            "description": "Transações financeiras"
        },
        "invoices": {
            "fields": ["companyId", "xmlUrl", "pdfUrl", "number", "serie", "total", "issuerCNPJ", "recipientCNPJ", "status", "validatedAt"],
            "description": "NF-e / XML"
        },
        "bank_statements": {
            "fields": ["companyId", "accountId", "periodStart", "periodEnd", "rawData", "parsed"],
            "description": "Extratos bancários"
        },
        "reconciliations": {
            "fields": ["companyId", "accountId", "reconciledAt", "itemsMatched", "unmatched"],
            "description": "Conciliações bancárias"
        },
        "budget": {
            "fields": ["companyId", "year", "month", "categoryAllocations", "owner"],
            "description": "Orçamentos"
        },
        "forecast": {
            "fields": ["companyId", "horizonDays", "generatedAt", "modelVersion", "projections", "assumptions"],
            "description": "Previsões financeiras"
        },
        "alerts": {
            "fields": ["companyId", "type", "severity", "message", "targetUsers", "resolved", "createdAt"],
            "description": "Alertas do sistema"
        },
        "auditLogs": {
            "fields": ["companyId", "userId", "action", "details", "createdAt"],
            "description": "Logs de auditoria"
        }
    }
    
    # Seletor de coleção
    selected_collection = st.selectbox("Selecione uma coleção para ver detalhes:", list(collections.keys()))
    
    # Exibir detalhes da coleção selecionada
    st.subheader(f"Coleção: {selected_collection}")
    st.markdown(f"**Descrição**: {collections[selected_collection]['description']}")
    
    # Criar tabela de campos
    fields_df = pd.DataFrame({
        "Campo": collections[selected_collection]["fields"],
        "Tipo": ["String", "String", "Date", "Number", "String", "String", "String", "Timestamp", "Timestamp", "String", "Object"][:len(collections[selected_collection]["fields"])]
    })
    
    st.dataframe(fields_df, use_container_width=True)
    
    # Índices sugeridos
    st.markdown("**Índices sugeridos**: companyId + dueDate on payables/receivables; companyId + accountId + period on statements, etc.")
