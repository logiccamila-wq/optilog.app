-- Clientes
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    company_type VARCHAR(2) CHECK (company_type IN ('PF', 'PJ')) DEFAULT 'PJ',
    document VARCHAR(18) UNIQUE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    city VARCHAR(100),
    state VARCHAR(2),
    credit_limit DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    customer_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fornecedores
CREATE TABLE IF NOT EXISTS suppliers (
    id SERIAL PRIMARY KEY,
    document VARCHAR(18) UNIQUE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    supplier_type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dados de exemplo
INSERT INTO customers (document, company_name, trade_name, email, phone, city, state, credit_limit, customer_type) VALUES
('12.345.678/0001-90', 'Indústria ABC Ltda', 'ABC Industrial', 'contato@abcindustrial.com.br', '(11) 3456-7890', 'São Paulo', 'SP', 50000.00, 'regular'),
('98.765.432/0001-10', 'Comércio XYZ SA', 'XYZ Comércio', 'vendas@xyzcomercio.com.br', '(21) 2345-6789', 'Rio de Janeiro', 'RJ', 30000.00, 'vip')
ON CONFLICT (document) DO NOTHING;

INSERT INTO suppliers (document, company_name, email, phone, supplier_type) VALUES
('55.666.777/0001-88', 'Posto Combustível Super Ltda', 'financeiro@postosup er.com.br', '(11) 4567-8901', 'combustivel'),
('44.333.222/0001-55', 'Peças e Acessórios TruckParts', 'vendas@truckparts.com.br', '(19) 3456-7890', 'pecas')
ON CONFLICT (document) DO NOTHING;