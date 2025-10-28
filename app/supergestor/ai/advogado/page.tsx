'use client';
import { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import DescriptionIcon from '@mui/icons-material/Description';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PolicyIcon from '@mui/icons-material/Policy';
import SendIcon from '@mui/icons-material/Send';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const SAMPLE_PROMPTS = [
  'Quais são minhas obrigações legais como transportadora?',
  'Como elaborar um contrato de prestação de serviços de transporte?',
  'Responsabilidade civil em caso de avarias na carga',
  'Legislação trabalhista para motoristas de caminhão',
];

export default function AdvogadoPage() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<Array<{ q: string; a: string }>>([]);

  const handleSubmit = async (promptText?: string) => {
    const finalQuestion = promptText || question;
    if (!finalQuestion.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Você é um Advogado especializado em Direito Empresarial e Logística no Brasil. ${finalQuestion}`,
          context: 'advogado_virtual',
        }),
      });

      if (!response.ok) throw new Error('Erro ao consultar IA');

      const data = await response.json();
      setAnswer(data.result);
      setConversationHistory([...conversationHistory, { q: finalQuestion, a: data.result }]);
      setQuestion('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <GavelIcon sx={{ fontSize: 48, color: 'primary.main' }} />
        <Box>
          <Typography variant="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            Advogado Virtual - Assistente Jurídico
            <Chip label="Powered by AI" color="primary" size="small" icon={<AutoAwesomeIcon />} />
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Consultoria jurídica com IA para questões empresariais e de logística
          </Typography>
          <Alert severity="warning" sx={{ mt: 1, fontSize: '0.875rem' }}>
            ⚠️ As informações fornecidas não substituem consultoria jurídica profissional
          </Alert>
        </Box>
      </Box>

      {/* KPIs Jurídicos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <DescriptionIcon />
                <Typography variant="h6">Contratos</Typography>
              </Box>
              <Typography variant="h4">24</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <VerifiedUserIcon />
                <Typography variant="h6">Compliance</Typography>
              </Box>
              <Typography variant="h4">98%</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #c31432 0%, #240b36 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <PolicyIcon />
                <Typography variant="h6">Processos</Typography>
              </Box>
              <Typography variant="h4">3</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #00b4db 0%, #0083b0 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <GavelIcon />
                <Typography variant="h6">Consultas</Typography>
              </Box>
              <Typography variant="h4">67</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Consulta */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <GavelIcon color="primary" />
          Consulte o Advogado Virtual
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Perguntas sugeridas:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {SAMPLE_PROMPTS.map((prompt, idx) => (
            <Chip
              key={idx}
              label={prompt}
              onClick={() => handleSubmit(prompt)}
              variant="outlined"
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>

        <TextField
          fullWidth
          multiline
          rows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Sua pergunta jurídica para o Advogado Virtual"
          disabled={loading}
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          size="large"
          onClick={() => handleSubmit()}
          disabled={loading || !question.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
          fullWidth
        >
          {loading ? 'Analisando questão jurídica...' : 'Enviar Consulta'}
        </Button>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {answer && (
          <Paper elevation={1} sx={{ mt: 3, p: 2, bgcolor: 'background.default' }}>
            <Typography variant="h6" gutterBottom color="primary">
              Parecer Jurídico:
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {answer}
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              📌 Recomendamos consultar um advogado licenciado para questões complexas ou ações legais.
            </Alert>
          </Paper>
        )}
      </Paper>

      {/* Histórico */}
      {conversationHistory.length > 0 && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Histórico de Consultas Jurídicas
          </Typography>
          {conversationHistory.map((item, idx) => (
            <Box key={idx} sx={{ mb: 2, pb: 2, borderBottom: idx < conversationHistory.length - 1 ? 1 : 0, borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary" fontWeight="bold">
                Pergunta:
              </Typography>
              <Typography variant="body1" gutterBottom>
                {item.q}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight="bold" sx={{ mt: 1 }}>
                Parecer:
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {item.a}
              </Typography>
            </Box>
          ))}
        </Paper>
      )}
    </Container>
  );
}
