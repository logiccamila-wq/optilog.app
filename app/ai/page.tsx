'use client';
import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';

export default function AIPage() {
  const [prompt, setPrompt] = useState(
    'Explique rapidamente WMS e TMS (conceitos, diferenças e como se integram) e sugira 3 melhorias logísticas práticas para e-commerce no Brasil, considerando last-mile e níveis de serviço.'
  );
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<any>(null);
  const [provider, setProvider] = useState<'openai' | 'gemini'>('openai');

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const region = 'us-central1';
  const functionName = provider === 'gemini' ? 'geminiProxy' : 'openaiProxy';
  const url = projectId
    ? `https://${region}-${projectId}.cloudfunctions.net/${functionName}`
    : '/api/ai';

  async function send() {
    setLoading(true);
    setResp(null);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          model: provider === 'gemini' ? 'gemini-1.5-flash-latest' : 'gpt-4o-mini',
        }),
      });
      const data = await res.json();
      setResp({ status: res.status, data });
    } catch (e: any) {
      setResp({ error: e?.message || String(e) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <Typography variant="h5" sx={{ mb: 2 }}>
        Teste IA via /api/ai
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          URL: {url}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <ToggleButtonGroup
            color="primary"
            value={provider}
            exclusive
            onChange={(_, val) => val && setProvider(val)}
            size="small"
          >
            <ToggleButton value="openai">OpenAI</ToggleButton>
            <ToggleButton value="gemini">Gemini</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Paper>

      <Box sx={{ display: 'grid', gap: 2 }}>
        <TextField
          label="Prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          multiline
          rows={8}
          fullWidth
          disabled={loading || !url}
        />
        <Box>
          <Button
            variant="contained"
            onClick={send}
            disabled={!url || loading}
            startIcon={loading ? <CircularProgress color="inherit" size={16} /> : undefined}
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </Button>
        </Box>
      </Box>

      {resp ? (
        <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
          <Box aria-live="polite">
            {resp.error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {resp.error}
              </Alert>
            )}
          </Box>
          <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', m: 0 }}>
            {JSON.stringify(resp, null, 2)}
          </Typography>
        </Paper>
      ) : (
        <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Digite um prompt e clique em Enviar para ver a resposta.
          </Typography>
        </Paper>
      )}
    </main>
  );
}
