// Template de rota Express
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    res.json([]);
  } catch (e) {
    res.status(500).json({ error: 'internal_error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const payload = req.body || {};
    res.status(201).json({ id: 'new-id', ...payload });
  } catch (e) {
    res.status(500).json({ error: 'internal_error' });
  }
});

module.exports = router;
