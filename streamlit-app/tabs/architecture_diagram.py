import streamlit as st

def render():
    st.header("📊 Diagrama de Arquitetura")
    
    # Diagrama Mermaid
    mermaid_diagram = '''
    flowchart LR
      subgraph Users
        UAdmin[Admin / CFO]
        UManager[Gerente Financeiro]
        UDriver[Motorista]
        UClient[Cliente / Pagador]
      end

      subgraph Frontend
        FFApp[FlutterFlow Apps]
        FFWeb[Admin Web (Next.js)]
        Dash[BI Dashboard]
        ChatUI[Chatbot UI]
      end

      subgraph Firebase
        Auth[Firebase Auth]
        Firestore[Firestore Collections]
        Storage[Cloud Storage]
        Functions[Cloud Functions (TS)]
        PubSub[Pub/Sub - Events]
      end

      subgraph ML
        MLTrain[Training (Vertex AI / AutoML / Functions)]
        MLModel[Deployed Model (Vertex AI / Cloud Run)]
      end

      subgraph BankIntegrations
        BankAPI[Bank / Open Banking]
        PaymentGateway[Pagamento / PIX / Boleto]
      end

      subgraph External
        GovAPI[SEFAZ / Sefaz NF-e Webservice]
        AccountingSys[ERP/Contábil Externo]
      end

      UAdmin -->|UI| FFWeb
      UManager -->|UI| FFWeb
      UDriver -->|UI| FFApp
      UClient -->|UI| FFApp

      FFWeb -->|Auth| Auth
      FFApp -->|Auth| Auth
      ChatUI -->|Auth| Auth

      FFWeb --> Firestore
      FFApp --> Firestore
      Dash --> Firestore
      ChatUI --> Functions

      Firestore --> Functions
      Functions -->|train data| MLTrain
      MLTrain --> MLModel
      Functions --> MLModel
      MLModel --> Functions

      Functions -->|call| BankAPI
      Functions -->|call| PaymentGateway
      Functions -->|call| GovAPI
      Functions -->|push| PubSub
      PubSub --> Functions

      Functions --> Storage
      Functions --> AccountingSys
    '''
    
    st.markdown(f"```mermaid\n{mermaid_diagram}\n```")
    
    st.info("**Nota:** Para visualizar o diagrama Mermaid, copie o código acima e cole em um editor que suporte Mermaid (VS Code + extensão, Obsidian, Notion + plugin, etc.)")
    
    # Imagem alternativa do diagrama
    st.subheader("Visualização Simplificada")
    
    # Criando uma visualização simplificada usando colunas do Streamlit
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.markdown("### Usuários")
        st.markdown("- Admin / CFO")
        st.markdown("- Gerente Financeiro")
        st.markdown("- Motorista")
        st.markdown("- Cliente / Pagador")
        
        st.markdown("### Frontend")
        st.markdown("- FlutterFlow Apps")
        st.markdown("- Admin Web (Next.js)")
        st.markdown("- BI Dashboard")
        st.markdown("- Chatbot UI")
    
    with col2:
        st.markdown("### Firebase")
        st.markdown("- Firebase Auth")
        st.markdown("- Firestore Collections")
        st.markdown("- Cloud Storage")
        st.markdown("- Cloud Functions (TS)")
        st.markdown("- Pub/Sub - Events")
    
    with col3:
        st.markdown("### ML")
        st.markdown("- Training (Vertex AI / AutoML)")
        st.markdown("- Deployed Model (Vertex AI)")
        
        st.markdown("### Integrações Bancárias")
        st.markdown("- Bank / Open Banking")
        st.markdown("- Pagamento / PIX / Boleto")
    
    with col4:
        st.markdown("### Externos")
        st.markdown("- SEFAZ / NF-e Webservice")
        st.markdown("- ERP/Contábil Externo")
