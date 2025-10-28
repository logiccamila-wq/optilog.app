-- Inventário de Ferramentas
CREATE TABLE IF NOT EXISTS tools (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(100),
  status VARCHAR(20) CHECK (status IN ('disponivel','emprestada','manutencao','perdida')) DEFAULT 'disponivel',
  condition VARCHAR(20) CHECK (condition IN ('nova','boa','reparo','sucata')) DEFAULT 'boa',
  location VARCHAR(100),
  assigned_to VARCHAR(150), -- email ou nome
  last_os_id INTEGER, -- referencia a service_orders.id quando aplicável
  purchase_date DATE,
  purchase_price DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tool_movements (
  id SERIAL PRIMARY KEY,
  tool_id INTEGER REFERENCES tools(id) ON DELETE CASCADE,
  movement_type VARCHAR(20) CHECK (movement_type IN ('emprestimo','devolucao','manutencao','perda','transferencia')) NOT NULL,
  from_location VARCHAR(100),
  to_location VARCHAR(100),
  related_os_id INTEGER, -- opcional: vincula com OS
  performed_by VARCHAR(150),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_tools_code ON tools(code);
CREATE INDEX IF NOT EXISTS idx_tools_status ON tools(status);
CREATE INDEX IF NOT EXISTS idx_tools_location ON tools(location);
CREATE INDEX IF NOT EXISTS idx_tool_movements_tool ON tool_movements(tool_id);
