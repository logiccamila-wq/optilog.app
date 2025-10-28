'use client';
import { useState } from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import Card from '@/components/ui/card';
import { Link2Icon, CheckCircle2Icon, AlertCircleIcon, XCircleIcon } from 'lucide-react';
import Link from 'next/link';

export default function IntegrationsPage() {
  const integrations = [
    {
      id: 'notion',
      name: 'Notion',
      description: 'Sincronize tarefas, projetos e documentos',
      status: 'connected',
      lastSync: '09:15:32 hoje',
      items: 28,
      link: '/integrations/notion',
      color: '#000',
      icon: '📝'
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Agenda viagens, manutenções e vencimentos',
      status: 'connected',
      lastSync: '08:00:00 hoje',
      items: 15,
      link: '/integrations/calendar',
      color: '#4285F4',
      icon: '📅'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      description: 'Notificações para motoristas e clientes',
      status: 'available',
      lastSync: '—',
      items: 0,
      link: '/integrations/whatsapp',
      color: '#25D366',
      icon: '💬'
    },
    {
      id: 'google-maps',
      name: 'Google Maps',
      description: 'Rotas otimizadas e tracking em tempo real',
      status: 'connected',
      lastSync: 'Tempo real',
      items: 0,
      link: '/integrations/maps',
      color: '#34A853',
      icon: '🗺️'
    },
    {
      id: 'nfe',
      name: 'NF-e / CT-e',
      description: 'Emissão automática de documentos fiscais',
      status: 'available',
      lastSync: '—',
      items: 0,
      link: '/integrations/nfe',
      color: '#1E40AF',
      icon: '📄'
    },
    {
      id: 'banking',
      name: 'Bancos (OFX)',
      description: 'Conciliação bancária automática',
      status: 'available',
      lastSync: '—',
      items: 0,
      link: '/integrations/banking',
      color: '#059669',
      icon: '🏦'
    },
  ];

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const availableCount = integrations.filter(i => i.status === 'available').length;
  const totalItems = integrations.reduce((acc, i) => acc + i.items, 0);

  return (
    <main style={{ padding: 24, display: 'grid', gap: 16 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Link2Icon size={40} />
        <Typography variant="h4">Central de Integrações</Typography>
      </Box>

      {/* KPIs */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
        <Card title="Integrações Ativas">
          <div style={{ fontSize: 32, fontWeight: 700, color: '#10b981' }}>{connectedCount}</div>
        </Card>
        <Card title="Disponíveis">
          <div style={{ fontSize: 32, fontWeight: 700, color: '#f59e0b' }}>{availableCount}</div>
        </Card>
        <Card title="Total Integrações">
          <div style={{ fontSize: 32, fontWeight: 700 }}>{integrations.length}</div>
        </Card>
        <Card title="Itens Sincronizados">
          <div style={{ fontSize: 32, fontWeight: 700 }}>{totalItems}</div>
        </Card>
      </Box>

      {/* Grid de Integrações */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 3 }}>
        {integrations.map(integration => (
          <Box 
            key={integration.id}
            sx={{ 
              p: 3, 
              border: `2px solid ${integration.status === 'connected' ? '#10b981' : '#e5e7eb'}`, 
              borderRadius: 2, 
              backgroundColor: '#fff',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <div style={{ fontSize: 32 }}>{integration.icon}</div>
              <div style={{ flex: 1 }}>
                <Typography variant="h6">{integration.name}</Typography>
                <Typography variant="body2" color="text.secondary">{integration.description}</Typography>
              </div>
              {integration.status === 'connected' ? (
                <CheckCircle2Icon color="#10b981" size={28} />
              ) : integration.status === 'error' ? (
                <XCircleIcon color="#dc2626" size={28} />
              ) : (
                <AlertCircleIcon color="#f59e0b" size={28} />
              )}
            </Box>

            <Box sx={{ display: 'grid', gap: 1, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><strong>Status:</strong></span>
                <Chip 
                  label={integration.status === 'connected' ? 'Conectado' : 'Disponível'} 
                  size="small" 
                  color={integration.status === 'connected' ? 'success' : 'default'} 
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><strong>Última Sync:</strong></span>
                <span>{integration.lastSync}</span>
              </Box>
              {integration.items > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span><strong>Itens:</strong></span>
                  <span>{integration.items}</span>
                </Box>
              )}
            </Box>

            <Link href={integration.link} style={{ textDecoration: 'none' }}>
              <Button 
                variant={integration.status === 'connected' ? 'outlined' : 'contained'} 
                fullWidth
                sx={{ 
                  backgroundColor: integration.status === 'connected' ? 'transparent' : integration.color,
                  borderColor: integration.color,
                  color: integration.status === 'connected' ? integration.color : '#fff',
                  '&:hover': {
                    backgroundColor: integration.status === 'connected' ? `${integration.color}10` : integration.color,
                  }
                }}
              >
                {integration.status === 'connected' ? 'Configurar' : 'Conectar'}
              </Button>
            </Link>
          </Box>
        ))}
      </Box>

      {/* Logs de Sync */}
      <Box sx={{ p: 3, border: '1px solid #e5e7eb', borderRadius: 2, backgroundColor: '#f9fafb' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>📜 Logs de Sincronização (Últimas 24h)</Typography>
        <Box sx={{ display: 'grid', gap: 1 }}>
          <div style={{ padding: 12, border: '1px solid #10b981', borderRadius: 8, backgroundColor: '#f0fdf4' }}>
            <strong>09:15:32</strong> - Notion: 28 itens sincronizados ✅
          </div>
          <div style={{ padding: 12, border: '1px solid #10b981', borderRadius: 8, backgroundColor: '#f0fdf4' }}>
            <strong>08:00:00</strong> - Google Calendar: 15 eventos criados ✅
          </div>
          <div style={{ padding: 12, border: '1px solid #3b82f6', borderRadius: 8, backgroundColor: '#eff6ff' }}>
            <strong>Tempo real</strong> - Google Maps: Tracking ativo para 8 veículos 🗺️
          </div>
        </Box>
      </Box>
    </main>
  );
}
