/**
 * Migração de dados do SQLite (backend/optilog.db) para Postgres.
 *
 * Requisitos:
 *  - Instalar dependências: `npm i -D pg sqlite3`
 *  - Definir `DATABASE_URL` no ambiente (ex.: Neon / Vercel Postgres)
 *  - Executar previamente o schema: backend/postgres/schema.sql
 *
 * Uso:
 *  DATABASE_URL="postgres://..." node scripts/migrate-sqlite-to-postgres.js
 */

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('Erro: defina DATABASE_URL ou DATABASE_URL_UNPOOLED no ambiente.');
  process.exit(1);
}

const pg = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const sqlitePath = path.join(__dirname, '..', 'backend', 'optilog.db');
if (!fs.existsSync(sqlitePath)) {
  console.error(`Erro: arquivo SQLite não encontrado: ${sqlitePath}`);
  process.exit(1);
}
const sqlite = new sqlite3.Database(sqlitePath);

async function runPg(sql, params = []) {
  return pg.query(sql, params);
}

async function ensureSchema() {
  const schemaPath = path.join(__dirname, '..', 'backend', 'postgres', 'schema.sql');
  const ddl = fs.readFileSync(schemaPath, 'utf-8');
  console.log('Aplicando schema Postgres...');
  await runPg(ddl);
  console.log('Schema aplicado.');
}

function readAllSqlite(table) {
  return new Promise((resolve, reject) => {
    sqlite.all(`SELECT * FROM ${table}`, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows || []);
    });
  });
}

async function insertRows(table, columns, rows) {
  if (!rows.length) return;
  const colList = columns.join(', ');
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
  const sql = `INSERT INTO ${table} (${colList}) VALUES (${placeholders})`;
  for (const r of rows) {
    const values = columns.map((c) => r[c] ?? null);
    await runPg(sql, values);
  }
}

async function fixSequence(table) {
  const q = `SELECT setval(pg_get_serial_sequence('${table}', 'id'), COALESCE((SELECT MAX(id) FROM ${table}), 1))`;
  await runPg(q);
}

async function migrate() {
  console.log('Iniciando migração SQLite → Postgres...');
  await ensureSchema();

  // Ordem pensada para respeitar dependências
  const plan = [
    { table: 'users', columns: ['id','email','password_hash','created_at'] },
    { table: 'customers', columns: ['id','name','email','phone','created_at'] },
    { table: 'products', columns: ['id','name','sku','price','created_at'] },
    { table: 'orders', columns: ['id','customer_id','product_id','quantity','created_at'] },
    { table: 'vehicles', columns: ['id','plate','modelo','km','avg_consumption','status'] },
    { table: 'tires', columns: ['id','vehicle_id','position','life'] },
    { table: 'maintenances', columns: ['id','vehicle_id','status','schedule_at'] },
    { table: 'shipments', columns: ['id','status','vehicle_id','created_at','cost','lat','lng','user_id'] },
    { table: 'invoices', columns: ['id','amount','status','issued_at'] },
    { table: 'receivables', columns: ['id','amount','status','due_at'] },
    { table: 'payables', columns: ['id','amount','status','due_at'] },
    { table: 'alerts', columns: ['id','type','message','created_at'] },
    { table: 'checklist', columns: ['id','item','done','updated_at'] },
    { table: 'estoque', columns: ['id','item','nivel','pontoReposicao'] },
  ];

  const client = await pg.connect();
  try {
    await client.query('BEGIN');

    for (const step of plan) {
      console.log(`Migrando tabela: ${step.table}`);
      const rows = await readAllSqlite(step.table);
      await insertRows(step.table, step.columns, rows);
      await fixSequence(step.table);
      console.log(`  → ${rows.length} linhas migradas.`);
    }

    await client.query('COMMIT');
    console.log('Migração concluída com sucesso.');
  } catch (err) {
    console.error('Falha na migração, efetuando ROLLBACK...', err);
    await client.query('ROLLBACK');
    process.exitCode = 1;
  } finally {
    client.release();
    await pg.end();
    sqlite.close();
  }
}

migrate().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});