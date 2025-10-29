'use client';

import { Container, Typography, Paper, Box, TextField, Button, Grid } from '@mui/material';
import { Building } from 'lucide-react';

export default function EmpresaPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Building size={40} style={{ color: '#3b82f6' }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            🏢 Configurações da Empresa
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Dados cadastrais e informações gerais
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
          Dados Gerais
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Razão Social"
              placeholder="Nome da empresa"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="CNPJ"
              placeholder="00.000.000/0000-00"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Inscrição Estadual"
              placeholder="000.000.000.000"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Endereço"
              placeholder="Rua, número"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Cidade"
              placeholder="Cidade"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Estado"
              placeholder="UF"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="CEP"
              placeholder="00000-000"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
          Contato
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Telefone"
              placeholder="(00) 0000-0000"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              placeholder="contato@empresa.com"
              variant="outlined"
              type="email"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Website"
              placeholder="https://www.empresa.com"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" size="large" sx={{ flex: 1 }}>
          Salvar Alterações
        </Button>
        <Button variant="outlined" size="large">
          Cancelar
        </Button>
      </Box>
    </Container>
  );
}
