'use client';
import { useState, useEffect } from 'react';
import { Alert, Box, Button, Typography } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import { isUserVerified } from '@/lib/permissions';

interface EmailVerificationProps {
  email: string;
  onVerified?: () => void;
}

export default function EmailVerification({ email, onVerified }: EmailVerificationProps) {
  const [verified, setVerified] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    // Verifica se o email já está verificado
    const isVerified = isUserVerified(email);
    setVerified(isVerified);
    
    if (isVerified && onVerified) {
      onVerified();
    }
  }, [email, onVerified]);

  const handleSendEmail = async () => {
    // Em produção, enviar email real
    console.log('Enviando email de confirmação para:', email);
    
    // Simula envio
    setSent(true);
    
    // Para usuários já autorizados, considerar verificado automaticamente
    const isVerified = isUserVerified(email);
    if (isVerified) {
      setVerified(true);
      if (onVerified) {
        onVerified();
      }
    }
  };

  if (verified) {
    return (
      <Alert severity="success" sx={{ mb: 3 }}>
        ✅ Email verificado com sucesso!
      </Alert>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      {sent ? (
        <Alert severity="info">
          📧 Email de confirmação enviado para <strong>{email}</strong>.
          Verifique sua caixa de entrada e spam.
        </Alert>
      ) : (
        <Alert 
          severity="warning"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={handleSendEmail}
              startIcon={<EmailIcon />}
            >
              Enviar Email
            </Button>
          }
        >
          <Typography variant="body2">
            Para acessar o sistema, você precisa confirmar seu email.
          </Typography>
        </Alert>
      )}
    </Box>
  );
}
