'use client';
import { useState } from 'react';
import { Box, Typography, Button, TextField, Table, TableHead, TableRow, TableCell, TableBody, Chip, Switch } from '@mui/material';
import Card from '@/components/ui/card';
import { CheckCircle2Icon, AlertCircleIcon, CalendarIcon } from 'lucide-react';

export default function CalendarIntegrationPage() {
  const [connected, setConnected] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [clientId, setClientId] = useState('');
  const [calendarId, setCalendarId] = useState('');

  const [syncConfig, setSyncConfig] = useState({
    viagens: true,
    manutencoes: true,
    vencimentos: true,
    reunioes: true,
    entregas: true,
  });

  const [eventos, setEventos] = useState([
    { id: 1, tipo: 'Viagem', titulo: 'SP → RJ - ABC1234', motorista: 'João Silva', data: '2025-10-29 06:00', duracao: '8h', status: 'Agendado' },
    { id: 2, tipo: 'Manutenção', titulo: 'Preventiva 10k km - DEF5678', mecanico: 'Carlos Souza', data: '2025-10-30 14:00', duracao: '4h', status: 'Agendado' },
    { id: 3, tipo: 'Vencimento', titulo: 'IPVA ABC1234', responsavel: 'Financeiro', data: '2025-11-15 00:00', duracao: '1d', status: 'Pendente' },
  ]);

  const handleConnect = () => {
    if (!clientId || !calendarId) {
      alert('Preencha Client ID e Calendar ID');
      return;
    }
    setConnected(true);
    alert('✅ Conectado ao Google Calendar com sucesso!');
  };

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      alert('✅ Sincronização concluída! 15 eventos criados no Google Calendar.');
    }, 2000);
  };

  return (
    <main style={{ padding: 24, display: 'grid', gap: 16 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <CalendarIcon size={40} color="#4285F4" />
        <Typography variant="h4">Integração Google Calendar</Typography>
        {connected ? <Chip label="Conectado" color="success" icon={<CheckCircle2Icon size={16} />} /> : <Chip label="Desconectado" color="error" icon={<AlertCircleIcon size={16} />} />}
      </Box>

      {/* KPIs */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
        <Card title="Status"><div style={{ fontSize: 28, fontWeight: 700, color: connected ? '#10b981' : '#dc2626' }}>{connected ? 'Ativo' : 'Inativo'}</div></Card>
        <Card title="Eventos Agendados"><div style={{ fontSize: 28, fontWeight: 700 }}>15</div></Card>
        <Card title="Próximas 24h"><div style={{ fontSize: 28, fontWeight: 700, color: '#f59e0b' }}>3</div></Card>
        <Card title="Lembretes Enviados"><div style={{ fontSize: 28, fontWeight: 700 }}>8</div></Card>
      </Box>

      {/* Configuração */}
      <Box sx={{ p: 3, border: '2px solid #4285F4', borderRadius: 2, backgroundColor: '#fff' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>⚙️ Configuração da Integração</Typography>
        <Box sx={{ display: 'grid', gap: 2 }}>
          <TextField 
            label="Google Client ID" 
            value={clientId} 
            onChange={(e) => setClientId(e.target.value)}
            placeholder="xxxxx-yyyyy.apps.googleusercontent.com"
            fullWidth
            helperText="Obtenha em: console.cloud.google.com/apis/credentials"
          />
          <TextField 
            label="Calendar ID" 
            value={calendarId} 
            onChange={(e) => setCalendarId(e.target.value)}
            placeholder="primary ou seu_email@gmail.com"
            fullWidth
            helperText="Use 'primary' para calendário principal"
          />
          <Button 
            variant="contained" 
            onClick={handleConnect} 
            disabled={connected}
            fullWidth
            sx={{ backgroundColor: '#4285F4' }}
          >
            {connected ? '✅ Conectado' : 'Conectar ao Google Calendar'}
          </Button>
        </Box>
      </Box>

      {/* Configuração de Sync */}
      {connected && (
        <Box sx={{ p: 3, border: '1px solid #3b82f6', borderRadius: 2, backgroundColor: '#eff6ff' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>📅 Configuração de Eventos</Typography>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, border: '1px solid #e5e7eb', borderRadius: 1, backgroundColor: '#fff' }}>
              <div>
                <strong>Viagens</strong>
                <div><small>Criar eventos para viagens agendadas (motorista convidado)</small></div>
              </div>
              <Switch checked={syncConfig.viagens} onChange={() => setSyncConfig({...syncConfig, viagens: !syncConfig.viagens})} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, border: '1px solid #e5e7eb', borderRadius: 1, backgroundColor: '#fff' }}>
              <div>
                <strong>Manutenções</strong>
                <div><small>Preventivas e corretivas agendadas (mecânico convidado)</small></div>
              </div>
              <Switch checked={syncConfig.manutencoes} onChange={() => setSyncConfig({...syncConfig, manutencoes: !syncConfig.manutencoes})} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, border: '1px solid #e5e7eb', borderRadius: 1, backgroundColor: '#fff' }}>
              <div>
                <strong>Vencimentos</strong>
                <div><small>IPVA, seguro, CNH, licenciamento (lembrete 7 dias antes)</small></div>
              </div>
              <Switch checked={syncConfig.vencimentos} onChange={() => setSyncConfig({...syncConfig, vencimentos: !syncConfig.vencimentos})} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, border: '1px solid #e5e7eb', borderRadius: 1, backgroundColor: '#fff' }}>
              <div>
                <strong>Reuniões</strong>
                <div><small>Revisão pela direção, auditorias, treinamentos</small></div>
              </div>
              <Switch checked={syncConfig.reunioes} onChange={() => setSyncConfig({...syncConfig, reunioes: !syncConfig.reunioes})} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, border: '1px solid #e5e7eb', borderRadius: 1, backgroundColor: '#fff' }}>
              <div>
                <strong>Entregas</strong>
                <div><small>Janelas de entrega agendadas com cliente</small></div>
              </div>
              <Switch checked={syncConfig.entregas} onChange={() => setSyncConfig({...syncConfig, entregas: !syncConfig.entregas})} />
            </Box>
          </Box>
          <Button 
            variant="contained" 
            fullWidth 
            sx={{ mt: 2, backgroundColor: '#4285F4' }} 
            onClick={handleSync}
            disabled={syncing}
          >
            {syncing ? 'Sincronizando...' : '📅 Sincronizar Agenda'}
          </Button>
        </Box>
      )}

      {/* Próximos Eventos */}
      <Box sx={{ p: 3, border: '1px solid #e5e7eb', borderRadius: 2, backgroundColor: '#fff' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>📆 Próximos Eventos</Typography>
        <Table>
          <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
            <TableRow>
              <TableCell><strong>Tipo</strong></TableCell>
              <TableCell><strong>Título</strong></TableCell>
              <TableCell><strong>Responsável</strong></TableCell>
              <TableCell><strong>Data/Hora</strong></TableCell>
              <TableCell><strong>Duração</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {eventos.map(e => (
              <TableRow key={e.id}>
                <TableCell><Chip label={e.tipo} size="small" color={e.tipo === 'Viagem' ? 'primary' : e.tipo === 'Manutenção' ? 'warning' : 'error'} /></TableCell>
                <TableCell><strong>{e.titulo}</strong></TableCell>
                <TableCell>{e.motorista || e.mecanico || e.responsavel}</TableCell>
                <TableCell>{new Date(e.data).toLocaleString('pt-BR')}</TableCell>
                <TableCell>{e.duracao}</TableCell>
                <TableCell><Chip label={e.status} size="small" color="success" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* Lembretes */}
      {connected && (
        <Box sx={{ p: 3, border: '1px solid #f59e0b', borderRadius: 2, backgroundColor: '#fffbeb' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>🔔 Configuração de Lembretes</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
            <TextField label="Lembrete Viagens" type="number" defaultValue={30} helperText="Minutos antes" />
            <TextField label="Lembrete Manutenções" type="number" defaultValue={60} helperText="Minutos antes" />
            <TextField label="Lembrete Vencimentos" type="number" defaultValue={7} helperText="Dias antes" />
            <TextField label="Lembrete Entregas" type="number" defaultValue={15} helperText="Minutos antes da janela" />
          </Box>
          <Button variant="contained" fullWidth sx={{ mt: 2 }}>Salvar Configurações</Button>
        </Box>
      )}
    </main>
  );
}
