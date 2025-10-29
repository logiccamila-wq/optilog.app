'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Chip,
  Alert,
  Divider,
} from '@mui/material';
import { Plug, Check, X, ExternalLink } from 'lucide-react';

export default function IntegracoesPage() {
  const [saved, setSaved] = useState(false);
  
  const integrations = [
    {
      name: 'Notion',
      description: 'Sincronize dados e documentos com o Notion',
      icon: '📝',
      status: 'inactive',
      color: '#000000',
      fields: ['API Key', 'Database ID'],
    },
    {
      name: 'n8n',
      description: 'Automação de workflows e processos',
      icon: '🤖',
      status: 'active',
      color: '#ea4b71',
      fields: ['Webhook URL', 'API Token'],
    },
    {
      name: 'Zoho Mail',
      description: 'Envio de emails transacionais',
      icon: '📧',
      status: 'active',
      color: '#e42527',
      fields: ['Client ID', 'Client Secret', 'Refresh Token'],
    },
    {
      name: 'Google Maps',
      description: 'Geocoding e otimização de rotas',
      icon: '🗺️',
      status: 'active',
      color: '#4285f4',
      fields: ['API Key'],
    },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Plug size={40} style={{ color: '#06b6d4' }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            🔌 Integrações
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Conecte o OptiLog com outras plataformas e serviços
          </Typography>
        </Box>
      </Box>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Configurações de integração salvas com sucesso!
        </Alert>
      )}

      <Box sx={{ display: 'grid', gap: 3 }}>
        {integrations.map((integration, index) => (
          <Paper key={index} sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    background: `${integration.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                  }}
                >
                  {integration.icon}
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {integration.name}
                    </Typography>
                    <Chip
                      label={integration.status === 'active' ? 'Ativa' : 'Inativa'}
                      size="small"
                      color={integration.status === 'active' ? 'success' : 'default'}
                      icon={integration.status === 'active' ? <Check size={16} /> : <X size={16} />}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {integration.description}
                  </Typography>
                </Box>
              </Box>
              <FormControlLabel
                control={<Switch defaultChecked={integration.status === 'active'} />}
                label=""
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'grid', gap: 2 }}>
              {integration.fields.map((field, idx) => (
                <TextField
                  key={idx}
                  label={field}
                  variant="outlined"
                  size="small"
                  fullWidth
                  type={field.toLowerCase().includes('token') || field.toLowerCase().includes('secret') || field.toLowerCase().includes('key') ? 'password' : 'text'}
                  placeholder={`Insira seu ${field}`}
                />
              ))}
            </Box>

            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button variant="outlined" size="small" startIcon={<ExternalLink size={16} />}>
                Documentação
              </Button>
              <Button variant="text" size="small">
                Testar Conexão
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>

      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button variant="contained" size="large" onClick={handleSave} sx={{ flex: 1 }}>
          Salvar Todas as Configurações
        </Button>
      </Box>

      <Paper sx={{ mt: 3, p: 3, borderRadius: 3, backgroundColor: 'info.light' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Sobre as Integrações
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          As integrações permitem que o OptiLog se conecte com outras plataformas para:
        </Typography>
        <ul style={{ marginLeft: 20 }}>
          <li>
            <Typography variant="body2">
              <strong>Notion:</strong> Sincronizar documentos, checklists e bases de conhecimento
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <strong>n8n:</strong> Automatizar workflows complexos sem código
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <strong>Zoho Mail:</strong> Enviar notificações e alertas por email
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <strong>Google Maps:</strong> Calcular rotas otimizadas e rastrear veículos
            </Typography>
          </li>
        </ul>
      </Paper>

      <Paper sx={{ mt: 2, p: 3, borderRadius: 3, border: '2px solid', borderColor: 'warning.main' }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, color: 'warning.main' }}>
          ⚠️ Segurança
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Nunca compartilhe suas chaves de API ou tokens de acesso. Todas as credenciais são
          armazenadas de forma criptografada e nunca são expostas no código-fonte.
        </Typography>
      </Paper>
    </Container>
  );
}
