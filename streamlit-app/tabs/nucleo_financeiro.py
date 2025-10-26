import streamlit as st
import pandas as pd
import numpy as np

def render():
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
            - Chatbot \"CFO Virtual\" capaz de analisar toda a empresa
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
