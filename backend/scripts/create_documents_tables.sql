-- ============================================
-- TABELAS PARA GESTÃO DE DOCUMENTOS (CRLV, CNH, CT-e)
-- ============================================

-- Tabela de Veículos (baseada em CRLV)
CREATE TABLE IF NOT EXISTS veiculos (
  id SERIAL PRIMARY KEY,
  renavam VARCHAR(11) UNIQUE,
  placa VARCHAR(7) UNIQUE NOT NULL,
  chassis VARCHAR(17),
  tipo VARCHAR(50), -- 'caminhão', 'van', 'carreta', etc
  modelo VARCHAR(100),
  marca VARCHAR(50),
  ano_fabricacao INTEGER,
  ano_modelo INTEGER,
  categoria VARCHAR(50), -- 'carga', 'passageiros', etc
  eixos INTEGER,
  rodagem VARCHAR(20), -- 'truck', 'toco', 'carreta'
  capacidade_carga DECIMAL(10,2), -- em kg
  proprietario_cpf_cnpj VARCHAR(14),
  proprietario_nome VARCHAR(255),
  crlv_pdf_path TEXT,
  qrcode_data TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_test_data BOOLEAN DEFAULT false
);

-- Tabela de Motoristas (baseada em CNH)
CREATE TABLE IF NOT EXISTS motoristas (
  id SERIAL PRIMARY KEY,
  renach VARCHAR(11) UNIQUE,
  cpf VARCHAR(11) UNIQUE NOT NULL,
  nome VARCHAR(100) NOT NULL,
  data_nascimento DATE,
  categoria_cnh VARCHAR(10), -- 'A', 'B', 'C', 'D', 'E', 'AB', 'AC', etc
  validade_cnh DATE,
  primeira_habilitacao DATE,
  numero_registro VARCHAR(20),
  restricoes TEXT,
  foto_path TEXT,
  cnh_pdf_path TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_test_data BOOLEAN DEFAULT false
);

-- Tabela de CT-e (Conhecimento de Transporte Eletrônico)
CREATE TABLE IF NOT EXISTS cte (
  id SERIAL PRIMARY KEY,
  numero VARCHAR(20) NOT NULL,
  chave_acesso VARCHAR(44) UNIQUE NOT NULL,
  serie VARCHAR(10),
  data_emissao TIMESTAMP NOT NULL,
  tipo_operacao VARCHAR(20), -- 'entrada', 'saida'
  
  -- Remetente
  remetente_cnpj VARCHAR(14),
  remetente_nome VARCHAR(255),
  remetente_endereco TEXT,
  
  -- Destinatário
  destinatario_cnpj VARCHAR(14),
  destinatario_nome VARCHAR(255),
  destinatario_endereco TEXT,
  
  -- Valores
  valor_total DECIMAL(10,2),
  valor_frete DECIMAL(10,2),
  peso_total DECIMAL(10,2), -- em kg
  quantidade_volumes INTEGER,
  
  -- Impostos
  icms DECIMAL(10,2),
  pis DECIMAL(10,2),
  cofins DECIMAL(10,2),
  
  -- Natureza da carga
  natureza_carga VARCHAR(100),
  produto_predominante VARCHAR(255),
  
  -- Informações adicionais
  informacoes_complementares TEXT,
  pdf_path TEXT,
  xml_path TEXT,
  qrcode_data TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_test_data BOOLEAN DEFAULT false
);

-- Tabela de Documentos ANTT (Agência Nacional de Transportes Terrestres)
CREATE TABLE IF NOT EXISTS antt_documents (
  id SERIAL PRIMARY KEY,
  vehicle_id INTEGER REFERENCES veiculos(id),
  
  rntrc VARCHAR(20) UNIQUE, -- Registro Nacional de Transportadores Rodoviários de Carga
  validity_date DATE,
  document_type VARCHAR(50), -- 'TAC', 'ETC', 'CIPP', etc
  document_number VARCHAR(50),
  status VARCHAR(20), -- 'active', 'expired', 'suspended'
  
  pdf_path TEXT,
  qrcode_data TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_test_data BOOLEAN DEFAULT false
);

-- Tabela de Log de Importações
CREATE TABLE IF NOT EXISTS import_logs (
  id SERIAL PRIMARY KEY,
  import_type VARCHAR(50) NOT NULL, -- 'crlv', 'cnh', 'cte', 'antt'
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT,
  status VARCHAR(20) NOT NULL, -- 'success', 'error', 'partial'
  records_imported INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  error_messages TEXT,
  execution_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(100)
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_veiculos_placa ON veiculos(placa);
CREATE INDEX IF NOT EXISTS idx_veiculos_renavam ON veiculos(renavam);
CREATE INDEX IF NOT EXISTS idx_veiculos_chassis ON veiculos(chassis);
CREATE INDEX IF NOT EXISTS idx_veiculos_proprietario ON veiculos(proprietario_cpf_cnpj);
CREATE INDEX IF NOT EXISTS idx_veiculos_test_data ON veiculos(is_test_data);

CREATE INDEX IF NOT EXISTS idx_motoristas_cpf ON motoristas(cpf);
CREATE INDEX IF NOT EXISTS idx_motoristas_renach ON motoristas(renach);
CREATE INDEX IF NOT EXISTS idx_motoristas_nome ON motoristas(nome);
CREATE INDEX IF NOT EXISTS idx_motoristas_validade ON motoristas(validade_cnh);
CREATE INDEX IF NOT EXISTS idx_motoristas_test_data ON motoristas(is_test_data);

CREATE INDEX IF NOT EXISTS idx_cte_chave ON cte(chave_acesso);
CREATE INDEX IF NOT EXISTS idx_cte_numero ON cte(numero);
CREATE INDEX IF NOT EXISTS idx_cte_data ON cte(data_emissao);
CREATE INDEX IF NOT EXISTS idx_cte_remetente ON cte(remetente_cnpj);
CREATE INDEX IF NOT EXISTS idx_cte_destinatario ON cte(destinatario_cnpj);
CREATE INDEX IF NOT EXISTS idx_cte_test_data ON cte(is_test_data);

CREATE INDEX IF NOT EXISTS idx_antt_rntrc ON antt_documents(rntrc);
CREATE INDEX IF NOT EXISTS idx_antt_vehicle ON antt_documents(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_antt_validity ON antt_documents(validity_date);
CREATE INDEX IF NOT EXISTS idx_antt_test_data ON antt_documents(is_test_data);

CREATE INDEX IF NOT EXISTS idx_import_logs_type ON import_logs(import_type);
CREATE INDEX IF NOT EXISTS idx_import_logs_status ON import_logs(status);
CREATE INDEX IF NOT EXISTS idx_import_logs_date ON import_logs(created_at DESC);

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_documents_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualização de timestamp
DROP TRIGGER IF EXISTS trigger_veiculos_updated ON veiculos;
CREATE TRIGGER trigger_veiculos_updated
    BEFORE UPDATE ON veiculos
    FOR EACH ROW
    EXECUTE FUNCTION update_documents_timestamp();

DROP TRIGGER IF EXISTS trigger_motoristas_updated ON motoristas;
CREATE TRIGGER trigger_motoristas_updated
    BEFORE UPDATE ON motoristas
    FOR EACH ROW
    EXECUTE FUNCTION update_documents_timestamp();

DROP TRIGGER IF EXISTS trigger_cte_updated ON cte;
CREATE TRIGGER trigger_cte_updated
    BEFORE UPDATE ON cte
    FOR EACH ROW
    EXECUTE FUNCTION update_documents_timestamp();

DROP TRIGGER IF EXISTS trigger_antt_updated ON antt_documents;
CREATE TRIGGER trigger_antt_updated
    BEFORE UPDATE ON antt_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_documents_timestamp();
