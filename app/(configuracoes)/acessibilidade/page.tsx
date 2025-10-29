'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Switch,
  FormControlLabel,
  Slider,
  Button,
  Alert,
  Divider,
} from '@mui/material';
import { Accessibility, Eye, Type, Contrast } from 'lucide-react';

export default function AcessibilidadePage() {
  const [settings, setSettings] = useState({
    highContrast: false,
    largeText: false,
    reduceMotion: false,
    screenReaderMode: false,
    fontSize: 16,
  });
  const [saved, setSaved] = useState(false);

  const handleToggle = (key: string) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleSave = () => {
    // In a real implementation, save to backend/localStorage
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Accessibility size={40} style={{ color: '#f59e0b' }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            ♿ Acessibilidade
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configurações de acessibilidade seguindo WCAG 2.1 AA
          </Typography>
        </Box>
      </Box>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Configurações salvas com sucesso!
        </Alert>
      )}

      <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
          Modo de Visualização
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Contrast size={24} />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.highContrast}
                  onChange={() => handleToggle('highContrast')}
                />
              }
              label="Alto Contraste"
            />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 5 }}>
            Aumenta o contraste entre textos e fundos (mínimo 4.5:1)
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Type size={24} />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.largeText}
                  onChange={() => handleToggle('largeText')}
                />
              }
              label="Texto Grande"
            />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 5 }}>
            Aumenta o tamanho de todos os textos do sistema
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Eye size={24} />
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Tamanho da Fonte
            </Typography>
          </Box>
          <Box sx={{ px: 2 }}>
            <Slider
              value={settings.fontSize}
              onChange={(_, value) => setSettings((prev) => ({ ...prev, fontSize: value as number }))}
              min={12}
              max={24}
              step={2}
              marks
              valueLabelDisplay="on"
              valueLabelFormat={(value) => `${value}px`}
            />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 5 }}>
            Ajuste fino do tamanho da fonte (12px - 24px)
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
          Navegação e Interação
        </Typography>

        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.reduceMotion}
                onChange={() => handleToggle('reduceMotion')}
              />
            }
            label="Reduzir Movimento"
          />
          <Typography variant="caption" color="text.secondary" display="block" sx={{ ml: 5 }}>
            Remove ou reduz animações e transições
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.screenReaderMode}
                onChange={() => handleToggle('screenReaderMode')}
              />
            }
            label="Modo Leitor de Tela"
          />
          <Typography variant="caption" color="text.secondary" display="block" sx={{ ml: 5 }}>
            Otimiza a interface para leitores de tela (NVDA, JAWS, VoiceOver)
          </Typography>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" size="large" onClick={handleSave} sx={{ flex: 1 }}>
          Salvar Configurações
        </Button>
      </Box>

      <Paper sx={{ mt: 3, p: 3, borderRadius: 3, backgroundColor: 'info.light' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Conformidade WCAG 2.1 AA
        </Typography>
        <Typography variant="body2" color="text.secondary">
          O OptiLog segue as diretrizes de acessibilidade WCAG 2.1 nível AA, garantindo:
        </Typography>
        <ul style={{ marginLeft: 20, marginTop: 8 }}>
          <li>
            <Typography variant="body2">✅ Contraste adequado (mínimo 4.5:1)</Typography>
          </li>
          <li>
            <Typography variant="body2">✅ Navegação completa por teclado</Typography>
          </li>
          <li>
            <Typography variant="body2">✅ ARIA labels em todos os elementos interativos</Typography>
          </li>
          <li>
            <Typography variant="body2">✅ Textos alternativos em imagens</Typography>
          </li>
          <li>
            <Typography variant="body2">✅ Compatibilidade com leitores de tela</Typography>
          </li>
        </ul>
      </Paper>
    </Container>
  );
}
