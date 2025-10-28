'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Badge
} from '@mui/material';
import {
  LocalShipping,
  Navigation,
  CheckCircle,
  AccessTime,
  Chat,
  Refresh
} from '@mui/icons-material';

interface Trip {
  id: number;
  trip_number: string;
  customer_name: string;
  vehicle_plate: string;
  origin_city: string;
  destination_city: string;
  cargo_description: string;
  status: string;
  departure_date: string;
  arrival_date?: string;
  freight_value: number;
  driver_payment: number;
}

export default function MotoristaPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [driverName] = useState('João Silva'); // TODO: Get from auth

  useEffect(() => {
    loadTrips();
    
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(() => console.log('Service Worker registrado'))
        .catch((err) => console.error('Service Worker falhou:', err));
    }
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/trips?driver_name=${encodeURIComponent(driverName)}&status=em_andamento,pendente`);
      
      if (!response.ok) throw new Error('Erro ao carregar viagens');
      
      const data = await response.json();
      setTrips(data);
      setError('');
    } catch (err) {
      setError('Não foi possível carregar suas viagens. Verifique sua conexão.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'success' | 'warning' | 'info' | 'error' | 'default'> = {
      'pendente': 'warning',
      'em_andamento': 'info',
      'concluida': 'success',
      'cancelada': 'error'
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'pendente': 'Pendente',
      'em_andamento': 'Em Andamento',
      'concluida': 'Concluída',
      'cancelada': 'Cancelada'
    };
    return labels[status] || status;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      pb: 4
    }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        color: 'white',
        p: 2,
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                🚛 OptiLog Driver
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Olá, {driverName}
              </Typography>
            </Box>
            <IconButton color="inherit" onClick={loadTrips}>
              <Refresh />
            </IconButton>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ mt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Active Trips */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalShipping /> Minhas Viagens
          </Typography>

          {trips.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <LocalShipping sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Nenhuma viagem ativa
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Quando você tiver viagens atribuídas, elas aparecerão aqui.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            trips.map((trip) => (
              <Card key={trip.id} sx={{ mb: 2, overflow: 'visible' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {trip.trip_number}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {trip.customer_name}
                      </Typography>
                    </Box>
                    <Chip 
                      label={getStatusLabel(trip.status)}
                      color={getStatusColor(trip.status)}
                      size="small"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Navigation sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      <strong>{trip.origin_city}</strong> → <strong>{trip.destination_city}</strong>
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    🚚 {trip.vehicle_plate} • 📦 {trip.cargo_description}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Saída
                      </Typography>
                      <Typography variant="body2" fontWeight="500">
                        {formatDate(trip.departure_date)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Seu Pagamento
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" color="success.main">
                        {formatCurrency(trip.driver_payment)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>

                <CardActions sx={{ borderTop: 1, borderColor: 'divider', p: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Navigation />}
                    onClick={() => router.push(`/motorista/${trip.id}`)}
                    sx={{
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      color: 'white'
                    }}
                  >
                    Gerenciar Viagem
                  </Button>
                </CardActions>
              </Card>
            ))
          )}
        </Box>

        {/* Quick Stats */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 2,
          mt: 3
        }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <LocalShipping sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {trips.filter(t => t.status === 'em_andamento').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Em Andamento
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AccessTime sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {trips.filter(t => t.status === 'pendente').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pendentes
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {trips.filter(t => t.status === 'concluida').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Concluídas
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Install PWA Prompt */}
        <Card sx={{ mt: 3, bgcolor: 'info.light' }}>
          <CardContent>
            <Typography variant="body2" fontWeight="500" sx={{ mb: 1 }}>
              💡 Dica: Instale este app na tela inicial do seu celular
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Para um acesso mais rápido, toque no menu do navegador e selecione "Adicionar à tela inicial" ou "Instalar app".
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
