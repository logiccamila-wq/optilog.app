'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  Button,
  Alert,
} from '@mui/material';
import { Globe, Check } from 'lucide-react';

export default function IdiomasPage() {
  const [selectedLanguage, setSelectedLanguage] = useState('pt-BR');
  const [saved, setSaved] = useState(false);

  const languages = [
    { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
    { code: 'en-US', name: 'English (United States)', flag: '🇺🇸' },
    { code: 'es-ES', name: 'Español (España)', flag: '🇪🇸' },
  ];

  const handleSave = () => {
    // In a real implementation, this would save to backend/localStorage
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Globe size={40} style={{ color: '#3b82f6' }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            🌐 Idiomas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Selecione o idioma da interface do sistema
          </Typography>
        </Box>
      </Box>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Idioma salvo com sucesso! A interface será atualizada.
        </Alert>
      )}

      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
            Idioma da Interface
          </FormLabel>
          <RadioGroup
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {languages.map((lang) => (
              <Box
                key={lang.code}
                sx={{
                  p: 2,
                  mb: 1,
                  border: '2px solid',
                  borderColor: selectedLanguage === lang.code ? 'primary.main' : 'divider',
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'action.hover',
                  },
                }}
                onClick={() => setSelectedLanguage(lang.code)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h5">{lang.flag}</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {lang.name}
                    </Typography>
                  </Box>
                  {selectedLanguage === lang.code && (
                    <Check size={24} style={{ color: '#10b981' }} />
                  )}
                </Box>
              </Box>
            ))}
          </RadioGroup>
        </FormControl>

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSave}
            sx={{ flex: 1 }}
          >
            Salvar Configurações
          </Button>
        </Box>

        <Box sx={{ mt: 4, p: 2, backgroundColor: 'info.light', borderRadius: 2 }}>
          <Typography variant="caption" color="text.secondary">
            <strong>Nota:</strong> A mudança de idioma afetará toda a interface do sistema.
            Algumas partes técnicas podem permanecer em inglês.
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ mt: 3, p: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Idiomas Suportados
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          O OptiLog oferece suporte completo aos seguintes idiomas:
        </Typography>
        <ul style={{ marginLeft: 20 }}>
          <li>
            <Typography variant="body2">
              <strong>Português (Brasil):</strong> Idioma padrão com todas as funcionalidades
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <strong>English (US):</strong> Full internationalization support
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <strong>Español (España):</strong> Soporte completo de internacionalización
            </Typography>
          </li>
        </ul>
      </Paper>
    </Container>
  );
}
