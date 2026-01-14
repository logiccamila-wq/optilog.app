'use client';
import { useState } from 'react';
import { Box, Typography, Button, TextField, Table, TableHead, TableRow, TableCell, TableBody, Chip, Switch } from '@mui/material';
import Card from '@/components/ui/card';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function NotionIntegrationPage() {
  const [connected, setConnected] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [databaseId, setDatabaseId] = useState('');

  const [syncConfig, setSyncConfig] = useState({
    tarefas: true,
    projetos: true,
    documentos: true,
    manutencoes: true,
    viagens: true,
    financeiro: false,
  });

  const [syncHistory, setSyncHistory] = useState([
    { id: 1, tipo: 'Tarefas', timestamp: '2025-10-28 09:15:32', status: 'Sucesso', items: 12 },
    { id: 2, tipo: 'Viagens', timestamp: '2025-10-28 08:00:15', status: 'Sucesso', items: 5 },
    { id: 3, tipo: 'Manutenções', timestamp: '2025-10-27 18:45:00', status: 'Erro', items: 0 },
  ]);

  const handleConnect = () => {
    if (!apiKey || !databaseId) {
      alert('Preencha API Key e Database ID');
      return;
    }
    setConnected(true);
    alert('✅ Conectado ao Notion com sucesso!');
  };

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      alert('✅ Sincronização concluída!');
      setSyncHistory([
        { id: Date.now(), tipo: 'Sync Manual', timestamp: new Date().toLocaleString('pt-BR'), status: 'Sucesso', items: 28 },
        ...syncHistory
      ]);
    }, 2000);
  };

  return (
    <main style={{ padding: 24, display: 'grid', gap: 16 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000'%3E%3Cpath d='M4 4h16v16H4z'/%3E%3C/svg%3E" alt="Notion" style={{ width: 40, height: 40 }} />
        <Typography variant="h4">Integração Notion</Typography>
        {connected ? <Chip label="Conectado" color="success" icon={<CheckCircle2 size={16} />} /> : <Chip label="Desconectado" color="error" icon={<AlertCircle size={16} />} />}
      </Box>

      {/* KPIs */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
        <Card title="Status"><div style={{ fontSize: 28, fontWeight: 700, color: connected ? '#10b981' : '#dc2626' }}>{connected ? 'Ativo' : 'Inativo'}</div></Card>
        <Card title="Última Sync"><div style={{ fontSize: 20, fontWeight: 700 }}>09:15:32</div></Card>
        <Card title="Itens Sincronizados"><div style={{ fontSize: 28, fontWeight: 700 }}>28</div></Card>
        <Card title="Sync/Dia"><div style={{ fontSize: 28, fontWeight: 700 }}>12</div></Card>
      </Box>

      {/* Configuração */}
      <Box sx={{ p: 3, border: '2px solid #000', borderRadius: 2, backgroundColor: '#fff' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>⚙️ Configuração da Integração</Typography>
        <Box sx={{ display: 'grid', gap: 2 }}>
          <TextField 
            label="Notion API Key (Integration Token)" 
            value={apiKey} 
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="secret_xxxxxxxxxxxxxxxxxxxxxxxxxx"
            type="password"
            fullWidth
            helperText="Obtenha em: notion.so/my-integrations"
          />
          <TextField 
            label="Database ID" 
            value={databaseId} 
            onChange={(e) => setDatabaseId(e.target.value)}
            placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            fullWidth
            helperText="ID do database do Notion para sincronização"
          />
          <Button 
            variant="contained" 
            onClick={handleConnect} 
            disabled={connected}
            fullWidth
          >
            {connected ? '✅ Conectado' : 'Conectar ao Notion'}
          </Button>
        </Box>
      </Box>

      {/* Configuração de Sync */}
      {connected && (
        <Box sx={{ p: 3, border: '1px solid #3b82f6', borderRadius: 2, backgroundColor: '#eff6ff' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>🔄 Configuração de Sincronização</Typography>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, border: '1px solid #e5e7eb', borderRadius: 1, backgroundColor: '#fff' }}>
              <div>
                <strong>Tarefas</strong>
                <div><small>Sincronizar tarefas do TMS com Notion</small></div>
              </div>
              <Switch checked={syncConfig.tarefas} onChange={() => setSyncConfig({...syncConfig, tarefas: !syncConfig.tarefas})} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, border: '1px solid #e5e7eb', borderRadius: 1, backgroundColor: '#fff' }}>
              <div>
                <strong>Projetos</strong>
                <div><small>Sincronizar projetos e entregas</small></div>
              </div>
              <Switch checked={syncConfig.projetos} onChange={() => setSyncConfig({...syncConfig, projetos: !syncConfig.projetos})} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, border: '1px solid #e5e7eb', borderRadius: 1, backgroundColor: '#fff' }}>
              <div>
                <strong>Documentos</strong>
                <div><small>Anexar CT-e, NF-e, PoD no Notion</small></div>
              </div>
              <Switch checked={syncConfig.documentos} onChange={() => setSyncConfig({...syncConfig, documentos: !syncConfig.documentos})} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, border: '1px solid #e5e7eb', borderRadius: 1, backgroundColor: '#fff' }}>
              <div>
                <strong>Manutenções</strong>
                <div><small>Ordens de serviço e preventivas</small></div>
              </div>
              <Switch checked={syncConfig.manutencoes} onChange={() => setSyncConfig({...syncConfig, manutencoes: !syncConfig.manutencoes})} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, border: '1px solid #e5e7eb', borderRadius: 1, backgroundColor: '#fff' }}>
              <div>
                <strong>Viagens</strong>
                <div><small>Agenda de viagens e entregas</small></div>
              </div>
              <Switch checked={syncConfig.viagens} onChange={() => setSyncConfig({...syncConfig, viagens: !syncConfig.viagens})} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, border: '1px solid #e5e7eb', borderRadius: 1, backgroundColor: '#fff' }}>
              <div>
                <strong>Financeiro</strong>
                <div><small>Faturamento e contas a receber</small></div>
              </div>
              <Switch checked={syncConfig.financeiro} onChange={() => setSyncConfig({...syncConfig, financeiro: !syncConfig.financeiro})} />
            </Box>
          </Box>
          <Button 
            variant="contained" 
            fullWidth 
            sx={{ mt: 2 }} 
            onClick={handleSync}
            disabled={syncing}
            startIcon={syncing ? <RefreshCw className="animate-spin" /> : null}
          >
            {syncing ? 'Sincronizando...' : '🔄 Sincronizar Agora'}
          </Button>
        </Box>
      )}

      {/* Histórico */}
      <Box sx={{ p: 3, border: '1px solid #e5e7eb', borderRadius: 2, backgroundColor: '#fff' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>📜 Histórico de Sincronização</Typography>
        <Table>
          <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
            <TableRow>
              <TableCell><strong>Tipo</strong></TableCell>
              <TableCell><strong>Data/Hora</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Itens</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {syncHistory.map(s => (
              <TableRow key={s.id}>
                <TableCell>{s.tipo}</TableCell>
                <TableCell>{s.timestamp}</TableCell>
                <TableCell><Chip label={s.status} size="small" color={s.status === 'Sucesso' ? 'success' : 'error'} /></TableCell>
                <TableCell>{s.items}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* Webhook URL */}
      {connected && (
        <Box sx={{ p: 3, border: '1px solid #10b981', borderRadius: 2, backgroundColor: '#f0fdf4' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>🔗 Webhook Bidirecional</Typography>
          <TextField 
            label="Webhook URL (Cole no Notion)" 
            value="https://optilog.app/api/webhooks/notion"
            fullWidth
            InputProps={{ readOnly: true }}
            helperText="Configure este webhook no Notion para sincronização automática em tempo real"
          />
        </Box>
      )}
    </main>
  );
}
