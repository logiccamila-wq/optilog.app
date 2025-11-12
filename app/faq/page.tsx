"use client";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faqs = [
  { q: "Como redefinir minha senha?", a: "Acesse a tela de login e clique em 'Esqueci minha senha'. Siga as instruções enviadas por e-mail." },
  { q: "Como cadastrar novo veículo?", a: "Vá em Cadastros > Veículos e clique em 'Novo Veículo'. Preencha os dados e salve." },
  { q: "Como acessar relatórios?", a: "Acesse o menu Relatórios e escolha o tipo desejado. Use filtros para refinar a busca." },
  { q: "Como integrar Notion, Calendar, WhatsApp?", a: "Acesse Integrações, selecione o serviço desejado e siga o passo a passo de conexão." },
  { q: "Como acionar suporte?", a: "Use o chat integrado ou envie e-mail para devops@optilog.app." }
];

export default function FAQPage() {
  return (
    <main style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom>FAQ - Dúvidas Frequentes</Typography>
      <Box>
        {faqs.map((item, idx) => (
          <Accordion key={idx}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{item.q}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{item.a}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </main>
  );
}
