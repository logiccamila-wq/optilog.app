import streamlit as st

def render():
    st.header("Componentes & Fluxo de Dados")
    
    st.subheader("Frontends")
    st.markdown("""
    - **FlutterFlow apps (motorista, cliente, gestor)**: autenticação via Firebase Auth; leitura/gravação em Firestore; upload de comprovantes em Storage.
    - **Next.js admin (seu painel)**: dashboards, controle de regras, auditoria, exportação de relatórios.
    - **BI Dashboard (Looker Studio / Recharts embutido)** para CFO com drill-down.
    """)
    
    st.subheader("Backend")
    st.markdown("""
    - **Firestore** será a fonte de verdade para transações, contas a pagar/receber, lançamentos contábeis, contratos e histórico.
    - **Cloud Functions (TypeScript)** para:
        - ingestão e validação de NF-e / XML (webhooks / upload)
        - OCR invoices (via Vision API) + gerar lançamentos contábeis automatizados
        - conciliação bancária (connect a APIs de bancos / Open Banking)
        - agendador de jobs (Cloud Scheduler -> Functions) para lembretes/pagamentos
        - endpoints de ML (previsão fluxo de caixa, scoring de crédito)
        - Chatbot gateway (recebe prompt, consulta dados e retorna resposta)
    - **ML**: Treino em Vertex AI (recomendado) ou em Functions com scikit-learn / Prophet / TensorFlow; deploy como endpoint (Vertex/Cloud Run).
    """)
    
    st.subheader("Integrações")
    st.markdown("""
    - **Bancos** via APIs Open Banking (ou integração via PSP / Gateway).
    - **SEFAZ** para emissão e validação de NF-e.
    - **Sistemas contábeis** via API para export de lançamentos (Sped/contábil).
    """)
    
    st.subheader("Eventos")
    st.markdown("""
    - Firestore triggers -> Functions -> Pub/Sub -> downstream actions (notificações, gerar boletos, atualizar KPIs).
    """)
