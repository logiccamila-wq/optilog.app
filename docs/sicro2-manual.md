# Manual de Custos Rodoviários – Sicro2 (DNIT)

Fonte oficial: https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/custos-referenciais/sistemas-de-custos/sicro2/manual-de-custos-rodoviarios/ManualdeCustosSicro2Vol.1MetodologiaeConceitos.pdf

Este documento consolida os principais pontos do Manual de Custos Rodoviários – Sicro2 (Vol. 1: Metodologia e Conceitos) para uso interno em análises de viagens, compliance e estimativas de frete.

## Objetivos e Escopo
- Padronizar conceitos e metodologias de apuração de custos de transporte rodoviário.
- Servir como referência de boas práticas e parâmetros oficiais (DNIT) para formação de preços, análise de viabilidade e auditoria de custos.

## Estrutura de Custos
- Custos fixos: depreciação, remuneração do capital, seguros, licenças, impostos fixos.
- Custos variáveis: combustível, lubrificantes, pneus, manutenção, pedágios.
- Custos operacionais: mão de obra, despesas administrativas, comunicação, rastreamento.
- Componentes de viagem: distância, tempo, capacidade de carga, perfil de rota.

## Metodologia
- Base em unidades operacionais (km, hora, tonelada, eixo).
- Rateios por tipo de veículo/configuração de eixos.
- Utilização de coeficientes técnicos e consumos médios oficiais.
- Parametrização de preços via tabelas de referência e atualização periódica.

## Integração com Compliance
- Compatível com análises de PBTC e limites por eixo (Lei da Balança). Use os limites oficiais e tolerâncias aplicáveis (5% PBTC, 10% por eixo) nas auditorias.
- Relacionar configuração de eixos e capacidade com o custo por tonelada-km.

## Estimativa de Frete (Diretrizes)
- Estruturar cálculo pelo custo total por viagem + margem.
- Aplicar fatores: distância, peso transportado, tipo de via, pedágios, consumo médio.
- Permitir taxa configurável e indexadores regionais.

## Variáveis-Chave
- `categoria_veiculo`, `configuracao_eixos`, `capacidade_ton`.
- `distancia_km`, `tempo_viagem_h`, `consumo_combustivel_l_km`.
- `custo_pedagio`, `custo_manutencao_km`, `custo_pneus_km`.
- `custo_mo_km`, `custo_admin_km`.

## Boas Práticas
- Atualizar coeficientes técnicos com periodicidade definida.
- Auditar amostras de viagens para validar consumo e custos.
- Documentar fontes e versões das tabelas de referência.

## Referências
- DNIT – Manual de Custos Rodoviários – Sicro2 – Vol. 1: Metodologia e Conceitos.
- Normas correlatas: CONTRAN (pesos e dimensões), SENATRAN, DERs estaduais.