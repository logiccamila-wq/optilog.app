const express = require('express');
const router = express.Router();
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL || '');

// Wrapper to maintain query interface
const db = {
  query: async (text, params = []) => {
    const rows = await sql(text, params);
    return { rows };
  }
};

// GET /api/equipamentos - Listar todos os equipamentos
router.get('/', async (req, res) => {
  try {
    const { status, tipo } = req.query;
    
    let query = `
      SELECT 
        e.*,
        COUNT(DISTINCT i.id) as total_inspecoes,
        MAX(i.data_inspecao) as ultima_inspecao,
        MIN(i.proxima_inspecao) as proxima_inspecao,
        COUNT(DISTINCT CASE WHEN a.resolvido = false THEN a.id END) as alertas_ativos
      FROM equipamentos_frota e
      LEFT JOIN inspecoes_equipamentos i ON e.id = i.equipamento_id
      LEFT JOIN alertas_inspecoes a ON e.id = a.equipamento_id
    `;
    
    const conditions = [];
    const params = [];
    
    if (status) {
      conditions.push(`e.status = $${params.length + 1}`);
      params.push(status);
    }
    
    if (tipo) {
      conditions.push(`e.tipo = $${params.length + 1}`);
      params.push(tipo);
    }
    
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    query += ` GROUP BY e.id ORDER BY e.created_at DESC`;
    
    const result = await db.query(query, params);
    res.json(result.rows || []);
  } catch (error) {
    console.error('Erro ao buscar equipamentos:', error);
    res.status(500).json({ error: 'Erro ao buscar equipamentos', details: error.message });
  }
});

// GET /api/equipamentos/:id - Buscar equipamento por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        e.*,
        COUNT(DISTINCT i.id) as total_inspecoes,
        MAX(i.data_inspecao) as ultima_inspecao,
        MIN(i.proxima_inspecao) as proxima_inspecao,
        COUNT(DISTINCT CASE WHEN a.resolvido = false THEN a.id END) as alertas_ativos,
        COUNT(DISTINCT CASE WHEN a.resolvido = false AND a.severidade = 'critico' THEN a.id END) as alertas_criticos
      FROM equipamentos_frota e
      LEFT JOIN inspecoes_equipamentos i ON e.id = i.equipamento_id
      LEFT JOIN alertas_inspecoes a ON e.id = a.equipamento_id
      WHERE e.id = $1
      GROUP BY e.id
    `;
    
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Equipamento não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar equipamento:', error);
    res.status(500).json({ error: 'Erro ao buscar equipamento', details: error.message });
  }
});

// POST /api/equipamentos - Criar novo equipamento
router.post('/', async (req, res) => {
  try {
    const {
      tipo,
      placa,
      renavam,
      chassi,
      ano_fabricacao,
      fabricante,
      modelo,
      capacidade_carga,
      eixos,
      proprietario,
      documento_proprietario,
      nome_proprietario,
      status,
      localizado_em,
      crlv_vencimento,
      seguro_vencimento,
      seguro_apolice,
      seguro_seguradora,
      valor_compra,
      data_compra,
      observacoes,
      fotos_urls
    } = req.body;
    
    const query = `
      INSERT INTO equipamentos_frota (
        tipo, placa, renavam, chassi, ano_fabricacao, fabricante, modelo,
        capacidade_carga, eixos, proprietario, documento_proprietario, nome_proprietario,
        status, localizado_em, crlv_vencimento, seguro_vencimento, seguro_apolice,
        seguro_seguradora, valor_compra, data_compra, observacoes, fotos_urls
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
      RETURNING *
    `;
    
    const result = await db.query(query, [
      tipo, placa, renavam, chassi, ano_fabricacao, fabricante, modelo,
      capacidade_carga, eixos, proprietario, documento_proprietario, nome_proprietario,
      status || 'ativo', localizado_em, crlv_vencimento, seguro_vencimento, seguro_apolice,
      seguro_seguradora, valor_compra, data_compra, observacoes, fotos_urls
    ]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar equipamento:', error);
    res.status(500).json({ error: 'Erro ao criar equipamento', details: error.message });
  }
});

// PUT /api/equipamentos/:id - Atualizar equipamento
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    
    const allowedFields = [
      'tipo', 'placa', 'renavam', 'chassi', 'ano_fabricacao', 'fabricante', 'modelo',
      'capacidade_carga', 'eixos', 'proprietario', 'documento_proprietario', 'nome_proprietario',
      'status', 'localizado_em', 'crlv_vencimento', 'seguro_vencimento', 'seguro_apolice',
      'seguro_seguradora', 'valor_compra', 'data_compra', 'observacoes', 'fotos_urls'
    ];
    
    const updates = [];
    const values = [];
    let paramIndex = 1;
    
    Object.keys(fields).forEach(key => {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = $${paramIndex}`);
        values.push(fields[key]);
        paramIndex++;
      }
    });
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'Nenhum campo válido para atualizar' });
    }
    
    values.push(id);
    const query = `
      UPDATE equipamentos_frota 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    const result = await db.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Equipamento não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar equipamento:', error);
    res.status(500).json({ error: 'Erro ao atualizar equipamento', details: error.message });
  }
});

// DELETE /api/equipamentos/:id - Deletar equipamento
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'DELETE FROM equipamentos_frota WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Equipamento não encontrado' });
    }
    
    res.json({ message: 'Equipamento deletado com sucesso', id: result.rows[0].id });
  } catch (error) {
    console.error('Erro ao deletar equipamento:', error);
    res.status(500).json({ error: 'Erro ao deletar equipamento', details: error.message });
  }
});

// GET /api/equipamentos/stats/dashboard - Estatísticas para dashboard
router.get('/stats/dashboard', async (req, res) => {
  try {
    const stats = await db.query(`
      SELECT 
        COUNT(*) as total_equipamentos,
        COUNT(*) FILTER (WHERE status = 'ativo') as equipamentos_ativos,
        COUNT(*) FILTER (WHERE status = 'manutencao') as em_manutencao,
        COUNT(*) FILTER (WHERE status = 'inativo') as inativos
      FROM equipamentos_frota
    `);
    
    const inspecoes = await db.query(`
      SELECT 
        COUNT(*) FILTER (WHERE proxima_inspecao < CURRENT_DATE) as vencidas,
        COUNT(*) FILTER (WHERE proxima_inspecao >= CURRENT_DATE AND proxima_inspecao <= CURRENT_DATE + INTERVAL '7 days') as vencendo_7dias,
        COUNT(*) FILTER (WHERE proxima_inspecao >= CURRENT_DATE AND proxima_inspecao <= CURRENT_DATE + INTERVAL '30 days') as vencendo_30dias
      FROM inspecoes_equipamentos
      WHERE proxima_inspecao IS NOT NULL
    `);
    
    const alertas = await db.query(`
      SELECT 
        COUNT(*) FILTER (WHERE severidade = 'critico' AND resolvido = false) as criticos,
        COUNT(*) FILTER (WHERE severidade = 'aviso' AND resolvido = false) as avisos,
        COUNT(*) FILTER (WHERE severidade = 'info' AND resolvido = false) as info
      FROM alertas_inspecoes
    `);
    
    const conformidade = await db.query(`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'conforme') as conformes,
        COUNT(*) FILTER (WHERE status = 'nao_conforme') as nao_conformes,
        COUNT(*) as total
      FROM inspecoes_equipamentos
      WHERE data_inspecao >= CURRENT_DATE - INTERVAL '90 days'
    `);
    
    const taxaConformidade = conformidade.rows[0].total > 0 
      ? (conformidade.rows[0].conformes / conformidade.rows[0].total * 100).toFixed(1)
      : 0;
    
    res.json({
      equipamentos: stats.rows[0],
      inspecoes: inspecoes.rows[0],
      alertas: alertas.rows[0],
      conformidade: {
        ...conformidade.rows[0],
        taxa_conformidade: parseFloat(taxaConformidade)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas', details: error.message });
  }
});

module.exports = router;
