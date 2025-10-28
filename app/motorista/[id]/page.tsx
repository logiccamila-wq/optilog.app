'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Badge,
  Fab,
  InputAdornment
} from '@mui/material';
import {
  ArrowBack,
  PlayArrow,
  Stop,
  Restaurant,
  Hotel,
  Warning,
  LocalGasStation,
  AttachMoney,
  Chat,
  CheckCircle,
  MyLocation,
  PhotoCamera,
  Send,
  Add,
  Receipt
} from '@mui/icons-material';

interface TripDetails {
  id: number;
  trip_number: string;
  customer_name: string;
  vehicle_plate: string;
  origin_city: string;
  destination_city: string;
  cargo_description: string;
  status: string;
  departure_date: string;
  freight_value: number;
  driver_payment: number;
  events: TripEvent[];
  expenses: TripExpense[];
  checklist: TripChecklist | null;
  messages: TripMessage[];
}

interface TripEvent {
  id: number;
  event_type: string;
  event_date: string;
  location: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
}

interface TripExpense {
  id: number;
  expense_type: string;
  amount: number;
  description: string;
  expense_date: string;
  receipt_url?: string;
  approved: boolean;
}

interface TripChecklist {
  id: number;
  items: Record<string, boolean>;
  has_issues: boolean;
  issues_description?: string;
  photos?: string[];
}

interface TripMessage {
  id: number;
  sender: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export default function ViagemPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [trip, setTrip] = useState<TripDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [eventDialog, setEventDialog] = useState(false);
  const [expenseDialog, setExpenseDialog] = useState(false);
  const [checklistDialog, setChecklistDialog] = useState(false);
  const [location, setLocation] = useState<{lat: number, lon: number} | null>(null);

  // Event form
  const [eventType, setEventType] = useState('');
  const [eventNotes, setEventNotes] = useState('');

  // Expense form
  const [expenseType, setExpenseType] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');

  // Checklist
  const [checklistItems, setChecklistItems] = useState({
    'Pneus em bom estado': false,
    'Nível de óleo OK': false,
    'Nível de água OK': false,
    'Freios funcionando': false,
    'Luzes funcionando': false,
    'Retrovisores OK': false,
    'Documentação em dia': false,
    'Extintor de incêndio': false,
    'Triângulo': false,
    'Estepe em bom estado': false,
    'Carga bem amarrada': false,
    'Lona em bom estado': false,
    'Sem vazamentos': false,
    'Tacógrafo funcionando': false,
    'Kit primeiros socorros': false
  });
  const [checklistIssues, setChecklistIssues] = useState('');

  // Chat
  const [chatMessage, setChatMessage] = useState('');
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    loadTrip();
    getCurrentLocation();
  }, [params.id]);

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => console.error('Erro ao obter localização:', error)
      );
    }
  };

  const loadTrip = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/trips/${params.id}`);
      if (!response.ok) throw new Error('Erro ao carregar viagem');
      
      const data = await response.json();
      setTrip(data);
      
      // Count unread messages
      const unread = data.messages?.filter((m: TripMessage) => !m.is_read && m.sender !== 'João Silva').length || 0;
      setUnreadMessages(unread);
      
      // Load checklist if exists
      if (data.checklist?.items) {
        setChecklistItems(data.checklist.items);
        setChecklistIssues(data.checklist.issues_description || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const registerEvent = async () => {
    try {
      getCurrentLocation();
      
      const response = await fetch(`/api/trips/${params.id}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: eventType,
          notes: eventNotes,
          latitude: location?.lat,
          longitude: location?.lon
        })
      });

      if (!response.ok) throw new Error('Erro ao registrar evento');
      
      setEventDialog(false);
      setEventType('');
      setEventNotes('');
      loadTrip();
    } catch (err) {
      alert('Erro ao registrar evento. Tente novamente.');
      console.error(err);
    }
  };

  const registerExpense = async () => {
    try {
      const response = await fetch(`/api/trips/${params.id}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expense_type: expenseType,
          amount: parseFloat(expenseAmount),
          description: expenseDescription
        })
      });

      if (!response.ok) throw new Error('Erro ao registrar despesa');
      
      setExpenseDialog(false);
      setExpenseType('');
      setExpenseAmount('');
      setExpenseDescription('');
      loadTrip();
    } catch (err) {
      alert('Erro ao registrar despesa. Tente novamente.');
      console.error(err);
    }
  };

  const saveChecklist = async () => {
    try {
      const hasIssues = Object.values(checklistItems).some(v => !v) || checklistIssues.length > 0;
      
      const response = await fetch(`/api/trips/${params.id}/checklist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: checklistItems,
          has_issues: hasIssues,
          issues_description: checklistIssues
        })
      });

      if (!response.ok) throw new Error('Erro ao salvar checklist');
      
      setChecklistDialog(false);
      loadTrip();
      
      if (hasIssues) {
        alert('⚠️ Checklist salvo! Os problemas foram enviados para Vlademir e Enio Gomes.');
      }
    } catch (err) {
      alert('Erro ao salvar checklist. Tente novamente.');
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!chatMessage.trim()) return;
    
    try {
      const response = await fetch(`/api/trips/${params.id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: 'João Silva',
          recipient: 'Vlademir',
          message: chatMessage
        })
      });

      if (!response.ok) throw new Error('Erro ao enviar mensagem');
      
      setChatMessage('');
      loadTrip();
    } catch (err) {
      alert('Erro ao enviar mensagem. Tente novamente.');
      console.error(err);
    }
  };

  const eventTypeLabels: Record<string, { label: string, icon: JSX.Element }> = {
    'inicio': { label: 'Início da Viagem', icon: <PlayArrow /> },
    'chegada': { label: 'Chegada no Destino', icon: <CheckCircle /> },
    'espera': { label: 'Aguardando', icon: <Stop /> },
    'descarga': { label: 'Descarregando', icon: <PlayArrow /> },
    'fim': { label: 'Fim da Viagem', icon: <CheckCircle /> },
    'retorno': { label: 'Retorno', icon: <ArrowBack /> },
    'garagem': { label: 'Chegada Garagem', icon: <CheckCircle /> },
    'parada_refeicao': { label: 'Parada Refeição', icon: <Restaurant /> },
    'pernoite': { label: 'Pernoite', icon: <Hotel /> },
    'desvio_rota': { label: 'Desvio de Rota', icon: <Warning /> }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!trip) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Viagem não encontrada</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', pb: 10 }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="inherit" onClick={() => router.back()}>
              <ArrowBack />
            </IconButton>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                {trip.trip_number}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {trip.origin_city} → {trip.destination_city}
              </Typography>
            </Box>
            <Chip 
              label={trip.status.replace('_', ' ').toUpperCase()}
              sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 'bold' }}
              size="small"
            />
          </Box>
        </Container>
      </Box>

      {/* Tabs */}
      <Container maxWidth="md">
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'white' }}>
          <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)} variant="scrollable">
            <Tab label="Eventos" />
            <Tab label="Despesas" />
            <Tab label="Checklist" />
            <Tab label={
              <Badge badgeContent={unreadMessages} color="error">
                Chat
              </Badge>
            } />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ mt: 2 }}>
          {/* EVENTOS */}
          {tabIndex === 0 && (
            <Box>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    📍 Localização Atual
                  </Typography>
                  {location ? (
                    <Typography variant="body2" color="text.secondary">
                      Lat: {location.lat.toFixed(6)}, Lon: {location.lon.toFixed(6)}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Obtendo localização...
                    </Typography>
                  )}
                </CardContent>
              </Card>

              {trip.events?.length > 0 ? (
                <List>
                  {trip.events.map((event) => (
                    <Card key={event.id} sx={{ mb: 1 }}>
                      <ListItem>
                        <ListItemIcon>
                          {eventTypeLabels[event.event_type]?.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={eventTypeLabels[event.event_type]?.label || event.event_type}
                          secondary={
                            <>
                              {new Date(event.event_date).toLocaleString('pt-BR')}
                              {event.location && ` • ${event.location}`}
                              {event.notes && <><br />{event.notes}</>}
                            </>
                          }
                        />
                      </ListItem>
                    </Card>
                  ))}
                </List>
              ) : (
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary">
                      Nenhum evento registrado ainda
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Box>
          )}

          {/* DESPESAS */}
          {tabIndex === 1 && (
            <Box>
              {trip.expenses?.length > 0 ? (
                <List>
                  {trip.expenses.map((expense) => (
                    <Card key={expense.id} sx={{ mb: 1 }}>
                      <ListItem>
                        <ListItemIcon>
                          {expense.expense_type === 'combustivel' ? <LocalGasStation /> : <AttachMoney />}
                        </ListItemIcon>
                        <ListItemText
                          primary={`${expense.expense_type.toUpperCase()} - R$ ${expense.amount.toFixed(2)}`}
                          secondary={
                            <>
                              {expense.description}
                              <br />
                              {new Date(expense.expense_date).toLocaleString('pt-BR')}
                              {expense.approved && ' • ✅ Aprovado'}
                            </>
                          }
                        />
                      </ListItem>
                    </Card>
                  ))}
                  <Card sx={{ bgcolor: 'primary.light', mt: 2 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold">
                        Total: R$ {trip.expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                </List>
              ) : (
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary">
                      Nenhuma despesa registrada ainda
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Box>
          )}

          {/* CHECKLIST */}
          {tabIndex === 2 && (
            <Box>
              {trip.checklist ? (
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      ✅ Checklist Realizado
                    </Typography>
                    <List dense>
                      {Object.entries(trip.checklist.items).map(([item, checked]) => (
                        <ListItem key={item}>
                          <ListItemIcon>
                            <Checkbox checked={checked} disabled />
                          </ListItemIcon>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                    {trip.checklist.has_issues && (
                      <Alert severity="warning" sx={{ mt: 2 }}>
                        <Typography variant="body2" fontWeight="bold">
                          Problemas Reportados:
                        </Typography>
                        <Typography variant="body2">
                          {trip.checklist.issues_description}
                        </Typography>
                        <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                          📧 Enviado para: Vlademir + Enio Gomes
                        </Typography>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <CheckCircle sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Checklist Pré-Viagem
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      Realize a verificação antes de iniciar a viagem
                    </Typography>
                    <Button 
                      variant="contained" 
                      onClick={() => setChecklistDialog(true)}
                      startIcon={<CheckCircle />}
                    >
                      Iniciar Checklist
                    </Button>
                  </CardContent>
                </Card>
              )}
            </Box>
          )}

          {/* CHAT */}
          {tabIndex === 3 && (
            <Box>
              <Card sx={{ mb: 2, maxHeight: '60vh', overflow: 'auto' }}>
                <List>
                  {trip.messages?.length > 0 ? (
                    trip.messages.map((msg) => (
                      <ListItem
                        key={msg.id}
                        sx={{
                          flexDirection: 'column',
                          alignItems: msg.sender === 'João Silva' ? 'flex-end' : 'flex-start'
                        }}
                      >
                        <Box
                          sx={{
                            bgcolor: msg.sender === 'João Silva' ? 'primary.main' : 'grey.200',
                            color: msg.sender === 'João Silva' ? 'white' : 'text.primary',
                            p: 1.5,
                            borderRadius: 2,
                            maxWidth: '70%'
                          }}
                        >
                          <Typography variant="caption" sx={{ opacity: 0.8, display: 'block' }}>
                            {msg.sender}
                          </Typography>
                          <Typography variant="body2">
                            {msg.message}
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5 }}>
                            {new Date(msg.created_at).toLocaleString('pt-BR')}
                          </Typography>
                        </Box>
                      </ListItem>
                    ))
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Chat sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                      <Typography color="text.secondary">
                        Nenhuma mensagem ainda
                      </Typography>
                    </Box>
                  )}
                </List>
              </Card>

              <Card>
                <CardContent>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Digite sua mensagem para Vlademir..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton color="primary" onClick={sendMessage}>
                            <Send />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
      </Container>

      {/* FABs */}
      {tabIndex === 0 && (
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 80, right: 16 }}
          onClick={() => setEventDialog(true)}
        >
          <Add />
        </Fab>
      )}

      {tabIndex === 1 && (
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 80, right: 16 }}
          onClick={() => setExpenseDialog(true)}
        >
          <Add />
        </Fab>
      )}

      {/* Event Dialog */}
      <Dialog open={eventDialog} onClose={() => setEventDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Registrar Evento</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Tipo de Evento</InputLabel>
            <Select value={eventType} onChange={(e) => setEventType(e.target.value)}>
              {Object.entries(eventTypeLabels).map(([key, { label }]) => (
                <MenuItem key={key} value={key}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Observações (opcional)"
            value={eventNotes}
            onChange={(e) => setEventNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
          {location && (
            <Alert severity="info" sx={{ mt: 2 }}>
              📍 Localização GPS será registrada automaticamente
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEventDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={registerEvent} disabled={!eventType}>
            Registrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Expense Dialog */}
      <Dialog open={expenseDialog} onClose={() => setExpenseDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Registrar Despesa</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Tipo de Despesa</InputLabel>
            <Select value={expenseType} onChange={(e) => setExpenseType(e.target.value)}>
              <MenuItem value="combustivel">Combustível</MenuItem>
              <MenuItem value="pedagio">Pedágio</MenuItem>
              <MenuItem value="alimentacao">Alimentação</MenuItem>
              <MenuItem value="estacionamento">Estacionamento</MenuItem>
              <MenuItem value="manutencao">Manutenção</MenuItem>
              <MenuItem value="outros">Outros</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            type="number"
            label="Valor (R$)"
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(e.target.value)}
            sx={{ mt: 2 }}
            InputProps={{
              startAdornment: <InputAdornment position="start">R$</InputAdornment>
            }}
          />
          <TextField
            fullWidth
            label="Descrição"
            value={expenseDescription}
            onChange={(e) => setExpenseDescription(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Alert severity="info" sx={{ mt: 2 }}>
            💡 Tire foto do comprovante e guarde para prestação de contas
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExpenseDialog(false)}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={registerExpense}
            disabled={!expenseType || !expenseAmount}
          >
            Registrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Checklist Dialog */}
      <Dialog open={checklistDialog} onClose={() => setChecklistDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Checklist Pré-Viagem</DialogTitle>
        <DialogContent>
          <List>
            {Object.entries(checklistItems).map(([item, checked]) => (
              <ListItem key={item} button onClick={() => setChecklistItems(prev => ({ ...prev, [item]: !checked }))}>
                <ListItemIcon>
                  <Checkbox checked={checked} />
                </ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Descreva os problemas encontrados (se houver)"
            value={checklistIssues}
            onChange={(e) => setChecklistIssues(e.target.value)}
            sx={{ mt: 2 }}
          />
          {(Object.values(checklistItems).some(v => !v) || checklistIssues) && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              ⚠️ Os problemas serão enviados para Vlademir e Enio Gomes
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChecklistDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={saveChecklist}>
            Salvar Checklist
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
