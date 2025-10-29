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

// GET /api/inspecoes - Listar inspeções
router.get('/', async (req, res) => {
  try {
    const { equipamento_id, status, tipo_inspecao } = req.query;
    
    let query = `
      SELECT 
        i.*,
        e.tipo as equipamento_tipo,
        e.placa as equipamento_placa,
        e.modelo as equipamento_modelo
      FROM inspecoes_equipamentos i
      INNER JOIN equipamentos_frota e ON i.equipamento_id = e.id
    `;
    
    const conditions = [];
    const params = [];
    
    if (equipamento_id) {
      conditions.push(`i.equipamento_id = $${params.length + 1}`);
      params.push(equipamento_id);
    }
    
    if (status) {
      conditions.push(`i.status = $${params.length + 1}`);
      params.push(status);
    }
    
    if (tipo_inspecao) {
      conditions.push(`i.tipo_inspecao = $${params.length + 1}`);
      params.push(tipo_inspecao);
    }
    
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    query += ` ORDER BY i.data_inspecao DESC`;
    
    const result = await db.query(query, params);
    res.json(result.rows || []);
  } catch (error) {
    console.error('Erro ao buscar inspeções:', error);
    res.status(500).json({ error: 'Erro ao buscar inspeções', details: error.message });
  }
});

// GET /api/inspecoes/:id - Buscar inspeção por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        i.*,
        e.tipo as equipamento_tipo,
        e.placa as equipamento_placa,
        e.modelo as equipamento_modelo,
        e.fabricante as equipamento_fabricante
      FROM inspecoes_equipamentos i
      INNER JOIN equipamentos_frota e ON i.equipamento_id = e.id
      WHERE i.id = $1
    `;
    
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inspeção não encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar inspeção:', error);
    res.status(500).json({ error: 'Erro ao buscar inspeção', details: error.message });
  }
});

// POST /api/inspecoes - Criar nova inspeção
router.post('/', async (req, res) => {
  try {
    const {
      equipamento_id,
      tipo_inspecao,
      data_inspecao,
      proxima_inspecao,
      realizada_por,
      realizada_por_nome,
      status,
      observacoes,
      itens_verificados,
      fotos,
      laudo_url
    } = req.body;
    
    // Calcular não conformidades
    let nao_conformidades = 0;
    let nao_conformidades_criticas = 0;
    
    if (itens_verificados) {
      Object.values(itens_verificados).forEach(item => {
        if (item.status === 'nao_conforme') {
          nao_conformidades++;
          nao_conformidades_criticas++;
        } else if (item.status === 'atencao') {
          nao_conformidades++;
        }
      });
    }
    
    // Determinar status baseado nas não conformidades
    let finalStatus = status;
    if (!finalStatus) {
      if (nao_conformidades_criticas > 0) {
        finalStatus = 'nao_conforme';
      } else if (nao_conformidades > 0) {
        finalStatus = 'nao_conforme';
      } else {
        finalStatus = 'conforme';
      }
    }
    
    const query = `
      INSERT INTO inspecoes_equipamentos (
        equipamento_id, tipo_inspecao, data_inspecao, proxima_inspecao,
        realizada_por, realizada_por_nome, status, observacoes,
        itens_verificados, nao_conformidades, nao_conformidades_criticas,
        fotos, laudo_url
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;
    
    const result = await db.query(query, [
      equipamento_id,
      tipo_inspecao,
      data_inspecao || new Date(),
      proxima_inspecao,
      realizada_por,
      realizada_por_nome,
      finalStatus,
      observacoes,
      JSON.stringify(itens_verificados),
      nao_conformidades,
      nao_conformidades_criticas,
      fotos,
      laudo_url
    ]);
    
    // Criar alertas se necessário
    if (nao_conformidades_criticas > 0) {
      await db.query(`
        INSERT INTO alertas_inspecoes (
          equipamento_id, inspecao_id, tipo_alerta, severidade, mensagem,
          notificar_gerentes, notificar_diretoria
        )
        SELECT 
          $1, $2, 'nao_conforme_critica', 'critico',
          'CRÍTICO: ' || $3 || ' não conformidades críticas detectadas na inspeção',
          true, true
      `, [equipamento_id, result.rows[0].id, nao_conformidades_criticas]);
    }
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar inspeção:', error);
    res.status(500).json({ error: 'Erro ao criar inspeção', details: error.message });
  }
});

// PUT /api/inspecoes/:id - Atualizar inspeção
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    
    const allowedFields = [
      'tipo_inspecao', 'data_inspecao', 'proxima_inspecao', 'realizada_por',
      'realizada_por_nome', 'status', 'observacoes', 'itens_verificados',
      'nao_conformidades', 'nao_conformidades_criticas', 'fotos', 'laudo_url'
    ];
    
    const updates = [];
    const values = [];
    let paramIndex = 1;
    
    Object.keys(fields).forEach(key => {
      if (allowedFields.includes(key)) {
        if (key === 'itens_verificados' && typeof fields[key] === 'object') {
          updates.push(`${key} = $${paramIndex}`);
          values.push(JSON.stringify(fields[key]));
        } else {
          updates.push(`${key} = $${paramIndex}`);
          values.push(fields[key]);
        }
        paramIndex++;
      }
    });
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'Nenhum campo válido para atualizar' });
    }
    
    values.push(id);
    const query = `
      UPDATE inspecoes_equipamentos 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    const result = await db.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inspeção não encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar inspeção:', error);
    res.status(500).json({ error: 'Erro ao atualizar inspeção', details: error.message });
  }
});

// DELETE /api/inspecoes/:id - Deletar inspeção
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'DELETE FROM inspecoes_equipamentos WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inspeção não encontrada' });
    }
    
    res.json({ message: 'Inspeção deletada com sucesso', id: result.rows[0].id });
  } catch (error) {
    console.error('Erro ao deletar inspeção:', error);
    res.status(500).json({ error: 'Erro ao deletar inspeção', details: error.message });
  }
});

// GET /api/inspecoes/equipamento/:equipamento_id/historico - Histórico de inspeções
router.get('/equipamento/:equipamento_id/historico', async (req, res) => {
  try {
    const { equipamento_id } = req.params;
    
    const query = `
      SELECT 
        i.*,
        COUNT(a.id) as alertas_gerados
      FROM inspecoes_equipamentos i
      LEFT JOIN alertas_inspecoes a ON i.id = a.inspecao_id AND a.resolvido = false
      WHERE i.equipamento_id = $1
      GROUP BY i.id
      ORDER BY i.data_inspecao DESC
    `;
    
    const result = await db.query(query, [equipamento_id]);
    res.json(result.rows || []);
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({ error: 'Erro ao buscar histórico', details: error.message });
  }
});

// POST /api/inspecoes/check-vencimentos - Verificar inspeções vencidas e criar alertas
router.post('/check-vencimentos', async (req, res) => {
  try {
    await db.query('SELECT check_inspecoes_vencidas()');
    res.json({ message: 'Verificação de vencimentos executada com sucesso' });
  } catch (error) {
    console.error('Erro ao verificar vencimentos:', error);
    res.status(500).json({ error: 'Erro ao verificar vencimentos', details: error.message });
  }
});

module.exports = router;
