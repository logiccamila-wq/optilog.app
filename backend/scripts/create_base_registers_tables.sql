-- ============================================
-- TABELAS DE CADASTROS BASE DO TMS
-- ============================================

-- Clientes
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    company_type VARCHAR(2) CHECK (company_type IN ('PF', 'PJ')) DEFAULT 'PJ',
    document VARCHAR(18) UNIQUE NOT NULL, -- CPF ou CNPJ
    state_registration VARCHAR(20),
    municipal_registration VARCHAR(20),
    company_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),
    contact_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    mobile VARCHAR(20),
    
    -- Endereço
    zip_code VARCHAR(10),
    street VARCHAR(255),
    number VARCHAR(20),
    complement VARCHAR(100),
    neighborhood VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(2),
    country VARCHAR(3) DEFAULT 'BRA',
    
    -- Comercial
    credit_limit DECIMAL(15,2) DEFAULT 0,
    payment_term INTEGER DEFAULT 30, -- dias
    discount_rate DECIMAL(5,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
    customer_type VARCHAR(50), -- 'eventual', 'regular', 'vip'
    price_table_id INTEGER,
    
    -- Metadata
    notes TEXT,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    last_purchase_date DATE
);

-- Fornecedores
CREATE TABLE IF NOT EXISTS suppliers (
    id SERIAL PRIMARY KEY,
    company_type VARCHAR(2) CHECK (company_type IN ('PF', 'PJ')) DEFAULT 'PJ',
    document VARCHAR(18) UNIQUE NOT NULL,
    state_registration VARCHAR(20),
    company_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),
    contact_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    
    -- Endereço
    zip_code VARCHAR(10),
    street VARCHAR(255),
    number VARCHAR(20),
    complement VARCHAR(100),
    neighborhood VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(2),
    
    -- Comercial
    payment_term INTEGER DEFAULT 30,
    supplier_type VARCHAR(50), -- 'combustivel', 'pecas', 'manutencao', 'pneus'
    bank_name VARCHAR(100),
    bank_agency VARCHAR(10),
    bank_account VARCHAR(20),
    pix_key VARCHAR(100),
    
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Motoristas (expandido)
CREATE TABLE IF NOT EXISTS drivers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    rg VARCHAR(20),
    birth_date DATE,
    
    -- CNH
    cnh_number VARCHAR(20) UNIQUE NOT NULL,
    cnh_category VARCHAR(5) NOT NULL,
    cnh_expiry_date DATE NOT NULL,
    cnh_first_issue_date DATE,
    cnh_issue_state VARCHAR(2),
    
    -- Contato
    email VARCHAR(255),
    phone VARCHAR(20),
    mobile VARCHAR(20) NOT NULL,
    emergency_contact VARCHAR(255),
    emergency_phone VARCHAR(20),
    
    -- Endereço
    zip_code VARCHAR(10),
    street VARCHAR(255),
    number VARCHAR(20),
    complement VARCHAR(100),
    neighborhood VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(2),
    
    -- Profissional
    hiring_date DATE,
    termination_date DATE,
    employment_type VARCHAR(20) DEFAULT 'employee' CHECK (employment_type IN ('employee', 'autonomous', 'aggregated')),
    salary DECIMAL(10,2),
    commission_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Certificações
    mopp_expiry_date DATE, -- Movimentação de Produtos Perigosos
    has_eet BOOLEAN DEFAULT FALSE, -- Entrevista Estruturada de Trânsito
    risk_management_course DATE,
    
    -- Sistema
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'vacation', 'suspended', 'terminated')),
    photo_url TEXT,
    user_id INTEGER, -- Link com tabela users para login
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Veículos (expandido)
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    plate VARCHAR(10) UNIQUE NOT NULL,
    renavam VARCHAR(20) UNIQUE,
    chassis VARCHAR(30) UNIQUE,
    
    -- Identificação
    type VARCHAR(50) NOT NULL, -- 'truck', 'van', 'car', 'trailer', 'semi_trailer'
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year_manufacture INTEGER NOT NULL,
    year_model INTEGER NOT NULL,
    color VARCHAR(50),
    
    -- Capacidade
    capacity_kg DECIMAL(10,2),
    capacity_m3 DECIMAL(10,2),
    fuel_type VARCHAR(20), -- 'diesel', 'gasoline', 'ethanol', 'gnv', 'electric'
    fuel_tank_capacity DECIMAL(8,2),
    
    -- Eixos e Pneus
    axles_count INTEGER DEFAULT 2,
    wheels_count INTEGER DEFAULT 4,
    tire_size VARCHAR(20),
    
    -- Propriedade
    ownership VARCHAR(20) DEFAULT 'own' CHECK (ownership IN ('own', 'leased', 'rented', 'aggregated')),
    acquisition_date DATE,
    acquisition_value DECIMAL(15,2),
    leasing_monthly_value DECIMAL(10,2),
    
    -- Documentação
    ipva_expiry_date DATE,
    insurance_expiry_date DATE,
    insurance_company VARCHAR(255),
    insurance_policy VARCHAR(100),
    license_expiry_date DATE,
    antt_rntrc VARCHAR(20),
    antt_expiry_date DATE,
    
    -- Rastreamento
    tracker_id VARCHAR(100),
    tracker_type VARCHAR(50),
    tracker_provider VARCHAR(100),
    
    -- Operacional
    odometer DECIMAL(10,2) DEFAULT 0,
    engine_hours DECIMAL(10,2) DEFAULT 0,
    average_fuel_consumption DECIMAL(5,2), -- km/l
    maintenance_km_interval INTEGER DEFAULT 10000,
    next_maintenance_km DECIMAL(10,2),
    
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive', 'sold')),
    current_driver_id INTEGER REFERENCES drivers(id),
    notes TEXT,
    photo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de relacionamento Motorista-Veículo (histórico)
CREATE TABLE IF NOT EXISTS driver_vehicle_assignments (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER NOT NULL REFERENCES drivers(id),
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    is_primary BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_customers_document ON customers(document);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_suppliers_document ON suppliers(document);
CREATE INDEX IF NOT EXISTS idx_drivers_cpf ON drivers(cpf);
CREATE INDEX IF NOT EXISTS idx_drivers_cnh ON drivers(cnh_number);
CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_plate ON vehicles(plate);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicle_assignments_driver ON driver_vehicle_assignments(driver_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_assignments_vehicle ON driver_vehicle_assignments(vehicle_id);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_customers_updated ON customers;
CREATE TRIGGER trigger_customers_updated BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trigger_suppliers_updated ON suppliers;
CREATE TRIGGER trigger_suppliers_updated BEFORE UPDATE ON suppliers
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trigger_drivers_updated ON drivers;
CREATE TRIGGER trigger_drivers_updated BEFORE UPDATE ON drivers
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trigger_vehicles_updated ON vehicles;
CREATE TRIGGER trigger_vehicles_updated BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Dados de exemplo
INSERT INTO customers (document, company_name, trade_name, email, phone, city, state, credit_limit, customer_type) VALUES
('12.345.678/0001-90', 'Indústria ABC Ltda', 'ABC Industrial', 'contato@abcindustrial.com.br', '(11) 3456-7890', 'São Paulo', 'SP', 50000.00, 'regular'),
('98.765.432/0001-10', 'Comércio XYZ SA', 'XYZ Comércio', 'vendas@xyzcomercio.com.br', '(21) 2345-6789', 'Rio de Janeiro', 'RJ', 30000.00, 'vip'),
('111.222.333/0001-44', 'Distribuidora 123 Eireli', 'Dist 123', 'compras@dist123.com.br', '(85) 3123-4567', 'Fortaleza', 'CE', 15000.00, 'regular')
ON CONFLICT (document) DO NOTHING;

INSERT INTO suppliers (document, company_name, email, phone, supplier_type) VALUES
('55.666.777/0001-88', 'Posto Combustível Super Ltda', 'financeiro@postosup er.com.br', '(11) 4567-8901', 'combustivel'),
('44.333.222/0001-55', 'Peças e Acessórios TruckParts', 'vendas@truckparts.com.br', '(19) 3456-7890', 'pecas'),
('77.888.999/0001-33', 'Borracharia Central de Pneus', 'atendimento@centralpneus.com.br', '(11) 2345-6789', 'pneus')
ON CONFLICT (document) DO NOTHING;

-- Adiciona colunas faltantes em drivers se não existirem
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='drivers' AND column_name='employment_type') THEN
        ALTER TABLE drivers ADD COLUMN employment_type VARCHAR(20) DEFAULT 'employee';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='drivers' AND column_name='commission_rate') THEN
        ALTER TABLE drivers ADD COLUMN commission_rate DECIMAL(5,2) DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='drivers' AND column_name='mopp_expiry_date') THEN
        ALTER TABLE drivers ADD COLUMN mopp_expiry_date DATE;
    END IF;
END $$;

-- Adiciona colunas faltantes em vehicles se não existirem
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vehicles' AND column_name='fuel_type') THEN
        ALTER TABLE vehicles ADD COLUMN fuel_type VARCHAR(20) DEFAULT 'diesel';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vehicles' AND column_name='ownership') THEN
        ALTER TABLE vehicles ADD COLUMN ownership VARCHAR(20) DEFAULT 'own';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vehicles' AND column_name='axles_count') THEN
        ALTER TABLE vehicles ADD COLUMN axles_count INTEGER DEFAULT 2;
    END IF;
END $$;