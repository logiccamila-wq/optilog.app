import streamlit as st
import pandas as pd
import numpy as np

def render():
    """Renderiza o conteúdo da aba de Monitoramento Logístico."""
    st.header("📍 Monitoramento Logístico")

    # Adicionar abas dentro do módulo de Monitoramento Logístico
    monit_tabs = st.tabs(["Mapa de Rastreamento", "Análise de Custos", "Portal do Motorista", "Alertas e Checklist"])

    with monit_tabs[0]:
        render_mapa_rastreamento()

    with monit_tabs[1]:
        render_analise_custos()

    with monit_tabs[2]:
        render_portal_motorista()

    with monit_tabs[3]:
        render_alertas_checklist()

def render_mapa_rastreamento():
    """Renderiza a sub-aba 'Mapa de Rastreamento'."""
    st.subheader("Mapa de Rastreamento em Tempo Real")

    # Controles do mapa
    col1, col2, col3 = st.columns([2, 1, 1])
    with col1:
        st.markdown("### Filtros de Visualização")
        filtro_veiculos = st.multiselect(
            "Veículos",
            ["Todos", "Caminhão 1 - ABC1D23", "Caminhão 2 - DEF4G56", "Caminhão 3 - GHI7J89", "Caminhão 4 - JKL0M12"],
            default=["Todos"],
            key="filtro_veiculos_monit"
        )
        filtro_status = st.multiselect(
            "Status",
            ["Em trânsito", "Parado", "Em carga/descarga", "Em manutenção", "Alerta"],
            default=["Em trânsito", "Parado", "Em carga/descarga"],
            key="filtro_status_monit"
        )
    with col2:
        st.markdown("### Período")
        data_inicio = st.date_input("Data Início", pd.Timestamp.now() - pd.Timedelta(days=1), key="data_inicio_monit")
        data_fim = st.date_input("Data Fim", pd.Timestamp.now(), key="data_fim_monit")
    with col3:
        st.markdown("### Opções")
        st.checkbox("Mostrar rotas planejadas", value=True, key="rotas_planejadas_monit")
        st.checkbox("Mostrar pontos de parada", value=True, key="pontos_parada_monit")
        st.checkbox("Mostrar alertas", value=True, key="mostrar_alertas_monit")
        st.button("Atualizar Mapa", key="btn_atualizar_mapa_monit")

    # Simulação do mapa
    st.markdown("### Mapa de Rastreamento")
    mapa_html = f"""
    <div style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; height: 500px; position: relative;">
        <div style="position: absolute; top: 10px; left: 10px; background-color: white; padding: 5px; border-radius: 3px; box-shadow: 0 0 5px rgba(0,0,0,0.2);">
            <span style="font-size: 12px;">Zoom: 14 | Centro: -23.5505, -46.6333</span>
        </div>
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
            <h3>Mapa Interativo de Rastreamento</h3>
            <p>Aqui seria exibido o mapa real com os veículos e rotas</p>
        </div>
        <div style="position: absolute; bottom: 10px; right: 10px; background-color: white; padding: 5px; border-radius: 3px; box-shadow: 0 0 5px rgba(0,0,0,0.2);">
            <span style="font-size: 12px;">Última atualização: {pd.Timestamp.now().strftime("%d/%m/%Y %H:%M:%S")}</span>
        </div>
    </div>
    """
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

def render_analise_custos():
    """Renderiza a sub-aba 'Análise de Custos'."""
    st.subheader("Análise de Custos Logísticos")
    # ... (O restante do código para esta sub-aba iria aqui) ...
    st.info("Conteúdo da Análise de Custos em desenvolvimento.")

def render_portal_motorista():
    """Renderiza a sub-aba 'Portal do Motorista'."""
    st.subheader("Portal do Motorista")
    # ... (O restante do código para esta sub-aba iria aqui) ...
    st.info("Conteúdo do Portal do Motorista em desenvolvimento.")

def render_alertas_checklist():
    """Renderiza a sub-aba 'Alertas e Checklist'."""
    st.subheader("Alertas e Checklist")
    
    # Sistema de alertas
    st.markdown("### Sistema de Alertas")
    alertas_data = {
        "Veículo": ["ABC1D23", "DEF4G56", "ABC1D23", "GHI7J89", "JKL0M12"],
        "Data/Hora": ["15/06/2023 08:45", "15/06/2023 10:12", "15/06/2023 11:30", "15/06/2023 13:22", "15/06/2023 14:05"],
        "Tipo": ["Velocidade", "Parado Ligado", "Desvio de Rota", "Temperatura Pneu", "Manutenção Preventiva"],
        "Descrição": ["Velocidade acima de 100 km/h", "Veículo parado com motor ligado por 30 min", "Desvio de 5 km da rota planejada", "Temperatura do pneu traseiro direito elevada", "Vencimento da troca de óleo em 3 dias"],
        "Status": ["Não resolvido", "Resolvido", "Em análise", "Resolvido", "Agendado"]
    }
    df_alertas = pd.DataFrame(alertas_data)

    def highlight_status(val):
        if val == "Não resolvido": return "background-color: #FFEBEE; color: #F44336;"
        if val == "Resolvido": return "background-color: #E8F5E9; color: #4CAF50;"
        if val == "Em análise": return "background-color: #E3F2FD; color: #2196F3;"
        if val == "Agendado": return "background-color: #FFF8E1; color: #FFA000;"
        return ""

    st.dataframe(df_alertas.style.applymap(highlight_status, subset=["Status"]), use_container_width=True)

    # Checklist digital
    st.markdown("### Checklist Digital")
    checklist_tabs = st.tabs(["Pré-Viagem", "Manutenção Preventiva", "Pneus"])
    
    with checklist_tabs[0]:
        st.markdown("#### Checklist Pré-Viagem")
        with st.form("form_checklist_monit"):
            st.markdown("##### Documentação")
            st.checkbox("CNH válida e adequada à categoria", key="doc_cnh_monit")
            st.checkbox("CRLV do veículo", key="doc_crlv_monit")
            
            st.markdown("##### Parte Externa")
            st.checkbox("Verificação de pneus (pressão e desgaste)", key="ext_pneus_monit")
            st.checkbox("Funcionamento de luzes e sinalização", key="ext_luzes_monit")
            
            st.markdown("##### Observações")
            st.text_area("Registre aqui qualquer observação importante", key="obs_monit")
            
            if st.form_submit_button("Enviar Checklist"):
                st.success("Checklist enviado com sucesso!")

    with checklist_tabs[1]:
        st.markdown("#### Manutenção Preventiva")
        st.info("Conteúdo da Manutenção Preventiva em desenvolvimento.")

    with checklist_tabs[2]:
        st.markdown("#### Monitoramento de Pneus")
        st.info("Conteúdo do Monitoramento de Pneus em desenvolvimento.")