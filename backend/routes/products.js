const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { authMiddleware } = require('./auth');

router.get('/', authMiddleware, (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro no banco' });
    res.json(rows);
  });
});

router.post('/', authMiddleware, (req, res) => {
  const { name, sku, price } = req.body || {};
  if (!name) return res.status(400).json({ error: 'name é obrigatório' });
  const created_at = new Date().toISOString();
  db.run(
    `INSERT INTO products (name, sku, price, created_at) VALUES (?, ?, ?, ?)`,
    [name, sku, price, created_at],
    function (err) {
      if (err) return res.status(500).json({ error: 'Erro no banco' });
      res.json({ id: this.lastID, name, sku, price });
    }
  );
});

router.put('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { name, sku, price } = req.body || {};
  db.run(
    `UPDATE products SET name = ?, sku = ?, price = ? WHERE id = ?`,
    [name, sku, price, id],
    function (err) {
      if (err) return res.status(500).json({ error: 'Erro no banco' });
      res.json({ updated: this.changes });
    }
  );
});

router.delete('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM products WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: 'Erro no banco' });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;
