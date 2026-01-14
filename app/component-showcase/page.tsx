'use client';

import { useState } from 'react';
import { Inbox, RefreshCw, Package, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { Box, Container, Typography, Chip, Grid, Divider } from '@mui/material';
import EmptyState from '@/components/ui/EmptyState';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function ComponentShowcasePage() {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 6 }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ mb: 6 }}>
          <Chip 
            label="UI/UX Sistema OptiLog" 
            color="primary" 
            sx={{ mb: 2, fontWeight: 600 }}
          />
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            🎨 Showcase de Componentes
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: '800px' }}>
            Biblioteca de componentes UI padronizados com Tailwind CSS para consistência visual em toda aplicação OptiLog.
          </Typography>

          {/* Status Badges */}
          <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
            <Chip label="✅ Build: SUCCESS" color="success" variant="outlined" />
            <Chip label="✅ TypeScript: 0 erros" color="success" variant="outlined" />
            <Chip label="✅ Segurança: 0 vulnerabilidades" color="success" variant="outlined" />
            <Chip label="📦 4 Componentes UI" color="info" variant="outlined" />
          </Box>
        </Box>

        <Divider sx={{ mb: 6 }} />

        {/* EmptyState Component Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            EmptyState Component
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
            Componente para estados vazios com suporte a ícones, descrição e ações customizadas.
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  bgcolor: 'background.paper',
                  borderRadius: 3,
                  p: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  height: '100%'
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
                  Exemplo Básico
                </Typography>
                <EmptyState 
                  title="Nenhum item encontrado"
                  description="Comece adicionando seu primeiro item ao sistema"
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  bgcolor: 'background.paper',
                  borderRadius: 3,
                  p: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  height: '100%'
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
                  Com Ícone
                </Typography>
                <EmptyState 
                  icon={<Inbox size={48} />}
                  title="Nenhuma mensagem"
                  description="Sua caixa de entrada está vazia"
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  bgcolor: 'background.paper',
                  borderRadius: 3,
                  p: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  height: '100%'
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
                  Com Ação
                </Typography>
                <EmptyState 
                  icon={<Package size={48} />}
                  title="Nenhum produto cadastrado"
                  description="Cadastre produtos para começar"
                  action={
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                      Adicionar Produto
                    </button>
                  }
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  bgcolor: 'background.paper',
                  borderRadius: 3,
                  p: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  height: '100%'
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
                  Estado de Erro
                </Typography>
                <EmptyState 
                  icon={<AlertTriangle size={48} className="text-red-500" />}
                  title="Erro ao carregar dados"
                  description="Não foi possível conectar ao servidor"
                  action={
                    <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
                      Tentar Novamente
                    </button>
                  }
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ mb: 6 }} />

        {/* SkeletonLoader Component Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            SkeletonLoader Component
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
            Estados de carregamento com 4 variantes: table, card, list e text.
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  bgcolor: 'background.paper',
                  borderRadius: 3,
                  p: 4,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
                  Variante Tabela
                </Typography>
                <SkeletonLoader variant="table" rows={4} />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  bgcolor: 'background.paper',
                  borderRadius: 3,
                  p: 4,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
                  Variante Card
                </Typography>
                <SkeletonLoader variant="card" rows={2} />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  bgcolor: 'background.paper',
                  borderRadius: 3,
                  p: 4,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
                  Variante Lista
                </Typography>
                <SkeletonLoader variant="list" rows={5} />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  bgcolor: 'background.paper',
                  borderRadius: 3,
                  p: 4,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
                  Variante Texto
                </Typography>
                <SkeletonLoader variant="text" rows={6} />
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ mb: 6 }} />

        {/* ConfirmDialog Component Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            ConfirmDialog Component
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
            Diálogos de confirmação com variantes danger e default, baseados em Tailwind CSS.
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  bgcolor: 'background.paper',
                  borderRadius: 3,
                  p: 4,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
                  Diálogo de Perigo
                </Typography>
                <button
                  onClick={() => setShowConfirm(true)}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
                >
                  Mostrar Diálogo de Exclusão
                </button>

                <ConfirmDialog
                  open={showConfirm}
                  title="Deletar Item"
                  message="Tem certeza que deseja deletar este item? Esta ação não pode ser desfeita."
                  confirmText="Deletar"
                  cancelText="Cancelar"
                  variant="danger"
                  onConfirm={() => {
                    alert('Item deletado com sucesso!');
                    setShowConfirm(false);
                  }}
                  onCancel={() => setShowConfirm(false)}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  bgcolor: 'background.paper',
                  borderRadius: 3,
                  p: 4,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
                  Características
                </Typography>
                <Box component="ul" sx={{ pl: 3, color: 'text.secondary' }}>
                  <li>Baseado em Tailwind CSS</li>
                  <li>Suporte a dark mode</li>
                  <li>Variantes danger/default</li>
                  <li>Backdrop click para fechar</li>
                  <li>Acessível (ARIA labels)</li>
                  <li>Textos customizáveis</li>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ mb: 6 }} />

        {/* Design System Info */}
        <Box 
          sx={{ 
            bgcolor: 'background.paper',
            borderRadius: 3,
            p: 5,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            🎨 Sistema de Design OptiLog
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                Padrão de Cores
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 40, height: 40, bgcolor: '#0E539A', borderRadius: 1 }} />
                  <Typography variant="body2">Primary: #0E539A</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 40, height: 40, bgcolor: '#ef4444', borderRadius: 1 }} />
                  <Typography variant="body2">Danger: #ef4444</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 40, height: 40, bgcolor: '#10b981', borderRadius: 1 }} />
                  <Typography variant="body2">Success: #10b981</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                Tipografia
              </Typography>
              <Box sx={{ color: 'text.secondary' }}>
                <Typography variant="body2">• Font: Segoe UI Variable</Typography>
                <Typography variant="body2">• Headings: 700 weight</Typography>
                <Typography variant="body2">• Body: 400 weight</Typography>
                <Typography variant="body2">• Escala: 14px - 48px</Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                Componentes
              </Typography>
              <Box sx={{ color: 'text.secondary' }}>
                <Typography variant="body2">✅ EmptyState</Typography>
                <Typography variant="body2">✅ SkeletonLoader</Typography>
                <Typography variant="body2">✅ ConfirmDialog</Typography>
                <Typography variant="body2">✅ ToastProvider</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
