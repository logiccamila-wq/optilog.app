-- ============================================
-- TABELAS DE CTe (Conhecimento de Transporte Eletrônico)
-- ============================================

-- Função para atualizar timestamp (se não existir)
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tabela principal de CTe
CREATE TABLE IF NOT EXISTS cte_documents (
    id SERIAL PRIMARY KEY,
    -- Identificação
    cte_number VARCHAR(20) NOT NULL,
    series VARCHAR(5) NOT NULL DEFAULT '1',
    emission_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    access_key VARCHAR(44) UNIQUE NOT NULL,
    
    -- Tipo e Modelo
    cte_type VARCHAR(2) NOT NULL DEFAULT '0', -- 0=Normal, 1=Complementar, 2=Anulação, 3=Substituto
    cte_model VARCHAR(2) NOT NULL DEFAULT '57', -- 57=CTe
    service_type VARCHAR(1) NOT NULL DEFAULT '0', -- 0=Normal, 1=Subcontratação, 2=Redespacho, 3=Redespacho Intermediário
    
    -- Emissor (Transportadora)
    issuer_cnpj VARCHAR(18) NOT NULL,
    issuer_name VARCHAR(255) NOT NULL,
    issuer_trade_name VARCHAR(255),
    issuer_state_registration VARCHAR(20),
    issuer_address TEXT,
    issuer_city VARCHAR(100),
    issuer_state VARCHAR(2),
    issuer_zip_code VARCHAR(10),
    
    -- Tomador (quem paga o frete)
    payer_type VARCHAR(20) NOT NULL CHECK (payer_type IN ('sender', 'recipient', 'other')),
    payer_document VARCHAR(18),
    payer_name VARCHAR(255),
    payer_address TEXT,
    payer_city VARCHAR(100),
    payer_state VARCHAR(2),
    
    -- Remetente
    sender_document VARCHAR(18) NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    sender_address TEXT,
    sender_city VARCHAR(100),
    sender_state VARCHAR(2),
    sender_zip_code VARCHAR(10),
    
    -- Destinatário
    recipient_document VARCHAR(18) NOT NULL,
    recipient_name VARCHAR(255) NOT NULL,
    recipient_address TEXT,
    recipient_city VARCHAR(100),
    recipient_state VARCHAR(2),
    recipient_zip_code VARCHAR(10),
    
    -- Valores
    freight_value DECIMAL(15,2) NOT NULL,
    tax_base DECIMAL(15,2),
    icms_rate DECIMAL(5,2),
    icms_value DECIMAL(15,2),
    total_value DECIMAL(15,2) NOT NULL,
    
    -- Carga
    cargo_description TEXT,
    cargo_value DECIMAL(15,2),
    cargo_weight_kg DECIMAL(10,2),
    cargo_volume INTEGER,
    
    -- Modal e Veículo
    modal VARCHAR(20) NOT NULL DEFAULT 'road', -- road, air, sea, rail
    vehicle_plate VARCHAR(10),
    vehicle_state VARCHAR(2),
    vehicle_rntrc VARCHAR(20),
    driver_name VARCHAR(255),
    driver_cpf VARCHAR(14),
    
    -- NFe Vinculadas
    nfe_keys TEXT[], -- Array de chaves de NF-e vinculadas
    
    -- Status SEFAZ
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'authorized', 'rejected', 'cancelled', 'denied')),
    sefaz_protocol VARCHAR(20),
    sefaz_authorization_date TIMESTAMP,
    sefaz_status_code VARCHAR(10),
    sefaz_status_message TEXT,
    sefaz_response_xml TEXT,
    
    -- Cancelamento
    cancellation_protocol VARCHAR(20),
    cancellation_date TIMESTAMP,
    cancellation_reason TEXT,
    
    -- Arquivo
    xml_content TEXT,
    xml_signed TEXT,
    pdf_path TEXT,
    danfe_path TEXT,
    
    -- Metadata
    notes TEXT,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    
    CONSTRAINT unique_cte UNIQUE (cte_number, series, issuer_cnpj)
);

-- Itens de carga do CTe
CREATE TABLE IF NOT EXISTS cte_cargo_items (
    id SERIAL PRIMARY KEY,
    cte_id INTEGER NOT NULL REFERENCES cte_documents(id) ON DELETE CASCADE,
    item_sequence INTEGER NOT NULL,
    product_description TEXT NOT NULL,
    ncm_code VARCHAR(10),
    quantity DECIMAL(15,4) DEFAULT 1,
    unit VARCHAR(10) DEFAULT 'UN',
    unit_value DECIMAL(15,4),
    total_value DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Componentes de valor do frete
CREATE TABLE IF NOT EXISTS cte_freight_components (
    id SERIAL PRIMARY KEY,
    cte_id INTEGER NOT NULL REFERENCES cte_documents(id) ON DELETE CASCADE,
    component_name VARCHAR(100) NOT NULL, -- 'freight', 'toll', 'insurance', 'other'
    component_value DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Histórico de eventos do CTe
CREATE TABLE IF NOT EXISTS cte_events (
    id SERIAL PRIMARY KEY,
    cte_id INTEGER NOT NULL REFERENCES cte_documents(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'emission', 'authorization', 'cancellation', 'correction'
    event_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    event_description TEXT,
    sefaz_protocol VARCHAR(20),
    sefaz_response TEXT,
    user_id INTEGER
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_cte_access_key ON cte_documents(access_key);
CREATE INDEX IF NOT EXISTS idx_cte_status ON cte_documents(status);
CREATE INDEX IF NOT EXISTS idx_cte_emission_date ON cte_documents(emission_date DESC);
CREATE INDEX IF NOT EXISTS idx_cte_issuer ON cte_documents(issuer_cnpj);
CREATE INDEX IF NOT EXISTS idx_cte_sender ON cte_documents(sender_document);
CREATE INDEX IF NOT EXISTS idx_cte_recipient ON cte_documents(recipient_document);
CREATE INDEX IF NOT EXISTS idx_cte_vehicle ON cte_documents(vehicle_plate);
CREATE INDEX IF NOT EXISTS idx_cte_cargo_items_cte ON cte_cargo_items(cte_id);
CREATE INDEX IF NOT EXISTS idx_cte_events_cte ON cte_events(cte_id);

-- Trigger para updated_at
DROP TRIGGER IF EXISTS trigger_cte_updated ON cte_documents;
CREATE TRIGGER trigger_cte_updated
    BEFORE UPDATE ON cte_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- View para listagem de CTes
CREATE OR REPLACE VIEW cte_list AS
SELECT 
    c.id,
    c.cte_number,
    c.series,
    c.access_key,
    c.emission_date,
    c.issuer_name,
    c.sender_name,
    c.recipient_name,
    c.total_value,
    c.status,
    c.vehicle_plate,
    c.driver_name,
    COUNT(DISTINCT cci.id) as cargo_items_count,
    COUNT(DISTINCT ce.id) as events_count
FROM cte_documents c
LEFT JOIN cte_cargo_items cci ON c.id = cci.cte_id
LEFT JOIN cte_events ce ON c.id = ce.cte_id
GROUP BY c.id;

-- Dados de exemplo
INSERT INTO cte_documents (
    cte_number, access_key, issuer_cnpj, issuer_name, 
    sender_document, sender_name, sender_city, sender_state,
    recipient_document, recipient_name, recipient_city, recipient_state,
    payer_type, freight_value, total_value, cargo_description, cargo_weight_kg,
    modal, vehicle_plate, driver_name, status
) VALUES (
    '000001', '12345678901234567890123456789012345678901234',
    '12.345.678/0001-90', 'Transportadora Modelo Ltda',
    '11.222.333/0001-44', 'Indústria Remetente SA', 'São Paulo', 'SP',
    '99.888.777/0001-55', 'Comércio Destinatário Ltda', 'Rio de Janeiro', 'RJ',
    'sender', 1500.00, 1500.00, 'Produtos industrializados diversos', 5000.50,
    'road', 'ABC-1234', 'João da Silva', 'authorized'
) ON CONFLICT (cte_number, series, issuer_cnpj) DO NOTHING;

-- Evento de exemplo
INSERT INTO cte_events (cte_id, event_type, event_description) 
SELECT id, 'emission', 'CTe emitido com sucesso' 
FROM cte_documents WHERE cte_number = '000001'
ON CONFLICT DO NOTHING;