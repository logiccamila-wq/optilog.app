Kits Backend (API)

- Objetivo: fornecer padrão de rotas e integração com Firestore/DB.
- Stack: Node.js 20, Express, Firestore (via SDK), util `utils/api.ts` para consumo.

Padrão de rota Express (template)

```
const express = require('express');
const router = express.Router();

// GET lista
router.get('/', async (req, res) => {
  try {
    // TODO: substituir por origem real (Firestore/SQL)
    const items = [];
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: 'internal_error' });
  }
});

// POST criar
router.post('/', async (req, res) => {
  try {
    const payload = req.body;
    // TODO: persistir
    res.status(201).json({ id: 'new-id', ...payload });
  } catch (e) {
    res.status(500).json({ error: 'internal_error' });
  }
});

module.exports = router;
```

Endpoints sugeridos

- `/tires` (pneus): listar e atualizar métricas.
- `/vehicles` (veículos): cadastro e manutenção.
- `/shipments` (logística): tracking,
- `/invoices` (financeiro): faturas (open/paid/overdue).

Boas práticas

- Validar `req.body` antes de persistir.
- Paginar listagens longas.
- Utilizar códigos HTTP consistentes.
- Logar erros no servidor.
