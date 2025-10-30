-- ============================================
-- SISTEMA COMPLETO DE GESTÃO DE FROTA
-- Equipamentos + Inspeções + Alertas Inteligentes
-- ============================================

-- ============================================
-- TABELA: EQUIPAMENTOS DA FROTA
-- ============================================
CREATE TABLE IF NOT EXISTS equipamentos_frota (
  id SERIAL PRIMARY KEY,
  
  -- Identificação
  tipo VARCHAR(50) NOT NULL, -- semi-reboque, carreta, dolly, container, implemento
  placa VARCHAR(7) UNIQUE,
  renavam VARCHAR(11),
  chassi VARCHAR(17) UNIQUE,
  
  -- Fabricação
  ano_fabricacao INTEGER,
  fabricante VARCHAR(100),
  modelo VARCHAR(100),
  capacidade_carga DECIMAL(10,2), -- em toneladas
  eixos INTEGER,
  
  -- Proprietário
  proprietario VARCHAR(100), -- proprio, agregado, terceiro
  documento_proprietario VARCHAR(14), -- CPF ou CNPJ
  nome_proprietario VARCHAR(200),
  
  -- Status Operacional
  status VARCHAR(30) DEFAULT 'ativo', -- ativo, manutencao, inativo, vendido
  localizado_em VARCHAR(100), -- garagem, rua, oficina, viagem
  
  -- Documentação
  crlv_vencimento DATE,
  seguro_vencimento DATE,
  seguro_apolice VARCHAR(50),
  seguro_seguradora VARCHAR(100),
  
  -- Custos
  valor_compra DECIMAL(12,2),
  data_compra DATE,
  
  -- Metadata
  observacoes TEXT,
  fotos_urls TEXT[], -- Array de URLs de fotos
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by INTEGER
);

-- ============================================
-- TABELA: INSPEÇÕES DE EQUIPAMENTOS
-- ============================================
CREATE TABLE IF NOT EXISTS inspecoes_equipamentos (
  id SERIAL PRIMARY KEY,
  equipamento_id INTEGER NOT NULL REFERENCES equipamentos_frota(id) ON DELETE CASCADE,
  
  -- Tipo e Data da Inspeção
  tipo_inspecao VARCHAR(50) NOT NULL, -- preventiva, periodica, anual, pre_viagem
  data_inspecao DATE NOT NULL DEFAULT CURRENT_DATE,
  proxima_inspecao DATE,
  
  -- Responsável
  realizada_por INTEGER REFERENCES users(id),
  realizada_por_nome VARCHAR(200), -- caso não tenha user_id
  
  -- Resultados Gerais
  status VARCHAR(30) DEFAULT 'conforme', -- conforme, nao_conforme, pendente
  observacoes TEXT,
  
  -- Itens Verificados (JSONB para flexibilidade)
  itens_verificados JSONB,
  /*
  Exemplo de estrutura:
  {
    "pneus": {
      "status": "ok",
      "observacao": "Pneus em bom estado, pressão adequada"
    },
    "freios": {
      "status": "atencao",
      "observacao": "Pastilhas em 40%, trocar em breve"
    },
    "suspensao": {
      "status": "ok",
      "observacao": ""
    },
    "sistema_eletrico": {
      "status": "ok",
      "observacao": "Lanternas e sinalizadores funcionando"
    },
    "estrutura_chassi": {
      "status": "nao_conforme",
      "observacao": "Rachadura detectada no chassi, reparar urgente"
    },
    "engate": {
      "status": "ok",
      "observacao": ""
    },
    "portas_travas": {
      "status": "ok",
      "observacao": ""
    }
  }
  */
  
  -- Contadores de Não Conformidades
  nao_conformidades INTEGER DEFAULT 0,
  nao_conformidades_criticas INTEGER DEFAULT 0,
  
  -- Documentação
  fotos TEXT[], -- URLs das fotos da inspeção
  laudo_url TEXT, -- URL do laudo completo em PDF
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABELA: ALERTAS INTELIGENTES DE INSPEÇÕES
-- ============================================
CREATE TABLE IF NOT EXISTS alertas_inspecoes (
  id SERIAL PRIMARY KEY,
  equipamento_id INTEGER NOT NULL REFERENCES equipamentos_frota(id) ON DELETE CASCADE,
  inspecao_id INTEGER REFERENCES inspecoes_equipamentos(id) ON DELETE SET NULL,
  
  -- Tipo e Severidade
  tipo_alerta VARCHAR(50) NOT NULL, -- vencimento_proximo, vencido, nao_conforme_critica, documento_vencido
  severidade VARCHAR(20) NOT NULL DEFAULT 'info', -- info, aviso, critico
  mensagem TEXT NOT NULL,
  
  -- Destinatários
  notificar_gerentes BOOLEAN DEFAULT true,
  notificar_diretoria BOOLEAN DEFAULT false,
  notificado_em TIMESTAMP,
  emails_notificados TEXT[], -- emails que foram notificados
  
  -- Status
  resolvido BOOLEAN DEFAULT false,
  resolvido_em TIMESTAMP,
  resolvido_por INTEGER REFERENCES users(id),
  resolucao_notas TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP -- quando o alerta expira (se aplicável)
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_equipamentos_tipo ON equipamentos_frota(tipo);
CREATE INDEX IF NOT EXISTS idx_equipamentos_status ON equipamentos_frota(status);
CREATE INDEX IF NOT EXISTS idx_equipamentos_placa ON equipamentos_frota(placa);

CREATE INDEX IF NOT EXISTS idx_inspecoes_equipamento ON inspecoes_equipamentos(equipamento_id);
CREATE INDEX IF NOT EXISTS idx_inspecoes_data ON inspecoes_equipamentos(data_inspecao DESC);
CREATE INDEX IF NOT EXISTS idx_inspecoes_status ON inspecoes_equipamentos(status);
CREATE INDEX IF NOT EXISTS idx_inspecoes_proxima ON inspecoes_equipamentos(proxima_inspecao);

CREATE INDEX IF NOT EXISTS idx_alertas_equipamento ON alertas_inspecoes(equipamento_id);
CREATE INDEX IF NOT EXISTS idx_alertas_resolvido ON alertas_inspecoes(resolvido);
CREATE INDEX IF NOT EXISTS idx_alertas_severidade ON alertas_inspecoes(severidade);
CREATE INDEX IF NOT EXISTS idx_alertas_created ON alertas_inspecoes(created_at DESC);

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger para atualizar updated_at em equipamentos
CREATE OR REPLACE FUNCTION update_equipamentos_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_equipamentos_updated ON equipamentos_frota;
CREATE TRIGGER trigger_equipamentos_updated
    BEFORE UPDATE ON equipamentos_frota
    FOR EACH ROW
    EXECUTE FUNCTION update_equipamentos_timestamp();

-- Trigger para atualizar updated_at em inspeções
DROP TRIGGER IF EXISTS trigger_inspecoes_updated ON inspecoes_equipamentos;
CREATE TRIGGER trigger_inspecoes_updated
    BEFORE UPDATE ON inspecoes_equipamentos
    FOR EACH ROW
    EXECUTE FUNCTION update_equipamentos_timestamp();

-- ============================================
-- FUNÇÕES AUXILIARES
-- ============================================

-- Função para verificar inspeções vencidas e criar alertas automaticamente
CREATE OR REPLACE FUNCTION check_inspecoes_vencidas()
RETURNS void AS $$
DECLARE
    rec RECORD;
    dias_vencimento INTEGER;
    severidade VARCHAR(20);
    tipo_alert VARCHAR(50);
    mensagem TEXT;
BEGIN
    FOR rec IN 
        SELECT 
            e.id as equipamento_id,
            e.placa,
            e.tipo,
            i.id as inspecao_id,
            i.proxima_inspecao,
            i.tipo_inspecao
        FROM equipamentos_frota e
        INNER JOIN inspecoes_equipamentos i ON e.id = i.equipamento_id
        WHERE e.status = 'ativo'
          AND i.proxima_inspecao IS NOT NULL
          AND NOT EXISTS (
              SELECT 1 FROM alertas_inspecoes a
              WHERE a.equipamento_id = e.id
                AND a.inspecao_id = i.id
                AND a.resolvido = false
          )
    LOOP
        dias_vencimento := rec.proxima_inspecao - CURRENT_DATE;
        
        IF dias_vencimento < 0 THEN
            -- VENCIDA
            severidade := 'critico';
            tipo_alert := 'vencido';
            mensagem := format('CRÍTICO: Inspeção %s vencida há %s dias! Equipamento: %s %s',
                rec.tipo_inspecao, ABS(dias_vencimento), rec.tipo, rec.placa);
            
            INSERT INTO alertas_inspecoes (
                equipamento_id, inspecao_id, tipo_alerta, severidade, mensagem,
                notificar_gerentes, notificar_diretoria
            ) VALUES (
                rec.equipamento_id, rec.inspecao_id, tipo_alert, severidade, mensagem,
                true, true
            );
            
        ELSIF dias_vencimento <= 7 THEN
            -- VENCENDO EM 7 DIAS
            severidade := 'aviso';
            tipo_alert := 'vencimento_proximo';
            mensagem := format('AVISO: Inspeção %s vence em %s dias. Equipamento: %s %s',
                rec.tipo_inspecao, dias_vencimento, rec.tipo, rec.placa);
            
            INSERT INTO alertas_inspecoes (
                equipamento_id, inspecao_id, tipo_alerta, severidade, mensagem,
                notificar_gerentes, notificar_diretoria
            ) VALUES (
                rec.equipamento_id, rec.inspecao_id, tipo_alert, severidade, mensagem,
                true, false
            );
            
        ELSIF dias_vencimento <= 30 THEN
            -- VENCENDO EM 30 DIAS
            severidade := 'info';
            tipo_alert := 'vencimento_proximo';
            mensagem := format('INFO: Inspeção %s vence em %s dias. Equipamento: %s %s',
                rec.tipo_inspecao, dias_vencimento, rec.tipo, rec.placa);
            
            INSERT INTO alertas_inspecoes (
                equipamento_id, inspecao_id, tipo_alerta, severidade, mensagem,
                notificar_gerentes, notificar_diretoria
            ) VALUES (
                rec.equipamento_id, rec.inspecao_id, tipo_alert, severidade, mensagem,
                true, false
            );
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VIEWS PARA RELATÓRIOS
-- ============================================

-- View: Resumo de Equipamentos
CREATE OR REPLACE VIEW view_equipamentos_resumo AS
SELECT 
    e.id,
    e.tipo,
    e.placa,
    e.chassi,
    e.status,
    e.proprietario,
    COUNT(DISTINCT i.id) as total_inspecoes,
    MAX(i.data_inspecao) as ultima_inspecao,
    MIN(i.proxima_inspecao) as proxima_inspecao,
    SUM(CASE WHEN i.status = 'nao_conforme' THEN 1 ELSE 0 END) as inspecoes_nao_conformes,
    COUNT(DISTINCT CASE WHEN a.resolvido = false AND a.severidade = 'critico' THEN a.id END) as alertas_criticos
FROM equipamentos_frota e
LEFT JOIN inspecoes_equipamentos i ON e.id = i.equipamento_id
LEFT JOIN alertas_inspecoes a ON e.id = a.equipamento_id
GROUP BY e.id, e.tipo, e.placa, e.chassi, e.status, e.proprietario;

-- View: Alertas Ativos
CREATE OR REPLACE VIEW view_alertas_ativos AS
SELECT 
    a.id,
    a.tipo_alerta,
    a.severidade,
    a.mensagem,
    a.created_at,
    e.id as equipamento_id,
    e.tipo as equipamento_tipo,
    e.placa as equipamento_placa,
    i.tipo_inspecao,
    i.proxima_inspecao
FROM alertas_inspecoes a
INNER JOIN equipamentos_frota e ON a.equipamento_id = e.id
LEFT JOIN inspecoes_equipamentos i ON a.inspecao_id = i.id
WHERE a.resolvido = false
ORDER BY 
    CASE a.severidade
        WHEN 'critico' THEN 1
        WHEN 'aviso' THEN 2
        ELSE 3
    END,
    a.created_at DESC;

-- ============================================
-- DADOS DE EXEMPLO
-- ============================================

-- Inserir equipamentos de exemplo
INSERT INTO equipamentos_frota (tipo, placa, chassi, ano_fabricacao, fabricante, modelo, capacidade_carga, eixos, proprietario, status, localizado_em)
VALUES 
    ('semi-reboque', 'ABC1234', '9BW123456789012345', 2020, 'Randon', 'R-460', 30.0, 3, 'proprio', 'ativo', 'garagem'),
    ('carreta', 'DEF5678', '9BW987654321098765', 2019, 'Librelato', 'LS-320', 27.0, 2, 'proprio', 'ativo', 'viagem'),
    ('dolly', 'GHI9012', '9BW555444333222111', 2021, 'Randon', 'RD-220', 8.0, 1, 'agregado', 'ativo', 'garagem')
ON CONFLICT (placa) DO NOTHING;

-- Inserir inspeções de exemplo
INSERT INTO inspecoes_equipamentos (
    equipamento_id, 
    tipo_inspecao, 
    data_inspecao, 
    proxima_inspecao, 
    realizada_por_nome, 
    status,
    itens_verificados,
    nao_conformidades,
    nao_conformidades_criticas
)
SELECT 
    e.id,
    'preventiva',
    CURRENT_DATE - INTERVAL '20 days',
    CURRENT_DATE + INTERVAL '160 days',
    'João Silva',
    'conforme',
    '{"pneus":{"status":"ok","observacao":"Pneus em bom estado"},"freios":{"status":"ok","observacao":"Sistema de freios OK"},"suspensao":{"status":"ok","observacao":"Sem problemas"},"sistema_eletrico":{"status":"ok","observacao":"Funcionando perfeitamente"},"estrutura_chassi":{"status":"ok","observacao":"Sem danos"}}'::jsonb,
    0,
    0
FROM equipamentos_frota e
WHERE e.placa = 'ABC1234'
ON CONFLICT DO NOTHING;

-- Inserir inspeção com não conformidade
INSERT INTO inspecoes_equipamentos (
    equipamento_id, 
    tipo_inspecao, 
    data_inspecao, 
    proxima_inspecao, 
    realizada_por_nome, 
    status,
    itens_verificados,
    nao_conformidades,
    nao_conformidades_criticas,
    observacoes
)
SELECT 
    e.id,
    'periodica',
    CURRENT_DATE - INTERVAL '5 days',
    CURRENT_DATE - INTERVAL '5 days' + INTERVAL '180 days',
    'Maria Santos',
    'nao_conforme',
    '{"pneus":{"status":"atencao","observacao":"Pneus desgastados, trocar em breve"},"freios":{"status":"nao_conforme","observacao":"Pastilhas em 20%, trocar urgente"},"suspensao":{"status":"ok","observacao":"OK"},"sistema_eletrico":{"status":"ok","observacao":"OK"},"estrutura_chassi":{"status":"ok","observacao":"OK"}}'::jsonb,
    2,
    1,
    'Necessário trocar freios urgentemente'
FROM equipamentos_frota e
WHERE e.placa = 'DEF5678'
ON CONFLICT DO NOTHING;

COMMENT ON TABLE equipamentos_frota IS 'Cadastro de equipamentos da frota: semi-reboques, carretas, dollys, implementos';
COMMENT ON TABLE inspecoes_equipamentos IS 'Registro de inspeções realizadas nos equipamentos com itens verificados em JSONB';
COMMENT ON TABLE alertas_inspecoes IS 'Sistema de alertas inteligentes para vencimentos e não conformidades';
