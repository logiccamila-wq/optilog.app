"use client";
import { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Button,
  Divider,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import InventoryIcon from '@mui/icons-material/Inventory';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BarChartIcon from '@mui/icons-material/BarChart';

export default function WmsPage() {
  const [activeStep, setActiveStep] = useState(0);

  const processes = [
    { label: 'Recebimento', icon: <MoveToInboxIcon /> },
    { label: 'Endereçamento', icon: <QrCodeScannerIcon /> },
    { label: 'Armazenagem', icon: <WarehouseIcon /> },
    { label: 'Separação', icon: <InventoryIcon /> },
    { label: 'Expedição', icon: <LocalShippingIcon /> },
  ];

  const features = [
    {
      id: 'receiving',
      icon: <MoveToInboxIcon sx={{ fontSize: 40 }} />,
      title: 'Recebimento Inteligente',
      description: 'Validação automática de mercadorias',
      benefits: [
        'Conferência via código de barras/RFID',
        'Validação contra pedidos de compra',
        'Registro de não-conformidades',
        'Integração com fornecedores',
      ],
    },
    {
      id: 'addressing',
      icon: <QrCodeScannerIcon sx={{ fontSize: 40 }} />,
      title: 'Endereçamento Automático',
      description: 'Organização otimizada do estoque',
      benefits: [
        'Sugestão de posições por categoria',
        'Otimização de espaço (ABC/XYZ)',
        'Rastreabilidade por lote e validade',
        'Mapa visual do armazém',
      ],
    },
    {
      id: 'inventory',
      icon: <WarehouseIcon sx={{ fontSize: 40 }} />,
      title: 'Inventário em Tempo Real',
      description: 'Controle preciso de estoque',
      benefits: [
        'Inventário cíclico e rotativo',
        'Contagem por código de barras',
        'Alertas de divergências',
        'Relatórios de acuracidade',
      ],
    },
    {
      id: 'picking',
      icon: <InventoryIcon sx={{ fontSize: 40 }} />,
      title: 'Separação Otimizada',
      description: 'Picking inteligente e eficiente',
      benefits: [
        'Roteirização automática (wave/batch)',
        'Separação por zona/módulo',
        'Confirmação via scanner',
        'Produtividade por operador',
      ],
    },
  ];

  const stats = [
    { label: 'Acuracidade de Estoque', value: '99.5%', color: 'success' },
    { label: 'Produtividade', value: '+45%', color: 'primary' },
    { label: 'Redução de Erros', value: '-80%', color: 'warning' },
    { label: 'Giro de Estoque', value: '+30%', color: 'info' },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <WarehouseIcon sx={{ fontSize: 48, color: 'primary.main' }} />
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            WMS • Warehouse Management System
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Operações de estoque, recebimento, separação e expedição
          </Typography>
        </Box>
      </Box>

      {/* Fluxo de Processos */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Fluxo de Operações WMS
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {processes.map((process, index) => (
            <Step key={process.label} onClick={() => setActiveStep(index)} sx={{ cursor: 'pointer' }}>
              <StepLabel icon={process.icon}>{process.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Estatísticas */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {stats.map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color={`${stat.color}.main`} sx={{ fontWeight: 700 }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Funcionalidades */}
      <Grid container spacing={3}>
        {features.map((feature) => (
          <Grid item xs={12} md={6} key={feature.id}>
            <Card
              sx={{
                height: '100%',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ color: 'primary.main' }}>{feature.icon}</Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <List dense>
                  {feature.benefits.map((benefit, idx) => (
                    <ListItem key={idx}>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={benefit} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Integrações */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          Integrações Disponíveis
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Chip label="ERP - Gestão Integrada" color="primary" sx={{ width: '100%' }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Chip label="TMS - Transporte" color="primary" sx={{ width: '100%' }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Chip label="OMS - Pedidos" color="primary" sx={{ width: '100%' }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Chip label="Coletores de Dados (RFID/Barcode)" color="success" sx={{ width: '100%' }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Chip label="E-commerce e Marketplaces" color="success" sx={{ width: '100%' }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Chip label="Sistemas Fiscais (NF-e, SEFAZ)" color="success" sx={{ width: '100%' }} />
          </Grid>
        </Grid>
      </Paper>

      {/* CTA */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<BarChartIcon />}
          href="/dashboard"
        >
          Ver Dashboard de Estoque
        </Button>
      </Box>
    </Container>
  );
}
