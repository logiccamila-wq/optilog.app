'use client';
import { useState, useMemo } from 'react';
// Firebase removido; recursos baseados em Functions desativados.
import { Box, Typography, TextField, Button, Paper, Alert, CircularProgress } from '@mui/material';

export default function CFOPage() {
  const [question, setQuestion] = useState(
    'Preciso melhorar o fluxo de caixa nos próximos 6 meses. Sugira ações práticas considerando contas a pagar/receber e estoques.'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);


  async function send() {
    setError('CFO Virtual desativado (Firebase removido).');
    setAnswer(null);
  }

  return (
    <main className="container">
      <Typography variant="h4" sx={{ mb: 2 }}>
        CFO Virtual
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, display: 'grid', gap: 2 }}>
        <TextField
          label="Pergunta"
          multiline
          minRows={4}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={loading}
          helperText="Descreva seu cenário financeiro e peça recomendações."
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" onClick={send} disabled={loading}>
            {loading ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} /> Enviando...
              </>
            ) : (
              'Perguntar'
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
