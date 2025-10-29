'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Alert,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Add,
  CheckCircle,
  Warning,
  Error,
  ExpandMore,
  Visibility,
  Edit,
  CloudUpload
} from '@mui/icons-material';

interface Equipamento {
  id: number;
  tipo: string;
  placa: string;
  modelo: string;
  status: string;
  ultima_inspecao?: string;
  proxima_inspecao?: string;
  alertas_ativos?: number;
}

interface Inspecao {
  id: number;
  equipamento_id: number;
  equipamento_tipo: string;
  equipamento_placa: string;
  tipo_inspecao: string;
  data_inspecao: string;
  proxima_inspecao?: string;
  status: string;
  nao_conformidades: number;
  nao_conformidades_criticas: number;
  realizada_por_nome?: string;
}

export default function InspecoesPage() {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [inspecoes, setInspecoes] = useState<Inspecao[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedInspecao, setSelectedInspecao] = useState<Inspecao | null>(null);

  const [form, setForm] = useState({
    equipamento_id: '',
    tipo_inspecao: 'preventiva',
    data_inspecao: new Date().toISOString().split('T')[0],
    proxima_inspecao: '',
    realizada_por_nome: '',
    observacoes: '',
    itens_verificados: {
      pneus: { status: 'ok', observacao: '' },
      freios: { status: 'ok', observacao: '' },
      suspensao: { status: 'ok', observacao: '' },
      sistema_eletrico: { status: 'ok', observacao: '' },
      estrutura_chassi: { status: 'ok', observacao: '' },
      engate: { status: 'ok', observacao: '' },
      portas_travas: { status: 'ok', observacao: '' }
    }
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [equipRes, inspecRes] = await Promise.all([
        fetch('/api/equipamentos?status=ativo'),
        fetch('/api/inspecoes')
      ]);

      if (equipRes.ok) {
        const data = await equipRes.json();
        setEquipamentos(data);
      }

      if (inspecRes.ok) {
        const data = await inspecRes.json();
        setInspecoes(data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/inspecoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setDialogOpen(false);
        loadData();
        resetForm();
      } else {
        const error = await res.json();
        alert('Erro: ' + (error.message || 'Erro ao criar inspeção'));
      }
    } catch (error) {
      console.error('Erro ao criar inspeção:', error);
      alert('Erro ao criar inspeção');
    }
  };

  const resetForm = () => {
    setForm({
      equipamento_id: '',
      tipo_inspecao: 'preventiva',
      data_inspecao: new Date().toISOString().split('T')[0],
      proxima_inspecao: '',
      realizada_por_nome: '',
      observacoes: '',
      itens_verificados: {
        pneus: { status: 'ok', observacao: '' },
        freios: { status: 'ok', observacao: '' },
        suspensao: { status: 'ok', observacao: '' },
        sistema_eletrico: { status: 'ok', observacao: '' },
        estrutura_chassi: { status: 'ok', observacao: '' },
        engate: { status: 'ok', observacao: '' },
        portas_travas: { status: 'ok', observacao: '' }
      }
    });
  };

  const handleViewInspecao = (inspecao: Inspecao) => {
    setSelectedInspecao(inspecao);
    setViewDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'conforme': return 'success';
      case 'nao_conforme': return 'error';
      default: return 'warning';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'conforme': return <CheckCircle />;
      case 'nao_conforme': return <Error />;
      default: return <Warning />;
    }
  };

  const updateItemStatus = (item: string, field: 'status' | 'observacao', value: string) => {
    setForm({
      ...form,
      itens_verificados: {
        ...form.itens_verificados,
        [item]: {
          ...form.itens_verificados[item as keyof typeof form.itens_verificados],
          [field]: value
        }
      }
    });
  };

  // Estatísticas
  const stats = {
    total: inspecoes.length,
    conformes: inspecoes.filter(i => i.status === 'conforme').length,
    nao_conformes: inspecoes.filter(i => i.status === 'nao_conforme').length,
    criticas: inspecoes.reduce((sum, i) => sum + (i.nao_conformidades_criticas || 0), 0)
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Inspeções de Equipamentos
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<CloudUpload />}
            sx={{ mr: 2 }}
          >
            Importar Google Drive
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setDialogOpen(true)}
          >
            Nova Inspeção
          </Button>
        </Box>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* KPIs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle color="info" />
                <Typography variant="h6">{stats.total}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total de Inspeções
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle color="success" />
                <Typography variant="h6">{stats.conformes}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Conformes
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Warning color="error" />
                <Typography variant="h6">{stats.nao_conformes}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Não Conformes
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Error color="error" />
                <Typography variant="h6">{stats.criticas}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Não Conformidades Críticas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabela de Inspeções */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Equipamento</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Próxima</TableCell>
              <TableCell>Realizada Por</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Não Conformidades</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inspecoes.map((inspecao) => (
              <TableRow key={inspecao.id} hover>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {inspecao.equipamento_placa}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {inspecao.equipamento_tipo}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={inspecao.tipo_inspecao} size="small" />
                </TableCell>
                <TableCell>
                  {new Date(inspecao.data_inspecao).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  {inspecao.proxima_inspecao
                    ? new Date(inspecao.proxima_inspecao).toLocaleDateString('pt-BR')
                    : '-'}
                </TableCell>
                <TableCell>{inspecao.realizada_por_nome || '-'}</TableCell>
                <TableCell>
                  <Chip
                    icon={getStatusIcon(inspecao.status)}
                    label={inspecao.status}
                    color={getStatusColor(inspecao.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {inspecao.nao_conformidades > 0 && (
                      <Chip
                        label={inspecao.nao_conformidades}
                        size="small"
                        color="warning"
                      />
                    )}
                    {inspecao.nao_conformidades_criticas > 0 && (
                      <Chip
                        label={`${inspecao.nao_conformidades_criticas} críticas`}
                        size="small"
                        color="error"
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleViewInspecao(inspecao)}
                  >
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog: Nova Inspeção */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Nova Inspeção</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              select
              label="Equipamento"
              value={form.equipamento_id}
              onChange={(e) => setForm({ ...form, equipamento_id: e.target.value })}
              fullWidth
            >
              {equipamentos.map((eq) => (
                <MenuItem key={eq.id} value={eq.id}>
                  {eq.placa} - {eq.tipo} - {eq.modelo}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Tipo de Inspeção"
              value={form.tipo_inspecao}
              onChange={(e) => setForm({ ...form, tipo_inspecao: e.target.value })}
              fullWidth
            >
              <MenuItem value="preventiva">Preventiva</MenuItem>
              <MenuItem value="periodica">Periódica</MenuItem>
              <MenuItem value="anual">Anual</MenuItem>
              <MenuItem value="pre_viagem">Pré-viagem</MenuItem>
            </TextField>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Data da Inspeção"
                  type="date"
                  value={form.data_inspecao}
                  onChange={(e) => setForm({ ...form, data_inspecao: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Próxima Inspeção"
                  type="date"
                  value={form.proxima_inspecao}
                  onChange={(e) => setForm({ ...form, proxima_inspecao: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
            </Grid>

            <TextField
              label="Realizada Por"
              value={form.realizada_por_nome}
              onChange={(e) => setForm({ ...form, realizada_por_nome: e.target.value })}
              fullWidth
            />

            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 600 }}>
              Itens Verificados
            </Typography>

            {Object.keys(form.itens_verificados).map((item) => (
              <Accordion key={item}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>{item.replace(/_/g, ' ').toUpperCase()}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      select
                      label="Status"
                      value={form.itens_verificados[item as keyof typeof form.itens_verificados].status}
                      onChange={(e) => updateItemStatus(item, 'status', e.target.value)}
                      fullWidth
                    >
                      <MenuItem value="ok">OK</MenuItem>
                      <MenuItem value="atencao">Atenção</MenuItem>
                      <MenuItem value="nao_conforme">Não Conforme</MenuItem>
                    </TextField>
                    <TextField
                      label="Observação"
                      value={form.itens_verificados[item as keyof typeof form.itens_verificados].observacao}
                      onChange={(e) => updateItemStatus(item, 'observacao', e.target.value)}
                      multiline
                      rows={2}
                      fullWidth
                    />
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}

            <TextField
              label="Observações Gerais"
              value={form.observacoes}
              onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Salvar Inspeção
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Visualizar Inspeção */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Detalhes da Inspeção</DialogTitle>
        <DialogContent>
          {selectedInspecao && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <Alert severity={selectedInspecao.status === 'conforme' ? 'success' : 'error'}>
                Status: {selectedInspecao.status}
              </Alert>
              <Typography><strong>Equipamento:</strong> {selectedInspecao.equipamento_placa}</Typography>
              <Typography><strong>Tipo:</strong> {selectedInspecao.tipo_inspecao}</Typography>
              <Typography>
                <strong>Data:</strong> {new Date(selectedInspecao.data_inspecao).toLocaleDateString('pt-BR')}
              </Typography>
              <Typography>
                <strong>Realizada por:</strong> {selectedInspecao.realizada_por_nome || '-'}
              </Typography>
              <Typography>
                <strong>Não Conformidades:</strong> {selectedInspecao.nao_conformidades} 
                {selectedInspecao.nao_conformidades_criticas > 0 && 
                  ` (${selectedInspecao.nao_conformidades_criticas} críticas)`}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
