-- Tabela de usuários do sistema OptiLog
-- Suporta autenticação JWT e controle de acesso baseado em roles (RBAC)

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'manager', 'driver', 'mechanic', 'operator')),
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  
  -- Campos opcionais
  phone VARCHAR(20),
  cpf VARCHAR(14),
  cnh VARCHAR(20), -- Para motoristas
  avatar_url TEXT,
  
  -- Metadados
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  email_verified BOOLEAN DEFAULT FALSE,
  
  -- Soft delete
  deleted_at TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Inserir usuário admin padrão (senha: Multi12345678)
-- Hash bcrypt da senha Multi12345678: $2b$10$XgHfP3YFGmQfLV9gQ.xbHOqL3o7Y6KZ8xJ8YvGH1nK9gQ1uO7Y6KZ
INSERT INTO users (name, email, password_hash, role, status, email_verified)
VALUES 
  ('Camila Lareste', 'logiccamila@gmail.com', '$2b$10$XgHfP3YFGmQfLV9gQ.xbHOqL3o7Y6KZ8xJ8YvGH1nK9gQ1uO7Y6KZ', 'admin', 'active', TRUE),
  ('Camila E Teste', 'camila.eteste@gmail.com', '$2b$10$XgHfP3YFGmQfLV9gQ.xbHOqL3o7Y6KZ8xJ8YvGH1nK9gQ1uO7Y6KZ', 'admin', 'active', TRUE),
  ('Camila E Tseral', 'camila.etseral@gmail.com', '$2b$10$XgHfP3YFGmQfLV9gQ.xbHOqL3o7Y6KZ8xJ8YvGH1nK9gQ1uO7Y6KZ', 'admin', 'active', TRUE)
ON CONFLICT (email) DO NOTHING;

COMMENT ON TABLE users IS 'Usuários do sistema OptiLog com controle de acesso baseado em roles (RBAC)';
COMMENT ON COLUMN users.role IS 'Perfil do usuário: admin (total), manager (gerente), driver (motorista), mechanic (mecânico), operator (operador)';
COMMENT ON COLUMN users.status IS 'Status do usuário: active (ativo), inactive (inativo), suspended (suspenso)';
