"use client";
import { useState } from "react";
import { Box, Typography, Button, TextField, Chip } from "@mui/material";
import Card from "@/components/ui/card";
import { CheckCircle2Icon, AlertCircleIcon, MessageCircleIcon } from "lucide-react";

export default function WhatsAppIntegrationPage() {
  const [connected, setConnected] = useState(false);
  const [phone, setPhone] = useState("");
  const [apiKey, setApiKey] = useState("");

  const handleConnect = () => {
    if (!phone || !apiKey) {
      alert("Preencha o número do WhatsApp e a API Key");
      return;
    }
    setConnected(true);
    alert("\u2705 Conectado ao WhatsApp Business!");
  };

  return (
    <main style={{ padding: 24, display: "grid", gap: 16 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <MessageCircleIcon size={40} color="#25D366" />
        <Typography variant="h4">Integração WhatsApp Business</Typography>
        {connected ? (
          <Chip label="Conectado" color="success" icon={<CheckCircle2Icon size={16} />} />
        ) : (
          <Chip label="Desconectado" color="error" icon={<AlertCircleIcon size={16} />} />
        )}
      </Box>
      <Card title="Status">
        <div style={{ fontSize: 28, fontWeight: 700, color: connected ? "#10b981" : "#dc2626" }}>
          {connected ? "Ativo" : "Inativo"}
        </div>
      </Card>
      <Box sx={{ p: 3, border: "2px solid #25D366", borderRadius: 2, backgroundColor: "#fff" }}>
        <Typography variant="h6">Configuração</Typography>
        <TextField
          label="Número do WhatsApp"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="API Key"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="success" onClick={handleConnect} sx={{ mt: 2 }}>
          Conectar
        </Button>
      </Box>
      <Typography variant="body2" color="text.secondary">
        Após conectar, notificações automáticas serão enviadas para motoristas e clientes via WhatsApp Business.
      </Typography>
    </main>
  );
}
