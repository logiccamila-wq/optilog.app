const express = require('express');
const router = express.Router();

// Mock de dados para relatórios
router.get('/viagens', (req, res) => {
  res.json([
    { id: 1, periodo: '2025-10', viagens: 18 },
    { id: 2, periodo: '2025-11', viagens: 22 }
  ]);
});

router.get('/manutencoes', (req, res) => {
  res.json([
    { id: 1, veiculo: 'ABC1234', custo: 1200, data: '2025-10-10' },
    { id: 2, veiculo: 'DEF5678', custo: 800, data: '2025-11-01' }
  ]);
});

router.get('/motoristas', (req, res) => {
  res.json([
    { id: 1, nome: 'João Silva', viagens: 12, nota: 9.2 },
    { id: 2, nome: 'Maria Souza', viagens: 15, nota: 8.9 }
  ]);
});

router.get('/combustivel', (req, res) => {
  res.json([
    { id: 1, veiculo: 'ABC1234', consumo: 7.8 },
    { id: 2, veiculo: 'DEF5678', consumo: 8.1 }
  ]);
});

router.get('/faturamento', (req, res) => {
  res.json([
    { id: 1, mes: '2025-10', valor: 18000 },
    { id: 2, mes: '2025-11', valor: 22000 }
  ]);
});

module.exports = router;
