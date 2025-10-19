const express = require('express');
const router = express.Router();
const { db } = require('../db');

// Lista alertas (endpoint público de leitura)
router.get('/', (req, res) => {
  db.all(
    'SELECT id, type, message, created_at FROM alerts ORDER BY created_at DESC',
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Erro no banco' });
      res.json(rows);
    }
  );
});

module.exports = router;
