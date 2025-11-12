"use client";
import { useState } from "react";
import { Box, Typography, Button, Stepper, Step, StepLabel } from "@mui/material";

const steps = [
  "Bem-vindo ao Optilog.app!",
  "Cadastre seu primeiro veículo",
  "Adicione motoristas e usuários",
  "Configure integrações (Notion, Calendar, WhatsApp)",
  "Acesse relatórios e dashboards",
  "Pronto! Explore o sistema."
];

export default function OnboardingPage() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <main style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom>Onboarding</Typography>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, idx) => (
          <Step key={label} completed={activeStep > idx}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
        <Button
          disabled={activeStep === 0}
          onClick={() => setActiveStep(s => s - 1)}
        >Anterior</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setActiveStep(s => Math.min(s + 1, steps.length - 1))}
        >{activeStep === steps.length - 1 ? "Finalizar" : "Próximo"}</Button>
      </Box>
    </main>
  );
}
