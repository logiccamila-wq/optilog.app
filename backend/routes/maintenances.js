const express = require('express');
const router = express.Router();
const { db } = require('../db');

// Lista manutenções (endpoint público de leitura)
router.get('/', (req, res) => {
  db.all(
    'SELECT id, vehicle_id, status, schedule_at FROM maintenances ORDER BY schedule_at DESC',
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Erro no banco' });
      res.json(rows);
    }
  );
});

module.exports = router;
