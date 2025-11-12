const express = require('express');
const router = express.Router();

// Mock de alertas
const alertas = [
  { id: 1, tipo: 'API', msg: 'API fora do ar!', status: 'crítico', data: '2025-11-11 10:12' },
  { id: 2, tipo: 'Performance', msg: 'Tempo de resposta > 2s', status: 'atenção', data: '2025-11-11 09:55' },
  { id: 3, tipo: 'Login', msg: 'Falha de autenticação detectada', status: 'atenção', data: '2025-11-11 09:30' }
];

router.get('/', (req, res) => {
  res.json(alertas);
});

module.exports = router;
