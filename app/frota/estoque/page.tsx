'use client';
import { Box, Typography, Grid, Card, CardContent, Button, TextField } from '@mui/material';

export default function FrotaEstoquePage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        📦 Estoque de Peças
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Resumo</Typography>
              <ul>
                <li>Peças cadastradas: 0</li>
                <li>Itens com nível mínimo: 0</li>
                <li>Entradas no mês: 0</li>
                <li>Saídas no mês: 0</li>
              </ul>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Cadastro Rápido</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField label="Código" fullWidth />
                </Grid>
                <Grid item xs={12} md={8}>
                  <TextField label="Nome da Peça" fullWidth />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField label="Quantidade" type="number" fullWidth />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField label="Mínimo" type="number" fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained">Salvar</Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
