const express = require('express');
const router = express.Router();
const { db } = require('../db');

// Lista veículos (endpoint público de leitura)
router.get('/', (req, res) => {
  db.all('SELECT id, plate, modelo, km, avg_consumption, status FROM vehicles', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro no banco' });
    res.json(rows);
  });
});

module.exports = router;
