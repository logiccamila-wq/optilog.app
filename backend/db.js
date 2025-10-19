const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'optilog.db');
const db = new sqlite3.Database(dbPath);

function initDb(callback) {
  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password_hash TEXT,
        created_at TEXT
      )`
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        phone TEXT,
        created_at TEXT
      )`
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        sku TEXT,
        price REAL,
        created_at TEXT
      )`
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        product_id INTEGER,
        quantity INTEGER,
        created_at TEXT,
        FOREIGN KEY(customer_id) REFERENCES customers(id),
        FOREIGN KEY(product_id) REFERENCES products(id)
      )`
    );

    // Extended operational tables (logística/frota/financeiro)
    db.run(
      `CREATE TABLE IF NOT EXISTS shipments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        status TEXT,
        vehicle_id TEXT,
        created_at INTEGER,
        cost REAL,
        lat REAL,
        lng REAL,
        user_id TEXT
      )`
    );
    db.run(
      `CREATE TABLE IF NOT EXISTS vehicles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plate TEXT,
        modelo TEXT,
        km INTEGER,
        avg_consumption REAL,
        status TEXT
      )`
    );
    db.run(
      `CREATE TABLE IF NOT EXISTS tires (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicle_id INTEGER,
        position TEXT,
        life INTEGER
      )`
    );
    db.run(
      `CREATE TABLE IF NOT EXISTS maintenances (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicle_id INTEGER,
        status TEXT,
        schedule_at INTEGER
      )`
    );
    db.run(
      `CREATE TABLE IF NOT EXISTS invoices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL,
        status TEXT,
        issued_at INTEGER
      )`
    );
    db.run(
      `CREATE TABLE IF NOT EXISTS receivables (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL,
        status TEXT,
        due_at INTEGER
      )`
    );
    db.run(
      `CREATE TABLE IF NOT EXISTS payables (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL,
        status TEXT,
        due_at INTEGER
      )`
    );
    db.run(
      `CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        message TEXT,
        created_at INTEGER
      )`
    );
    db.run(
      `CREATE TABLE IF NOT EXISTS checklist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item TEXT,
        done INTEGER,
        updated_at INTEGER
      )`
    );
    db.run(
      `CREATE TABLE IF NOT EXISTS estoque (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item TEXT,
        nivel INTEGER,
        pontoReposicao INTEGER
      )`
    );

    // Seed minimal data if empty
    db.get(`SELECT COUNT(*) AS c FROM vehicles`, [], (err, row) => {
      if (!err && row && row.c === 0) {
        const now = Date.now();
        db.run(
          `INSERT INTO vehicles (plate, modelo, km, avg_consumption, status) VALUES (?, ?, ?, ?, ?)`,
          ['ABC-1234', 'Caminhão', 120000, 32.5, 'active']
        );
        db.run(
          `INSERT INTO vehicles (plate, modelo, km, avg_consumption, status) VALUES (?, ?, ?, ?, ?)`,
          ['XYZ-9876', 'Van', 80000, 28.1, 'active']
        );
        db.run(
          `INSERT INTO vehicles (plate, modelo, km, avg_consumption, status) VALUES (?, ?, ?, ?, ?)`,
          ['JHK-1111', 'Carreta', 150000, 35.7, 'active']
        );
      }
    });
    db.get(`SELECT COUNT(*) AS c FROM tires`, [], (err, row) => {
      if (!err && row && row.c === 0) {
        db.all(`SELECT id FROM vehicles`, [], (e2, vs) => {
          if (!e2 && vs && vs.length) {
            for (const v of vs) {
              db.run(`INSERT INTO tires (vehicle_id, position, life) VALUES (?, ?, ?)`, [
                v.id,
                'front_left',
                60,
              ]);
              db.run(`INSERT INTO tires (vehicle_id, position, life) VALUES (?, ?, ?)`, [
                v.id,
                'front_right',
                55,
              ]);
              db.run(`INSERT INTO tires (vehicle_id, position, life) VALUES (?, ?, ?)`, [
                v.id,
                'rear_left',
                40,
              ]);
              db.run(`INSERT INTO tires (vehicle_id, position, life) VALUES (?, ?, ?)`, [
                v.id,
                'rear_right',
                35,
              ]);
            }
          }
        });
      }
    });
    db.get(`SELECT COUNT(*) AS c FROM shipments`, [], (err, row) => {
      if (!err && row && row.c === 0) {
        db.all(`SELECT id FROM vehicles`, [], (e2, vs) => {
          const now = Date.now();
          const v1 = vs && vs[0] ? vs[0].id : null;
          const v2 = vs && vs[1] ? vs[1].id : null;
          db.run(
            `INSERT INTO shipments (status, vehicle_id, created_at, cost, lat, lng, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            ['in_transit', v1, now - 3600_000, 120.5, -23.55, -46.63, 'u1']
          );
          db.run(
            `INSERT INTO shipments (status, vehicle_id, created_at, cost, lat, lng, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            ['delivered', v2, now - 7200_000, 98.3, -22.9, -47.05, 'u2']
          );
          db.run(
            `INSERT INTO shipments (status, vehicle_id, created_at, cost, lat, lng, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            ['delayed', v1, now - 5400_000, 150.0, -23.1, -45.9, 'u3']
          );
          db.run(
            `INSERT INTO shipments (status, vehicle_id, created_at, cost, lat, lng, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            ['in_transit', v2, now - 1800_000, 75.0, -23.2, -46.5, 'u1']
          );
          db.run(
            `INSERT INTO shipments (status, vehicle_id, created_at, cost, lat, lng, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            ['in_transit', v1, now - 300_000, 45.7, -23.6, -46.7, 'u2']
          );
        });
      }
    });
    db.get(`SELECT COUNT(*) AS c FROM maintenances`, [], (err, row) => {
      if (!err && row && row.c === 0) {
        db.all(`SELECT id FROM vehicles`, [], (e2, vs) => {
          const now = Date.now();
          const v1 = vs && vs[0] ? vs[0].id : null;
          db.run(`INSERT INTO maintenances (vehicle_id, status, schedule_at) VALUES (?, ?, ?)`, [
            v1,
            'scheduled',
            now + 7 * 86400_000,
          ]);
          db.run(`INSERT INTO maintenances (vehicle_id, status, schedule_at) VALUES (?, ?, ?)`, [
            v1,
            'scheduled',
            now + 14 * 86400_000,
          ]);
        });
      }
    });
    db.get(`SELECT COUNT(*) AS c FROM invoices`, [], (err, row) => {
      if (!err && row && row.c === 0) {
        const now = Date.now();
        db.run(`INSERT INTO invoices (amount, status, issued_at) VALUES (?, ?, ?)`, [
          1200.0,
          'open',
          now - 5 * 86400_000,
        ]);
        db.run(`INSERT INTO invoices (amount, status, issued_at) VALUES (?, ?, ?)`, [
          800.5,
          'paid',
          now - 15 * 86400_000,
        ]);
        db.run(`INSERT INTO invoices (amount, status, issued_at) VALUES (?, ?, ?)`, [
          430.75,
          'overdue',
          now - 35 * 86400_000,
        ]);
      }
    });
    db.get(`SELECT COUNT(*) AS c FROM receivables`, [], (err, row) => {
      if (!err && row && row.c === 0) {
        const now = Date.now();
        db.run(`INSERT INTO receivables (amount, status, due_at) VALUES (?, ?, ?)`, [
          500.0,
          'open',
          now + 10 * 86400_000,
        ]);
        db.run(`INSERT INTO receivables (amount, status, due_at) VALUES (?, ?, ?)`, [
          350.25,
          'open',
          now + 25 * 86400_000,
        ]);
        db.run(`INSERT INTO receivables (amount, status, due_at) VALUES (?, ?, ?)`, [
          100.0,
          'overdue',
          now - 10 * 86400_000,
        ]);
      }
    });
    db.get(`SELECT COUNT(*) AS c FROM payables`, [], (err, row) => {
      if (!err && row && row.c === 0) {
        const now = Date.now();
        db.run(`INSERT INTO payables (amount, status, due_at) VALUES (?, ?, ?)`, [
          200.0,
          'open',
          now + 7 * 86400_000,
        ]);
        db.run(`INSERT INTO payables (amount, status, due_at) VALUES (?, ?, ?)`, [
          150.0,
          'paid',
          now - 2 * 86400_000,
        ]);
      }
    });
    db.get(`SELECT COUNT(*) AS c FROM alerts`, [], (err, row) => {
      if (!err && row && row.c === 0) {
        const now = Date.now();
        db.run(`INSERT INTO alerts (type, message, created_at) VALUES (?, ?, ?)`, [
          'warning',
          'Atraso na rota SP-23',
          now - 3600_000,
        ]);
        db.run(`INSERT INTO alerts (type, message, created_at) VALUES (?, ?, ?)`, [
          'info',
          'Reprogramação de manutenção veículo ABC-1234',
          now - 7200_000,
        ]);
      }
    });
    db.get(`SELECT COUNT(*) AS c FROM checklist`, [], (err, row) => {
      if (!err && row && row.c === 0) {
        const now = Date.now();
        db.run(`INSERT INTO checklist (item, done, updated_at) VALUES (?, ?, ?)`, [
          'Conferir estoque',
          0,
          now - 86400_000,
        ]);
        db.run(`INSERT INTO checklist (item, done, updated_at) VALUES (?, ?, ?)`, [
          'Verificar pneus',
          1,
          now - 2 * 86400_000,
        ]);
      }
    });
    db.get(`SELECT COUNT(*) AS c FROM estoque`, [], (err, row) => {
      if (!err && row && row.c === 0) {
        db.run(`INSERT INTO estoque (item, nivel, pontoReposicao) VALUES (?, ?, ?)`, [
          'Palete',
          12,
          8,
        ]);
        db.run(`INSERT INTO estoque (item, nivel, pontoReposicao) VALUES (?, ?, ?)`, [
          'Caixa',
          40,
          20,
        ]);
        db.run(`INSERT INTO estoque (item, nivel, pontoReposicao) VALUES (?, ?, ?)`, [
          'Etiqueta',
          5,
          10,
        ]);
      }
    });

    if (callback) callback();
  });
}

module.exports = { db, initDb };
