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
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SendIcon from '@mui/icons-material/Send';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const SAMPLE_PROMPTS = [
  'Como melhorar a eficiência operacional da minha transportadora?',
  'Quais as melhores práticas para gestão de frota?',
  'Como reduzir custos sem comprometer a qualidade?',
  'Estratégias para expandir minha base de clientes',
];

export default function ConsultorPage() {
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
          prompt: `Você é um Consultor Empresarial especializado em logística e transportes. ${finalQuestion}`,
          context: 'consultor_empresarial',
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
        <BusinessCenterIcon sx={{ fontSize: 48, color: 'primary.main' }} />
        <Box>
          <Typography variant="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            Consultor Virtual - Assistente Empresarial
            <Chip label="Powered by AI" color="primary" size="small" icon={<AutoAwesomeIcon />} />
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Consultoria estratégica com IA para otimização de processos e crescimento
          </Typography>
        </Box>
      </Box>

      {/* KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TrendingUpIcon />
                <Typography variant="h6">Eficiência</Typography>
              </Box>
              <Typography variant="h4">87%</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AssessmentIcon />
                <Typography variant="h6">ROI</Typography>
              </Box>
              <Typography variant="h4">32%</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <BusinessCenterIcon />
                <Typography variant="h6">Projetos</Typography>
              </Box>
              <Typography variant="h4">12</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TipsAndUpdatesIcon />
                <Typography variant="h6">Insights</Typography>
              </Box>
              <Typography variant="h4">48</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Consulta */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TipsAndUpdatesIcon color="primary" />
          Consulte o Assistente Empresarial
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
          placeholder="Sua pergunta para o Consultor Virtual"
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
          {loading ? 'Analisando...' : 'Enviar Consulta'}
        </Button>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {answer && (
          <Paper elevation={1} sx={{ mt: 3, p: 2, bgcolor: 'background.default' }}>
            <Typography variant="h6" gutterBottom color="primary">
              Recomendação do Consultor:
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {answer}
            </Typography>
          </Paper>
        )}
      </Paper>

      {/* Histórico */}
      {conversationHistory.length > 0 && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Histórico de Consultas
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
                Resposta:
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
