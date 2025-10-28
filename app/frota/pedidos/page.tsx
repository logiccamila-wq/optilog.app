'use client';
import { Box, Typography, Grid, Card, CardContent, TextField, Button } from '@mui/material';

export default function FrotaPedidosPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        🧾 Pedidos & Compras
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Nova Requisição</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField label="Descrição do pedido" fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Justificativa" fullWidth multiline rows={3} />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained">Enviar para Cotação</Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Status</Typography>
              <ul>
                <li>Requisições abertas: 0</li>
                <li>Cotações em andamento: 0</li>
                <li>Pedidos emitidos: 0</li>
              </ul>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
