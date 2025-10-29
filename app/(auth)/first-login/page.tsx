'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Container,
  Link as MuiLink,
  Paper,
} from '@mui/material';
import { CheckCircle, Security } from '@mui/icons-material';
import { BRANDING } from '@/config/branding';

export default function FirstLoginPage() {
  const router = useRouter();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);

  const canProceed = termsAccepted && privacyAccepted;

  const handleAccept = () => {
    if (!canProceed) return;

    // Persist marketing consent if accepted
    if (typeof window !== 'undefined') {
      localStorage.setItem('marketing_consent', marketingAccepted.toString());
      localStorage.setItem('terms_accepted', 'true');
      localStorage.setItem('privacy_accepted', 'true');
      localStorage.setItem('first_login_completed', new Date().toISOString());
    }

    // Redirect to email verification
    router.push('/verify-email');
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          border: '1px solid rgba(255,255,255,0.08)',
          bgcolor: 'rgba(17,23,40,0.9)',
        }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <Security fontSize="large" />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Bem-vindo ao {BRANDING.product.name}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {BRANDING.product.tagline}
          </Typography>
        </Box>

        <Card
          elevation={0}
          sx={{
            bgcolor: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            mb: 3,
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Tela de Primeiro Acesso
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Para continuar, você precisa aceitar os termos e condições do {BRANDING.company.name}.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    sx={{ color: 'primary.main' }}
                  />
                }
                label={
                  <Typography variant="body2">
                    Li e aceito os{' '}
                    <MuiLink
                      href={BRANDING.legal.contracts.drive1}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 600 }}
                    >
                      Termos de Uso
                    </MuiLink>{' '}
                    *
                  </Typography>
                }
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    sx={{ color: 'primary.main' }}
                  />
                }
                label={
                  <Typography variant="body2">
                    Li e aceito a{' '}
                    <MuiLink
                      href={BRANDING.legal.contracts.drive2}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 600 }}
                    >
                      Política de Privacidade
                    </MuiLink>{' '}
                    *
                  </Typography>
                }
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={marketingAccepted}
                    onChange={(e) => setMarketingAccepted(e.target.checked)}
                    sx={{ color: 'primary.main' }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Aceito receber comunicações de marketing e novidades (opcional)
                  </Typography>
                }
              />
            </Box>

            <Typography variant="caption" sx={{ display: 'block', mt: 3, color: 'text.secondary' }}>
              * Campos obrigatórios
            </Typography>
          </CardContent>
        </Card>

        <Button
          variant="contained"
          size="large"
          fullWidth
          disabled={!canProceed}
          onClick={handleAccept}
          startIcon={<CheckCircle />}
          sx={{
            py: 1.5,
            fontWeight: 600,
            bgcolor: canProceed ? 'primary.main' : 'action.disabled',
          }}
        >
          Aceitar e Continuar
        </Button>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
            <Security fontSize="small" />
            Seus dados estão protegidos e serão tratados de acordo com a LGPD
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
