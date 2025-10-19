const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { authMiddleware } = require('./auth');

router.get('/', authMiddleware, (req, res) => {
  db.all('SELECT * FROM customers', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro no banco' });
    res.json(rows);
  });
});

router.post('/', authMiddleware, (req, res) => {
  const { name, email, phone } = req.body || {};
  if (!name) return res.status(400).json({ error: 'name é obrigatório' });
  const created_at = new Date().toISOString();
  db.run(
    `INSERT INTO customers (name, email, phone, created_at) VALUES (?, ?, ?, ?)`,
    [name, email, phone, created_at],
    function (err) {
      if (err) return res.status(500).json({ error: 'Erro no banco' });
      res.json({ id: this.lastID, name, email, phone });
    }
  );
});

router.put('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body || {};
  db.run(
    `UPDATE customers SET name = ?, email = ?, phone = ? WHERE id = ?`,
    [name, email, phone, id],
    function (err) {
      if (err) return res.status(500).json({ error: 'Erro no banco' });
      res.json({ updated: this.changes });
    }
  );
});

router.delete('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM customers WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: 'Erro no banco' });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;
