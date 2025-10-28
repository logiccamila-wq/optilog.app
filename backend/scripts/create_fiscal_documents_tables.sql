-- Documentos fiscais (CTe, NF-e, MDFe)
CREATE TABLE IF NOT EXISTS fiscal_documents (
    id SERIAL PRIMARY KEY,
    document_type VARCHAR(10) NOT NULL CHECK (document_type IN ('CTe', 'NFe', 'MDFe', 'CIOTe')),
    document_number VARCHAR(50) NOT NULL,
    series VARCHAR(10) NOT NULL,
    emission_date DATE NOT NULL,
    issuer_cnpj VARCHAR(18) NOT NULL,
    issuer_name VARCHAR(255) NOT NULL,
    recipient_cnpj VARCHAR(18),
    recipient_name VARCHAR(255),
    total_value DECIMAL(15,2) NOT NULL DEFAULT 0,
    tax_value DECIMAL(15,2) DEFAULT 0,
    freight_value DECIMAL(15,2) DEFAULT 0,
    currency_code VARCHAR(3) DEFAULT 'BRL',
    status VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'processando', 'validado', 'rejeitado', 'cancelado')),
    sefaz_status VARCHAR(50),
    sefaz_response TEXT,
    access_key VARCHAR(44) UNIQUE,
    xml_content TEXT,
    pdf_content TEXT,
    file_path TEXT,
    file_size INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    validation_errors JSON,
    tags TEXT[],
    notes TEXT,
    created_by INTEGER,
    CONSTRAINT unique_document UNIQUE (document_type, document_number, series, issuer_cnpj)
);

-- Itens dos documentos fiscais
CREATE TABLE IF NOT EXISTS fiscal_document_items (
    id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES fiscal_documents(id) ON DELETE CASCADE,
    item_sequence INTEGER NOT NULL,
    product_code VARCHAR(100),
    product_name VARCHAR(500) NOT NULL,
    ncm_code VARCHAR(10),
    cfop VARCHAR(10),
    unit VARCHAR(10),
    quantity DECIMAL(15,4) NOT NULL DEFAULT 1,
    unit_value DECIMAL(15,4) NOT NULL,
    total_value DECIMAL(15,2) NOT NULL,
    icms_base DECIMAL(15,2),
    icms_rate DECIMAL(5,2),
    icms_value DECIMAL(15,2),
    ipi_rate DECIMAL(5,2),
    ipi_value DECIMAL(15,2),
    pis_rate DECIMAL(5,2),
    pis_value DECIMAL(15,2),
    cofins_rate DECIMAL(5,2),
    cofins_value DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Anexos dos documentos fiscais
CREATE TABLE IF NOT EXISTS fiscal_document_attachments (
    id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES fiscal_documents(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_type VARCHAR(50) NOT NULL CHECK (file_type IN ('xml', 'pdf', 'image', 'other')),
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by INTEGER
);

-- Histórico de validação SEFAZ
CREATE TABLE IF NOT EXISTS sefaz_validation_history (
    id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES fiscal_documents(id) ON DELETE CASCADE,
    validation_type VARCHAR(50) NOT NULL, -- 'syntax', 'schema', 'business', 'sefaz_query'
    status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'warning', 'error')),
    message TEXT NOT NULL,
    details JSON,
    validated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    validation_code VARCHAR(10)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_fiscal_documents_type ON fiscal_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_fiscal_documents_status ON fiscal_documents(status);
CREATE INDEX IF NOT EXISTS idx_fiscal_documents_emission_date ON fiscal_documents(emission_date DESC);
CREATE INDEX IF NOT EXISTS idx_fiscal_documents_issuer ON fiscal_documents(issuer_cnpj);
CREATE INDEX IF NOT EXISTS idx_fiscal_documents_access_key ON fiscal_documents(access_key);
CREATE INDEX IF NOT EXISTS idx_fiscal_document_items_document ON fiscal_document_items(document_id);
CREATE INDEX IF NOT EXISTS idx_fiscal_attachments_document ON fiscal_document_attachments(document_id);
CREATE INDEX IF NOT EXISTS idx_sefaz_history_document ON sefaz_validation_history(document_id);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_fiscal_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at
DROP TRIGGER IF EXISTS trigger_update_fiscal_documents_updated_at ON fiscal_documents;
CREATE TRIGGER trigger_update_fiscal_documents_updated_at
    BEFORE UPDATE ON fiscal_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_fiscal_documents_updated_at();

-- View para relatórios consolidados
CREATE OR REPLACE VIEW fiscal_documents_summary AS
SELECT 
    fd.id,
    fd.document_type,
    fd.document_number,
    fd.series,
    fd.emission_date,
    fd.issuer_name,
    fd.recipient_name,
    fd.total_value,
    fd.status,
    fd.access_key,
    COUNT(DISTINCT fdi.id) as items_count,
    COUNT(DISTINCT fda.id) as attachments_count,
    COUNT(DISTINCT CASE WHEN svh.status = 'error' THEN svh.id END) as validation_errors_count
FROM fiscal_documents fd
LEFT JOIN fiscal_document_items fdi ON fd.id = fdi.document_id
LEFT JOIN fiscal_document_attachments fda ON fd.id = fda.document_id
LEFT JOIN sefaz_validation_history svh ON fd.id = svh.document_id
GROUP BY fd.id, fd.document_type, fd.document_number, fd.series, 
         fd.emission_date, fd.issuer_name, fd.recipient_name, 
         fd.total_value, fd.status, fd.access_key;

-- Dados de exemplo
INSERT INTO fiscal_documents (document_type, document_number, series, emission_date, issuer_cnpj, issuer_name, recipient_cnpj, recipient_name, total_value, access_key, status) VALUES
('CTe', '000001234', '1', '2024-10-28', '12.345.678/0001-90', 'Transportadora Modelo Ltda', '98.765.432/0001-10', 'Cliente Exemplo SA', 850.50, '12345678901234567890123456789012345678901234', 'validado'),
('NFe', '000005678', '2', '2024-10-27', '98.765.432/0001-10', 'Cliente Exemplo SA', '12.345.678/0001-90', 'Transportadora Modelo Ltda', 1250.75, '09876543210987654321098765432109876543210987', 'pendente'),
('MDFe', '000000123', '1', '2024-10-26', '12.345.678/0001-90', 'Transportadora Modelo Ltda', NULL, NULL, 2100.00, '11223344556677889900112233445566778899001122', 'processando')
ON CONFLICT (document_type, document_number, series, issuer_cnpj) DO NOTHING;

-- Itens de exemplo para a primeira CTe
INSERT INTO fiscal_document_items (document_id, item_sequence, product_name, quantity, unit_value, total_value) VALUES
(1, 1, 'Frete rodoviário de mercadorias em geral', 1, 850.50, 850.50)
ON CONFLICT DO NOTHING;