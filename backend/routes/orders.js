const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { authMiddleware } = require('./auth');

router.get('/', authMiddleware, (req, res) => {
  const query = `SELECT o.id, o.customer_id, o.product_id, o.quantity, o.created_at,
    c.name AS customer_name, p.name AS product_name
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
    LEFT JOIN products p ON o.product_id = p.id`;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro no banco' });
    res.json(rows);
  });
});

router.post('/', authMiddleware, (req, res) => {
  const { customer_id, product_id, quantity } = req.body || {};
  if (!customer_id || !product_id || !quantity) {
    return res.status(400).json({ error: 'customer_id, product_id e quantity são obrigatórios' });
  }
  const created_at = new Date().toISOString();
  db.run(
    `INSERT INTO orders (customer_id, product_id, quantity, created_at) VALUES (?, ?, ?, ?)`,
    [customer_id, product_id, quantity, created_at],
    function (err) {
      if (err) return res.status(500).json({ error: 'Erro no banco' });
      res.json({ id: this.lastID, customer_id, product_id, quantity });
    }
  );
});

router.delete('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM orders WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: 'Erro no banco' });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;
