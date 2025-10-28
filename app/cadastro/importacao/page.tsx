'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Download,
  Upload,
  Description,
} from '@mui/icons-material';

export default function ImportExportPage() {
  const [entity, setEntity] = useState('customers');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const entities = [
    { value: 'customers', label: 'Clientes' },
    { value: 'drivers', label: 'Motoristas' },
    { value: 'vehicles', label: 'Veículos' },
    { value: 'service_orders', label: 'Ordens de Serviço' },
  ];

  const handleExport = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/export?entity=${entity}`);
      
      if (!response.ok) {
        throw new Error('Erro ao exportar dados');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${entity}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setResult({ message: 'Exportação concluída com sucesso!' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError('Selecione um arquivo CSV');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('entity', entity);

      const response = await fetch('/api/export', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao importar dados');
      }

      setResult(data);
      setFile(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        📊 Importação e Exportação de Dados
      </Typography>

      <Grid container spacing={3}>
        {/* Exportação */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Download sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Exportar Dados</Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Exporta dados do sistema em formato CSV para análise externa ou backup.
              </Typography>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Tipo de Dados</InputLabel>
                <Select
                  value={entity}
                  label="Tipo de Dados"
                  onChange={(e) => setEntity(e.target.value)}
                >
                  {entities.map(ent => (
                    <MenuItem key={ent.value} value={ent.value}>
                      {ent.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                fullWidth
                startIcon={<Download />}
                onClick={handleExport}
                disabled={loading}
              >
                Exportar para CSV
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Importação */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Upload sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Importar Dados</Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Importa dados de um arquivo CSV. O arquivo deve ter as colunas corretas.
              </Typography>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Tipo de Dados</InputLabel>
                <Select
                  value={entity}
                  label="Tipo de Dados"
                  onChange={(e) => setEntity(e.target.value)}
                >
                  {entities.map(ent => (
                    <MenuItem key={ent.value} value={ent.value}>
                      {ent.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                fullWidth
                component="label"
                startIcon={<Description />}
                sx={{ mb: 2 }}
              >
                {file ? file.name : 'Selecionar Arquivo CSV'}
                <input
                  type="file"
                  hidden
                  accept=".csv"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </Button>

              <Button
                variant="contained"
                color="success"
                fullWidth
                startIcon={<Upload />}
                onClick={handleImport}
                disabled={loading || !file}
              >
                Importar Dados
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Resultados */}
        {loading && (
          <Grid size={{ xs: 12 }}>
            <LinearProgress />
          </Grid>
        )}

        {error && (
          <Grid size={{ xs: 12 }}>
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </Grid>
        )}

        {result && (
          <Grid size={{ xs: 12 }}>
            <Alert severity="success" onClose={() => setResult(null)}>
              <Typography variant="subtitle2">{result.message}</Typography>
              {result.imported !== undefined && (
                <Typography variant="body2">
                  Importados: {result.imported} de {result.total} registros
                </Typography>
              )}
              {result.errors && result.errors.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="error">Erros:</Typography>
                  <List dense>
                    {result.errors.map((err: string, idx: number) => (
                      <ListItem key={idx}>
                        <ListItemText primary={err} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Alert>
          </Grid>
        )}

        {/* Instruções */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>📋 Formato do CSV</Typography>
              
              <Typography variant="subtitle2">Clientes:</Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 2 }}>
                Nome,Email,Telefone
              </Typography>

              <Typography variant="subtitle2">Motoristas:</Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 2 }}>
                Nome,CPF,CNH,Categoria,Telefone,Status
              </Typography>

              <Typography variant="subtitle2">Veículos:</Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                Placa,Marca,Modelo,Ano,Tipo,Status
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}