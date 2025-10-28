const express = require('express');
const router = express.Router();
const { db } = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

router.post('/register', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ error: 'email e password são obrigatórios' });
  const hash = bcrypt.hashSync(password, 10);
  const created_at = new Date().toISOString();
  const stmt = db.prepare('INSERT INTO users (email, password_hash, created_at) VALUES (?, ?, ?)');
  stmt.run([email, hash, created_at], function (err) {
    if (err) {
      if (err.message && err.message.includes('UNIQUE')) {
        return res.status(409).json({ error: 'Email já registrado' });
      }
      return res.status(500).json({ error: 'Erro ao registrar' });
    }
    res.json({ id: this.lastID, email });
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ error: 'email e password são obrigatórios' });
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'Erro no banco' });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    const ok = bcrypt.compareSync(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Credenciais inválidas' });
    const token = jwt.sign({ sub: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  });
});

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Token ausente' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = { router, authMiddleware };
