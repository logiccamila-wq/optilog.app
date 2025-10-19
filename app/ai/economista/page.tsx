'use client';
import { useMemo, useState } from 'react';
// Firebase removido; recursos baseados em Functions desativados.
import { Box, Typography, TextField, Button, Paper, Alert, CircularProgress } from '@mui/material';

export default function EconomistaPage() {
  const [topic, setTopic] = useState(
    'Cenários para taxa de juros e câmbio no Brasil e impacto na logística química.'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);


  async function send() {
    setError('Economista Virtual desativado (Firebase removido).');
    setAnswer(null);
  }

  return (
    <main className="container">
      <Typography variant="h4" sx={{ mb: 2 }}>
        Economista Virtual
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, display: 'grid', gap: 2 }}>
        <TextField
          label="Tópico/Consulta"
          multiline
          minRows={4}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={loading}
          helperText="Tema macroeconômico, setor, risco/opinião desejada."
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" onClick={send} disabled={loading}>
            {loading ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} /> Enviando...
              </>
            ) : (
              'Consultar'
            )}
          </Button>
          <Button variant="text" onClick={() => setAnswer(null)} disabled={loading}>
            Limpar resposta
          </Button>
        </Box>
        {error && (
          <Alert severity="error" aria-live="polite">
            {error}
          </Alert>
        )}
        {answer && (
          <Paper variant="outlined" sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Resposta
            </Typography>
            <Typography>{answer}</Typography>
          </Paper>
        )}
      </Paper>
    </main>
  );
}
