import streamlit as st
import pandas as pd
import numpy as np

def render():
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
