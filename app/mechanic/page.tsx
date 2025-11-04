'use client';
import { Box, Container, Typography, Card, CardContent, Grid, Button, Chip } from '@mui/material';
import { Build, Assignment, Inventory, CheckCircle } from '@mui/icons-material';

export default function MechanicPage() {
  const stats = {
    osAbertas: 5,
    osEmAndamento: 2,
    osConcluidas: 18,
    pecasSolicitadas: 3
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', pb: 4 }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', color: 'white', p: 2 }}>
        <Container maxWidth="md">
          <Typography variant="h5" fontWeight="bold">🔧 Portal do Mecânico</Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>Bem-vindo ao seu portal de manutenção</Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ mt: 3 }}>
        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Assignment sx={{ fontSize: 40, color: 'warning.main' }} />
                <Typography variant="h4" fontWeight="bold">{stats.osAbertas}</Typography>
                <Typography variant="body2" color="text.secondary">OS Abertas</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Build sx={{ fontSize: 40, color: 'info.main' }} />
                <Typography variant="h4" fontWeight="bold">{stats.osEmAndamento}</Typography>
                <Typography variant="body2" color="text.secondary">Em Andamento</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <CheckCircle sx={{ fontSize: 40, color: 'success.main' }} />
                <Typography variant="h4" fontWeight="bold">{stats.osConcluidas}</Typography>
                <Typography variant="body2" color="text.secondary">Concluídas</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Inventory sx={{ fontSize: 40, color: 'error.main' }} />
                <Typography variant="h4" fontWeight="bold">{stats.pecasSolicitadas}</Typography>
                <Typography variant="body2" color="text.secondary">Peças Pendentes</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Ordens de Serviço */}
        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>🔧 Ordens de Serviço Pendentes</Typography>
        
        {[
          { id: 'OS-001', veiculo: 'ABC-1234', tipo: 'Preventiva', prioridade: 'Alta' },
          { id: 'OS-002', veiculo: 'XYZ-9876', tipo: 'Corretiva', prioridade: 'Média' },
          { id: 'OS-003', veiculo: 'QWE-5555', tipo: 'Preventiva', prioridade: 'Baixa' }
        ].map((os) => (
          <Card key={os.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight="bold">{os.id}</Typography>
                  <Typography variant="body2" color="text.secondary">Veículo: {os.veiculo}</Typography>
                </Box>
                <Chip 
                  label={os.prioridade}
                  color={os.prioridade === 'Alta' ? 'error' : os.prioridade === 'Média' ? 'warning' : 'default'}
                  size="small"
                />
              </Box>
              <Typography variant="body2" sx={{ mb: 2 }}>📋 Tipo: <strong>{os.tipo}</strong></Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" size="small" sx={{ flex: 1 }}>Iniciar OS</Button>
                <Button variant="outlined" size="small">Detalhes</Button>
              </Box>
            </CardContent>
          </Card>
        ))}

        {/* Ações Rápidas */}
        <Typography variant="h6" sx={{ color: 'white', mt: 4, mb: 2 }}>⚡ Ações Rápidas</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button variant="contained" fullWidth sx={{ py: 2 }} startIcon={<Inventory />}>
              Solicitar Peças
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant="contained" fullWidth sx={{ py: 2 }} startIcon={<Assignment />}>
              Histórico
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}