import Link from 'next/link';
import { Box, Button, Paper, Typography } from '@mui/material';
import { Home, ArrowBack } from '@mui/icons-material';

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 3
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 6,
          maxWidth: 500,
          textAlign: 'center'
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: '120px',
            fontWeight: 800,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          404
        </Typography>

        <Typography variant="h4" gutterBottom fontWeight={700}>
          Página não encontrada
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          A página que você está procurando não existe ou foi movida.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            component={Link}
            href="/"
            variant="contained"
            size="large"
            startIcon={<Home />}
          >
            Voltar para Home
          </Button>
          <Button
            onClick={() => window.history.back()}
            variant="outlined"
            size="large"
            startIcon={<ArrowBack />}
          >
            Página Anterior
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
