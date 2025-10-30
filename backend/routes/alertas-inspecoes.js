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

// GET /api/alertas-inspecoes - Listar alertas
router.get('/', async (req, res) => {
  try {
    const { equipamento_id, severidade, resolvido } = req.query;
    
    let query = `
      SELECT 
        a.*,
        e.tipo as equipamento_tipo,
        e.placa as equipamento_placa,
        e.modelo as equipamento_modelo,
        i.tipo_inspecao,
        i.proxima_inspecao
      FROM alertas_inspecoes a
      INNER JOIN equipamentos_frota e ON a.equipamento_id = e.id
      LEFT JOIN inspecoes_equipamentos i ON a.inspecao_id = i.id
    `;
    
    const conditions = [];
    const params = [];
    
    if (equipamento_id) {
      conditions.push(`a.equipamento_id = $${params.length + 1}`);
      params.push(equipamento_id);
    }
    
    if (severidade) {
      conditions.push(`a.severidade = $${params.length + 1}`);
      params.push(severidade);
    }
    
    if (resolvido !== undefined) {
      conditions.push(`a.resolvido = $${params.length + 1}`);
      params.push(resolvido === 'true');
    }
    
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    query += ` ORDER BY 
      CASE a.severidade 
        WHEN 'critico' THEN 1 
        WHEN 'aviso' THEN 2 
        ELSE 3 
      END,
      a.created_at DESC
    `;
    
    const result = await db.query(query, params);
    res.json(result.rows || []);
  } catch (error) {
    console.error('Erro ao buscar alertas:', error);
    res.status(500).json({ error: 'Erro ao buscar alertas', details: error.message });
  }
});

// GET /api/alertas-inspecoes/:id - Buscar alerta por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        a.*,
        e.tipo as equipamento_tipo,
        e.placa as equipamento_placa,
        e.modelo as equipamento_modelo,
        e.fabricante as equipamento_fabricante,
        i.tipo_inspecao,
        i.data_inspecao,
        i.proxima_inspecao,
        i.status as inspecao_status
      FROM alertas_inspecoes a
      INNER JOIN equipamentos_frota e ON a.equipamento_id = e.id
      LEFT JOIN inspecoes_equipamentos i ON a.inspecao_id = i.id
      WHERE a.id = $1
    `;
    
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alerta não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar alerta:', error);
    res.status(500).json({ error: 'Erro ao buscar alerta', details: error.message });
  }
});

// POST /api/alertas-inspecoes - Criar novo alerta
router.post('/', async (req, res) => {
  try {
    const {
      equipamento_id,
      inspecao_id,
      tipo_alerta,
      severidade,
      mensagem,
      notificar_gerentes,
      notificar_diretoria,
      emails_notificados,
      expires_at
    } = req.body;
    
    const query = `
      INSERT INTO alertas_inspecoes (
        equipamento_id, inspecao_id, tipo_alerta, severidade, mensagem,
        notificar_gerentes, notificar_diretoria, emails_notificados, expires_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    const result = await db.query(query, [
      equipamento_id,
      inspecao_id,
      tipo_alerta,
      severidade || 'info',
      mensagem,
      notificar_gerentes !== false,
      notificar_diretoria || false,
      emails_notificados,
      expires_at
    ]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar alerta:', error);
    res.status(500).json({ error: 'Erro ao criar alerta', details: error.message });
  }
});

// PUT /api/alertas-inspecoes/:id/resolver - Resolver alerta
router.put('/:id/resolver', async (req, res) => {
  try {
    const { id } = req.params;
    const { resolvido_por, resolucao_notas } = req.body;
    
    const query = `
      UPDATE alertas_inspecoes 
      SET 
        resolvido = true,
        resolvido_em = NOW(),
        resolvido_por = $1,
        resolucao_notas = $2
      WHERE id = $3
      RETURNING *
    `;
    
    const result = await db.query(query, [resolvido_por, resolucao_notas, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alerta não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao resolver alerta:', error);
    res.status(500).json({ error: 'Erro ao resolver alerta', details: error.message });
  }
});

// PUT /api/alertas-inspecoes/:id/notificar - Marcar como notificado
router.put('/:id/notificar', async (req, res) => {
  try {
    const { id } = req.params;
    const { emails_notificados } = req.body;
    
    const query = `
      UPDATE alertas_inspecoes 
      SET 
        notificado_em = NOW(),
        emails_notificados = $1
      WHERE id = $2
      RETURNING *
    `;
    
    const result = await db.query(query, [emails_notificados, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alerta não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao notificar alerta:', error);
    res.status(500).json({ error: 'Erro ao notificar alerta', details: error.message });
  }
});

// DELETE /api/alertas-inspecoes/:id - Deletar alerta
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'DELETE FROM alertas_inspecoes WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alerta não encontrado' });
    }
    
    res.json({ message: 'Alerta deletado com sucesso', id: result.rows[0].id });
  } catch (error) {
    console.error('Erro ao deletar alerta:', error);
    res.status(500).json({ error: 'Erro ao deletar alerta', details: error.message });
  }
});

// GET /api/alertas-inspecoes/stats/dashboard - Estatísticas de alertas
router.get('/stats/dashboard', async (req, res) => {
  try {
    const stats = await db.query(`
      SELECT 
        COUNT(*) FILTER (WHERE severidade = 'critico' AND resolvido = false) as criticos_ativos,
        COUNT(*) FILTER (WHERE severidade = 'aviso' AND resolvido = false) as avisos_ativos,
        COUNT(*) FILTER (WHERE severidade = 'info' AND resolvido = false) as info_ativos,
        COUNT(*) FILTER (WHERE resolvido = true) as total_resolvidos,
        COUNT(*) FILTER (WHERE resolvido = false) as total_pendentes
      FROM alertas_inspecoes
    `);
    
    const porTipo = await db.query(`
      SELECT 
        tipo_alerta,
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE resolvido = false) as pendentes
      FROM alertas_inspecoes
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY tipo_alerta
      ORDER BY total DESC
    `);
    
    res.json({
      resumo: stats.rows[0],
      por_tipo: porTipo.rows
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas', details: error.message });
  }
});

// GET /api/alertas-inspecoes/equipamento/:equipamento_id - Alertas por equipamento
router.get('/equipamento/:equipamento_id', async (req, res) => {
  try {
    const { equipamento_id } = req.params;
    const { incluir_resolvidos } = req.query;
    
    let query = `
      SELECT 
        a.*,
        i.tipo_inspecao,
        i.data_inspecao,
        i.proxima_inspecao
      FROM alertas_inspecoes a
      LEFT JOIN inspecoes_equipamentos i ON a.inspecao_id = i.id
      WHERE a.equipamento_id = $1
    `;
    
    if (incluir_resolvidos !== 'true') {
      query += ` AND a.resolvido = false`;
    }
    
    query += ` ORDER BY 
      CASE a.severidade 
        WHEN 'critico' THEN 1 
        WHEN 'aviso' THEN 2 
        ELSE 3 
      END,
      a.created_at DESC
    `;
    
    const result = await db.query(query, [equipamento_id]);
    res.json(result.rows || []);
  } catch (error) {
    console.error('Erro ao buscar alertas do equipamento:', error);
    res.status(500).json({ error: 'Erro ao buscar alertas', details: error.message });
  }
});

// GET /api/alertas-inspecoes/pendentes/notificacao - Alertas pendentes de notificação
router.get('/pendentes/notificacao', async (req, res) => {
  try {
    const query = `
      SELECT 
        a.*,
        e.tipo as equipamento_tipo,
        e.placa as equipamento_placa,
        i.tipo_inspecao,
        i.proxima_inspecao
      FROM alertas_inspecoes a
      INNER JOIN equipamentos_frota e ON a.equipamento_id = e.id
      LEFT JOIN inspecoes_equipamentos i ON a.inspecao_id = i.id
      WHERE a.notificado_em IS NULL
        AND a.resolvido = false
      ORDER BY 
        CASE a.severidade 
          WHEN 'critico' THEN 1 
          WHEN 'aviso' THEN 2 
          ELSE 3 
        END,
        a.created_at ASC
    `;
    
    const result = await db.query(query);
    res.json(result.rows || []);
  } catch (error) {
    console.error('Erro ao buscar alertas pendentes:', error);
    res.status(500).json({ error: 'Erro ao buscar alertas pendentes', details: error.message });
  }
});

module.exports = router;
