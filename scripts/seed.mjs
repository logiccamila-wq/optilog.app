import { neon } from '@neondatabase/serverless';
import fs from 'node:fs';
import path from 'node:path';

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    return;
  }
  const raw = fs.readFileSync(envPath, 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = val;
  }
}

async function main() {
  loadEnvLocal();

  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL ou DATABASE_URL_UNPOOLED não definido. Configure em .env.local');
    process.exit(1);
  }

  const sql = neon(url);

  console.log('Criando tabela posts se não existir...');
  await sql`
    CREATE TABLE IF NOT EXISTS posts (
      id BIGSERIAL PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      content TEXT,
      is_published BOOLEAN NOT NULL DEFAULT TRUE,
      author_id TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  console.log('Inserindo dados de exemplo...');
  await sql`
    INSERT INTO posts (slug, title, content, is_published, author_id)
    VALUES
      ('hello-neon', 'Hello Neon', 'Primeiro post usando Neon serverless.', TRUE, 'system'),
      ('neon-vs-firebase', 'Por que Neon é diferente do Firebase', 'Comparando arquiteturas: SQL vs NoSQL; serverless Postgres vs Realtime DB.', TRUE, 'system'),
      ('preview-branching', 'Branches por PR com Neon + Vercel', 'Cada PR cria um branch de DB; preview isolado e seguro.', TRUE, 'system')
    ON CONFLICT (slug) DO NOTHING
  `;

  console.log('Seed concluído.');
}

main().catch((err) => {
  console.error('Falha no seed:', err?.message ?? String(err));
  process.exit(1);
});
