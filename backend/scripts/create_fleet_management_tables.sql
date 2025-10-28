-- ============================================
-- GESTÃO DE FROTA COMPLETA
-- ============================================

-- Função de timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Abastecimentos
CREATE TABLE IF NOT EXISTS fuel_supplies (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
    driver_id INTEGER REFERENCES drivers(id),
    
    -- Dados do abastecimento
    supply_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    odometer DECIMAL(10,2) NOT NULL,
    liters DECIMAL(8,2) NOT NULL,
    unit_price DECIMAL(8,3) NOT NULL,
    total_value DECIMAL(10,2) NOT NULL,
    
    -- Combustível
    fuel_type VARCHAR(20) NOT NULL, -- 'diesel', 'gasoline', 'ethanol', 'gnv'
    fuel_quality VARCHAR(20), -- 'S10', 'S500', 'comum', 'aditivado'
    
    -- Posto
    station_name VARCHAR(255),
    station_cnpj VARCHAR(18),
    station_city VARCHAR(100),
    station_state VARCHAR(2),
    
    -- Performance
    km_driven DECIMAL(10,2), -- desde último abastecimento
    average_consumption DECIMAL(5,2), -- km/litro calculado
    
    -- Pagamento
    payment_method VARCHAR(20), -- 'cash', 'card', 'voucher', 'credit'
    payment_voucher VARCHAR(100),
    nfe_key VARCHAR(44),
    
    -- Metadata
    notes TEXT,
    receipt_photo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER
);

-- Manutenções (expandido)
CREATE TABLE IF NOT EXISTS vehicle_maintenances (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
    service_order_id INTEGER REFERENCES service_orders(id),
    
    -- Tipo e Agendamento
    maintenance_type VARCHAR(20) NOT NULL CHECK (maintenance_type IN ('preventive', 'corrective', 'predictive')),
    scheduled_date DATE,
    execution_date TIMESTAMP,
    
    -- Odômetro
    odometer_start DECIMAL(10,2),
    odometer_end DECIMAL(10,2),
    
    -- Mecânico/Oficina
    mechanic_id INTEGER REFERENCES drivers(id), -- pode ser mecânico
    workshop_name VARCHAR(255),
    workshop_cnpj VARCHAR(18),
    
    -- Descrição
    description TEXT NOT NULL,
    symptoms TEXT,
    diagnosis TEXT,
    solution TEXT,
    
    -- Custos
    labor_cost DECIMAL(10,2) DEFAULT 0,
    parts_cost DECIMAL(10,2) DEFAULT 0,
    external_cost DECIMAL(10,2) DEFAULT 0, -- oficina externa
    total_cost DECIMAL(10,2) DEFAULT 0,
    
    -- Status
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    
    -- Garantia
    warranty_expiry_date DATE,
    warranty_km DECIMAL(10,2),
    
    -- Metadata
    notes TEXT,
    photos_urls TEXT[],
    nfe_key VARCHAR(44),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER
);

-- Peças utilizadas nas manutenções
CREATE TABLE IF NOT EXISTS maintenance_parts (
    id SERIAL PRIMARY KEY,
    maintenance_id INTEGER NOT NULL REFERENCES vehicle_maintenances(id) ON DELETE CASCADE,
    part_code VARCHAR(100),
    part_name VARCHAR(255) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    supplier_name VARCHAR(255),
    warranty_months INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alertas e vencimentos de documentos
CREATE TABLE IF NOT EXISTS vehicle_alerts (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
    
    alert_type VARCHAR(50) NOT NULL, -- 'ipva', 'insurance', 'license', 'antt', 'maintenance', 'inspection'
    alert_description TEXT NOT NULL,
    due_date DATE NOT NULL,
    alert_date DATE NOT NULL, -- quando começar a alertar
    
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'alerted', 'resolved', 'expired')),
    resolved_date DATE,
    resolved_by INTEGER,
    
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Custos operacionais do veículo
CREATE TABLE IF NOT EXISTS vehicle_costs (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
    
    cost_date DATE NOT NULL DEFAULT CURRENT_DATE,
    cost_type VARCHAR(50) NOT NULL, -- 'fuel', 'maintenance', 'toll', 'parking', 'fine', 'insurance', 'depreciation', 'other'
    cost_category VARCHAR(100), -- categoria detalhada
    
    description TEXT,
    value DECIMAL(10,2) NOT NULL,
    
    -- Relacionamento com outras tabelas
    fuel_supply_id INTEGER REFERENCES fuel_supplies(id),
    maintenance_id INTEGER REFERENCES vehicle_maintenances(id),
    
    -- Documento fiscal
    document_number VARCHAR(50),
    nfe_key VARCHAR(44),
    
    payment_method VARCHAR(20),
    payment_date DATE,
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_fuel_supplies_vehicle ON fuel_supplies(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_fuel_supplies_date ON fuel_supplies(supply_date DESC);
CREATE INDEX IF NOT EXISTS idx_maintenances_vehicle ON vehicle_maintenances(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_maintenances_status ON vehicle_maintenances(status);
CREATE INDEX IF NOT EXISTS idx_maintenances_date ON vehicle_maintenances(execution_date DESC);
CREATE INDEX IF NOT EXISTS idx_vehicle_alerts_vehicle ON vehicle_alerts(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_alerts_due_date ON vehicle_alerts(due_date);
CREATE INDEX IF NOT EXISTS idx_vehicle_alerts_status ON vehicle_alerts(status);
CREATE INDEX IF NOT EXISTS idx_vehicle_costs_vehicle ON vehicle_costs(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_costs_date ON vehicle_costs(cost_date DESC);

-- Triggers
DROP TRIGGER IF EXISTS trigger_maintenances_updated ON vehicle_maintenances;
CREATE TRIGGER trigger_maintenances_updated
    BEFORE UPDATE ON vehicle_maintenances
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- Função para calcular consumo médio
CREATE OR REPLACE FUNCTION calculate_fuel_consumption()
RETURNS TRIGGER AS $$
DECLARE
    last_supply RECORD;
BEGIN
    -- Busca último abastecimento do mesmo veículo
    SELECT * INTO last_supply
    FROM fuel_supplies
    WHERE vehicle_id = NEW.vehicle_id
      AND id < NEW.id
    ORDER BY supply_date DESC
    LIMIT 1;
    
    IF FOUND THEN
        NEW.km_driven := NEW.odometer - last_supply.odometer;
        IF NEW.liters > 0 AND NEW.km_driven > 0 THEN
            NEW.average_consumption := NEW.km_driven / NEW.liters;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_calculate_fuel_consumption ON fuel_supplies;
CREATE TRIGGER trigger_calculate_fuel_consumption
    BEFORE INSERT ON fuel_supplies
    FOR EACH ROW
    EXECUTE FUNCTION calculate_fuel_consumption();

-- Views para relatórios
CREATE OR REPLACE VIEW vehicle_performance_summary AS
SELECT 
    v.id,
    v.plate,
    COUNT(DISTINCT fs.id) as fuel_supplies_count,
    SUM(fs.total_value) as total_fuel_cost,
    AVG(fs.average_consumption) as avg_fuel_consumption,
    COUNT(DISTINCT vm.id) as maintenances_count,
    SUM(vm.total_cost) as total_maintenance_cost,
    (COALESCE(SUM(fs.total_value), 0) + COALESCE(SUM(vm.total_cost), 0)) as total_operational_cost
FROM vehicles v
LEFT JOIN fuel_supplies fs ON v.id = fs.vehicle_id
LEFT JOIN vehicle_maintenances vm ON v.id = vm.vehicle_id
GROUP BY v.id, v.plate;

-- Dados de exemplo
INSERT INTO fuel_supplies (vehicle_id, supply_date, odometer, liters, unit_price, total_value, fuel_type, station_name) 
SELECT 
    1, 
    CURRENT_TIMESTAMP - INTERVAL '3 days', 
    45000, 
    120.5, 
    5.89, 
    709.75, 
    'diesel', 
    'Posto Shell Centro'
WHERE EXISTS (SELECT 1 FROM vehicles WHERE id = 1)
ON CONFLICT DO NOTHING;

INSERT INTO vehicle_alerts (vehicle_id, alert_type, alert_description, due_date, alert_date, priority)
SELECT 
    1,
    'ipva',
    'Vencimento do IPVA 2025',
    '2025-03-31',
    '2025-03-01',
    'high'
WHERE EXISTS (SELECT 1 FROM vehicles WHERE id = 1)
ON CONFLICT DO NOTHING;