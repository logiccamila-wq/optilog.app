"use client";
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
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PublicIcon from '@mui/icons-material/Public';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import SendIcon from '@mui/icons-material/Send';
import PsychologyIcon from '@mui/icons-material/Psychology';

interface EconomicIndicators {
  selic: number;
  ipca: number;
  cambio: number;
  pib: number;
}

const SAMPLE_TOPICS = [
  'Impacto da alta do dólar nos custos logísticos',
  'Cenário macroeconômico para 2025 - Brasil',
  'Como a inflação afeta meu negócio de transporte?',
  'Tendências de juros e investimentos em frota',
];

const RECENT_NEWS = [
  { title: 'Banco Central mantém Selic em 10.75%', date: '2025-10-20' },
  { title: 'IPCA acumula 4.2% no ano', date: '2025-10-15' },
  { title: 'Dólar fecha a R$ 5.15', date: '2025-10-25' },
  { title: 'PIB cresce 2.1% no trimestre', date: '2025-10-10' },
];

export default function EconomistaPage() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<Array<{ t: string; a: string }>>([]);

  // Mock economic indicators - TODO: integrar com API real (Banco Central, IBGE)
  const indicators: EconomicIndicators = {
    selic: 10.75,
    ipca: 4.2,
    cambio: 5.15,
    pib: 2.1,
  };

  async function send() {
    if (!topic.trim()) {
      setError('Por favor, descreva o tópico que deseja analisar.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // TODO: Integrar com Gemini API
      // Simulação de resposta do Economista Virtual
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const mockAnswer = `**Análise Econômica - Economista Virtual**

**Contexto Macroeconômico Atual:**
- Selic: ${indicators.selic}% a.a. (estável)
- IPCA: ${indicators.ipca}% no ano (dentro da meta)
- Câmbio: R$ ${indicators.cambio} (volatilidade moderada)
- PIB: +${indicators.pib}% no trimestre (crescimento sustentável)

**Análise do Tópico Solicitado:**

"${topic}"

**Impactos no Setor de Logística e Transporte:**

1. **Custos Operacionais**:
   - Diesel: Tendência de alta de 3-5% trimestral (correlação com petróleo)
   - Manutenção: Pressão inflacionária em peças importadas (+8% a.a.)
   - Pedágios: Reajuste médio de 6.5% previsto para 2026

2. **Financiamento e Investimentos**:
   - Com Selic em ${indicators.selic}%, custo de capital permanece elevado
   - Recomendação: Priorizar veículos com ROI >18% para novos financiamentos
   - Leasing pode ser vantajoso vs. compra (considerar benefício fiscal)

3. **Gestão de Risco Cambial**:
   - Volatilidade do dólar impacta pneus e peças (+12% em dólar no ano)
   - Sugestão: Hedge cambial para compras acima de USD 50k
   - Negociar contratos em reais com fornecedores quando possível

4. **Cenário Prospectivo (6-12 meses)**:
   - **Provável (60%)**: Selic estável ou queda gradual (-0.5pp)
   - **Otimista (25%)**: Redução acelerada da Selic (-1.5pp) + PIB >3%
   - **Pessimista (15%)**: Pressão inflacionária + Selic em alta

**Recomendações Estratégicas:**

📊 **Curto Prazo (3 meses)**:
- Revisar contratos de fornecedores (cláusula de reajuste)
- Manter reserva de caixa equivalente a 90 dias de operação
- Hedge cambial para compras programadas

💼 **Médio Prazo (6-12 meses)**:
- Avaliar renovação de frota (janela de juros ainda elevados, mas tendência de queda)
- Diversificar carteira de clientes (reduzir exposição setorial)
- Investir em eficiência operacional (ROI mais atrativo que expansão)

🎯 **Indicadores a Monitorar Semanalmente**:
- Preço do diesel (ANP)
- Taxa de câmbio (PTAX)
- Curva de juros futuros (B3)
- Índice de confiança empresarial (FGV)

**Fontes de Dados:**
Esta análise foi baseada em indicadores de: Banco Central, IBGE, ANP, FGV, e tendências de mercado. 
Consulte economistas e analistas especializados para decisões de alto impacto.`;

      setAnswer(mockAnswer);
      setAnalysisHistory([...analysisHistory, { t: topic, a: mockAnswer }]);
      setTopic('');
    } catch (err) {
      setError('Erro ao gerar análise. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <PsychologyIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Economista Virtual - Análise Macroeconômica
        </Typography>
        <Chip label="AI-Powered" color="primary" size="small" />
      </Box>

      <Grid container spacing={3}>
        {/* Indicadores Econômicos */}
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption">Taxa Selic</Typography>
                <TrendingUpIcon />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {indicators.selic}% a.a.
              </Typography>
              <Typography variant="caption">Banco Central</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption">IPCA (ano)</Typography>
                <ShowChartIcon />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {indicators.ipca}%
              </Typography>
              <Typography variant="caption">IBGE</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption">Câmbio USD/BRL</Typography>
                <PublicIcon />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                R$ {indicators.cambio}
              </Typography>
              <Typography variant="caption">PTAX</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption">PIB (trimestre)</Typography>
                <BarChartIcon />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                +{indicators.pib}%
              </Typography>
              <Typography variant="caption">IBGE</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Interface de Consulta */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Consulte o Economista Virtual
            </Typography>

            {/* Tópicos Sugeridos */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" sx={{ mb: 1, display: 'block', color: 'text.secondary' }}>
                Análises sugeridas:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {SAMPLE_TOPICS.map((t, idx) => (
                  <Chip
                    key={idx}
                    label={t}
                    size="small"
                    onClick={() => setTopic(t)}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Input de Tópico */}
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Tópico ou Consulta Econômica"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={loading}
              placeholder="Ex: Como a variação cambial impacta meus custos de manutenção?"
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              fullWidth
              onClick={send}
              disabled={loading || !topic.trim()}
              startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
              sx={{ mb: 2 }}
            >
              {loading ? 'Analisando dados econômicos...' : 'Gerar Análise'}
            </Button>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {/* Resposta */}
            {answer && (
              <Paper sx={{ p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main', fontWeight: 600 }}>
                  Análise Econômica:
                </Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {answer}
                </Typography>
              </Paper>
            )}
          </Paper>
        </Grid>

        {/* Notícias e Histórico */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Notícias Recentes
            </Typography>
            <List dense>
              {RECENT_NEWS.map((news, idx) => (
                <ListItem key={idx} sx={{ px: 0 }}>
                  <ListItemText
                    primary={news.title}
                    secondary={new Date(news.date).toLocaleDateString('pt-BR')}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3, maxHeight: 400, overflow: 'auto' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Histórico de Análises
            </Typography>
            {analysisHistory.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Nenhuma análise ainda. Faça sua primeira consulta!
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {analysisHistory.map((item, idx) => (
                  <Paper key={idx} sx={{ p: 2, backgroundColor: 'grey.50' }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      Tópico:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {item.t}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'success.main' }}>
                      Preview:
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                      {item.a.substring(0, 120)}...
                    </Typography>
                  </Paper>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Alert severity="info" sx={{ mt: 3 }}>
        <strong>Disclaimer:</strong> As análises do Economista Virtual são geradas por IA com base em dados públicos. 
        Para decisões estratégicas, consulte economistas, analistas de mercado e consultores especializados.
      </Alert>
    </Container>
  );
}
