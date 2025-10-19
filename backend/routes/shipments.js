const express = require('express');
const router = express.Router();
const { db } = require('../db');

// Lista todos os shipments (endpoint público de leitura)
router.get('/', (req, res) => {
  db.all(
    'SELECT id, status, vehicle_id, created_at, cost, lat, lng, user_id FROM shipments ORDER BY created_at DESC',
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Erro no banco' });
      res.json(rows);
    }
  );
});

module.exports = router;
