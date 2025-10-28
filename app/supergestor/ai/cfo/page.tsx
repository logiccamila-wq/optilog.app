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
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SendIcon from '@mui/icons-material/Send';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface FinancialMetrics {
  cashFlow: number;
  revenue: number;
  expenses: number;
  profit: number;
}

const SAMPLE_PROMPTS = [
  'Como posso melhorar meu fluxo de caixa nos próximos 6 meses?',
  'Analise minha estrutura de custos e sugira otimizações',
  'Qual a melhor estratégia para reduzir inadimplência?',
  'Como devo priorizar investimentos em tecnologia vs. frota?',
];

export default function CFOPage() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<Array<{ q: string; a: string }>>([]);

  // Mock financial data - TODO: integrar com API real
  const metrics: FinancialMetrics = {
    cashFlow: 125000,
    revenue: 580000,
    expenses: 455000,
    profit: 125000,
  };

  async function send() {
    if (!question.trim()) {
      setError('Por favor, digite sua pergunta.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // TODO: Integrar com Gemini API
      // Simulação de resposta do CFO Virtual
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAnswer = `**Análise Financeira - CFO Virtual**

Com base nos dados atuais:
- Receita: R$ ${metrics.revenue.toLocaleString('pt-BR')}
- Despesas: R$ ${metrics.expenses.toLocaleString('pt-BR')}
- Lucro: R$ ${metrics.profit.toLocaleString('pt-BR')}
- Fluxo de Caixa: R$ ${metrics.cashFlow.toLocaleString('pt-BR')}

**Recomendações:**

1. **Fluxo de Caixa**: Considerando seu saldo atual de R$ 125k, recomendo:
   - Criar reserva de emergência de 3 meses (≈R$ 1.365M)
   - Negociar prazos maiores com fornecedores (45-60 dias)
   - Antecipar recebíveis apenas em casos críticos (custo alto)

2. **Otimização de Custos**:
   - Revisar contratos de fornecedores (potencial economia de 8-12%)
   - Implementar controle rigoroso de combustível (economia estimada: R$ 15k/mês)
   - Avaliar terceirização de serviços não-core

3. **Gestão de Crédito**:
   - Implementar análise de crédito para novos clientes
   - Política de desconto para pagamento antecipado (2% em 7 dias)
   - Cobrança proativa a partir de D+5 do vencimento

4. **Indicadores a Monitorar**:
   - EBITDA margin target: 25% (atual: ~21.5%)
   - Ciclo financeiro: reduzir de 45 para 30 dias
   - ROI em novos veículos: mínimo 18% ao ano

**Próximos Passos Imediatos:**
- Revisar top 10 fornecedores esta semana
- Implementar dashboard de KPIs financeiros
- Agendar reunião mensal de revisão orçamentária

Esta análise foi gerada com base em inteligência artificial. Consulte seu contador/auditor para decisões críticas.`;

      setAnswer(mockAnswer);
      setConversationHistory([...conversationHistory, { q: question, a: mockAnswer }]);
      setQuestion('');
    } catch (err) {
      setError('Erro ao processar pergunta. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <AutoAwesomeIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          CFO Virtual - Assistente Financeiro
        </Typography>
        <Chip label="Powered by AI" color="primary" size="small" />
      </Box>

      <Grid container spacing={3}>
        {/* Métricas Financeiras */}
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption">Receita Mensal</Typography>
                <TrendingUpIcon />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                R$ {metrics.revenue.toLocaleString('pt-BR')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption">Despesas</Typography>
                <AssessmentIcon />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                R$ {metrics.expenses.toLocaleString('pt-BR')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption">Lucro</Typography>
                <AttachMoneyIcon />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                R$ {metrics.profit.toLocaleString('pt-BR')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption">Fluxo de Caixa</Typography>
                <AccountBalanceIcon />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                R$ {metrics.cashFlow.toLocaleString('pt-BR')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Interface de Chat */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Consulte o CFO Virtual
            </Typography>

            {/* Prompts Sugeridos */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" sx={{ mb: 1, display: 'block', color: 'text.secondary' }}>
                Perguntas sugeridas:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {SAMPLE_PROMPTS.map((prompt, idx) => (
                  <Chip
                    key={idx}
                    label={prompt}
                    size="small"
                    onClick={() => setQuestion(prompt)}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Input de Pergunta */}
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Sua pergunta para o CFO Virtual"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={loading}
              placeholder="Ex: Como posso reduzir custos operacionais sem impactar a qualidade do serviço?"
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              fullWidth
              onClick={send}
              disabled={loading || !question.trim()}
              startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
              sx={{ mb: 2 }}
            >
              {loading ? 'Analisando...' : 'Enviar Pergunta'}
            </Button>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {/* Resposta */}
            {answer && (
              <Paper sx={{ p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main', fontWeight: 600 }}>
                  Resposta do CFO Virtual:
                </Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {answer}
                </Typography>
              </Paper>
            )}
          </Paper>
        </Grid>

        {/* Histórico de Conversas */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, maxHeight: 600, overflow: 'auto' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Histórico
            </Typography>
            {conversationHistory.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Nenhuma consulta ainda. Faça sua primeira pergunta!
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {conversationHistory.map((item, idx) => (
                  <Paper key={idx} sx={{ p: 2, backgroundColor: 'grey.50' }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      Pergunta:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {item.q}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'success.main' }}>
                      Resumo:
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                      {item.a.substring(0, 150)}...
                    </Typography>
                  </Paper>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Alert severity="info" sx={{ mt: 3 }}>
        <strong>Nota:</strong> O CFO Virtual é uma ferramenta de suporte à decisão. Para ações críticas, 
        sempre consulte profissionais certificados (contador, auditor, consultor financeiro).
      </Alert>
    </Container>
  );
}
