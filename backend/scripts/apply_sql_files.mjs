#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import pkg from 'pg';

const { Client } = pkg;

// Lê DATABASE_URL do ambiente ou usa fallback seguro
const DATABASE_URL = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || 'postgres://postgres:postgres@localhost:5432/optilog';

async function readSqlFile(filePath) {
  const abs = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(abs)) throw new Error(`Arquivo SQL não encontrado: ${abs}`);
  const sql = fs.readFileSync(abs, 'utf-8');
  return sql;
}

async function applySql(client, sql, label) {
  console.log(`\n▶️ Aplicando: ${label} (${sql.length} bytes)`);
  await client.query(sql);
  console.log(`✅ OK: ${label}`);
}

async function main() {
  const files = process.argv.slice(2);
  if (files.length === 0) {
    console.error('Uso: node backend/scripts/apply_sql_files.mjs <arquivo1.sql> <arquivo2.sql> ...');
    process.exit(1);
  }

  const client = new Client({ connectionString: DATABASE_URL });
  console.log('Conectando a:', DATABASE_URL.replace(/:\/\/(.*?):(.*?)@/, '://***:***@'));

  try {
    await client.connect();
    await client.query('BEGIN');

    for (const f of files) {
      const sql = await readSqlFile(f);
      await applySql(client, sql, path.basename(f));
    }

    await client.query('COMMIT');
    console.log('\n🎉 Migrações aplicadas com sucesso');
  } catch (err) {
    console.error('\n❌ Erro ao aplicar migrações:', err?.message || err);
    try { await client.query('ROLLBACK'); } catch {}
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
