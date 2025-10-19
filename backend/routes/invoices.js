const express = require('express');
const router = express.Router();
const { db } = require('../db');

// Lista invoices (endpoint público de leitura)
router.get('/', (req, res) => {
  db.all(
    'SELECT id, amount, status, issued_at FROM invoices ORDER BY issued_at DESC',
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Erro no banco' });
      res.json(rows);
    }
  );
});

module.exports = router;
