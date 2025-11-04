'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Paper,
  Divider,
} from '@mui/material';
import {
  Build,
  Assignment,
  CheckCircle,
  Schedule,
  Warning,
  Inventory,
  LocalShipping,
} from '@mui/icons-material';

interface ServiceOrder {
  id: number;
  vehicle_plate: string;
  vehicle_model: string;
  type: string;
  priority: string;
  status: string;
  description: string;
  created_at: string;
}

export default function MechanicAppPage() {
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  // TODO: Get from auth context when available
  const mechanicName = 'Mecânico'; // Placeholder

  useEffect(() => {
    fetchServiceOrders();
  }, []);

  const fetchServiceOrders = async () => {
    try {
      // Simulated data - replace with real API call
      const mockData: ServiceOrder[] = [
        {
          id: 1,
          vehicle_plate: 'ABC-1234',
          vehicle_model: 'Mercedes-Benz Actros',
          type: 'Preventiva',
          priority: 'medium',
          status: 'assigned',
          description: 'Troca de óleo e filtros',
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          vehicle_plate: 'XYZ-5678',
          vehicle_model: 'Volvo FH',
          type: 'Corretiva',
          priority: 'high',
          status: 'assigned',
          description: 'Problema no sistema de freios',
          created_at: new Date().toISOString(),
        },
      ];
      setServiceOrders(mockData);
    } catch (error) {
      console.error('Error fetching service orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    pending: serviceOrders.filter(o => o.status === 'assigned').length,
    inProgress: serviceOrders.filter(o => o.status === 'in_progress').length,
    completed: 12, // Simulated
    total: serviceOrders.length + 12,
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Build sx={{ fontSize: 48, color: 'success.main' }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Portal do Mecânico
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Bem-vindo, {mechanicName}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                    {stats.total}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Total de O.S.
                  </Typography>
                </Box>
                <Assignment sx={{ fontSize: 48, color: 'rgba(255,255,255,0.3)' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                    {stats.pending}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Pendentes
                  </Typography>
                </Box>
                <Schedule sx={{ fontSize: 48, color: 'rgba(255,255,255,0.3)' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                    {stats.inProgress}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Em Andamento
                  </Typography>
                </Box>
                <Build sx={{ fontSize: 48, color: 'rgba(255,255,255,0.3)' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                    {stats.completed}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Concluídas
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 48, color: 'rgba(255,255,255,0.3)' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<Assignment />}
            href="/frota/ordens"
            sx={{ py: 2 }}
          >
            Minhas Ordens de Serviço
          </Button>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<Inventory />}
            href="/frota/estoque"
            sx={{ py: 2 }}
            color="secondary"
          >
            Requisitar Peças
          </Button>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<Build />}
            href="/frota/ferramentas"
            sx={{ py: 2 }}
            color="success"
          >
            Checklist de Ferramentas
          </Button>
        </Grid>
      </Grid>

      {/* Service Orders List */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Ordens de Serviço Atribuídas
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {loading ? (
          <Typography>Carregando...</Typography>
        ) : serviceOrders.length === 0 ? (
          <Typography color="text.secondary">Nenhuma ordem de serviço atribuída</Typography>
        ) : (
          <List>
            {serviceOrders.map((order) => (
              <ListItemButton key={order.id} sx={{ mb: 1, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <LocalShipping sx={{ mr: 2, color: 'text.secondary' }} />
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {order.vehicle_plate} - {order.vehicle_model}
                      </Typography>
                      {order.priority === 'high' && (
                        <Chip label="Prioridade Alta" color="error" size="small" icon={<Warning />} />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        {order.description}
                      </Typography>
                      <Box sx={{ mt: 0.5, display: 'flex', gap: 1 }}>
                        <Chip label={order.type} size="small" />
                        <Chip 
                          label={order.status === 'assigned' ? 'Atribuída' : order.status} 
                          size="small" 
                          color="primary"
                        />
                      </Box>
                    </Box>
                  }
                />
                <Button variant="outlined" size="small">
                  Ver Detalhes
                </Button>
              </ListItemButton>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
}