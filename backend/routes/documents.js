const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/optilog';
const pool = new Pool({ connectionString: DATABASE_URL });

/**
 * GET /api/documents/status
 * Retorna status do banco (quantidade de registros reais vs hipotéticos)
 */
router.get('/status', async (req, res) => {
  try {
    const tables = ['veiculos', 'motoristas', 'cte', 'antt_documents'];
    const status = {
      tables: [],
      totalReal: 0,
      totalTest: 0,
    };

    for (const table of tables) {
      // Verifica se tabela existe
      const tableCheck = await pool.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        )`,
        [table]
      );

      if (!tableCheck.rows[0].exists) {
        continue;
      }

      const testCount = await pool.query(
        `SELECT COUNT(*) as count FROM ${table} WHERE is_test_data = true`
      );

      const realCount = await pool.query(
        `SELECT COUNT(*) as count FROM ${table} WHERE is_test_data = false`
      );

      const testNum = parseInt(testCount.rows[0].count);
      const realNum = parseInt(realCount.rows[0].count);

      status.tables.push({
        table,
        realRecords: realNum,
        testRecords: testNum,
        total: testNum + realNum,
      });

      status.totalReal += realNum;
      status.totalTest += testNum;
    }

    status.lastCheck = new Date().toISOString();

    res.json(status);
  } catch (error) {
    console.error('Erro ao buscar status:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/documents/import-logs
 * Lista logs de importação
 */
router.get('/import-logs', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const result = await pool.query(
      `SELECT * FROM import_logs 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) as total FROM import_logs');

    res.json({
      logs: result.rows,
      total: parseInt(countResult.rows[0].total),
      limit,
      offset,
    });
  } catch (error) {
    console.error('Erro ao buscar logs:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/documents/clean
 * Limpa dados hipotéticos do banco
 */
router.post('/clean', async (req, res) => {
  try {
    const { dryRun = true } = req.body;

    const results = {
      deleted: 0,
      tables: [],
    };

    const tablesWithFlag = ['veiculos', 'motoristas', 'cte', 'antt_documents'];

    for (const table of tablesWithFlag) {
      const tableCheck = await pool.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        )`,
        [table]
      );

      if (!tableCheck.rows[0].exists) {
        continue;
      }

      if (dryRun) {
        const count = await pool.query(
          `SELECT COUNT(*) as count FROM ${table} WHERE is_test_data = true`
        );

        const deletedCount = parseInt(count.rows[0].count);
        results.deleted += deletedCount;
        results.tables.push({ table, deleted: deletedCount, dryRun: true });
      } else {
        const result = await pool.query(
          `DELETE FROM ${table} WHERE is_test_data = true RETURNING id`
        );

        results.deleted += result.rowCount;
        results.tables.push({ table, deleted: result.rowCount, dryRun: false });
      }
    }

    results.timestamp = new Date().toISOString();
    results.message = dryRun
      ? 'Simulação concluída. Use dryRun=false para executar.'
      : 'Limpeza executada com sucesso.';

    res.json(results);
  } catch (error) {
    console.error('Erro ao limpar banco:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/documents/veiculos
 * Lista veículos
 */
router.get('/veiculos', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const testOnly = req.query.testOnly === 'true';

    let whereClause = testOnly ? 'WHERE is_test_data = true' : '';

    const result = await pool.query(
      `SELECT * FROM veiculos ${whereClause} ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) as total FROM veiculos ${whereClause}`
    );

    res.json({
      veiculos: result.rows,
      total: parseInt(countResult.rows[0].total),
      limit,
      offset,
    });
  } catch (error) {
    console.error('Erro ao buscar veículos:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/documents/motoristas
 * Lista motoristas
 */
router.get('/motoristas', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const testOnly = req.query.testOnly === 'true';

    let whereClause = testOnly ? 'WHERE is_test_data = true' : '';

    const result = await pool.query(
      `SELECT * FROM motoristas ${whereClause} ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) as total FROM motoristas ${whereClause}`
    );

    res.json({
      motoristas: result.rows,
      total: parseInt(countResult.rows[0].total),
      limit,
      offset,
    });
  } catch (error) {
    console.error('Erro ao buscar motoristas:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/documents/cte
 * Lista CT-e
 */
router.get('/cte', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const testOnly = req.query.testOnly === 'true';

    let whereClause = testOnly ? 'WHERE is_test_data = true' : '';

    const result = await pool.query(
      `SELECT * FROM cte ${whereClause} ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await pool.query(`SELECT COUNT(*) as total FROM cte ${whereClause}`);

    res.json({
      cte: result.rows,
      total: parseInt(countResult.rows[0].total),
      limit,
      offset,
    });
  } catch (error) {
    console.error('Erro ao buscar CT-e:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
