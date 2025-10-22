const express = require('express');
const router = express.Router();
const { db } = require('../db');

// Lista pneus (endpoint público de leitura)
router.get('/', (req, res) => {
  db.all('SELECT id, vehicle_id, position, life FROM tires', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro no banco' });
    res.json(rows);
  });
});

// Atualiza posição/veículo/vida do pneu (movimentação)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { vehicle_id, position, life } = req.body || {};
  if (vehicle_id === undefined && position === undefined && life === undefined) {
    return res.status(400).json({ error: 'Informe ao menos vehicle_id, position ou life' });
  }
  db.run(
    `UPDATE tires 
     SET vehicle_id = COALESCE(?, vehicle_id),
         position = COALESCE(?, position),
         life = COALESCE(?, life)
     WHERE id = ?`,
    [vehicle_id, position, life, id],
    function (err) {
      if (err) return res.status(500).json({ error: 'Erro no banco' });
      db.get('SELECT id, vehicle_id, position, life FROM tires WHERE id = ?', [id], (e2, row) => {
        if (e2) return res.status(500).json({ error: 'Erro no banco' });
        if (!row) return res.status(404).json({ error: 'Pneu não encontrado' });
        res.json(row);
      });
    }
  );
});

module.exports = router;
