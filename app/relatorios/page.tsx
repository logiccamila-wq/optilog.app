"use client";
import { Box, Typography, Button, Paper } from "@mui/material";

const relatorios = [
  { nome: "Viagens por período", desc: "Visualize e exporte viagens realizadas em um intervalo de datas." },
  { nome: "Manutenções e custos", desc: "Acompanhe manutenções realizadas e custos associados." },
  { nome: "Performance de motoristas", desc: "Compare indicadores de desempenho dos motoristas." },
  { nome: "Consumo de combustível", desc: "Analise o consumo médio e total por veículo." },
  { nome: "Faturamento e NF-e/CT-e", desc: "Relatórios fiscais e de faturamento detalhados." }
];

export default function RelatoriosPage() {
  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom>Relatórios Customizados</Typography>
      <Box sx={{ display: "grid", gap: 3 }}>
        {relatorios.map((r, idx) => (
          <Paper key={idx} sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6">{r.nome}</Typography>
            <Typography color="text.secondary">{r.desc}</Typography>
            <Button variant="outlined" sx={{ mt: 1 }}>Visualizar</Button>
          </Paper>
        ))}
      </Box>
    </main>
  );
}
