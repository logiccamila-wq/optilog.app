"use client";
import { Box, Typography, Paper, Chip } from "@mui/material";

const alertas = [
  { tipo: "API", msg: "API fora do ar!", status: "crítico", data: "2025-11-11 10:12" },
  { tipo: "Performance", msg: "Tempo de resposta > 2s", status: "atenção", data: "2025-11-11 09:55" },
  { tipo: "Login", msg: "Falha de autenticação detectada", status: "atenção", data: "2025-11-11 09:30" }
];

export default function AlertasPage() {
  return (
    <main style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom>Central de Alertas</Typography>
      <Box sx={{ display: "grid", gap: 2 }}>
        {alertas.map((a, idx) => (
          <Paper key={idx} sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
            <Chip label={a.status.toUpperCase()} color={a.status === "crítico" ? "error" : "warning"} />
            <Typography sx={{ flex: 1 }}>{a.msg}</Typography>
            <Typography variant="caption" color="text.secondary">{a.data}</Typography>
          </Paper>
        ))}
      </Box>
    </main>
  );
}
