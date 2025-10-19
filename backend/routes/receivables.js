const express = require('express');
const router = express.Router();
const { db } = require('../db');

// Lista recebíveis (endpoint público de leitura)
router.get('/', (req, res) => {
  db.all(
    'SELECT id, amount, status, due_at FROM receivables ORDER BY due_at DESC',
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Erro no banco' });
      res.json(rows);
    }
  );
});

module.exports = router;
