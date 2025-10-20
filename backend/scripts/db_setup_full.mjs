import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pkg;
const client = new Client({
  connectionString:
    process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/optilog',
});

async function setup() {
  try {
    await client.connect();
    console.log('Conectado ao banco');

    await client.query('BEGIN');

    await client.query(`
      DROP TABLE IF EXISTS alerts, checklist, estoque, payables, receivables, invoices,
      maintenances, shipments, orders, tires, vehicles, products, customers, users CASCADE;
    `);

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE,
        password_hash TEXT,
        created_at TIMESTAMP DEFAULT now()
      );
      
      CREATE TABLE customers (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT,
        phone TEXT,
        created_at TIMESTAMP DEFAULT now()
      );

      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name TEXT,
        sku TEXT,
        price NUMERIC(12,2),
        created_at TIMESTAMP DEFAULT now()
      );

      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        customer_id INT REFERENCES customers(id),
        product_id INT REFERENCES products(id),
        quantity INT,
        created_at TIMESTAMP DEFAULT now()
      );

      CREATE TABLE vehicles (
        id SERIAL PRIMARY KEY,
        plate TEXT,
        modelo TEXT,
        km INT,
        avg_consumption NUMERIC(10,2),
        status TEXT
      );

      CREATE TABLE tires (
        id SERIAL PRIMARY KEY,
        vehicle_id INT REFERENCES vehicles(id),
        position TEXT,
        life INT
      );

      CREATE TABLE shipments (
        id SERIAL PRIMARY KEY,
        status TEXT,
        vehicle_id INT REFERENCES vehicles(id),
        created_at TIMESTAMP DEFAULT now(),
        cost NUMERIC(12,2),
        lat DOUBLE PRECISION,
        lng DOUBLE PRECISION,
        user_id TEXT
      );

      CREATE TABLE maintenances (
        id SERIAL PRIMARY KEY,
        vehicle_id INT REFERENCES vehicles(id),
        status TEXT,
        schedule_at TIMESTAMP
      );

      CREATE TABLE invoices (
        id SERIAL PRIMARY KEY,
        amount NUMERIC(12,2),
        status TEXT,
        issued_at TIMESTAMP
      );

      CREATE TABLE receivables (
        id SERIAL PRIMARY KEY,
        amount NUMERIC(12,2),
        status TEXT,
        due_at TIMESTAMP
      );

      CREATE TABLE payables (
        id SERIAL PRIMARY KEY,
        amount NUMERIC(12,2),
        status TEXT,
        due_at TIMESTAMP
      );

      CREATE TABLE alerts (
        id SERIAL PRIMARY KEY,
        type TEXT,
        message TEXT,
        created_at TIMESTAMP DEFAULT now()
      );

      CREATE TABLE checklist (
        id SERIAL PRIMARY KEY,
        item TEXT,
        done INT,
        updated_at TIMESTAMP
      );

      CREATE TABLE estoque (
        id SERIAL PRIMARY KEY,
        item TEXT,
        nivel INT,
        pontoReposicao INT
      );
    `);

    console.log('Tabelas criadas');

    // Vehicles
    await client.query(`
      INSERT INTO vehicles (plate, modelo, km, avg_consumption, status) VALUES
      ('ABC-1234', 'Caminhão', 120000, 32.5, 'active'),
      ('XYZ-9876', 'Van', 80000, 28.1, 'active'),
      ('JHK-1111', 'Carreta', 150000, 35.7, 'active');
    `);

    // Tires for each vehicle (4 por veículo)
    await client.query(`
      INSERT INTO tires (vehicle_id, position, life)
      SELECT v.id, p.position, p.life
      FROM vehicles v
      CROSS JOIN (VALUES
        ('front_left', 60),
        ('front_right', 55),
        ('rear_left', 40),
        ('rear_right', 35)
      ) AS p(position, life);
    `);

    // Shipments
    await client.query(`
      INSERT INTO shipments (status, vehicle_id, created_at, cost, lat, lng, user_id) VALUES
      ('in_transit', (SELECT id FROM vehicles LIMIT 1 OFFSET 0), now() - interval '1 hour', 120.5, -23.55, -46.63, 'u1'),
      ('delivered', (SELECT id FROM vehicles LIMIT 1 OFFSET 1), now() - interval '2 hours', 98.3, -22.9, -47.05, 'u2'),
      ('delayed', (SELECT id FROM vehicles LIMIT 1 OFFSET 0), now() - interval '90 minutes', 150.0, -23.1, -45.9, 'u3'),
      ('in_transit', (SELECT id FROM vehicles LIMIT 1 OFFSET 1), now() - interval '30 minutes', 75.0, -23.2, -46.5, 'u1'),
      ('in_transit', (SELECT id FROM vehicles LIMIT 1 OFFSET 0), now() - interval '5 minutes', 45.7, -23.6, -46.7, 'u2');
    `);

    // Maintenances
    await client.query(`
      INSERT INTO maintenances (vehicle_id, status, schedule_at) VALUES
      ((SELECT id FROM vehicles LIMIT 1 OFFSET 0), 'scheduled', now() + interval '7 days'),
      ((SELECT id FROM vehicles LIMIT 1 OFFSET 0), 'scheduled', now() + interval '14 days');
    `);

    // Invoices
    await client.query(`
      INSERT INTO invoices (amount, status, issued_at) VALUES
      (1200.0, 'open', now() - interval '5 days'),
      (800.5, 'paid', now() - interval '15 days'),
      (430.75, 'overdue', now() - interval '35 days');
    `);

    // Receivables
    await client.query(`
      INSERT INTO receivables (amount, status, due_at) VALUES
      (500.0, 'open', now() + interval '10 days'),
      (350.25, 'open', now() + interval '25 days'),
      (100.0, 'overdue', now() - interval '10 days');
    `);

    // Payables
    await client.query(`
      INSERT INTO payables (amount, status, due_at) VALUES
      (200.0, 'open', now() + interval '7 days'),
      (150.0, 'paid', now() - interval '2 days');
    `);

    // Alerts
    await client.query(`
      INSERT INTO alerts (type, message, created_at) VALUES
      ('warning', 'Atraso na rota SP-23', now() - interval '1 hour'),
      ('info', 'Reprogramação de manutenção veículo ABC-1234', now() - interval '2 hours');
    `);

    // Checklist
    await client.query(`
      INSERT INTO checklist (item, done, updated_at) VALUES
      ('Conferir estoque', 0, now() - interval '1 day'),
      ('Verificar pneus', 1, now() - interval '2 days');
    `);

    // Estoque
    await client.query(`
      INSERT INTO estoque (item, nivel, pontoReposicao) VALUES
      ('Palete', 12, 8),
      ('Caixa', 40, 20),
      ('Etiqueta', 5, 10);
    `);

    // Customers / Products / Orders
    await client.query(`
      INSERT INTO customers (name, email, phone) VALUES
      ('Cliente A', 'clienteA@email.com', '1111-1111'),
      ('Cliente B', 'clienteB@email.com', '2222-2222');
    `);

    await client.query(`
      INSERT INTO products (name, sku, price) VALUES
      ('Pneu 205/55', 'P20555', 350.00),
      ('Óleo Diesel', 'OD1000', 150.00);
    `);

    await client.query(`
      INSERT INTO orders (customer_id, product_id, quantity) VALUES
      (1, 1, 4),
      (2, 2, 10);
    `);

    await client.query('COMMIT');

    console.log('Seeds aplicadas com sucesso');

    await client.end();
    console.log('Conexão encerrada');
  } catch (err) {
    console.error('Erro durante setup:', err);
    try { await client.query('ROLLBACK'); } catch (e) {}
    await client.end();
    process.exit(1);
  }
}

setup();