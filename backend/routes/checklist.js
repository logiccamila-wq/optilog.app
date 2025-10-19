const express = require('express');
const router = express.Router();
const { db } = require('../db');

// Lista checklist (endpoint público de leitura)
router.get('/', (req, res) => {
  db.all(
    'SELECT id, item, done, updated_at FROM checklist ORDER BY updated_at DESC',
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Erro no banco' });
      res.json(rows);
    }
  );
});

module.exports = router;
