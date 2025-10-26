import streamlit as st
import pandas as pd
import numpy as np
import time
import base64
import os

# Importar os módulos de cada aba
from tabs import (
    developer_hub,
    architecture_diagram,
    componentes_fluxo,
    firestore_collections,
    cloud_functions,
    nucleo_financeiro,
    gestao_frota,
    guia_estudo,
    chat_suporte,
    monitoramento_logistico,
    analytics_ia
)


# Configuração da página
ASSETS_DIR = os.path.join(os.path.dirname(__file__), "assets")

st.set_page_config(
    page_title="XYZ LogicFlow - OptiLog",
    page_icon="🚚",
    layout="wide"
)

# Função para exibir a logo SVG
def render_svg(svg_filename):
    svg_path = os.path.join(ASSETS_DIR, svg_filename)
    with open(svg_path, "r") as f:
        svg = f.read()
    b64 = base64.b64encode(svg.encode("utf-8")).decode("utf-8")
    html = f'<img src="data:image/svg+xml;base64,{b64}" style="display: block; margin: 0 auto; max-width: 300px;">'
    return html

# Verificar se é a primeira execução
if 'start_time' not in st.session_state:
    st.session_state.start_time = time.time()
    st.session_state.show_splash = True

# Tela de abertura
if st.session_state.show_splash and time.time() - st.session_state.start_time < 3:
    st.markdown("<div style='text-align: center; margin-top: 100px;'>", unsafe_allow_html=True)
    st.markdown(render_svg("logo.svg"), unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)
    st.markdown("<style>div.block-container{padding-top:0px;}</style>", unsafe_allow_html=True)
    time.sleep(2)  # Exibe a tela de abertura por 2 segundos
    st.session_state.show_splash = False
    st.rerun()
else:
    # Cabeçalho com logo e título
    col1, col2 = st.columns([1, 5])
    with col1:
        st.markdown(render_svg("logo.svg"), unsafe_allow_html=True)
    with col2:
        st.title("OptiLog - Arquitetura do Sistema")
        st.markdown("<p style='color: #5E35B1; margin-top: -15px;'>Powered by XYZ LogicFlow Technology</p>", unsafe_allow_html=True)

# Tabs para diferentes seções
tab1, tab2, tab3, tab4, tab5, tab6, tab7, tab8, tab9, tab10, tab11 = st.tabs(["🔧 Developer Hub", "📊 Diagrama de Arquitetura", "🔄 Componentes & Fluxo", "🗄️ Coleções Firestore", "☁️ Cloud Functions", "💰 Núcleo Financeiro EJG", "🚛 Gestão de Frota EJG", "📚 Guia de Estudo", "💬 Chat & Suporte EJG", "📍 Monitoramento Logístico", "🤖 Analytics e IA"])

with tab1:
    st.header("🔧 Developer Hub - Centro de Desenvolvimento")
    st.markdown("**Plataforma Integrada de Desenvolvimento, Automação e Integração**")
    
    # Seção de Desenvolvimento de Código e Automação
    st.markdown("### 💻 Desenvolvimento de Código e Automação")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown("#### 🚀 Ambiente de Desenvolvimento")
        
        dev_tools = [
            {"Tool": "VS Code Extensions", "Status": "🟢 Ativo", "Versão": "v1.2.3"},
            {"Tool": "Firebase CLI", "Status": "🟢 Ativo", "Versão": "v12.4.0"},
            {"Tool": "Flutter SDK", "Status": "🟢 Ativo", "Versão": "v3.24.3"},
            {"Tool": "Node.js Runtime", "Status": "🟢 Ativo", "Versão": "v18.17.0"},
            {"Tool": "TypeScript Compiler", "Status": "🟢 Ativo", "Versão": "v5.1.6"}
        ]
        
        for tool in dev_tools:
            st.markdown(f"""
            <div style="border: 1px solid #ddd; padding: 8px; margin: 5px 0; border-radius: 5px; background-color: #f9f9f9;">
                <strong>{tool["Tool"]}</strong><br>
                {tool["Status"]} | {tool["Versão"]}
            </div>
            """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("#### ⚡ Scripts de Automação")
        
        automation_scripts = [
            {"Script": "Deploy Automático", "Trigger": "Git Push", "Status": "✅"},
            {"Script": "Backup Database", "Trigger": "Diário 02:00", "Status": "✅"},
            {"Script": "Sync APIs", "Trigger": "A cada 15min", "Status": "✅"},
            {"Script": "Build Mobile Apps", "Trigger": "Release Tag", "Status": "⏳"},
            {"Script": "Update Dependencies", "Trigger": "Semanal", "Status": "✅"}
        ]
        
        for script in automation_scripts:
            cor = "#4CAF50" if script["Status"] == "✅" else "#FFA000"
            st.markdown(f"""
            <div style="border-left: 4px solid {cor}; padding: 10px; margin: 8px 0; background-color: #f8f9fa;">
                <strong>{script["Script"]}</strong><br>
                Trigger: {script["Trigger"]}<br>
                Status: {script["Status"]}
            </div>
            """, unsafe_allow_html=True)
    
    with col3:
        st.markdown("#### 🔄 CI/CD Pipeline")
        
        pipeline_status = {
            "Build": {"Status": "✅ Sucesso", "Tempo": "2m 34s", "Commit": "a1b2c3d"},
            "Testes": {"Status": "✅ Passou", "Tempo": "1m 12s", "Cobertura": "94.2%"},
            "Deploy": {"Status": "✅ Ativo", "Tempo": "45s", "Ambiente": "Production"},
            "Monitoring": {"Status": "🟢 Online", "Uptime": "99.9%", "Alertas": "0"}
        }
        
        for stage, info in pipeline_status.items():
            st.markdown(f"""
            <div style="background-color: #e8f5e9; padding: 12px; margin: 8px 0; border-radius: 8px;">
                <strong>{stage}</strong><br>
                {info["Status"]}<br>
                <small>{list(info.values())[1]} | {list(info.values())[2]}</small>
            </div>
            """, unsafe_allow_html=True)
    
    # Gerenciamento de Chaves API e Integrações
    st.markdown("### 🔑 Gerenciamento de APIs e Integrações")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("#### 🌐 APIs Externas Configuradas")
        
        api_configs = [
            {"API": "Firebase Auth", "Endpoint": "firebase.googleapis.com", "Status": "🟢", "Rate Limit": "10k/min"},
            {"API": "Google Maps", "Endpoint": "maps.googleapis.com", "Status": "🟢", "Rate Limit": "2.5k/min"},
            {"API": "Open Banking", "Endpoint": "api.banco.com.br", "Status": "🟡", "Rate Limit": "1k/min"},
            {"API": "SEFAZ WebService", "Endpoint": "nfe.sefaz.gov.br", "Status": "🟢", "Rate Limit": "500/min"},
            {"API": "WhatsApp Business", "Endpoint": "graph.facebook.com", "Status": "🟢", "Rate Limit": "1k/min"}
        ]
        
        df_apis = pd.DataFrame(api_configs)
        st.dataframe(df_apis, use_container_width=True)
        
        st.markdown("#### 🔐 Chaves API")
        
        api_keys = [
            {"Serviço": "Firebase", "Tipo": "Service Account", "Expiração": "Nunca", "Status": "🟢"},
            {"Serviço": "Google Cloud", "Tipo": "API Key", "Expiração": "365 dias", "Status": "🟢"},
            {"Serviço": "Maps API", "Tipo": "Restricted Key", "Expiração": "180 dias", "Status": "🟡"},
            {"Serviço": "Payment Gateway", "Tipo": "OAuth 2.0", "Expiração": "90 dias", "Status": "🟢"}
        ]
        
        for key in api_keys:
            cor = "#4CAF50" if key["Status"] == "🟢" else "#FFA000"
            st.markdown(f"""
            <div style="border: 1px solid {cor}; padding: 10px; margin: 8px 0; border-radius: 5px;">
                <strong>{key["Serviço"]}</strong> - {key["Tipo"]}<br>
                Expira em: {key["Expiração"]} {key["Status"]}
            </div>
            """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("#### 📊 Monitoramento de APIs")
        
        # Gráfico de uso de APIs
        api_usage_data = {
            "API": ["Firebase", "Google Maps", "Open Banking", "SEFAZ", "WhatsApp"],
            "Requests/hora": [1250, 890, 340, 120, 560],
            "Latência (ms)": [45, 120, 280, 450, 95]
        }
        
        fig_api_usage = {
            "data": [
                {
                    "type": "bar",
                    "x": api_usage_data["API"],
                    "y": api_usage_data["Requests/hora"],
                    "name": "Requests/hora",
                    "marker": {"color": "#5E35B1"}
                }
            ],
            "layout": {
                "title": "Uso de APIs por Hora",
                "height": 300,
                "yaxis": {"title": "Requests"}
            }
        }
        
        st.plotly_chart(fig_api_usage, use_container_width=True)
        
        # Status de integração
        st.markdown("#### 🔗 Status de Integrações")
        
        integrations = [
            {"Sistema": "ERP Interno", "Status": "🟢 Conectado", "Última Sync": "2min"},
            {"Sistema": "CRM Vendas", "Status": "🟢 Conectado", "Última Sync": "5min"},
            {"Sistema": "Contabilidade", "Status": "🟡 Parcial", "Última Sync": "1h"},
            {"Sistema": "Banco Central", "Status": "🟢 Conectado", "Última Sync": "30min"}
        ]
        
        for integration in integrations:
            st.markdown(f"""
            <div style="display: flex; justify-content: space-between; padding: 8px; border-bottom: 1px solid #eee;">
                <span><strong>{integration["Sistema"]}</strong></span>
                <span>{integration["Status"]}</span>
            </div>
            """, unsafe_allow_html=True)
    
    # Apps Móveis (Android/iOS)
    st.markdown("### 📱 Desenvolvimento de Apps Móveis")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown("#### 🤖 Android Development")
        
        android_info = {
            "Versão Atual": "v2.1.4",
            "Target SDK": "API 34 (Android 14)",
            "Min SDK": "API 21 (Android 5.0)",
            "Build Tools": "34.0.0",
            "Gradle": "8.1.1"
        }
        
        st.markdown("**📊 Informações do App:**")
        for key, value in android_info.items():
            st.markdown(f"• **{key}:** {value}")
        
        st.markdown("**🏪 Google Play Store:**")
        st.markdown("""
        <div style="background-color: #e8f5e9; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <strong>OptiLog Driver</strong><br>
            📦 Pacote: com.optilog.driver<br>
            ⭐ Rating: 4.7/5 (1.2k reviews)<br>
            📥 Downloads: 50k+<br>
            🔄 Última atualização: 15/12/2024
        </div>
        """, unsafe_allow_html=True)
        
        # Métricas Android
        android_metrics = [
            {"Métrica": "Crashes", "Valor": "0.1%", "Status": "🟢"},
            {"Métrica": "ANRs", "Valor": "0.05%", "Status": "🟢"},
            {"Métrica": "Usuários Ativos", "Valor": "12.5k", "Status": "📈"},
            {"Métrica": "Retenção D7", "Valor": "78%", "Status": "🟢"}
        ]
        
        for metric in android_metrics:
            st.markdown(f"**{metric['Métrica']}:** {metric['Valor']} {metric['Status']}")
    
    with col2:
        st.markdown("#### 🍎 iOS Development")
        
        ios_info = {
            "Versão Atual": "v2.1.3",
            "iOS Target": "iOS 15.0+",
            "Xcode": "15.1",
            "Swift": "5.9",
            "CocoaPods": "1.14.3"
        }
        
        st.markdown("**📊 Informações do App:**")
        for key, value in ios_info.items():
            st.markdown(f"• **{key}:** {value}")
        
        st.markdown("**🏪 App Store:**")
        st.markdown("""
        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <strong>OptiLog Driver</strong><br>
            📦 Bundle ID: com.optilog.driver<br>
            ⭐ Rating: 4.8/5 (890 reviews)<br>
            📥 Downloads: 35k+<br>
            🔄 Última atualização: 18/12/2024
        </div>
        """, unsafe_allow_html=True)
        
        # Métricas iOS
        ios_metrics = [
            {"Métrica": "Crashes", "Valor": "0.08%", "Status": "🟢"},
            {"Métrica": "Hang Rate", "Valor": "0.02%", "Status": "🟢"},
            {"Métrica": "Usuários Ativos", "Valor": "8.9k", "Status": "📈"},
            {"Métrica": "Retenção D7", "Valor": "82%", "Status": "🟢"}
        ]
        
        for metric in ios_metrics:
            st.markdown(f"**{metric['Métrica']}:** {metric['Valor']} {metric['Status']}")
    
    with col3:
        st.markdown("#### 🔄 Cross-Platform Tools")
        
        st.markdown("**🎯 Flutter Framework:**")
        flutter_info = [
            "Flutter 3.24.3 (stable)",
            "Dart 3.5.3",
            "Android toolchain ✅",
            "Xcode toolchain ✅",
            "VS Code extensions ✅"
        ]
        
        for info in flutter_info:
            st.markdown(f"• {info}")
        
        st.markdown("**📦 Dependências Principais:**")
        dependencies = [
            {"Package": "firebase_core", "Versão": "^2.24.2"},
            {"Package": "provider", "Versão": "^6.1.1"},
            {"Package": "http", "Versão": "^1.1.0"},
            {"Package": "geolocator", "Versão": "^10.1.0"},
            {"Package": "camera", "Versão": "^0.10.5"}
        ]
        
        for dep in dependencies:
            st.markdown(f"• **{dep['Package']}:** {dep['Versão']}")
        
        # Build Status
        st.markdown("**🏗️ Build Status:**")
        st.markdown("""
        <div style="background-color: #f0f8ff; padding: 12px; border-radius: 8px; margin: 10px 0;">
            <strong>Android:</strong> ✅ Build #234 (Sucesso)<br>
            <strong>iOS:</strong> ✅ Build #189 (Sucesso)<br>
            <strong>Web:</strong> ✅ Build #456 (Sucesso)<br>
            <strong>Última build:</strong> 2h atrás
        </div>
        """, unsafe_allow_html=True)
    
    # Módulo Televisão/Smart TV
    st.markdown("### 📺 Módulo Smart TV e Televisão")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("#### 📱 Apps para Smart TV")
        
        tv_platforms = [
            {"Plataforma": "Android TV", "Status": "🟢 Ativo", "Versão": "v1.0.2", "Dispositivos": "120+"},
            {"Plataforma": "Samsung Tizen", "Status": "🟡 Beta", "Versão": "v0.9.1", "Dispositivos": "45+"},
            {"Plataforma": "LG webOS", "Status": "🔄 Desenvolvimento", "Versão": "v0.8.0", "Dispositivos": "0"},
            {"Plataforma": "Fire TV", "Status": "🟢 Ativo", "Versão": "v1.0.1", "Dispositivos": "78+"}
        ]
        
        for platform in tv_platforms:
            cor = "#4CAF50" if platform["Status"].startswith("🟢") else "#FFA000" if platform["Status"].startswith("🟡") else "#2196F3"
            st.markdown(f"""
            <div style="border-left: 4px solid {cor}; padding: 12px; margin: 10px 0; background-color: #f8f9fa;">
                <strong>{platform["Plataforma"]}</strong><br>
                {platform["Status"]} | {platform["Versão"]}<br>
                Dispositivos ativos: {platform["Dispositivos"]}
            </div>
            """, unsafe_allow_html=True)
        
        st.markdown("#### 🎮 Controle Remoto Virtual")
        
        remote_features = [
            "🔄 Navegação por voz",
            "📊 Dashboard interativo",
            "📱 Sincronização com mobile",
            "🔔 Notificações em tempo real",
            "📈 Gráficos e métricas",
            "🎯 Controle de frota visual"
        ]
        
        for feature in remote_features:
            st.markdown(f"• {feature}")
    
    with col2:
        st.markdown("#### 📊 Dashboard TV - Visualização")
        
        # Simulação de interface TV
        st.markdown("""
        <div style="background-color: #000; color: #fff; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h3 style="color: #5E35B1; margin: 0;">OptiLog TV Dashboard</h3>
                <p style="margin: 5px 0; color: #ccc;">Centro de Controle Logístico</p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div style="background-color: #1a1a1a; padding: 15px; border-radius: 8px;">
                    <h4 style="color: #4CAF50; margin: 0 0 10px 0;">🚛 Frota Ativa</h4>
                    <p style="font-size: 24px; margin: 0; color: #fff;">47 veículos</p>
                    <p style="color: #4CAF50; margin: 0;">↗️ +3 desde ontem</p>
                </div>
                
                <div style="background-color: #1a1a1a; padding: 15px; border-radius: 8px;">
                    <h4 style="color: #FF9800; margin: 0 0 10px 0;">📦 Entregas Hoje</h4>
                    <p style="font-size: 24px; margin: 0; color: #fff;">156 entregas</p>
                    <p style="color: #FF9800; margin: 0;">🎯 94% no prazo</p>
                </div>
            </div>
            
            <div style="background-color: #1a1a1a; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <h4 style="color: #2196F3; margin: 0 0 10px 0;">📍 Mapa em Tempo Real</h4>
                <div style="height: 100px; background-color: #333; border-radius: 5px; display: flex; align-items: center; justify-content: center;">
                    <span style="color: #ccc;">🗺️ Visualização do mapa com 47 veículos</span>
                </div>
            </div>
            
            <div style="text-align: center; color: #666; font-size: 12px;">
                Última atualização: {pd.Timestamp.now().strftime('%H:%M:%S')} | Controle remoto: Conectado
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("#### 🎛️ Configurações de TV")
        
        tv_settings = [
            {"Configuração": "Resolução", "Valor": "4K (3840x2160)", "Status": "✅"},
            {"Configuração": "Refresh Rate", "Valor": "60 Hz", "Status": "✅"},
            {"Configuração": "Auto-refresh", "Valor": "30 segundos", "Status": "✅"},
            {"Configuração": "Modo Noturno", "Valor": "22:00 - 06:00", "Status": "🌙"},
            {"Configuração": "Áudio", "Valor": "Alertas habilitados", "Status": "🔊"}
        ]
        
        for setting in tv_settings:
            st.markdown(f"""
            <div style="display: flex; justify-content: space-between; padding: 8px; border-bottom: 1px solid #333; background-color: #f9f9f9;">
                <span><strong>{setting["Configuração"]}</strong></span>
                <span>{setting["Valor"]} {setting["Status"]}</span>
            </div>
            """, unsafe_allow_html=True)
    
    # Estatísticas Gerais do Developer Hub
    st.markdown("### 📈 Estatísticas do Developer Hub")
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric(
            label="🔧 Projetos Ativos",
            value="12",
            delta="2",
            help="Número de projetos em desenvolvimento ativo"
        )
    
    with col2:
        st.metric(
            label="🚀 Deploys/Semana",
            value="34",
            delta="8",
            help="Número de deploys realizados na última semana"
        )
    
    with col3:
        st.metric(
            label="🔑 APIs Integradas",
            value="23",
            delta="3",
            help="Total de APIs externas integradas"
        )
    
    with col4:
        st.metric(
            label="📱 Apps Publicados",
            value="8",
            delta="1",
            help="Aplicativos publicados nas lojas"
        )

with tab2:
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

with tab2:
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
    
with tab6:
    st.header("Gestão de Frota EJG")
    
    # Adicionar abas dentro do módulo de Gestão de Frota
    frota_tabs = st.tabs(["Dashboard", "Manutenção Preventiva", "Rotas e Eficiência", "Custos Operacionais"])
    
    with frota_tabs[0]:
        st.subheader("Dashboard de Monitoramento de Veículos")
        
        # Métricas principais
        col1, col2, col3, col4 = st.columns(4)
        with col1:
            st.metric(label="Veículos Ativos", value="42", delta="2")
        with col2:
            st.metric(label="Em Manutenção", value="5", delta="-1")
        with col3:
            st.metric(label="Eficiência da Frota", value="87%", delta="3%")
        with col4:
            st.metric(label="Km Total Mensal", value="125.430", delta="12.500")
        
        # Gráfico de status da frota
        st.subheader("Status da Frota")
        
        # Dados simulados para o gráfico
        status_data = pd.DataFrame({
            'Status': ['Em Operação', 'Em Manutenção', 'Em Trânsito', 'Parado'],
            'Quantidade': [35, 5, 7, 2]
        })
        
        st.bar_chart(status_data.set_index('Status'))
        
        # Tabela de veículos
        st.subheader("Lista de Veículos")
        
        # Dados simulados para a tabela
        veiculos_data = pd.DataFrame({
            'ID': range(1, 11),
            'Placa': ['ABC-1234', 'DEF-5678', 'GHI-9012', 'JKL-3456', 'MNO-7890', 'PQR-1234', 'STU-5678', 'VWX-9012', 'YZA-3456', 'BCD-7890'],
            'Modelo': ['Volvo FH 540', 'Scania R450', 'Mercedes Actros', 'Volvo FH 460', 'DAF XF', 'Iveco S-Way', 'Scania S500', 'Mercedes Arocs', 'MAN TGX', 'Volvo FM'],
            'Status': ['Em Operação', 'Em Manutenção', 'Em Operação', 'Em Trânsito', 'Em Operação', 'Em Operação', 'Em Trânsito', 'Em Operação', 'Em Manutenção', 'Em Operação'],
            'Motorista': ['João Silva', 'Maria Oliveira', 'Pedro Santos', 'Ana Costa', 'Carlos Souza', 'Fernanda Lima', 'Ricardo Pereira', 'Juliana Alves', 'Marcos Ribeiro', 'Patrícia Gomes'],
            'Última Manutenção': ['2023-05-15', '2023-06-20', '2023-04-10', '2023-07-05', '2023-05-30', '2023-06-15', '2023-07-01', '2023-04-25', '2023-07-10', '2023-05-20']
        })
        
        st.dataframe(veiculos_data)
        
    with frota_tabs[1]:
        st.subheader("Sistema de Manutenção Preventiva")
        
        # Calendário de manutenções
        st.markdown("### Calendário de Manutenções Programadas")
        
        # Dados simulados para o calendário
        manutencoes_data = pd.DataFrame({
            'Veículo': ['ABC-1234', 'DEF-5678', 'GHI-9012', 'JKL-3456', 'MNO-7890'],
            'Tipo': ['Preventiva', 'Corretiva', 'Revisão', 'Preventiva', 'Troca de Óleo'],
            'Data Programada': ['2023-08-15', '2023-08-10', '2023-08-20', '2023-08-25', '2023-08-12'],
            'Responsável': ['Oficina Central', 'Concessionária', 'Oficina Central', 'Concessionária', 'Oficina Central'],
            'Status': ['Agendada', 'Em Andamento', 'Agendada', 'Agendada', 'Agendada']
        })
        
        st.dataframe(manutencoes_data)
        
        # Alertas de manutenção
        st.markdown("### Alertas de Manutenção")
        
        # Dados simulados para os alertas
        alertas_data = pd.DataFrame({
            'Veículo': ['DEF-5678', 'YZA-3456', 'PQR-1234'],
            'Alerta': ['Troca de Óleo Urgente', 'Revisão de Freios', 'Calibragem de Pneus'],
            'Prioridade': ['Alta', 'Média', 'Baixa'],
            'Dias Restantes': [0, 5, 10]
        })
        
        # Colorir com base na prioridade
        def highlight_prioridade(s):
            return ['background-color: red' if v == 'Alta' else 'background-color: yellow' if v == 'Média' else 'background-color: green' for v in s]
        
        st.dataframe(alertas_data.style.apply(highlight_prioridade, subset=['Prioridade']))
        
        # Histórico de manutenções
        st.markdown("### Histórico de Manutenções")
        
        # Dados simulados para o histórico
        historico_data = pd.DataFrame({
            'Veículo': ['ABC-1234', 'DEF-5678', 'GHI-9012', 'JKL-3456', 'MNO-7890'],
            'Tipo': ['Troca de Óleo', 'Revisão Geral', 'Troca de Pneus', 'Manutenção Elétrica', 'Revisão de Freios'],
            'Data': ['2023-05-15', '2023-06-20', '2023-04-10', '2023-07-05', '2023-05-30'],
            'Custo': ['R$ 1.500,00', 'R$ 5.200,00', 'R$ 3.800,00', 'R$ 2.100,00', 'R$ 1.800,00'],
            'Oficina': ['Oficina Central', 'Concessionária', 'Oficina Central', 'Concessionária', 'Oficina Central']
        })
        
        st.dataframe(historico_data)
        
    with frota_tabs[2]:
        st.subheader("Visualização de Rotas e Eficiência")
        
        # Mapa de rotas (simulado)
        st.markdown("### Mapa de Rotas Ativas")
        
        # Dados simulados para o mapa
        map_data = pd.DataFrame(
            np.random.randn(100, 2) / [20, 20] + [-23.5505, -46.6333],
            columns=['lat', 'lon']
        )
        
        st.map(map_data)
        
        # Análise de eficiência
        st.markdown("### Análise de Eficiência por Rota")
        
        # Dados simulados para a análise
        eficiencia_data = pd.DataFrame({
            'Rota': ['SP-RJ', 'SP-MG', 'SP-PR', 'SP-MS', 'RJ-BA'],
            'Distância (km)': [430, 580, 410, 890, 1200],
            'Tempo Médio (h)': [6.5, 8.2, 5.8, 12.3, 16.5],
            'Consumo Médio (L/100km)': [32.5, 35.2, 30.8, 33.3, 34.5],
            'Eficiência (%)': [92, 87, 95, 84, 80]
        })
        
        st.dataframe(eficiencia_data)
        
        # Gráfico de eficiência
        st.markdown("### Eficiência por Rota")
        
        st.bar_chart(eficiencia_data.set_index('Rota')['Eficiência (%)'])
        
        # Otimização de rotas
        st.markdown("### Sugestões de Otimização")
        
        st.info("""
        **Rota SP-MG**: Alteração sugerida para reduzir 45km e economizar 5% de combustível.
        
        **Rota RJ-BA**: Considerar pontos de parada alternativos para reduzir tempo de viagem em 1h30min.
        
        **Rota SP-MS**: Redistribuir carga para aumentar eficiência em 8%.
        """)
        
    with frota_tabs[3]:
        st.subheader("Controle de Custos Operacionais")
        
        # Visão geral de custos
        st.markdown("### Visão Geral de Custos")
        
        # Métricas de custos
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric(label="Custo Total Mensal", value="R$ 385.750,00", delta="-R$ 12.500,00")
        with col2:
            st.metric(label="Custo Médio por Km", value="R$ 3,25", delta="-R$ 0,15")
        with col3:
            st.metric(label="Custo Médio por Veículo", value="R$ 9.185,00", delta="-R$ 320,00")
        
        # Gráfico de distribuição de custos
        st.markdown("### Distribuição de Custos")
        
        # Dados simulados para o gráfico
        custos_data = pd.DataFrame({
            'Categoria': ['Combustível', 'Manutenção', 'Pneus', 'Salários', 'Seguros', 'Impostos', 'Outros'],
            'Valor': [180000, 75000, 35000, 50000, 25000, 15000, 5750]
        })
        
        st.bar_chart(custos_data.set_index('Categoria'))
        
        # Análise de tendências
        st.markdown("### Tendências de Custos (Últimos 6 Meses)")
        
        # Dados simulados para tendências
        meses = ['Fev/2023', 'Mar/2023', 'Abr/2023', 'Mai/2023', 'Jun/2023', 'Jul/2023']
        tendencias_data = pd.DataFrame({
            'Mês': meses,
            'Combustível': [195000, 190000, 185000, 182000, 178000, 180000],
            'Manutenção': [68000, 70000, 72000, 78000, 76000, 75000],
            'Pneus': [32000, 33000, 34000, 36000, 35000, 35000],
            'Outros': [98000, 97000, 95000, 93000, 92000, 95750]
        })
        
        st.line_chart(tendencias_data.set_index('Mês'))
        
        # Oportunidades de economia
        st.markdown("### Oportunidades de Economia")
        
        st.success("""
        **Combustível**: Implementação de rotas otimizadas pode reduzir o consumo em até 8%.
        
        **Manutenção**: Programa preventivo pode reduzir custos corretivos em até 15%.
        
        **Pneus**: Monitoramento de pressão e rodízio adequado pode estender vida útil em 20%.
        
        **Economia Total Estimada**: R$ 42.500,00 mensais
        """)

with tab3:
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

with tab4:
    st.header("Cloud Functions (TypeScript)")
    
    # Seletor de função
    function_options = ["forecast.ts", "reconcile.ts", "ocrInvoice.ts"]
    selected_function = st.selectbox("Selecione uma função para ver o código:", function_options)
    
    if selected_function == "forecast.ts":
        st.code('''
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import fetch from "node-fetch";
admin.initializeApp();

export const generateCashForecast = functions.https.onCall(async (data, ctx) => {
  const { companyId, horizonDays = 90 } = data;
  // 1) Query payables/receivables + accounts balances
  const db = admin.firestore();
  // Sample: aggregate historic inflows/outflows
  // 2) Call internal ML endpoint or Vertex AI
  // For POC: simple moving-average projection
  const projections = []; // build array of {date, projectedBalance}

  // TODO: replace with a real ML model call
  return { companyId, horizonDays, projections };
});
        ''', language="typescript")
    
    elif selected_function == "reconcile.ts":
        st.code('''
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

export const reconcileBankStatement = functions.https.onCall(async (data, ctx) => {
  const { companyId, accountId, statementId } = data;
  const db = admin.firestore();

  // 1. Load statement entries
  // 2. Try match against transactions by amount and date window
  // 3. Mark matched transactions / create reconciliation doc
  // 4. Return summary
  return { matched: 12, unmatched: 3 };
});
        ''', language="typescript")
    
    elif selected_function == "ocrInvoice.ts":
        st.code('''
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";

// Inicializar o app se ainda não estiver inicializado
try {
  admin.initializeApp();
} catch (e) {
  console.log('Admin SDK já inicializado');
}

/**
 * Função para processar OCR em faturas/notas fiscais
 * Extrai informações relevantes e cria lançamentos contábeis automatizados
 */
export const processInvoiceOCR = functions.storage.object().onFinalize(async (object) => {
  // Verificar se é um arquivo de fatura/nota fiscal
  const filePath = object.name;
  if (!filePath) return;
  
  // Verificar se é um PDF ou imagem
  if (!filePath.endsWith('.pdf') && !filePath.endsWith('.jpg') && !filePath.endsWith('.png')) {
    console.log('Arquivo não é PDF ou imagem, ignorando:', filePath);
    return;
  }

  // Extrair companyId do caminho (assumindo estrutura: invoices/{companyId}/...)
  const pathParts = filePath.split('/');
  if (pathParts.length < 3 || pathParts[0] !== 'invoices') {
    console.log('Caminho de arquivo inválido:', filePath);
    return;
  }
  
  const companyId = pathParts[1];
  const db = admin.firestore();
  
  try {
    // 1. Obter URL de download do arquivo
    const bucket = admin.storage().bucket(object.bucket);
    const [signedUrl] = await bucket.file(filePath).getSignedUrl({
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutos
    });
    
    // 2. Chamar a Vision API para OCR (simulado aqui)
    console.log(`Processando OCR para arquivo: ${filePath}`);
    
    // Simulação de resultado de OCR - em produção, usar Vision API
    const ocrResult = await simulateOCR(signedUrl);
    
    // 3. Extrair informações relevantes da fatura
    const invoiceData = extractInvoiceData(ocrResult);
    
    // 4. Criar documento de fatura no Firestore
    const invoiceId = uuidv4();
    await db.collection('invoices').doc(invoiceId).set({
      companyId,
      fileUrl: `gs://${object.bucket}/${filePath}`,
      pdfUrl: signedUrl,
      number: invoiceData.number,
      serie: invoiceData.serie,
      total: invoiceData.total,
      issuerCNPJ: invoiceData.issuerCNPJ,
      recipientCNPJ: invoiceData.recipientCNPJ,
      status: 'processed',
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
      items: invoiceData.items,
      rawOcrText: ocrResult.text
    });
    
    // 5. Criar lançamento contábil automatizado
    if (invoiceData.total > 0) {
      const payableId = uuidv4();
      await db.collection('payables').doc(payableId).set({
        companyId,
        supplierId: invoiceData.issuerCNPJ,
        dueDate: invoiceData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias se não especificado
        amount: invoiceData.total,
        currency: 'BRL',
        status: 'pending',
        invoiceRef: invoiceId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        description: `NF ${invoiceData.number} - ${invoiceData.issuerName || 'Fornecedor'}`
      });
      
      console.log(`Lançamento contábil criado: ${payableId} para fatura ${invoiceId}`);
    }
    
    return { success: true, invoiceId, data: invoiceData };
    
  } catch (error) {
    console.error('Erro ao processar OCR da fatura:', error);
    
    // Registrar erro no Firestore para auditoria
    await db.collection('auditLogs').add({
      companyId,
      action: 'invoice_ocr_error',
      filePath,
      error: error.message,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return { success: false, error: error.message };
  }
});

// Função auxiliar para simular OCR (substituir por chamada real à Vision API)
async function simulateOCR(fileUrl: string) {
  console.log(`Simulando OCR para: ${fileUrl}`);
  
  // Simulação de resultado
  return {
    text: `DANFE
NF-e: 123456
Série: 1
CNPJ Emissor: 12.345.678/0001-99
CNPJ Destinatário: 98.765.432/0001-01
Valor Total: R$ 1.234,56
Data Emissão: 01/10/2023
Data Vencimento: 31/10/2023
Item 1: Serviço de Transporte - R$ 1.000,00
Item 2: Taxa de Carregamento - R$ 234,56`,
    confidence: 0.95
  };
}

// Função para extrair dados estruturados do texto OCR
function extractInvoiceData(ocrResult: { text: string, confidence: number }) {
  const text = ocrResult.text;
  
  // Extrair informações usando regex (simplificado)
  const numberMatch = text.match(/NF-e:\\s*(\\d+)/);
  const serieMatch = text.match(/Série:\\s*(\\d+)/);
  const totalMatch = text.match(/Valor Total:\\s*R\\$\\s*([\\d.,]+)/);
  const issuerCNPJMatch = text.match(/CNPJ Emissor:\\s*([\\d./-]+)/);
  const recipientCNPJMatch = text.match(/CNPJ Destinatário:\\s*([\\d./-]+)/);
  const dueDateMatch = text.match(/Data Vencimento:\\s*(\\d{2}\\/\\d{2}\\/\\d{4})/);
  
  // Extrair itens (simplificado)
  const itemsRegex = /Item \\d+:.*?R\\$\\s*([\\d.,]+)/g;
  const items = [];
  let itemMatch;
  
  while ((itemMatch = itemsRegex.exec(text)) !== null) {
    items.push({
      description: itemMatch[0].split('-')[0].trim(),
      value: parseFloat(itemMatch[1].replace('.', '').replace(',', '.'))
    });
  }
  
  // Converter data de vencimento
  let dueDate = null;
  if (dueDateMatch && dueDateMatch[1]) {
    const parts = dueDateMatch[1].split('/');
    dueDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  }
  
  // Formatar valor total
  let total = 0;
  if (totalMatch && totalMatch[1]) {
    total = parseFloat(totalMatch[1].replace('.', '').replace(',', '.'));
  }
  
  return {
    number: numberMatch ? numberMatch[1] : 'Desconhecido',
    serie: serieMatch ? serieMatch[1] : '1',
    total,
    issuerCNPJ: issuerCNPJMatch ? issuerCNPJMatch[1] : 'Desconhecido',
    recipientCNPJ: recipientCNPJMatch ? recipientCNPJMatch[1] : 'Desconhecido',
    dueDate,
    items
  };
}
        ''', language="typescript")

with tab5:
    st.header("Núcleo Financeiro EJG - Evolução em Transporte")
    
    # Imagem do logo EJG
    st.markdown("""
    <div style='background-color: #B30000; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px;'>
        <h2 style='color: white; margin: 0;'>EJG - EVOLUÇÃO EM TRANSPORTE</h2>
    </div>
    """, unsafe_allow_html=True)
    
    # Tabs para os submódulos financeiros
    fin_tab1, fin_tab2, fin_tab3, fin_tab4, fin_tab5, fin_tab6 = st.tabs([
        "Gestão Financeira", 
        "Contabilidade e Fiscal", 
        "Análise de Risco", 
        "Dashboards e BI",
        "IA e Algoritmos",
        "Jurídico"
    ])
    
    with fin_tab1:
        st.subheader("Núcleo Financeiro - Ferramentas Avançadas")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("### Contas a Pagar e Receber")
            st.markdown("""
            - Controle automático de pagamentos e recebimentos
            - Lembretes e alertas inteligentes
            - Integração bancária (PSD2, Open Banking)
            """)
            
            # Demo de fluxo de caixa
            st.markdown("### Demonstração: Fluxo de Caixa Projetado com IA")
            
            # Dados simulados para o gráfico
            dates = pd.date_range(start='2023-01-01', periods=90)
            np.random.seed(42)
            base_value = 100000
            
            # Simulando receitas e despesas com tendência de crescimento
            revenues = np.random.normal(loc=base_value, scale=base_value*0.1, size=90) * (1 + np.arange(90) * 0.005)
            expenses = np.random.normal(loc=base_value*0.7, scale=base_value*0.05, size=90) * (1 + np.arange(90) * 0.003)
            
            # Calculando saldo
            balance = np.cumsum(revenues - expenses)
            
            # Criando DataFrame
            df = pd.DataFrame({
                'Data': dates,
                'Receitas': revenues,
                'Despesas': expenses,
                'Saldo': balance
            })
            
            # Exibindo gráfico
            st.line_chart(df.set_index('Data')[['Receitas', 'Despesas']])
            st.area_chart(df.set_index('Data')['Saldo'])
        
        with col2:
            st.markdown("### Gestão de Caixa e Tesouraria")
            st.markdown("""
            - Previsão de saldo e liquidez via ML
            - Otimização de capital de giro
            - Simulação de cenários de caixa
            """)
            
            st.markdown("### Orçamento e Planejamento Financeiro (FP&A)")
            st.markdown("""
            - Planejamento anual/mensal com análise preditiva
            - Simulação de cenários econômicos
            - Algoritmos de otimização de gastos
            """)
            
            # Demo de simulação de cenários
            st.markdown("### Demonstração: Simulação de Cenários")
            scenario = st.selectbox("Selecione o cenário:", ["Otimista", "Realista", "Pessimista"])
            
            # Fatores de ajuste baseados no cenário
            factors = {
                "Otimista": 1.15,
                "Realista": 1.0,
                "Pessimista": 0.85
            }
            
            # Métricas simuladas
            st.metric(label="Receita Projetada (12 meses)", 
                     value=f"R$ {1200000 * factors[scenario]:,.2f}".replace(',', '.'),
                     delta=f"{(factors[scenario]-1)*100:.1f}%" if scenario != "Realista" else None)
            
            st.metric(label="Lucro Líquido Projetado", 
                     value=f"R$ {240000 * factors[scenario]:,.2f}".replace(',', '.'),
                     delta=f"{(factors[scenario]-1)*100:.1f}%" if scenario != "Realista" else None)
    
    with fin_tab2:
        st.subheader("Contabilidade e Fiscal - 100% Legal e Eficiente")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("### Contabilidade Automática")
            st.markdown("""
            - Lançamentos contábeis automatizados via OCR e AI
            - Conciliação contábil inteligente
            - Demonstrações financeiras (Balanço, DRE, DFC)
            - Análise de indicadores contábeis via dashboards
            """)
            
            # Demo de reconhecimento de notas fiscais
            st.markdown("### Demonstração: Reconhecimento de Notas Fiscais")
            
            uploaded_file = st.file_uploader("Faça upload de uma nota fiscal", type=["pdf", "jpg", "png"])
            if uploaded_file is not None:
                st.success("Nota fiscal reconhecida com sucesso!")
                st.json({
                    "numero_nf": "123456",
                    "valor_total": "R$ 1.234,56",
                    "data_emissao": "01/10/2023",
                    "cnpj_emissor": "12.345.678/0001-99",
                    "itens_reconhecidos": [
                        {"descricao": "Serviço de Transporte", "valor": "R$ 1.000,00"},
                        {"descricao": "Taxa de Carregamento", "valor": "R$ 234,56"}
                    ]
                })
        
        with col2:
            st.markdown("### Gestão Fiscal e Tributária")
            st.markdown("""
            - Cálculo automático de impostos (ICMS, ISS, IR, PIS/COFINS)
            - Simulação de cenários tributários para otimização fiscal
            - Emissão e validação de notas fiscais eletrônicas (NF-e, NFS-e)
            - Compliance tributário com alertas preditivos
            """)
            
            # Demo de simulação tributária
            st.markdown("### Demonstração: Simulação Tributária")
            
            regime_tributario = st.radio("Regime Tributário:", ["Simples Nacional", "Lucro Presumido", "Lucro Real"])
            
            faturamento = st.slider("Faturamento Mensal (R$):", 10000, 1000000, 100000, step=10000)
            
            # Cálculo simplificado de impostos
            if regime_tributario == "Simples Nacional":
                aliquota = 0.06
                nome_imposto = "Simples Nacional"
            elif regime_tributario == "Lucro Presumido":
                aliquota = 0.155
                nome_imposto = "IRPJ+CSLL+PIS+COFINS"
            else:  # Lucro Real
                aliquota = 0.25
                nome_imposto = "IRPJ+CSLL+PIS+COFINS"
            
            imposto = faturamento * aliquota
            
            st.metric(label=f"Total de {nome_imposto}", 
                     value=f"R$ {imposto:,.2f}".replace(',', '.'),
                     delta=f"{aliquota*100:.1f}% do faturamento")
    
    with fin_tab3:
        st.subheader("Análise de Risco e Inteligência Econômica")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("### Analista de Risco Financeiro")
            st.markdown("""
            - Modelos de scoring de crédito e risco de inadimplência
            - Monitoramento de riscos de mercado, liquidez e crédito
            - Machine learning para prever insolvência de clientes
            """)
            
            # Demo de scoring de clientes
            st.markdown("### Demonstração: Scoring de Clientes")
            
            # Dados simulados
            clientes = [
                {"nome": "Empresa A", "cnpj": "12.345.678/0001-01", "score": 92, "risco": "Baixo"},
                {"nome": "Empresa B", "cnpj": "23.456.789/0001-02", "score": 78, "risco": "Médio"},
                {"nome": "Empresa C", "cnpj": "34.567.890/0001-03", "score": 45, "risco": "Alto"},
                {"nome": "Empresa D", "cnpj": "45.678.901/0001-04", "score": 88, "risco": "Baixo"},
                {"nome": "Empresa E", "cnpj": "56.789.012/0001-05", "score": 62, "risco": "Médio"}
            ]
            
            # Criando DataFrame
            df_clientes = pd.DataFrame(clientes)
            
            # Exibindo tabela com formatação condicional
            st.dataframe(df_clientes.style.apply(lambda x: ['background-color: #8eff8e' if v == "Baixo" 
                                                      else 'background-color: #ffff78' if v == "Médio"
                                                      else 'background-color: #ff7878' for v in x], 
                                          subset=['risco']))
        
        with col2:
            st.markdown("### Economista Virtual")
            st.markdown("""
            - Modelos preditivos macroeconômicos (inflação, juros, câmbio)
            - Análise de impacto econômico sobre o negócio
            - Algoritmos de otimização de investimentos
            """)
            
            st.markdown("### Matemático e Estatístico Corporativo")
            st.markdown("""
            - Algoritmos de séries temporais e regressões múltiplas
            - Modelos de previsão de receita, despesas e lucros
            - Análise de correlação entre indicadores financeiros
            """)
            
            # Demo de previsão econômica
            st.markdown("### Demonstração: Previsão Econômica")
            
            # Dados simulados para indicadores econômicos
            meses = pd.date_range(start='2023-01-01', periods=12, freq='M')
            
            # Simulando indicadores
            np.random.seed(42)
            inflacao = np.cumsum(np.random.normal(loc=0.004, scale=0.002, size=12))
            juros = np.cumsum(np.random.normal(loc=0.001, scale=0.001, size=12)) + 0.105
            cambio = np.cumsum(np.random.normal(loc=0.01, scale=0.03, size=12)) + 5.0
            
            # Criando DataFrame
            df_eco = pd.DataFrame({
                'Mês': meses,
                'Inflação (IPCA)': inflacao,
                'Taxa Selic': juros,
                'Câmbio (USD/BRL)': cambio
            })
            
            # Exibindo gráfico
            indicador = st.selectbox("Selecione o indicador econômico:", 
                                    ["Inflação (IPCA)", "Taxa Selic", "Câmbio (USD/BRL)"])
            
            st.line_chart(df_eco.set_index('Mês')[indicador])
    
    with fin_tab4:
        st.subheader("Dashboards e BI - Visualização Avançada")
        
        st.markdown("### Dashboard Financeiro 360°")
        
        # Criando um dashboard simulado com métricas
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric(label="Receita Mensal", value="R$ 125.400", delta="8.5%")
        
        with col2:
            st.metric(label="Lucro Líquido", value="R$ 32.450", delta="12.3%")
        
        with col3:
            st.metric(label="Margem Líquida", value="25.8%", delta="3.2%")
        
        with col4:
            st.metric(label="ROI", value="18.5%", delta="-1.2%")
        
        # Gráficos simulados
        st.markdown("### Análise de Desempenho")
        
        # Dados simulados para o gráfico
        meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']
        receitas = [95000, 102000, 108000, 115000, 118000, 125000]
        despesas = [76000, 79000, 82000, 85000, 87000, 92000]
        lucro = [r-d for r, d in zip(receitas, despesas)]
        
        # Criando DataFrame
        df_desempenho = pd.DataFrame({
            'Mês': meses,
            'Receita': receitas,
            'Despesa': despesas,
            'Lucro': lucro
        })
        
        # Exibindo gráfico
        st.bar_chart(df_desempenho.set_index('Mês')[['Receita', 'Despesa']])
        
        # Gráfico de pizza para distribuição de despesas
        st.markdown("### Distribuição de Despesas")
        
        # Dados simulados
        categorias = ['Combustível', 'Manutenção', 'Salários', 'Impostos', 'Outros']
        valores = [35, 20, 25, 15, 5]
        
        # Criando DataFrame
        df_pizza = pd.DataFrame({
            'Categoria': categorias,
            'Valor (%)': valores
        })
        
        # Exibindo tabela
        st.dataframe(df_pizza)
        
        # Mensagem sobre visualização interativa
        st.info("Em um ambiente de produção, este dashboard seria totalmente interativo com filtros por período, unidade de negócio e drill-down para análises detalhadas.")
    
    with fin_tab5:
        st.subheader("Algoritmos e Inteligência Artificial")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("### Machine Learning & Previsão")
            st.markdown("""
            - Regressão linear e logística (previsão de vendas e inadimplência)
            - Árvores de decisão e Random Forest (análise de risco)
            - Redes neurais e LSTM (séries temporais financeiras)
            - K-means / clustering (segmentação de clientes e fornecedores)
            """)
            
            # Demo de modelo de ML
            st.markdown("### Demonstração: Modelo de Previsão")
            
            # Parâmetros para simulação
            dias_atraso = st.slider("Dias de atraso médio:", 0, 30, 5)
            valor_medio = st.slider("Valor médio das faturas (R$):", 1000, 10000, 5000)
            historico_pagamento = st.slider("Histórico de pagamento (0-100):", 0, 100, 80)
            
            # Simulação simplificada de um modelo
            score = 100 - (dias_atraso * 2) + (valor_medio / 1000) + (historico_pagamento * 0.5)
            score = max(0, min(100, score))
            
            # Exibindo resultado
            st.progress(int(score))
            
            if score >= 80:
                st.success(f"Score de crédito: {score:.1f} - Risco Baixo")
            elif score >= 50:
                st.warning(f"Score de crédito: {score:.1f} - Risco Médio")
            else:
                st.error(f"Score de crédito: {score:.1f} - Risco Alto")
        
        with col2:
            st.markdown("### IA Generativa e Chatbot Corporativo")
            st.markdown("""
            - Chatbot "CFO Virtual" capaz de analisar toda a empresa
            - Consultoria tributária e jurídica automatizada
            - Respostas inteligentes a dúvidas financeiras
            - Relatórios automáticos gerados em linguagem natural
            """)
            
            # Demo de chatbot
            st.markdown("### Demonstração: CFO Virtual")
            
            # Interface de chat simulada
            user_input = st.text_input("Faça uma pergunta ao CFO Virtual:", 
                                      placeholder="Ex: Qual o fluxo de caixa projetado para o próximo trimestre?")
            
            if user_input:
                with st.chat_message("user"):
                    st.write(user_input)
                
                with st.chat_message("assistant", avatar="👨‍💼"):
                    if "fluxo de caixa" in user_input.lower():
                        st.write("""Com base nas projeções atuais, o fluxo de caixa para o próximo trimestre é:
                        
                        - Abril: R$ 145.000 (positivo)
                        - Maio: R$ 162.000 (positivo)
                        - Junho: R$ 178.000 (positivo)
                        
                        Isso representa um crescimento de 22% em relação ao mesmo período do ano anterior. Recomendo manter o plano de investimentos atual.""")
                    
                    elif "inadimplência" in user_input.lower():
                        st.write("""A taxa de inadimplência atual é de 3.2%, abaixo da média do setor (4.5%).
                        
                        Os principais clientes com pagamentos em atraso são:
                        1. Empresa XYZ - R$ 12.450 (30 dias)
                        2. Transportadora ABC - R$ 8.300 (15 dias)
                        
                        Recomendo acionar o departamento comercial para negociação.""")
                    
                    else:
                        st.write("""Baseado nos dados financeiros atuais, posso informar que:
                        
                        - A empresa está com saúde financeira estável
                        - O índice de liquidez corrente é 1.8 (adequado)
                        - Existem oportunidades de otimização fiscal que podem gerar economia de até 12%
                        
                        Posso detalhar qualquer um desses pontos ou responder outras perguntas específicas sobre finanças, contabilidade ou tributação.""")
    
    with fin_tab6:
        st.subheader("Jurídico e Advogado Tributário")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("### Compliance Legal")
            st.markdown("""
            - Monitoramento de mudanças na legislação fiscal e trabalhista
            - Alertas de prazos e obrigações legais
            - Automatização de contratos e documentos jurídicos
            """)
            
            # Demo de calendário de obrigações
            st.markdown("### Demonstração: Calendário de Obrigações")
            
            # Dados simulados
            obrigacoes = [
                {"data": "05/11/2023", "obrigacao": "Entrega da GFIP", "status": "Pendente"},
                {"data": "15/11/2023", "obrigacao": "Pagamento INSS", "status": "Pendente"},
                {"data": "20/11/2023", "obrigacao": "Pagamento FGTS", "status": "Pendente"},
                {"data": "25/11/2023", "obrigacao": "Entrega da EFD-REINF", "status": "Pendente"},
                {"data": "30/11/2023", "obrigacao": "Pagamento IRPJ/CSLL", "status": "Pendente"}
            ]
            
            # Criando DataFrame
            df_obrigacoes = pd.DataFrame(obrigacoes)
            
            # Exibindo tabela
            st.dataframe(df_obrigacoes)
        
        with col2:
            st.markdown("### Advogado Tributário Virtual")
            st.markdown("""
            - Simulação de estratégias tributárias legais
            - Análise de risco de autuações fiscais
            """)
            
with tab7:
    st.header("Super Gestor & XYZ LogicFlow Platform: Guia de Estudo")
    
    # Adicionar abas dentro do módulo de Guia de Estudo
    estudo_tabs = st.tabs(["Quiz Interativo", "Material de Estudo", "Avaliação"])
    
    with estudo_tabs[0]:
        st.subheader("Quiz: Perguntas e Respostas")
        
        st.markdown("""
        Responda as seguintes perguntas com base no material fornecido sobre a plataforma Super Gestor & XYZ LogicFlow.
        """)
        
        # Perguntas e respostas
        perguntas = [
            {
                "pergunta": "1. Qual é a principal stack de tecnologia usada para construir o aplicativo 'Super Gestor'?",
                "resposta": "O frontend do aplicativo é construído usando Next.js e React, evidenciado pelo uso de arquivos .tsx, React hooks e configurações específicas do Next.js. O backend é alimentado pela plataforma Firebase do Google, que gerencia o banco de dados, autenticação de usuários e outras funcionalidades do lado do servidor."
            },
            {
                "pergunta": "2. Descreva o papel e o propósito do módulo 'Super Gestor' dentro da plataforma XYZ LogicFlow.",
                "resposta": "O módulo 'Super Gestor' é concebido como o núcleo inteligente da plataforma, atuando como um consultor interno e externo alimentado por IA. Ele é projetado para analisar dados de todos os outros módulos (CRM, logística, finanças) usando algoritmos e IA para identificar gargalos operacionais, sugerir otimizações e transformar dados brutos em decisões estratégicas de negócios."
            },
            {
                "pergunta": "3. Explique a função do Firebase na arquitetura do aplicativo. Mencione pelo menos dois serviços específicos do Firebase utilizados.",
                "resposta": "O Firebase serve como o backend central, descrito como o 'Cérebro e o Armazém Central' do sistema. Os documentos de origem documentam o uso do Firebase Authentication para gerenciar login e registro de usuários e o Cloud Firestore como o banco de dados em tempo real para armazenar dados do aplicativo, incluindo tarefas, mensagens de chat e leituras TPMS. O Firebase Storage também é implementado para uploads de arquivos, como fotos de perfil de usuários."
            },
            {
                "pergunta": "4. Qual foi o principal problema que causou o erro auth/invalid-api-key, e qual foi a solução definitiva implementada?",
                "resposta": "O erro auth/invalid-api-key foi causado principalmente por inicializações fragmentadas do Firebase em vários componentes e problemas com variáveis de ambiente não sendo carregadas corretamente durante o processo de build. A solução definitiva foi centralizar a configuração do Firebase em um único arquivo (src/firebase/config.ts) e garantir que todos os componentes recebessem a instância inicializada de um provedor central (auth-provider.tsx), criando uma conexão única e robusta para toda a aplicação."
            },
            {
                "pergunta": "5. Descreva o módulo 'Fluxo de Atividades' e seu propósito pretendido para enfrentar desafios operacionais.",
                "resposta": "O 'Fluxo de Atividades' é um módulo central projetado para organizar e monitorar tarefas através de uma lista dinâmica em tempo real. Seu propósito é resolver os problemas centrais de 'gargalos' e falta de visibilidade operacional, permitindo que os usuários criem, atribuam e acompanhem o status das tarefas, que são então salvas e sincronizadas entre todos os usuários através do banco de dados Firestore."
            }
        ]
        
        # Exibir perguntas com expansores para mostrar respostas
        for i, qa in enumerate(perguntas):
            with st.expander(qa["pergunta"]):
                st.markdown(qa["resposta"])
                
        # Adicionar um quiz interativo
        st.subheader("Quiz Interativo")
        
        # Inicializar estado da sessão para o quiz
        if 'quiz_score' not in st.session_state:
            st.session_state.quiz_score = 0
            st.session_state.quiz_completed = False
            st.session_state.quiz_answers = {}
        
        # Perguntas de múltipla escolha
        quiz_perguntas = [
            {
                "pergunta": "Qual é o backend principal usado no Super Gestor?",
                "opcoes": ["AWS Lambda", "Firebase", "Azure Functions", "MongoDB"],
                "resposta_correta": 1
            },
            {
                "pergunta": "Qual erro foi resolvido centralizando a configuração do Firebase?",
                "opcoes": ["auth/invalid-api-key", "auth/user-not-found", "auth/wrong-password", "auth/email-already-in-use"],
                "resposta_correta": 0
            },
            {
                "pergunta": "Qual modelo de IA é mencionado para uso na plataforma?",
                "opcoes": ["GPT-4", "BERT", "Gemini Pro", "Claude"],
                "resposta_correta": 2
            }
        ]
        
        # Exibir o quiz se não estiver completo
        if not st.session_state.quiz_completed:
            for i, q in enumerate(quiz_perguntas):
                st.markdown(f"**{q['pergunta']}**")
                key = f"quiz_{i}"
                st.session_state.quiz_answers[key] = st.radio(
                    "Escolha uma opção:",
                    q["opcoes"],
                    key=key,
                    index=None
                )
            
            if st.button("Verificar Respostas"):
                score = 0
                for i, q in enumerate(quiz_perguntas):
                    key = f"quiz_{i}"
                    if st.session_state.quiz_answers[key] == q["opcoes"][q["resposta_correta"]]:
                        score += 1
                
                st.session_state.quiz_score = score
                st.session_state.quiz_completed = True
                st.rerun()
        else:
            # Mostrar resultados
            st.success(f"Você acertou {st.session_state.quiz_score} de {len(quiz_perguntas)} perguntas!")
            
            if st.button("Tentar Novamente"):
                st.session_state.quiz_completed = False
                st.session_state.quiz_score = 0
                st.session_state.quiz_answers = {}
                st.rerun()
    
    with estudo_tabs[1]:
        st.subheader("Material de Estudo")
        
        st.markdown("""
        ## Super Gestor & XYZ LogicFlow Platform
        
        ### Visão Geral da Plataforma
        
        O Super Gestor é uma plataforma integrada desenvolvida para otimizar operações logísticas e de transporte. 
        Construída com tecnologias modernas como Next.js, React e Firebase, a plataforma oferece uma solução completa 
        para gerenciamento de frotas, finanças, manutenção e muito mais.
        
        ### Stack Tecnológica
        
        - **Frontend**: Next.js e React (arquivos .tsx)
        - **Backend**: Firebase (Authentication, Firestore, Storage)
        - **IA/ML**: Genkit, Gemini Pro
        - **Integrações**: APIs bancárias, SEFAZ, sistemas contábeis externos
        
        ### Principais Módulos
        
        1. **Super Gestor**: Núcleo inteligente da plataforma, atuando como consultor interno e externo alimentado por IA
        2. **Fluxo de Atividades**: Organização e monitoramento de tarefas em tempo real
        3. **TPMS Tracker**: Monitoramento de pressão e temperatura dos pneus
        4. **Análise de Pneus**: Interface interativa para gerenciamento do estado dos pneus
        5. **Módulo Financeiro**: Implementação da metodologia NTC para análise de custos
        
        ### Evolução da Plataforma
        
        A plataforma passou por várias iterações e mudanças de nome, incluindo:
        - Super Gestor
        - XYZ LogicFlow
        - Optilog
        - EJG Optilog
        - Renasoft
        """)
    
    with estudo_tabs[2]:
        st.subheader("Sistema de Avaliação de Conhecimento")
        
        st.markdown("""
        ## Avaliação de Conhecimento
        
        Este sistema permite avaliar o conhecimento sobre a plataforma Super Gestor & XYZ LogicFlow.
        """)
        
        # Inicializar estado da sessão para avaliação
        if 'avaliacao_iniciada' not in st.session_state:
            st.session_state.avaliacao_iniciada = False
            st.session_state.avaliacao_concluida = False
            st.session_state.avaliacao_respostas = {}
            st.session_state.avaliacao_score = 0
        
        # Perguntas da avaliação
        avaliacao_perguntas = [
            {
                "pergunta": "Qual é o principal propósito do módulo 'Fluxo de Atividades'?",
                "tipo": "multipla_escolha",
                "opcoes": [
                    "Gerenciar finanças da empresa",
                    "Organizar e monitorar tarefas em tempo real",
                    "Controlar estoque de produtos",
                    "Emitir notas fiscais"
                ],
                "resposta_correta": 1
            },
            {
                "pergunta": "Qual foi a solução implementada para resolver o erro auth/invalid-api-key?",
                "tipo": "multipla_escolha",
                "opcoes": [
                    "Mudar para outro provedor de autenticação",
                    "Centralizar a configuração do Firebase em um único arquivo",
                    "Desativar a autenticação temporariamente",
                    "Criar uma nova chave de API"
                ],
                "resposta_correta": 1
            }
        ]
        
        # Interface para iniciar a avaliação
        if not st.session_state.avaliacao_iniciada and not st.session_state.avaliacao_concluida:
            st.markdown("""
            Esta avaliação contém perguntas de múltipla escolha sobre a plataforma.
            
            Tempo estimado: 5 minutos
            """)
            
            nome = st.text_input("Nome completo:")
            email = st.text_input("E-mail:")
            
            if st.button("Iniciar Avaliação") and nome and email:
                st.session_state.avaliacao_iniciada = True
                st.session_state.nome_avaliacao = nome
                st.session_state.email_avaliacao = email
                st.rerun()
        
        # Exibir a avaliação
        elif st.session_state.avaliacao_iniciada and not st.session_state.avaliacao_concluida:
            st.markdown(f"**Avaliação para:** {st.session_state.nome_avaliacao}")
            
            for i, q in enumerate(avaliacao_perguntas):
                st.markdown(f"**{i+1}. {q['pergunta']}**")
                key = f"avaliacao_{i}"
                
                if q["tipo"] == "multipla_escolha":
                    st.session_state.avaliacao_respostas[key] = st.radio(
                        "Escolha uma opção:",
                        q["opcoes"],
                        key=key,
                        index=None
                    )
            
            if st.button("Enviar Avaliação"):
                # Calcular pontuação para perguntas de múltipla escolha
                score = 0
                total_mc = 0
                
                for i, q in enumerate(avaliacao_perguntas):
                    key = f"avaliacao_{i}"
                    if q["tipo"] == "multipla_escolha":
                        total_mc += 1
                        if st.session_state.avaliacao_respostas[key] == q["opcoes"][q["resposta_correta"]]:
                            score += 1
                
                if total_mc > 0:
                    st.session_state.avaliacao_score = score / total_mc
                
                st.session_state.avaliacao_concluida = True
                st.session_state.avaliacao_iniciada = False
                st.rerun()
        
        # Mostrar resultados da avaliação
        elif st.session_state.avaliacao_concluida:
            st.success(f"Avaliação enviada com sucesso, {st.session_state.nome_avaliacao}!")
            
            # Mostrar pontuação para perguntas de múltipla escolha
            st.markdown(f"**Pontuação em perguntas de múltipla escolha:** {st.session_state.avaliacao_score * 100:.0f}%")
            
            if st.button("Iniciar Nova Avaliação"):
                st.session_state.avaliacao_iniciada = False
                st.session_state.avaliacao_concluida = False
                st.session_state.avaliacao_respostas = {}
                st.session_state.avaliacao_score = 0
                st.markdown("""
            - IA para revisão de contratos e cláusulas fiscais
            """)
            
with tab8:
    st.header("Chat & Suporte EJG")
    
    # Adicionar abas dentro do módulo de Chat e Suporte
    chat_tabs = st.tabs(["Atendimento EJG", "Consultoria", "Abertura de Chamados", "Cadastros"])
    
    with chat_tabs[0]:
        st.subheader("Chat de Atendimento EJG")
        
        # Inicializar histórico de chat na sessão
        if 'chat_messages' not in st.session_state:
            st.session_state.chat_messages = [
                {"role": "assistant", "content": "Olá! Sou o assistente virtual da EJG. Como posso ajudar você hoje?"}
            ]
        
        # Exibir mensagens anteriores
        for message in st.session_state.chat_messages:
            with st.chat_message(message["role"]):
                st.markdown(message["content"])
        
        # Campo de entrada para nova mensagem
        user_input = st.chat_input("Digite sua mensagem aqui...")
        
        if user_input:
            # Adicionar mensagem do usuário ao histórico
            st.session_state.chat_messages.append({"role": "user", "content": user_input})
            
            # Exibir mensagem do usuário
            with st.chat_message("user"):
                st.markdown(user_input)
            
            # Simular resposta do assistente
            with st.chat_message("assistant"):
                message_placeholder = st.empty()
                full_response = ""
                
                # Simular digitação
                assistant_response = "Obrigado por sua mensagem. Estou processando sua solicitação e em breve um de nossos consultores entrará em contato. Posso ajudar com mais alguma coisa?"
                
                for chunk in assistant_response.split():
                    full_response += chunk + " "
                    time.sleep(0.05)
                    message_placeholder.markdown(full_response + "▌")
                
                message_placeholder.markdown(assistant_response)
            
            # Adicionar resposta do assistente ao histórico
            st.session_state.chat_messages.append({"role": "assistant", "content": assistant_response})
    
    with chat_tabs[1]:
        st.subheader("Consultoria Especializada")
        
        st.markdown("""
        ### Consultoria EJG
        
        Nossa equipe de consultores especializados está disponível para auxiliar em:
        
        - Otimização de processos logísticos
        - Consultoria em transporte de produtos químicos
        - Análise de eficiência operacional
        - Implementação de melhores práticas
        - Treinamento de equipes
        """)
        
        # Seleção de tipo de consultoria
        consultoria_tipo = st.selectbox(
            "Selecione o tipo de consultoria desejada:",
            ["Logística", "Transporte Químico", "Eficiência Operacional", "Implementação de Sistemas", "Treinamento"]
        )
        
        # Formulário de solicitação
        with st.form("form_consultoria"):
            st.write("Preencha os dados para solicitar consultoria:")
            nome = st.text_input("Nome completo")
            email = st.text_input("E-mail")
            empresa = st.text_input("Empresa")
            descricao = st.text_area("Descreva sua necessidade")
            urgencia = st.select_slider("Nível de urgência", options=["Baixa", "Média", "Alta", "Urgente"])
            
            submitted = st.form_submit_button("Solicitar Consultoria")
            if submitted:
                st.success(f"Solicitação de consultoria em {consultoria_tipo} enviada com sucesso! Um consultor entrará em contato em breve.")
    
    with chat_tabs[2]:
        st.subheader("Abertura de Chamados")
        
        # Tipos de chamados
        st.markdown("""
        ### Sistema de Chamados
        
        Utilize este sistema para abrir chamados técnicos, reportar problemas ou solicitar suporte.
        """)
        
        # Formulário de abertura de chamado
        with st.form("form_chamado"):
            st.write("Preencha os dados para abrir um novo chamado:")
            
            chamado_tipo = st.selectbox(
                "Tipo de chamado:",
                ["Suporte Técnico", "Dúvida Operacional", "Problema no Sistema", "Solicitação de Recurso", "Outro"]
            )
            
            chamado_titulo = st.text_input("Título do chamado")
            chamado_descricao = st.text_area("Descrição detalhada")
            
            chamado_prioridade = st.radio("Prioridade:", ["Baixa", "Média", "Alta", "Crítica"])
            
            # Upload de arquivos
            chamado_arquivo = st.file_uploader("Anexar arquivos (opcional)", type=["png", "jpg", "pdf", "docx"])
            
            chamado_notificacao = st.checkbox("Receber notificações por e-mail")
            
            submitted = st.form_submit_button("Abrir Chamado")
            if submitted:
                st.success(f"Chamado #{np.random.randint(10000, 99999)} aberto com sucesso! Acompanhe o status pelo seu painel.")
                
                # Exibir detalhes do chamado
                st.info(f"""
                **Detalhes do Chamado:**
                - Tipo: {chamado_tipo}
                - Título: {chamado_titulo}
                - Prioridade: {chamado_prioridade}
                - Status: Aberto
                - Data de Abertura: {pd.Timestamp.now().strftime('%d/%m/%Y %H:%M')}
                """)
    
    with chat_tabs[3]:
        st.subheader("Cadastros e Orientações")
        
        st.markdown("""
        ### Sistema de Cadastros
        
        Utilize esta seção para realizar cadastros no sistema e receber orientações.
        """)
        
        # Seleção de tipo de cadastro
        cadastro_tipo = st.selectbox(
            "Selecione o tipo de cadastro:",
            ["Motorista", "Veículo", "Cliente", "Fornecedor", "Rota", "Produto Químico"]
        )
        
        # Exibir formulário específico com base na seleção
        if cadastro_tipo == "Motorista":
            with st.form("form_motorista"):
                st.write("Cadastro de Motorista")
                nome = st.text_input("Nome completo")
                cpf = st.text_input("CPF")
                cnh = st.text_input("Número da CNH")
                categoria = st.selectbox("Categoria da CNH", ["A", "B", "C", "D", "E", "AB", "AC", "AD", "AE"])
                validade = st.date_input("Validade da CNH")
                mopp = st.checkbox("Possui MOPP (Movimentação Operacional de Produtos Perigosos)")
                
                submitted = st.form_submit_button("Cadastrar Motorista")
                if submitted:
                    st.success(f"Motorista {nome} cadastrado com sucesso!")
        
        elif cadastro_tipo == "Veículo":
            with st.form("form_veiculo"):
                st.write("Cadastro de Veículo")
                placa = st.text_input("Placa")
                modelo = st.text_input("Modelo")
                fabricante = st.text_input("Fabricante")
                ano = st.number_input("Ano de fabricação", min_value=1990, max_value=2030)
                tipo = st.selectbox("Tipo de veículo", ["Caminhão Tanque", "Caminhão Baú", "Caminhão Sider", "Bitrem", "Rodotrem", "Outro"])
                capacidade = st.number_input("Capacidade (kg)", min_value=0)
                
                submitted = st.form_submit_button("Cadastrar Veículo")
                if submitted:
                    st.success(f"Veículo placa {placa} cadastrado com sucesso!")
        
        elif cadastro_tipo == "Produto Químico":
            with st.form("form_produto"):
                st.write("Cadastro de Produto Químico")
                nome_produto = st.text_input("Nome do produto")
                numero_onu = st.text_input("Número ONU")
                classe_risco = st.selectbox("Classe de risco", ["1 - Explosivos", "2 - Gases", "3 - Líquidos Inflamáveis", "4 - Sólidos Inflamáveis", "5 - Oxidantes", "6 - Tóxicos", "7 - Radioativos", "8 - Corrosivos", "9 - Diversos"])
                grupo_embalagem = st.selectbox("Grupo de embalagem", ["I - Alto risco", "II - Médio risco", "III - Baixo risco"])
                ficha_emergencia = st.file_uploader("Ficha de emergência (PDF)", type=["pdf"])
                
                submitted = st.form_submit_button("Cadastrar Produto")
                if submitted:
                    st.success(f"Produto químico {nome_produto} cadastrado com sucesso!")
                    st.info("Lembre-se: É obrigatório manter a ficha de emergência atualizada e disponível durante o transporte.")
        
        # Seção de orientações
        st.subheader("Orientações")
        
        with st.expander("Orientações para Transporte de Produtos Perigosos"):
            st.markdown("""
            ### Requisitos para Transporte de Produtos Perigosos
            
            1. **Documentação obrigatória:**
               - Certificado de capacitação MOPP do motorista
               - Ficha de emergência do produto
               - Envelope para transporte
               - Documento fiscal com informações de risco
               
            2. **Sinalização do veículo:**
               - Painéis de segurança (placas laranja)
               - Rótulos de risco
               
            3. **Equipamentos obrigatórios:**
               - Kit de emergência
               - EPI para o motorista
               - Extintores específicos
            """)
        
        with st.expander("Orientações para Cadastro no Sistema"):
            st.markdown("""
            ### Como realizar cadastros no sistema
            
            1. Selecione o tipo de cadastro desejado no menu suspenso
            2. Preencha todos os campos obrigatórios (marcados com *)
            3. Anexe os documentos solicitados nos formatos indicados
            4. Clique em "Cadastrar" para finalizar
            
            Após o cadastro, os dados passarão por validação e você receberá uma confirmação por e-mail.
             """)
             
with tab9:
    st.header("Monitoramento Logístico")
    
    # Adicionar abas dentro do módulo de Monitoramento Logístico
    monit_tabs = st.tabs(["Mapa de Rastreamento", "Análise de Custos", "Portal do Motorista", "Alertas e Checklist"])
    
    with monit_tabs[0]:
        st.subheader("Mapa de Rastreamento em Tempo Real")
        
        # Controles do mapa
        col1, col2, col3 = st.columns([2, 1, 1])
        with col1:
            st.markdown("### Filtros de Visualização")
            filtro_veiculos = st.multiselect(
                "Veículos",
                ["Todos", "Caminhão 1 - ABC1D23", "Caminhão 2 - DEF4G56", "Caminhão 3 - GHI7J89", "Caminhão 4 - JKL0M12"],
                default=["Todos"]
            )
            
            filtro_status = st.multiselect(
                "Status",
                ["Em trânsito", "Parado", "Em carga/descarga", "Em manutenção", "Alerta"],
                default=["Em trânsito", "Parado", "Em carga/descarga"]
            )
        
        with col2:
            st.markdown("### Período")
            data_inicio = st.date_input("Data Início", pd.Timestamp.now() - pd.Timedelta(days=1))
            data_fim = st.date_input("Data Fim", pd.Timestamp.now())
        
        with col3:
            st.markdown("### Opções")
            st.checkbox("Mostrar rotas planejadas", value=True)
            st.checkbox("Mostrar pontos de parada", value=True)
            st.checkbox("Mostrar alertas", value=True)
            st.button("Atualizar Mapa")
        
        # Simulação do mapa
        st.markdown("### Mapa de Rastreamento")
        
        # Código HTML para simular um mapa interativo
        mapa_html = """
        <div style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; height: 500px; position: relative;">
            <div style="position: absolute; top: 10px; left: 10px; background-color: white; padding: 5px; border-radius: 3px; box-shadow: 0 0 5px rgba(0,0,0,0.2);">
                <span style="font-size: 12px;">Zoom: 14 | Centro: -23.5505, -46.6333</span>
            </div>
            
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                <h3>Mapa Interativo de Rastreamento</h3>
                <p>Aqui seria exibido o mapa real com os veículos e rotas</p>
                <p>Integrável com Google Maps, Mapbox ou OpenStreetMap</p>
                <div style="width: 80%; height: 2px; background-color: #ff0000; margin: 20px auto;"></div>
                <div style="width: 10px; height: 10px; background-color: #ff0000; border-radius: 50%; display: inline-block;"></div>
                <span style="margin-left: 5px;">Caminhão 1 - ABC1D23 (Em trânsito)</span>
                <br>
                <div style="width: 10px; height: 10px; background-color: #00ff00; border-radius: 50%; display: inline-block; margin-top: 10px;"></div>
                <span style="margin-left: 5px;">Caminhão 2 - DEF4G56 (Parado)</span>
                <br>
                <div style="width: 10px; height: 10px; background-color: #0000ff; border-radius: 50%; display: inline-block; margin-top: 10px;"></div>
                <span style="margin-left: 5px;">Caminhão 3 - GHI7J89 (Em carga/descarga)</span>
            </div>
            
            <div style="position: absolute; bottom: 10px; right: 10px; background-color: white; padding: 5px; border-radius: 3px; box-shadow: 0 0 5px rgba(0,0,0,0.2);">
                <span style="font-size: 12px;">Última atualização: {}</span>
            </div>
        </div>
        """.format(pd.Timestamp.now().strftime("%d/%m/%Y %H:%M:%S"))
        
        st.markdown(mapa_html, unsafe_allow_html=True)
        
        # Informações dos veículos
        st.markdown("### Informações dos Veículos")
        veiculos_data = {
            "Placa": ["ABC1D23", "DEF4G56", "GHI7J89", "JKL0M12"],
            "Motorista": ["Ruan Silva", "Carlos Oliveira", "Marcos Santos", "Pedro Almeida"],
            "Status": ["Em trânsito", "Parado", "Em carga/descarga", "Em manutenção"],
            "Velocidade": ["75 km/h", "0 km/h", "0 km/h", "0 km/h"],
            "Última Atualização": ["Há 2 min", "Há 15 min", "Há 5 min", "Há 1 hora"],
            "Próximo Destino": ["São Paulo, SP", "Campinas, SP", "Ribeirão Preto, SP", "Oficina Central"]
        }
        
        df_veiculos = pd.DataFrame(veiculos_data)
        st.dataframe(df_veiculos, use_container_width=True)
    
    with monit_tabs[1]:
        st.subheader("Análise de Custos Logísticos")
        
        # Filtros para análise de custos
        col1, col2 = st.columns(2)
        with col1:
            periodo_analise = st.selectbox(
                "Período de Análise",
                ["Último mês", "Últimos 3 meses", "Últimos 6 meses", "Último ano", "Personalizado"]
            )
            
            if periodo_analise == "Personalizado":
                data_inicio_analise = st.date_input("Data Início Análise", pd.Timestamp.now() - pd.Timedelta(days=30))
                data_fim_analise = st.date_input("Data Fim Análise", pd.Timestamp.now())
        
        with col2:
            tipo_analise = st.multiselect(
                "Tipo de Análise",
                ["Combustível", "Manutenção", "Pneus", "Pedágios", "Salários", "Depreciação", "Outros"],
                default=["Combustível", "Manutenção", "Pneus", "Pedágios"]
            )
            
            agrupar_por = st.selectbox(
                "Agrupar por",
                ["Veículo", "Rota", "Motorista", "Tipo de Despesa", "Cliente"]
            )
        
        # Gráfico de custos por categoria
        st.markdown("### Custos por Categoria")
        
        # Dados simulados para o gráfico
        categorias = ["Combustível", "Manutenção", "Pneus", "Pedágios", "Salários", "Depreciação", "Outros"]
        valores = [42500, 15800, 8900, 12300, 35000, 9500, 5200]
        
        # Criar gráfico de barras
        fig_categorias = {
            "data": [{"type": "bar", "x": categorias, "y": valores, "marker": {"color": "#5E35B1"}}],
            "layout": {"title": "Custos por Categoria (R$)", "height": 400}
        }
        
        st.plotly_chart(fig_categorias, use_container_width=True)
        
        # Gráfico de evolução de custos
        st.markdown("### Evolução de Custos")
        
        # Dados simulados para o gráfico de linha
        meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"]
        combustivel = [38000, 40200, 39500, 41800, 42500, 43200]
        manutencao = [12000, 8500, 14200, 10500, 15800, 11200]
        pneus = [5000, 4800, 7200, 6500, 8900, 7800]
        pedagios = [10500, 11200, 11800, 12000, 12300, 12500]
        
        # Criar gráfico de linha
        fig_evolucao = {
            "data": [
                {"type": "scatter", "mode": "lines+markers", "x": meses, "y": combustivel, "name": "Combustível"},
                {"type": "scatter", "mode": "lines+markers", "x": meses, "y": manutencao, "name": "Manutenção"},
                {"type": "scatter", "mode": "lines+markers", "x": meses, "y": pneus, "name": "Pneus"},
                {"type": "scatter", "mode": "lines+markers", "x": meses, "y": pedagios, "name": "Pedágios"}
            ],
            "layout": {"title": "Evolução de Custos por Categoria (R$)", "height": 400}
        }
        
        st.plotly_chart(fig_evolucao, use_container_width=True)
        
        # Tabela de custos detalhados
        st.markdown("### Custos Detalhados")
        
        # Dados simulados para a tabela
        custos_data = {
            "Veículo": ["ABC1D23", "DEF4G56", "GHI7J89", "JKL0M12", "ABC1D23", "DEF4G56"],
            "Data": ["01/06/2023", "03/06/2023", "05/06/2023", "08/06/2023", "10/06/2023", "12/06/2023"],
            "Categoria": ["Combustível", "Manutenção", "Pneus", "Pedágios", "Combustível", "Pedágios"],
            "Descrição": ["Abastecimento", "Troca de óleo", "Substituição de pneus", "Pedágio SP-RJ", "Abastecimento", "Pedágio SP-MG"],
            "Valor (R$)": [850.00, 450.00, 3200.00, 180.00, 920.00, 150.00]
        }
        
        df_custos = pd.DataFrame(custos_data)
        st.dataframe(df_custos, use_container_width=True)
        
        # Indicadores de desempenho
        st.markdown("### Indicadores de Desempenho")
        
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric(
                label="Custo por Km",
                value="R$ 4,20",
                delta="-0.15",
                delta_color="inverse"
            )
        
        with col2:
            st.metric(
                label="Custo Médio Mensal",
                value="R$ 129.200",
                delta="5.2%",
                delta_color="inverse"
            )
        
        with col3:
            st.metric(
                label="Consumo Médio",
                value="4,2 km/l",
                delta="0.3",
                delta_color="normal"
            )
        
        with col4:
            st.metric(
                label="Eficiência Operacional",
                value="87%",
                delta="2%",
                delta_color="normal"
            )
    
    with monit_tabs[2]:
        st.subheader("Portal do Motorista")
        
        # Informações do motorista
        st.markdown("""
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="margin-top: 0;">Portal do Motorista</h3>
            <p style="font-size: 18px;">Veículo: <strong>ABC1D23</strong></p>
            <p style="font-size: 16px;">Olá, <strong>Ruan</strong>. Sua jornada está sob controle.</p>
        </div>
        """, unsafe_allow_html=True)
        
        # Cards de funcionalidades
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.markdown("""
            <div style="border: 1px solid #ddd; border-radius: 10px; padding: 15px; height: 200px;">
                <h4 style="color: #5E35B1;"><i class="fas fa-clock"></i> Controle de Jornada</h4>
                <p>Início/Fim de Rota, Pausas e Descanso (Lei 13.103/15).</p>
                <button style="background-color: #5E35B1; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">Registrar Ponto</button>
            </div>
            """, unsafe_allow_html=True)
        
        with col2:
            st.markdown("""
            <div style="border: 1px solid #ddd; border-radius: 10px; padding: 15px; height: 200px;">
                <h4 style="color: #5E35B1;"><i class="fas fa-gas-pump"></i> Abastecimento/Despesas</h4>
                <p>Lançamento de combustível e despesas da viagem.</p>
                <button style="background-color: #FF9800; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">Lançar Despesa</button>
            </div>
            """, unsafe_allow_html=True)
        
        with col3:
            st.markdown("""
            <div style="border: 1px solid #ddd; border-radius: 10px; padding: 15px; height: 200px;">
                <h4 style="color: #5E35B1;"><i class="fas fa-clipboard-check"></i> Checklist e Alertas</h4>
                <p>Checklist Digital (Pré-Viagem) e Alertas de Velocidade/Ignição.</p>
                <button style="background-color: #2196F3; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">Ver Checklist</button>
            </div>
            """, unsafe_allow_html=True)
        
        # Métricas de desempenho
        st.markdown("""
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-top: 20px;">
            <h4 style="margin-top: 0;"><i class="fas fa-trophy"></i> Metas e Avaliação de Desempenho</h4>
            <p>Nota de Desempenho (Mês): <strong style="color: #4CAF50;">8.9</strong> <span style="color: #FFD700;">★</span> &nbsp;&nbsp;&nbsp; Meta: 9.0</p>
            
            <div style="background-color: #ddd; height: 10px; border-radius: 5px; margin: 10px 0;">
                <div style="background-color: #5E35B1; height: 10px; border-radius: 5px; width: 89%;"></div>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                <div>
                    <h5>Consumo Médio</h5>
                    <p><strong>4.2 km/l</strong></p>
                    <span style="background-color: #E8F5E9; color: #4CAF50; padding: 3px 8px; border-radius: 10px; font-size: 12px;">Dentro da meta</span>
                </div>
                
                <div>
                    <h5>Alertas de Velocidade</h5>
                    <p><strong>3</strong></p>
                    <span style="background-color: #FFEBEE; color: #F44336; padding: 3px 8px; border-radius: 10px; font-size: 12px;">Atenção</span>
                </div>
                
                <div>
                    <h5>Parado Ligado</h5>
                    <p><strong>45 min</strong></p>
                    <span style="background-color: #FFF8E1; color: #FFA000; padding: 3px 8px; border-radius: 10px; font-size: 12px;">Requer atenção</span>
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    with monit_tabs[3]:
        st.subheader("Alertas e Checklist")
        
        # Sistema de alertas
        st.markdown("### Sistema de Alertas")
        
        # Dados simulados para alertas
        alertas_data = {
            "Veículo": ["ABC1D23", "DEF4G56", "ABC1D23", "GHI7J89", "JKL0M12"],
            "Data/Hora": ["15/06/2023 08:45", "15/06/2023 10:12", "15/06/2023 11:30", "15/06/2023 13:22", "15/06/2023 14:05"],
            "Tipo": ["Velocidade", "Parado Ligado", "Desvio de Rota", "Temperatura Pneu", "Manutenção Preventiva"],
            "Descrição": ["Velocidade acima de 100 km/h", "Veículo parado com motor ligado por 30 min", "Desvio de 5 km da rota planejada", "Temperatura do pneu traseiro direito elevada", "Vencimento da troca de óleo em 3 dias"],
            "Status": ["Não resolvido", "Resolvido", "Em análise", "Resolvido", "Agendado"]
        }
        
        df_alertas = pd.DataFrame(alertas_data)
        
        # Adicionar cores ao status
        def highlight_status(val):
            if val == "Não resolvido":
                return "background-color: #FFEBEE; color: #F44336;"
            elif val == "Resolvido":
                return "background-color: #E8F5E9; color: #4CAF50;"
            elif val == "Em análise":
                return "background-color: #E3F2FD; color: #2196F3;"
            elif val == "Agendado":
                return "background-color: #FFF8E1; color: #FFA000;"
            return ""
        
        st.dataframe(df_alertas.style.applymap(highlight_status, subset=["Status"]), use_container_width=True)
        
        # Checklist digital
        st.markdown("### Checklist Digital")
        
        # Tabs para diferentes tipos de checklist
        checklist_tabs = st.tabs(["Pré-Viagem", "Manutenção Preventiva", "Pneus"])
        
        with checklist_tabs[0]:
            st.markdown("#### Checklist Pré-Viagem")
            
            # Formulário de checklist
            with st.form("form_checklist"):
                st.markdown("##### Documentação")
                doc_cnh = st.checkbox("CNH válida e adequada à categoria")
                doc_crlv = st.checkbox("CRLV do veículo")
                doc_antt = st.checkbox("Registro ANTT (se aplicável)")
                doc_mopp = st.checkbox("Certificado MOPP (para produtos perigosos)")
                
                st.markdown("##### Parte Externa")
                ext_pneus = st.checkbox("Verificação de pneus (pressão e desgaste)")
                ext_luzes = st.checkbox("Funcionamento de luzes e sinalização")
                ext_limpadores = st.checkbox("Limpadores de para-brisa")
                ext_vazamentos = st.checkbox("Ausência de vazamentos")
                
                st.markdown("##### Parte Interna")
                int_painel = st.checkbox("Painel de instrumentos")
                int_freios = st.checkbox("Teste de freios")
                int_cinto = st.checkbox("Cintos de segurança")
                int_extintor = st.checkbox("Extintor de incêndio válido")
                
                st.markdown("##### Observações")
                observacoes = st.text_area("Registre aqui qualquer observação importante")
                
                submitted = st.form_submit_button("Enviar Checklist")
                if submitted:
                    st.success("Checklist enviado com sucesso!")
                    st.info(f"""
                    **Resumo do Checklist:**
                    - Data/Hora: {pd.Timestamp.now().strftime('%d/%m/%Y %H:%M')}
                    - Veículo: ABC1D23
                    - Motorista: Ruan Silva
                    - Status: Aprovado para viagem
                    """)
        
        with checklist_tabs[1]:
            st.markdown("#### Manutenção Preventiva")
            
            # Dados simulados para manutenção
            manutencao_data = {
                "Item": ["Troca de óleo", "Filtro de ar", "Filtro de combustível", "Pastilhas de freio", "Alinhamento/Balanceamento", "Suspensão"],
                "Última Manutenção": ["01/05/2023", "01/05/2023", "01/05/2023", "15/03/2023", "15/04/2023", "10/02/2023"],
                "Próxima Manutenção": ["01/08/2023", "01/08/2023", "01/08/2023", "15/09/2023", "15/07/2023", "10/08/2023"],
                "Km Atual": [45000, 45000, 45000, 45000, 45000, 45000],
                "Km Próxima": [55000, 55000, 55000, 65000, 55000, 65000],
                "Status": ["OK", "OK", "OK", "Atenção", "Próximo", "OK"]
            }
            
            df_manutencao = pd.DataFrame(manutencao_data)
            
            # Adicionar cores ao status
            def highlight_manutencao(val):
                if val == "OK":
                    return "background-color: #E8F5E9; color: #4CAF50;"
                elif val == "Próximo":
                    return "background-color: #FFF8E1; color: #FFA000;"
                elif val == "Atenção":
                    return "background-color: #FFEBEE; color: #F44336;"
                return ""
            
            st.dataframe(df_manutencao.style.applymap(highlight_manutencao, subset=["Status"]), use_container_width=True)
            
            # Botão para agendar manutenção
            if st.button("Agendar Manutenção"):
                st.info("Funcionalidade de agendamento de manutenção será aberta.")
        
        with checklist_tabs[2]:
            st.markdown("#### Monitoramento de Pneus")
            
            # Visualização gráfica dos pneus
            st.markdown("""
            <div style="background-color: #f0f0f0; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
                <h4>Visualização do Veículo - ABC1D23</h4>
                <div style="margin: 20px auto; width: 80%; position: relative; height: 200px;">
                    <!-- Representação do caminhão -->
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 300px; height: 80px; background-color: #ddd; border-radius: 10px;"></div>
                    
                    <!-- Pneus -->
                    <div style="position: absolute; top: 30%; left: 20%; width: 30px; height: 30px; background-color: #4CAF50; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">1</div>
                    <div style="position: absolute; top: 30%; left: 30%; width: 30px; height: 30px; background-color: #4CAF50; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">2</div>
                    <div style="position: absolute; top: 70%; left: 60%; width: 30px; height: 30px; background-color: #FFA000; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">3</div>
                    <div style="position: absolute; top: 70%; left: 70%; width: 30px; height: 30px; background-color: #F44336; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">4</div>
                    <div style="position: absolute; top: 30%; left: 60%; width: 30px; height: 30px; background-color: #4CAF50; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">5</div>
                    <div style="position: absolute; top: 30%; left: 70%; width: 30px; height: 30px; background-color: #4CAF50; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">6</div>
                </div>
                
                <div style="display: flex; justify-content: center; margin-top: 20px;">
                    <div style="margin: 0 10px;"><span style="display: inline-block; width: 15px; height: 15px; background-color: #4CAF50; border-radius: 50%;"></span> OK</div>
                    <div style="margin: 0 10px;"><span style="display: inline-block; width: 15px; height: 15px; background-color: #FFA000; border-radius: 50%;"></span> Atenção</div>
                    <div style="margin: 0 10px;"><span style="display: inline-block; width: 15px; height: 15px; background-color: #F44336; border-radius: 50%;"></span> Crítico</div>
                </div>
            </div>
            """, unsafe_allow_html=True)
            
            # Dados dos pneus
            pneus_data = {
                "Posição": [1, 2, 3, 4, 5, 6],
                "Pressão (psi)": [100, 102, 90, 75, 100, 101],
                "Temperatura (°C)": [45, 47, 55, 65, 46, 48],
                "Profundidade (mm)": [7.5, 7.2, 5.1, 3.2, 7.0, 7.3],
                "Vida Útil (%)": [85, 82, 60, 30, 80, 83],
                "Status": ["OK", "OK", "Atenção", "Crítico", "OK", "OK"]
            }
            
            df_pneus = pd.DataFrame(pneus_data)
            
            # Adicionar cores ao status
            def highlight_pneus(val):
                if val == "OK":
                    return "background-color: #E8F5E9; color: #4CAF50;"
                elif val == "Atenção":
                    return "background-color: #FFF8E1; color: #FFA000;"
                elif val == "Crítico":
                    return "background-color: #FFEBEE; color: #F44336;"
                return ""
            
            st.dataframe(df_pneus.style.applymap(highlight_pneus, subset=["Status"]), use_container_width=True)
            
            # Gráfico de temperatura dos pneus
            st.markdown("#### Temperatura dos Pneus (Últimas 24h)")
            
            # Dados simulados para o gráfico
            horas = list(range(24))
            temp_pneu1 = [45, 46, 47, 48, 47, 46, 45, 44, 43, 44, 45, 46, 47, 48, 49, 48, 47, 46, 45, 44, 45, 46, 45, 45]
            temp_pneu4 = [50, 52, 55, 57, 60, 62, 63, 64, 65, 64, 63, 62, 61, 62, 63, 64, 65, 64, 63, 62, 61, 60, 59, 58]
            
            # Criar gráfico de linha
            fig_temp = {
                "data": [
                    {"type": "scatter", "mode": "lines", "x": horas, "y": temp_pneu1, "name": "Pneu 1 (OK)"},
                    {"type": "scatter", "mode": "lines", "x": horas, "y": temp_pneu4, "name": "Pneu 4 (Crítico)"}
                ],
                "layout": {
                    "title": "Temperatura dos Pneus (°C)",
                    "height": 300,
                    "xaxis": {"title": "Horas"},
                    "yaxis": {"title": "Temperatura (°C)"}
                }
            }
            
            st.plotly_chart(fig_temp, use_container_width=True)
            
            # Demo de análise de risco tributário
            st.markdown("### Demonstração: Análise de Risco Tributário")
            
            # Dados simulados
            riscos = [
                {"area": "ICMS", "nivel": "Alto", "impacto": "R$ 120.000", "recomendacao": "Revisar apuração"},
                {"area": "PIS/COFINS", "nivel": "Baixo", "impacto": "R$ 15.000", "recomendacao": "Manter controles"},
                {"area": "IRPJ", "nivel": "Médio", "impacto": "R$ 45.000", "recomendacao": "Documentar operações"},
                {"area": "Trabalhista", "nivel": "Baixo", "impacto": "R$ 25.000", "recomendacao": "Manter controles"}
            ]
            
            # Criando DataFrame
            df_riscos = pd.DataFrame(riscos)
            
            # Exibindo tabela com formatação condicional
            st.dataframe(df_riscos.style.apply(lambda x: ['background-color: #8eff8e' if v == "Baixo" 
                                                    else 'background-color: #ffff78' if v == "Médio"
                                                    else 'background-color: #ff7878' for v in x], 
                                        subset=['nivel']))

with tab10:
    st.header("🤖 Analytics e IA - Torre de Controle Inteligente")
    st.markdown("**Sistema de Analytics Avançado com Machine Learning e Análise Preditiva**")
    
    # Torre de Controle - KPIs Estratégicos
    st.markdown("### 🏗️ Torre de Controle - KPIs Estratégicos")
    
    # Métricas principais em tempo real
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric(
            label="📊 Eficiência Operacional",
            value="94.2%",
            delta="2.1%",
            help="Índice de eficiência geral da operação"
        )
    
    with col2:
        st.metric(
            label="💰 ROI Logístico",
            value="R$ 2.4M",
            delta="15.3%",
            help="Retorno sobre investimento em logística"
        )
    
    with col3:
        st.metric(
            label="🚛 Utilização da Frota",
            value="87.5%",
            delta="-1.2%",
            delta_color="inverse",
            help="Percentual de utilização da frota"
        )
    
    with col4:
        st.metric(
            label="⚡ Score de IA",
            value="8.7/10",
            delta="0.3",
            help="Pontuação geral do sistema de IA"
        )
    
    # Métricas em tempo real com indicadores visuais
    st.markdown("### 📈 Métricas em Tempo Real")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("#### 🎯 Indicadores de Performance")
        
        # Dados simulados para gráfico de performance
        performance_data = {
            "Métrica": ["Entregas no Prazo", "Consumo Combustível", "Manutenção Preventiva", "Satisfação Cliente"],
            "Atual": [95.2, 88.7, 92.1, 96.8],
            "Meta": [95.0, 90.0, 95.0, 95.0],
            "Tendência": ["↗️", "↘️", "↗️", "↗️"]
        }
        
        df_performance = pd.DataFrame(performance_data)
        
        # Gráfico de barras comparativo
        fig_performance = {
            "data": [
                {
                    "type": "bar",
                    "x": df_performance["Métrica"],
                    "y": df_performance["Atual"],
                    "name": "Atual",
                    "marker": {"color": "#5E35B1"}
                },
                {
                    "type": "bar",
                    "x": df_performance["Métrica"],
                    "y": df_performance["Meta"],
                    "name": "Meta",
                    "marker": {"color": "#FF9800"}
                }
            ],
            "layout": {
                "title": "Performance vs Meta (%)",
                "height": 400,
                "barmode": "group"
            }
        }
        
        st.plotly_chart(fig_performance, use_container_width=True)
    
    with col2:
        st.markdown("#### 🔄 Fluxo de Dados em Tempo Real")
        
        # Simulação de dados em tempo real
        real_time_data = {
            "Fonte": ["Telemetria Veículos", "Sensores IoT", "APIs Externas", "Sistemas ERP", "Mobile Apps"],
            "Status": ["🟢 Online", "🟢 Online", "🟡 Parcial", "🟢 Online", "🟢 Online"],
            "Última Atualização": ["2s", "5s", "1m", "30s", "10s"],
            "Volume (MB/h)": [245.7, 89.3, 156.2, 67.8, 123.4]
        }
        
        df_realtime = pd.DataFrame(real_time_data)
        st.dataframe(df_realtime, use_container_width=True)
        
        # Gráfico de volume de dados
        fig_volume = {
            "data": [
                {
                    "type": "pie",
                    "labels": df_realtime["Fonte"],
                    "values": df_realtime["Volume (MB/h)"],
                    "hole": 0.4
                }
            ],
            "layout": {
                "title": "Volume de Dados por Fonte",
                "height": 300
            }
        }
        
        st.plotly_chart(fig_volume, use_container_width=True)
    
    # Sistema de Insights de Machine Learning
    st.markdown("### 🧠 Insights de Machine Learning")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown("#### 🔍 Detecção de Anomalias")
        
        anomalias = [
            {"Tipo": "Consumo Excessivo", "Veículo": "ABC1D23", "Severidade": "Alta", "Ação": "Verificar motor"},
            {"Tipo": "Rota Ineficiente", "Veículo": "DEF4G56", "Severidade": "Média", "Ação": "Otimizar trajeto"},
            {"Tipo": "Parada Prolongada", "Veículo": "GHI7J89", "Severidade": "Baixa", "Ação": "Monitorar"}
        ]
        
        for anomalia in anomalias:
            cor = "#F44336" if anomalia["Severidade"] == "Alta" else "#FF9800" if anomalia["Severidade"] == "Média" else "#4CAF50"
            st.markdown(f"""
            <div style="border-left: 4px solid {cor}; padding: 10px; margin: 10px 0; background-color: #f8f9fa;">
                <strong>{anomalia["Tipo"]}</strong><br>
                Veículo: {anomalia["Veículo"]}<br>
                Ação: {anomalia["Ação"]}
            </div>
            """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("#### 📊 Padrões Identificados")
        
        padroes = [
            {"Padrão": "Pico de Consumo", "Horário": "14h-16h", "Impacto": "+12% combustível"},
            {"Padrão": "Rota Otimizada", "Trajeto": "SP-RJ", "Economia": "R$ 450/viagem"},
            {"Padrão": "Manutenção Preditiva", "Componente": "Freios", "Prazo": "15 dias"}
        ]
        
        for padrao in padroes:
            st.markdown(f"""
            <div style="border: 1px solid #ddd; padding: 10px; margin: 10px 0; border-radius: 5px; background-color: #f0f8ff;">
                <strong>🔍 {padrao["Padrão"]}</strong><br>
                {list(padrao.keys())[1]}: {list(padrao.values())[1]}<br>
                {list(padrao.keys())[2]}: {list(padrao.values())[2]}
            </div>
            """, unsafe_allow_html=True)
    
    with col3:
        st.markdown("#### 🎯 Recomendações IA")
        
        recomendacoes = [
            {"Ação": "Ajustar Rotas", "Economia": "R$ 2.3k/mês", "Prioridade": "Alta"},
            {"Ação": "Treinamento Motoristas", "Economia": "R$ 1.8k/mês", "Prioridade": "Média"},
            {"Ação": "Upgrade Telemetria", "Economia": "R$ 3.1k/mês", "Prioridade": "Alta"}
        ]
        
        for rec in recomendacoes:
            cor = "#5E35B1" if rec["Prioridade"] == "Alta" else "#FF9800"
            st.markdown(f"""
            <div style="border-left: 4px solid {cor}; padding: 10px; margin: 10px 0; background-color: #f5f5f5;">
                <strong>💡 {rec["Ação"]}</strong><br>
                Economia: {rec["Economia"]}<br>
                Prioridade: {rec["Prioridade"]}
            </div>
            """, unsafe_allow_html=True)
    
    # Análise Preditiva e Recomendações
    st.markdown("### 🔮 Análise Preditiva e Recomendações")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("#### 📈 Previsões de Demanda")
        
        # Dados simulados para previsão
        dias = list(range(1, 31))
        demanda_real = [120, 135, 142, 128, 156, 167, 145, 139, 158, 172, 165, 149, 178, 185, 192, 188, 175, 169, 183, 196, 201, 189, 177, 184, 198, 205, 212, 208, 195, 203]
        demanda_prevista = [125, 138, 145, 132, 159, 170, 148, 142, 161, 175, 168, 152, 181, 188, 195, 191, 178, 172, 186, 199, 204, 192, 180, 187, 201, 208, 215, 211, 198, 206]
        
        fig_previsao = {
            "data": [
                {
                    "type": "scatter",
                    "mode": "lines",
                    "x": dias[:20],
                    "y": demanda_real[:20],
                    "name": "Demanda Real",
                    "line": {"color": "#5E35B1"}
                },
                {
                    "type": "scatter",
                    "mode": "lines",
                    "x": dias[19:],
                    "y": demanda_prevista[19:],
                    "name": "Previsão IA",
                    "line": {"color": "#FF9800", "dash": "dash"}
                }
            ],
            "layout": {
                "title": "Previsão de Demanda - Próximos 10 dias",
                "height": 400,
                "xaxis": {"title": "Dias"},
                "yaxis": {"title": "Demanda (viagens)"}
            }
        }
        
        st.plotly_chart(fig_previsao, use_container_width=True)
    
    with col2:
        st.markdown("#### 🔧 Manutenção Preditiva")
        
        # Dados de manutenção preditiva
        manutencao_data = {
            "Veículo": ["ABC1D23", "DEF4G56", "GHI7J89", "JKL0M12", "NOP3Q45"],
            "Componente": ["Motor", "Freios", "Pneus", "Transmissão", "Suspensão"],
            "Risco": [85, 72, 45, 91, 38],
            "Dias Restantes": [12, 25, 67, 8, 89],
            "Custo Estimado": ["R$ 3.500", "R$ 1.200", "R$ 800", "R$ 4.200", "R$ 950"]
        }
        
        df_manutencao = pd.DataFrame(manutencao_data)
        
        # Função para colorir baseado no risco
        def color_risco(val):
            if val >= 80:
                return 'background-color: #ffcdd2'
            elif val >= 60:
                return 'background-color: #fff3e0'
            else:
                return 'background-color: #e8f5e9'
        
        st.dataframe(
            df_manutencao.style.applymap(color_risco, subset=['Risco']),
            use_container_width=True
        )
        
        # Gráfico de risco por veículo
        fig_risco = {
            "data": [
                {
                    "type": "bar",
                    "x": df_manutencao["Veículo"],
                    "y": df_manutencao["Risco"],
                    "marker": {
                        "color": df_manutencao["Risco"],
                        "colorscale": "RdYlGn_r",
                        "showscale": True
                    }
                }
            ],
            "layout": {
                "title": "Nível de Risco por Veículo (%)",
                "height": 300,
                "yaxis": {"title": "Risco (%)"}
            }
        }
        
        st.plotly_chart(fig_risco, use_container_width=True)
    
    # Distribuição de Dados e Insights Especiais
    st.markdown("### 📊 Distribuição Inteligente de Dados")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown("#### 🌐 Conectividade IoT")
        
        iot_status = {
            "Dispositivos Ativos": 247,
            "Taxa de Conectividade": "98.7%",
            "Dados Processados/h": "1.2 TB",
            "Latência Média": "45ms"
        }
        
        for key, value in iot_status.items():
            st.markdown(f"**{key}:** {value}")
        
        # Indicador de status
        st.markdown("""
        <div style="text-align: center; padding: 20px;">
            <div style="width: 80px; height: 80px; border-radius: 50%; background-color: #4CAF50; margin: 0 auto; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold;">
                98.7%
            </div>
            <p style="margin-top: 10px; font-weight: bold;">Sistema Online</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("#### 🤖 Modelos de IA Ativos")
        
        modelos_ia = [
            {"Modelo": "Otimização de Rotas", "Precisão": "94.2%", "Status": "🟢"},
            {"Modelo": "Previsão de Demanda", "Precisão": "89.7%", "Status": "🟢"},
            {"Modelo": "Detecção de Anomalias", "Precisão": "96.1%", "Status": "🟢"},
            {"Modelo": "Manutenção Preditiva", "Precisão": "91.8%", "Status": "🟡"},
            {"Modelo": "Análise de Combustível", "Precisão": "87.3%", "Status": "🟢"}
        ]
        
        for modelo in modelos_ia:
            st.markdown(f"""
            <div style="display: flex; justify-content: space-between; padding: 8px; border-bottom: 1px solid #eee;">
                <span><strong>{modelo["Modelo"]}</strong></span>
                <span>{modelo["Status"]} {modelo["Precisão"]}</span>
            </div>
            """, unsafe_allow_html=True)
    
    with col3:
        st.markdown("#### 📈 Insights Especiais")
        
        insights_especiais = [
            "🔥 **Insight MKL**: Padrão de consumo identificado nas rotas SP-RJ com potencial de economia de 18%",
            "⚡ **Análise Preditiva**: Modelo prevê aumento de 23% na demanda para próxima semana",
            "🎯 **Distribuição Otimizada**: IA sugere redistribuição de cargas para reduzir 15% dos custos operacionais",
            "🔍 **Detecção Avançada**: Sistema identificou padrão de manutenção que pode evitar R$ 45k em custos"
        ]
        
        for insight in insights_especiais:
            st.markdown(f"""
            <div style="background-color: #f0f8ff; padding: 12px; margin: 8px 0; border-radius: 8px; border-left: 4px solid #5E35B1;">
                {insight}
            </div>
            """, unsafe_allow_html=True)
    
    # Painel de Controle Executivo
    st.markdown("### 🎛️ Painel de Controle Executivo")
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.markdown("#### 📊 Dashboard Executivo")
        
        # Dados para dashboard executivo
        meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"]
        receita = [850, 920, 1050, 980, 1120, 1200]
        custos = [650, 680, 750, 720, 800, 850]
        lucro = [200, 240, 300, 260, 320, 350]
        
        fig_executivo = {
            "data": [
                {
                    "type": "scatter",
                    "mode": "lines+markers",
                    "x": meses,
                    "y": receita,
                    "name": "Receita (R$ mil)",
                    "line": {"color": "#4CAF50"}
                },
                {
                    "type": "scatter",
                    "mode": "lines+markers",
                    "x": meses,
                    "y": custos,
                    "name": "Custos (R$ mil)",
                    "line": {"color": "#F44336"}
                },
                {
                    "type": "scatter",
                    "mode": "lines+markers",
                    "x": meses,
                    "y": lucro,
                    "name": "Lucro (R$ mil)",
                    "line": {"color": "#5E35B1"}
                }
            ],
            "layout": {
                "title": "Performance Financeira - 2024",
                "height": 400,
                "yaxis": {"title": "Valores (R$ mil)"}
            }
        }
        
        st.plotly_chart(fig_executivo, use_container_width=True)
    
    with col2:
        st.markdown("#### 🎯 Metas Estratégicas")
        
        metas = [
            {"Meta": "ROI Anual", "Atual": "24.5%", "Target": "25%", "Progress": 98},
            {"Meta": "Redução Custos", "Atual": "12.3%", "Target": "15%", "Progress": 82},
            {"Meta": "Eficiência IA", "Atual": "94.2%", "Target": "95%", "Progress": 99},
            {"Meta": "Satisfação Cliente", "Atual": "96.8%", "Target": "97%", "Progress": 99}
        ]
        
        for meta in metas:
            st.markdown(f"**{meta['Meta']}**")
            st.progress(meta['Progress'] / 100)
            st.markdown(f"Atual: {meta['Atual']} | Meta: {meta['Target']}")
            st.markdown("---")

# Rodapé
st.markdown("---")
st.markdown("© 2025 OptiLog - Sistema de Gestão de Transportes | EJG - Evolução em Transporte")# Em um arquivo utils.py ou diretamente na aba
def render_info_card(title, status, version):
    st.markdown(f"""
    <div style="border: 1px solid #ddd; padding: 8px; margin: 5px 0; border-radius: 5px; background-color: #f9f9f9;">
        <strong>{title}</strong><br>
        {status} | {version}
    </div>
    """, unsafe_allow_html=True)

# No código da aba developer_hub.py
with col1:
    st.markdown("#### 🚀 Ambiente de Desenvolvimento")
    dev_tools = [
        {"Tool": "VS Code Extensions", "Status": "🟢 Ativo", "Versão": "v1.2.3"},
        # ...
    ]
    for tool in dev_tools:
        render_info_card(tool["Tool"], tool["Status"], tool["Versão"])
streamlit-app/
|-- app.py
|-- assets/
|   |-- logo.svg
|-- tabs/
|   |-- __init__.py
|   |-- developer_hub.py
|   |-- architecture_diagram.py
|   |-- firestore_collections.py
|   |-- ... (um arquivo para cada aba)
# app.py (versão refatorada)
import streamlit as st
# ... outras importações ...
from tabs import (
    developer_hub,
    architecture_diagram,
    firestore_collections,
    # ... importe as outras abas
)

# ... (código de configuração da página e splash screen) ...

# Cabeçalho
# ...

# Tabs
tabs = st.tabs([
    "🔧 Developer Hub", "📊 Diagrama de Arquitetura", "🔄 Componentes & Fluxo", 
    "🗄️ Coleções Firestore", "☁️ Cloud Functions", "💰 Núcleo Financeiro EJG", 
    "🚛 Gestão de Frota EJG", "📚 Guia de Estudo", "💬 Chat & Suporte EJG", 
    "📍 Monitoramento Logístico", "🤖 Analytics e IA"
])

with tabs[0]:
    developer_hub.render()

with tabs[1]:
    architecture_diagram.render()

with tabs[3]:
    firestore_collections.render()

# ... e assim por diante para as outras abas
# tabs/developer_hub.py
import streamlit as st

def render():
    st.header("🔧 Developer Hub - Centro de Desenvolvimento")
    st.markdown("**Plataforma Integrada de Desenvolvimento, Automação e Integração**")
    # ... resto do código da aba Developer Hub ...
# i18n.py
TEXTS = {
    "pt": {
        "dev_hub_title": "🔧 Developer Hub - Centro de Desenvolvimento",
        "dev_hub_subtitle": "**Plataforma Integrada de Desenvolvimento, Automação e Integração**",
        "api_monitoring_header": "#### 📊 Monitoramento de APIs",
        # ... outros textos
    },
    "en": {
        "dev_hub_title": "🔧 Developer Hub",
        "dev_hub_subtitle": "**Integrated Development, Automation, and Integration Platform**",
        "api_monitoring_header": "#### 📊 API Monitoring",
        # ...
    }
}

def get_text(key, lang="pt"):
    """Retorna o texto para a chave e idioma especificados."""
    return TEXTS.get(lang, {}).get(key, f"<{key}>")
# Em um dos seus arquivos de aba
from i18n import get_text

# ...
st.header(get_text("dev_hub_title"))
st.markdown(get_text("dev_hub_subtitle"))

# ...
with col2:
    st.markdown(get_text("api_monitoring_header"))
# Em um arquivo utils.py ou diretamente na aba
def render_info_card(title, status, version):
    st.markdown(f"""
    <div style="border: 1px solid #ddd; padding: 8px; margin: 5px 0; border-radius: 5px; background-color: #f9f9f9;">
        <strong>{title}</strong><br>
        {status} | {version}
    </div>
    """, unsafe_allow_html=True)

# No código da aba developer_hub.py
with col1:
    st.markdown("#### 🚀 Ambiente de Desenvolvimento")
    dev_tools = [
        {"Tool": "VS Code Extensions", "Status": "🟢 Ativo", "Versão": "v1.2.3"},
        # ...
    ]
    for tool in dev_tools:
        render_info_card(tool["Tool"], tool["Status"], tool["Versão"])
# Em um arquivo utils.py ou diretamente na aba
def render_info_card(title, status, version):
    st.markdown(f"""
    <div style="border: 1px solid #ddd; padding: 8px; margin: 5px 0; border-radius: 5px; background-color: #f9f9f9;">
        <strong>{title}</strong><br>
        {status} | {version}
    </div>
    """, unsafe_allow_html=True)

# No código da aba developer_hub.py
with col1:
    st.markdown("#### 🚀 Ambiente de Desenvolvimento")
    dev_tools = [
        {"Tool": "VS Code Extensions", "Status": "🟢 Ativo", "Versão": "v1.2.3"},
        # ...
    ]
    for tool in dev_tools:
        render_info_card(tool["Tool"], tool["Status"], tool["Versão"])
streamlit-app/
|-- app.py
|-- assets/
|   |-- logo.svg
|-- tabs/
|   |-- __init__.py
|   |-- developer_hub.py
|   |-- architecture_diagram.py
|   |-- firestore_collections.py
|   |-- ... (um arquivo para cada aba)
# app.py (versão refatorada)
import streamlit as st
# ... outras importações ...
from tabs import (
    developer_hub,
    architecture_diagram,
    firestore_collections,
    # ... importe as outras abas
)

# ... (código de configuração da página e splash screen) ...

# Cabeçalho
# ...

# Tabs
tabs = st.tabs([
    "🔧 Developer Hub", "📊 Diagrama de Arquitetura", "🔄 Componentes & Fluxo", 
    "🗄️ Coleções Firestore", "☁️ Cloud Functions", "💰 Núcleo Financeiro EJG", 
    "🚛 Gestão de Frota EJG", "📚 Guia de Estudo", "💬 Chat & Suporte EJG", 
    "📍 Monitoramento Logístico", "🤖 Analytics e IA"
])

with tabs[0]:
    developer_hub.render()

with tabs[1]:
    architecture_diagram.render()

with tabs[3]:
    firestore_collections.render()

# ... e assim por diante para as outras abas
# tabs/developer_hub.py
import streamlit as st

def render():
    st.header("🔧 Developer Hub - Centro de Desenvolvimento")
    st.markdown("**Plataforma Integrada de Desenvolvimento, Automação e Integração**")
    # ... resto do código da aba Developer Hub ...
# tabs/monitoramento_logistico.py
import streamlit as st