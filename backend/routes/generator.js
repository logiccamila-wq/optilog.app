const express = require('express');
const router = express.Router();
const { gerarCodigo } = require('../openai');

router.post('/', async (req, res) => {
  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'prompt é obrigatório' });
  try {
    const codigo = await gerarCodigo(prompt);
    res.json({ codigo });
  } catch (err) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

module.exports = router;
