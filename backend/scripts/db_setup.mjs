#!/usr/bin/env node
import 'dotenv/config';
import { Pool } from 'pg';

const DEFAULT_URL =
  process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/optilog';

const pool = new Pool({ connectionString: DEFAULT_URL });

async function ensureSchema() {
  const sqls = [
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE,
      password_hash TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS customers (
      id SERIAL PRIMARY KEY,
      name TEXT,
      email TEXT,
      phone TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT,
      sku TEXT,
      price NUMERIC,
      created_at TIMESTAMP DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      customer_id INTEGER REFERENCES customers(id),
      product_id INTEGER REFERENCES products(id),
      quantity INTEGER,
      created_at TIMESTAMP DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS vehicles (
      id SERIAL PRIMARY KEY,
      plate TEXT,
      modelo TEXT,
      km INTEGER,
      avg_consumption NUMERIC,
      status TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS tires (
      id SERIAL PRIMARY KEY,
      vehicle_id INTEGER REFERENCES vehicles(id),
      position TEXT,
      life INTEGER
    )`,
    `CREATE TABLE IF NOT EXISTS shipments (
      id SERIAL PRIMARY KEY,
      status TEXT,
      vehicle_id INTEGER REFERENCES vehicles(id),
      created_at TIMESTAMP DEFAULT NOW(),
      cost NUMERIC,
      lat DOUBLE PRECISION,
      lng DOUBLE PRECISION,
      user_id TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS maintenances (
      id SERIAL PRIMARY KEY,
      vehicle_id INTEGER REFERENCES vehicles(id),
      status TEXT,
      schedule_at TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS invoices (
      id SERIAL PRIMARY KEY,
      amount NUMERIC,
      status TEXT,
      issued_at TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS receivables (
      id SERIAL PRIMARY KEY,
      amount NUMERIC,
      status TEXT,
      due_at TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS payables (
      id SERIAL PRIMARY KEY,
      amount NUMERIC,
      status TEXT,
      due_at TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS alerts (
      id SERIAL PRIMARY KEY,
      type TEXT,
      message TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS checklist (
      id SERIAL PRIMARY KEY,
      item TEXT,
      done BOOLEAN DEFAULT FALSE,
      updated_at TIMESTAMP DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS estoque (
      id SERIAL PRIMARY KEY,
      item TEXT,
      nivel INTEGER,
      pontoReposicao INTEGER
    )`,
  ];
  for (const q of sqls) {
    await pool.query(q);
  }
}

async function seedIfEmpty() {
  const vehiclesCount = (await pool.query('SELECT COUNT(*)::int AS c FROM vehicles')).rows[0].c;
  if (vehiclesCount === 0) {
    await pool.query(
      `INSERT INTO vehicles (plate, modelo, km, avg_consumption, status) VALUES 
       ('ABC-1234','Caminhão',120000,32.5,'active'),
       ('XYZ-9876','Van',80000,28.1,'active'),
       ('JHK-1111','Carreta',150000,35.7,'active')`
    );
  }
  const tiresCount = (await pool.query('SELECT COUNT(*)::int AS c FROM tires')).rows[0].c;
  if (tiresCount === 0) {
    const vRes = await pool.query('SELECT id FROM vehicles');
    for (const v of vRes.rows) {
      await pool.query(
        `INSERT INTO tires (vehicle_id, position, life) VALUES 
         ($1,'front_left',60),($1,'front_right',55),($1,'rear_left',40),($1,'rear_right',35)`,
        [v.id]
      );
    }
  }
  const shipmentsCount = (await pool.query('SELECT COUNT(*)::int AS c FROM shipments')).rows[0].c;
  if (shipmentsCount === 0) {
    const vRes = await pool.query('SELECT id FROM vehicles ORDER BY id ASC');
    const v1 = vRes.rows[0]?.id || null;
    const v2 = vRes.rows[1]?.id || null;
    const now = new Date();
    const values = [
      ['in_transit', v1, new Date(now.getTime() - 3600_000), 120.5, -23.55, -46.63, 'u1'],
      ['delivered', v2, new Date(now.getTime() - 7200_000), 98.3, -22.9, -47.05, 'u2'],
      ['delayed', v1, new Date(now.getTime() - 5400_000), 150.0, -23.1, -45.9, 'u3'],
      ['in_transit', v2, new Date(now.getTime() - 1800_000), 75.0, -23.2, -46.5, 'u1'],
      ['in_transit', v1, new Date(now.getTime() - 300_000), 45.7, -23.6, -46.7, 'u2'],
    ];
    for (const row of values) {
      await pool.query(
        'INSERT INTO shipments (status, vehicle_id, created_at, cost, lat, lng, user_id) VALUES ($1,$2,$3,$4,$5,$6,$7)',
        row
      );
    }
  }
  const maintCount = (await pool.query('SELECT COUNT(*)::int AS c FROM maintenances')).rows[0].c;
  if (maintCount === 0) {
    const vRes = await pool.query('SELECT id FROM vehicles ORDER BY id ASC');
    const v1 = vRes.rows[0]?.id || null;
    const now = new Date();
    await pool.query(
      'INSERT INTO maintenances (vehicle_id, status, schedule_at) VALUES ($1,$2,$3)',
      [v1, 'scheduled', new Date(now.getTime() + 7 * 86400_000)]
    );
    await pool.query(
      'INSERT INTO maintenances (vehicle_id, status, schedule_at) VALUES ($1,$2,$3)',
      [v1, 'scheduled', new Date(now.getTime() + 14 * 86400_000)]
    );
  }
  const invCount = (await pool.query('SELECT COUNT(*)::int AS c FROM invoices')).rows[0].c;
  if (invCount === 0) {
    const now = new Date();
    await pool.query(
      `INSERT INTO invoices (amount, status, issued_at) VALUES 
       (1200.0,'paid',$1),(850.5,'pending',$2),(450.75,'overdue',$3)`,
      [
        new Date(now.getTime() - 86400_000),
        new Date(now.getTime() - 2 * 86400_000),
        new Date(now.getTime() - 3 * 86400_000),
      ]
    );
  }
  const recCount = (await pool.query('SELECT COUNT(*)::int AS c FROM receivables')).rows[0].c;
  if (recCount === 0) {
    const now = new Date();
    await pool.query(
      `INSERT INTO receivables (amount, status, due_at) VALUES 
       (500.0,'pending',$1),(900.0,'pending',$2),(120.0,'paid',$3)`,
      [
        new Date(now.getTime() + 86400_000),
        new Date(now.getTime() + 2 * 86400_000),
        new Date(now.getTime() - 86400_000),
      ]
    );
  }
  const payCount = (await pool.query('SELECT COUNT(*)::int AS c FROM payables')).rows[0].c;
  if (payCount === 0) {
    const now = new Date();
    await pool.query(
      `INSERT INTO payables (amount, status, due_at) VALUES 
       (300.0,'pending',$1),(150.0,'paid',$2),(700.0,'pending',$3)`,
      [
        new Date(now.getTime() + 2 * 86400_000),
        new Date(now.getTime() - 86400_000),
        new Date(now.getTime() + 5 * 86400_000),
      ]
    );
  }
  const alertCount = (await pool.query('SELECT COUNT(*)::int AS c FROM alerts')).rows[0].c;
  if (alertCount === 0) {
    await pool.query(
      `INSERT INTO alerts (type, message) VALUES 
       ('maintenance','Revisão preventiva prevista para veículo ABC-1234'),
       ('shipment','Entrega XYZ-9876 em rota, previsão 2h'),
       ('tires','Pneu traseiro direita com baixa vida útil')`
    );
  }
  const checkCount = (await pool.query('SELECT COUNT(*)::int AS c FROM checklist')).rows[0].c;
  if (checkCount === 0) {
    await pool.query(
      `INSERT INTO checklist (item, done) VALUES 
       ('Checar nível de óleo', false),
       ('Validar pressão dos pneus', true),
       ('Conferir documentos do veículo', false)`
    );
  }
  const custCount = (await pool.query('SELECT COUNT(*)::int AS c FROM customers')).rows[0].c;
  if (custCount === 0) {
    await pool.query(
      `INSERT INTO customers (name, email, phone) VALUES 
       ('Acme Ltda','contato@acme.com','+55 11 99999-0000'),
       ('Globex SA','sales@globex.com','+55 21 98888-1111')`
    );
  }
  const prodCount = (await pool.query('SELECT COUNT(*)::int AS c FROM products')).rows[0].c;
  if (prodCount === 0) {
    await pool.query(
      `INSERT INTO products (name, sku, price) VALUES 
       ('Pneu 275/80 R22.5','PN-27580R225',1299.90),
       ('Filtro de óleo','FO-123',59.90),
       ('Fluido de freio','FF-456',39.90)`
    );
  }
  const orderCount = (await pool.query('SELECT COUNT(*)::int AS c FROM orders')).rows[0].c;
  if (orderCount === 0) {
    const custRes = await pool.query('SELECT id FROM customers ORDER BY id ASC');
    const prodRes = await pool.query('SELECT id FROM products ORDER BY id ASC');
    const c1 = custRes.rows[0]?.id;
    const c2 = custRes.rows[1]?.id;
    const p1 = prodRes.rows[0]?.id;
    const p2 = prodRes.rows[1]?.id;
    await pool.query('INSERT INTO orders (customer_id, product_id, quantity) VALUES ($1,$2,$3)', [
      c1,
      p1,
      10,
    ]);
    await pool.query('INSERT INTO orders (customer_id, product_id, quantity) VALUES ($1,$2,$3)', [
      c2,
      p2,
      5,
    ]);
  }
}

async function main() {
  console.log(
    'Connecting to Postgres:',
    DEFAULT_URL.replace(/:\/\/([^:]+):([^@]+)@/, '://***:***@')
  );
  try {
    await ensureSchema();
    await seedIfEmpty();
    console.log('✅ Banco provisionado e seed realizado com sucesso');
    await pool.end();
    process.exit(0);
  } catch (e) {
    console.error('❌ Falha ao provisionar banco:', e?.message || e);
    await pool.end();
    process.exit(1);
  }
}

main();
