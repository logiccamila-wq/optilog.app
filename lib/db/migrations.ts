import { sql } from '@vercel/postgres';
import { Role } from '@/types/system';

export async function createTables() {
  try {
    // Tabela de usuários
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        firebase_uid TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('super_gestor', 'administrador', 'operador_logistico', 'motorista', 'financeiro')),
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Tabela de permissões específicas
    await sql`
      CREATE TABLE IF NOT EXISTS permissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        role TEXT NOT NULL CHECK (role IN ('super_gestor', 'administrador', 'operador_logistico', 'motorista', 'financeiro')),
        module TEXT NOT NULL,
        action TEXT NOT NULL CHECK (action IN ('create', 'read', 'update', 'delete', 'approve', 'special')),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Tabela de módulos do sistema
    await sql`
      CREATE TABLE IF NOT EXISTS modules (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        path TEXT NOT NULL UNIQUE,
        icon TEXT,
        active BOOLEAN DEFAULT true,
        required_role TEXT[] NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Tabela de logs de acesso
    await sql`
      CREATE TABLE IF NOT EXISTS access_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        module TEXT NOT NULL,
        action TEXT NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        success BOOLEAN NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Índices para otimização
    await sql`CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_permissions_role ON permissions(role);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_access_logs_user_id ON access_logs(user_id);`;

    console.log('Tabelas criadas com sucesso!');
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
    throw error;
  }
}