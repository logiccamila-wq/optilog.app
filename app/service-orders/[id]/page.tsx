'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Fab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  CheckCircle,
  PlayArrow,
  Stop,
  Cancel,
  Add,
  AttachFile,
  PhotoCamera,
  Build,
  Person,
  Timeline,
  ExpandMore,
  Edit,
  Delete,
} from '@mui/icons-material';

interface ServiceOrder {
  id: number;
  number: string;
  vehicle_id: number;
  mechanic_id?: number;
  supervisor_id?: number;
  type: string;
  priority: string;
  status: string;
  description: string;
  created_at: string;
  scheduled_date?: string;
  started_at?: string;
  finished_at?: string;
  approved_at?: string;
  total_cost: number;
  labor_hours?: number;
  labor_cost?: number;
  parts_cost?: number;
  completion_notes?: string;
  quality_check: boolean;
}

interface HistoryEntry {
  id: number;
  from_status: string;
  to_status: string;
  changed_by: number;
  changed_by_name: string;
  notes?: string;
  created_at: string;
}

interface Part {
  id: number;
  part_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

interface Attachment {
  id: number;
  filename: string;
  original_name: string;
  file_size: number;
  file_type: string;
  description?: string;
  created_at: string;
}

export default function ServiceOrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<ServiceOrder | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialogs
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [showPartsDialog, setShowPartsDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  
  // Forms
  const [approveForm, setApproveForm] = useState({ supervisor_id: '', notes: '' });
  const [startForm, setStartForm] = useState({ mechanic_id: '', estimated_hours: '' });
  const [finishForm, setFinishForm] = useState({
    labor_hours: '',
    labor_cost: '',
    completion_notes: '',
    quality_check: false
  });
  const [partsForm, setPartsForm] = useState({
    parts: [{ part_name: '', quantity: 1, unit_price: 0 }]
  });

  useEffect(() => {
    loadOrderData();
  }, [params.id]);

  const loadOrderData = async () => {
    try {
      setLoading(true);
      
      // Carrega dados paralelos
      const [orderRes, historyRes, partsRes, attachmentsRes] = await Promise.all([
        fetch(`/api/service-orders/${params.id}`),
        fetch(`/api/service-orders/${params.id}/history`),
        fetch(`/api/service-orders/${params.id}/parts`),
        fetch(`/api/service-orders/${params.id}/attachments`)
      ]);

      if (orderRes.ok) {
        const [orderData] = await orderRes.json();
        setOrder(orderData);
      }
      
      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setHistory(historyData);
      }
      
      if (partsRes.ok) {
        const partsData = await partsRes.json();
        setParts(partsData);
      }
      
      if (attachmentsRes.ok) {
        const attachmentsData = await attachmentsRes.json();
        setAttachments(attachmentsData);
      }
      
    } catch (error) {
      console.error('Erro ao carregar dados da OS:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      const res = await fetch(`/api/service-orders/${params.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(approveForm)
      });

      if (res.ok) {
        setShowApproveDialog(false);
        loadOrderData();
      }
    } catch (error) {
      console.error('Erro ao aprovar OS:', error);
    }
  };

  const handleStart = async () => {
    try {
      const res = await fetch(`/api/service-orders/${params.id}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(startForm)
      });

      if (res.ok) {
        setShowStartDialog(false);
        loadOrderData();
      }
    } catch (error) {
      console.error('Erro ao iniciar OS:', error);
    }
  };

  const handleFinish = async () => {
    try {
      const res = await fetch(`/api/service-orders/${params.id}/finish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...finishForm,
          mechanic_id: order?.mechanic_id || 1, // TODO: pegar do contexto
          total_cost: (parseFloat(finishForm.labor_cost) || 0) + (order?.parts_cost || 0)
        })
      });

      if (res.ok) {
        setShowFinishDialog(false);
        loadOrderData();
      }
    } catch (error) {
      console.error('Erro ao finalizar OS:', error);
    }
  };

  const handleAddParts = async () => {
    try {
      const res = await fetch(`/api/service-orders/${params.id}/parts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partsForm)
      });

      if (res.ok) {
        setShowPartsDialog(false);
        setPartsForm({ parts: [{ part_name: '', quantity: 1, unit_price: 0 }] });
        loadOrderData();
      }
    } catch (error) {
      console.error('Erro ao adicionar peças:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      aberta: '#f59e0b',
      aprovada: '#3b82f6',
      em_execucao: '#8b5cf6',
      fechada: '#10b981',
      cancelada: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      baixa: '#10b981',
      media: '#f59e0b',
      alta: '#ef4444',
      urgente: '#dc2626',
    };
    return colors[priority] || '#6b7280';
  };

  const getStatusSteps = () => {
    const steps = [
      { label: 'Aberta', status: 'aberta' },
      { label: 'Aprovada', status: 'aprovada' },
      { label: 'Em Execução', status: 'em_execucao' },
      { label: 'Fechada', status: 'fechada' },
    ];

    const currentIndex = steps.findIndex(step => step.status === order?.status);
    return { steps, currentIndex };
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!order) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Ordem de serviço não encontrada</Alert>
      </Box>
    );
  }

  const { steps, currentIndex } = getStatusSteps();

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => router.back()} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 700, flex: 1 }}>
          OS #{order.number}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label={order.status}
            sx={{ bgcolor: getStatusColor(order.status), color: 'white' }}
          />
          <Chip
            label={order.priority}
            sx={{ bgcolor: getPriorityColor(order.priority), color: 'white' }}
          />
        </Box>
      </Box>

      {/* Status Progress */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Status do Workflow
          </Typography>
          <Stepper activeStep={currentIndex} orientation="horizontal">
            {steps.map((step, index) => (
              <Step key={step.label} completed={index < currentIndex}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Informações Principais */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                <Build sx={{ mr: 1, verticalAlign: 'middle' }} />
                Informações da OS
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Veículo</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    ID: {order.vehicle_id}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Tipo</Typography>
                  <Typography variant="body1">{order.type}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Descrição</Typography>
                  <Typography variant="body1">{order.description}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Criado em</Typography>
                  <Typography variant="body1">
                    {new Date(order.created_at).toLocaleString('pt-BR')}
                  </Typography>
                </Grid>
                {order.scheduled_date && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Agendado para</Typography>
                    <Typography variant="body1">
                      {new Date(order.scheduled_date).toLocaleDateString('pt-BR')}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>

          {/* Peças Utilizadas */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Peças Utilizadas</Typography>
                {order.status === 'em_execucao' && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Add />}
                    onClick={() => setShowPartsDialog(true)}
                  >
                    Adicionar Peça
                  </Button>
                )}
              </Box>
              
              {parts.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Nenhuma peça adicionada ainda
                </Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Peça</TableCell>
                        <TableCell align="center">Qtd</TableCell>
                        <TableCell align="right">Valor Unit.</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {parts.map((part) => (
                        <TableRow key={part.id}>
                          <TableCell>{part.part_name}</TableCell>
                          <TableCell align="center">{part.quantity}</TableCell>
                          <TableCell align="right">R$ {part.unit_price.toFixed(2)}</TableCell>
                          <TableCell align="right">R$ {part.total_price.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar com Ações e Anexos */}
        <Grid item xs={12} md={4}>
          {/* Actions Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Ações</Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {order.status === 'aberta' && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CheckCircle />}
                    onClick={() => setShowApproveDialog(true)}
                  >
                    Aprovar OS
                  </Button>
                )}
                
                {order.status === 'aprovada' && (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<PlayArrow />}
                    onClick={() => setShowStartDialog(true)}
                  >
                    Iniciar Execução
                  </Button>
                )}
                
                {order.status === 'em_execucao' && (
                  <Button
                    variant="contained"
                    color="warning"
                    startIcon={<Stop />}
                    onClick={() => setShowFinishDialog(true)}
                  >
                    Finalizar OS
                  </Button>
                )}
                
                <Button
                  variant="outlined"
                  startIcon={<AttachFile />}
                  onClick={() => setShowUploadDialog(true)}
                >
                  Anexar Arquivo
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Resumo Financeiro */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Resumo Financeiro</Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Mão de obra:</Typography>
                  <Typography variant="body2">
                    R$ {(order.labor_cost || 0).toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Peças:</Typography>
                  <Typography variant="body2">
                    R$ {(order.parts_cost || 0).toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', borderTop: 1, pt: 1, mt: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>Total:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    R$ {order.total_cost.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Anexos */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Anexos</Typography>
              
              {attachments.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Nenhum anexo ainda
                </Typography>
              ) : (
                <List dense>
                  {attachments.map((attachment) => (
                    <ListItem key={attachment.id} divider>
                      <ListItemIcon>
                        {attachment.file_type === 'photo' ? <PhotoCamera /> : <AttachFile />}
                      </ListItemIcon>
                      <ListItemText
                        primary={attachment.original_name}
                        secondary={`${(attachment.file_size / 1024).toFixed(1)} KB`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Histórico */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            <Timeline sx={{ mr: 1, verticalAlign: 'middle' }} />
            Histórico
          </Typography>
          
          {history.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Nenhum histórico disponível
            </Typography>
          ) : (
            <List>
              {history.map((entry) => (
                <ListItem key={entry.id} divider>
                  <ListItemIcon>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      <Person />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={`${entry.from_status} → ${entry.to_status}`}
                    secondary={
                      <Box>
                        <Typography variant="caption">
                          por {entry.changed_by_name || 'Usuário'} • 
                          {new Date(entry.created_at).toLocaleString('pt-BR')}
                        </Typography>
                        {entry.notes && (
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {entry.notes}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      {/* Aprovar Dialog */}
      <Dialog open={showApproveDialog} onClose={() => setShowApproveDialog(false)}>
        <DialogTitle>Aprovar Ordem de Serviço</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="ID do Supervisor"
            type="number"
            fullWidth
            value={approveForm.supervisor_id}
            onChange={(e) => setApproveForm({...approveForm, supervisor_id: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Observações"
            multiline
            rows={3}
            fullWidth
            value={approveForm.notes}
            onChange={(e) => setApproveForm({...approveForm, notes: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowApproveDialog(false)}>Cancelar</Button>
          <Button onClick={handleApprove} variant="contained">Aprovar</Button>
        </DialogActions>
      </Dialog>

      {/* Iniciar Dialog */}
      <Dialog open={showStartDialog} onClose={() => setShowStartDialog(false)}>
        <DialogTitle>Iniciar Execução</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="ID do Mecânico"
            type="number"
            fullWidth
            value={startForm.mechanic_id}
            onChange={(e) => setStartForm({...startForm, mechanic_id: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Horas Estimadas"
            type="number"
            fullWidth
            value={startForm.estimated_hours}
            onChange={(e) => setStartForm({...startForm, estimated_hours: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStartDialog(false)}>Cancelar</Button>
          <Button onClick={handleStart} variant="contained">Iniciar</Button>
        </DialogActions>
      </Dialog>

      {/* Finalizar Dialog */}
      <Dialog open={showFinishDialog} onClose={() => setShowFinishDialog(false)}>
        <DialogTitle>Finalizar Ordem de Serviço</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Horas Trabalhadas"
            type="number"
            step="0.5"
            fullWidth
            required
            value={finishForm.labor_hours}
            onChange={(e) => setFinishForm({...finishForm, labor_hours: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Custo Mão de Obra (R$)"
            type="number"
            step="0.01"
            fullWidth
            value={finishForm.labor_cost}
            onChange={(e) => setFinishForm({...finishForm, labor_cost: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Observações de Conclusão"
            multiline
            rows={3}
            fullWidth
            value={finishForm.completion_notes}
            onChange={(e) => setFinishForm({...finishForm, completion_notes: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFinishDialog(false)}>Cancelar</Button>
          <Button onClick={handleFinish} variant="contained">Finalizar</Button>
        </DialogActions>
      </Dialog>

      {/* Peças Dialog */}
      <Dialog open={showPartsDialog} onClose={() => setShowPartsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Adicionar Peças</DialogTitle>
        <DialogContent>
          {partsForm.parts.map((part, index) => (
            <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={5}>
                <TextField
                  label="Nome da Peça"
                  fullWidth
                  value={part.part_name}
                  onChange={(e) => {
                    const newParts = [...partsForm.parts];
                    newParts[index].part_name = e.target.value;
                    setPartsForm({...partsForm, parts: newParts});
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Quantidade"
                  type="number"
                  fullWidth
                  value={part.quantity}
                  onChange={(e) => {
                    const newParts = [...partsForm.parts];
                    newParts[index].quantity = parseInt(e.target.value) || 1;
                    setPartsForm({...partsForm, parts: newParts});
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Preço Unit."
                  type="number"
                  step="0.01"
                  fullWidth
                  value={part.unit_price}
                  onChange={(e) => {
                    const newParts = [...partsForm.parts];
                    newParts[index].unit_price = parseFloat(e.target.value) || 0;
                    setPartsForm({...partsForm, parts: newParts});
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={1}>
                {partsForm.parts.length > 1 && (
                  <IconButton
                    onClick={() => {
                      const newParts = partsForm.parts.filter((_, i) => i !== index);
                      setPartsForm({...partsForm, parts: newParts});
                    }}
                  >
                    <Delete />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}
          
          <Button
            startIcon={<Add />}
            onClick={() => {
              setPartsForm({
                ...partsForm,
                parts: [...partsForm.parts, { part_name: '', quantity: 1, unit_price: 0 }]
              });
            }}
          >
            Adicionar Outra Peça
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPartsDialog(false)}>Cancelar</Button>
          <Button onClick={handleAddParts} variant="contained">Salvar Peças</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}