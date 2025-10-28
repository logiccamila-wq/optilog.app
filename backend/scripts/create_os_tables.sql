-- Ordem de Serviço (Manutenção)
CREATE TABLE IF NOT EXISTS service_orders (
  id SERIAL PRIMARY KEY,
  number VARCHAR(20) UNIQUE NOT NULL,
  vehicle_id INTEGER,
  mechanic_id INTEGER,
  supervisor_id INTEGER,
  type VARCHAR(50) CHECK (type IN ('preventiva', 'corretiva', 'preditiva', 'inspeção')),
  priority VARCHAR(20) CHECK (priority IN ('baixa', 'media', 'alta', 'urgente')) DEFAULT 'media',
  status VARCHAR(30) CHECK (status IN ('aberta', 'aprovada', 'em_execucao', 'aguardando_pecas', 'fechada', 'cancelada')) DEFAULT 'aberta',
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  scheduled_date DATE,
  started_at TIMESTAMP,
  finished_at TIMESTAMP,
  approved_at TIMESTAMP,
  approved_by INTEGER,
  total_cost DECIMAL(10,2) DEFAULT 0,
  labor_hours DECIMAL(5,2) DEFAULT 0,
  labor_cost DECIMAL(10,2) DEFAULT 0,
  parts_cost DECIMAL(10,2) DEFAULT 0,
  signature_url TEXT,
  notes TEXT
);

-- Peças utilizadas na OS
CREATE TABLE IF NOT EXISTS os_parts (
  id SERIAL PRIMARY KEY,
  os_id INTEGER REFERENCES service_orders(id) ON DELETE CASCADE,
  part_code VARCHAR(50),
  part_name VARCHAR(200) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  supplier VARCHAR(255),
  notes TEXT
);

-- Anexos da OS (fotos, PDFs, notas fiscais)
CREATE TABLE IF NOT EXISTS os_attachments (
  id SERIAL PRIMARY KEY,
  os_id INTEGER REFERENCES service_orders(id) ON DELETE CASCADE,
  type VARCHAR(20) CHECK (type IN ('foto_antes', 'foto_depois', 'pdf', 'nota_fiscal', 'outro')),
  url TEXT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  file_size INTEGER,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  uploaded_by INTEGER
);

-- Checklist de tarefas da OS
CREATE TABLE IF NOT EXISTS os_checklist (
  id SERIAL PRIMARY KEY,
  os_id INTEGER REFERENCES service_orders(id) ON DELETE CASCADE,
  task_description TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  completed_by INTEGER,
  notes TEXT,
  order_index INTEGER DEFAULT 0
);

-- Histórico de mudanças de status
CREATE TABLE IF NOT EXISTS os_status_history (
  id SERIAL PRIMARY KEY,
  os_id INTEGER REFERENCES service_orders(id) ON DELETE CASCADE,
  from_status VARCHAR(30),
  to_status VARCHAR(30) NOT NULL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  changed_by INTEGER,
  notes TEXT
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_os_vehicle ON service_orders(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_os_mechanic ON service_orders(mechanic_id);
CREATE INDEX IF NOT EXISTS idx_os_status ON service_orders(status);
CREATE INDEX IF NOT EXISTS idx_os_created ON service_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_os_parts_os ON os_parts(os_id);
CREATE INDEX IF NOT EXISTS idx_os_attachments_os ON os_attachments(os_id);

-- Função para gerar número de OS
CREATE OR REPLACE FUNCTION generate_os_number()
RETURNS TEXT AS $$
DECLARE
  next_id INTEGER;
  year_suffix TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(number FROM 4 FOR 6) AS INTEGER)), 0) + 1
  INTO next_id
  FROM service_orders
  WHERE number LIKE 'OS-' || TO_CHAR(CURRENT_DATE, 'YY') || '%';
  
  year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
  RETURN 'OS-' || year_suffix || LPAD(next_id::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar número automaticamente
CREATE OR REPLACE FUNCTION set_os_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.number IS NULL OR NEW.number = '' THEN
    NEW.number := generate_os_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_os_number
BEFORE INSERT ON service_orders
FOR EACH ROW
EXECUTE FUNCTION set_os_number();

-- View para relatórios
CREATE OR REPLACE VIEW os_summary AS
SELECT 
  so.id,
  so.number,
  so.type,
  so.priority,
  so.status,
  so.description,
  so.created_at,
  so.scheduled_date,
  so.total_cost,
  so.labor_hours,
  COUNT(DISTINCT op.id) as parts_count,
  COUNT(DISTINCT oa.id) as attachments_count,
  COUNT(DISTINCT oc.id) as checklist_total,
  COUNT(DISTINCT CASE WHEN oc.completed THEN oc.id END) as checklist_completed
FROM service_orders so
LEFT JOIN os_parts op ON so.id = op.os_id
LEFT JOIN os_attachments oa ON so.id = oa.os_id
LEFT JOIN os_checklist oc ON so.id = oc.os_id
GROUP BY so.id;
