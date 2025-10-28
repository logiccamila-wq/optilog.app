'use client';
import { Box, Typography, Grid, Card, CardContent, TextField, Button } from '@mui/material';

export default function FrotaLavaJatoPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        🧼 Lava Jato
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Agendar Lavagem</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField label="Placa do Veículo" fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Data" type="date" fullWidth InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Observações" fullWidth multiline rows={3} />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained">Agendar</Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Últimas Lavagens</Typography>
              <ul>
                <li>ABC-1234 - 20/10/2025 - Completa</li>
                <li>XYZ-5678 - 18/10/2025 - Chassi</li>
              </ul>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
