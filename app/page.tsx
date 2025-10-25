"use client";

import React, { useState } from "react";
import { Typography, Button, Box, Grid, TextField } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

export default function HomePage() {
  const themes = ["theme-blue", "theme-purple", "theme-green"] as const;
  const [themeIndex, setThemeIndex] = useState(0);
  const currentTheme = themes[themeIndex];

  const cycleTheme = () => setThemeIndex((i) => (i + 1) % themes.length);

  return (
    <main className={`${styles.heroContainer} ${currentTheme}`}>
      <div className={styles.heroBg} />

      <section className={styles.heroCard} aria-label="Devoptilog Hero">
        <div className={styles.headerRow}>
          <Image src="/logo.svg" alt="Devoptilog" width={160} height={48} />
          <span className={styles.poweredChip}>Powered by TRAE IDE • Next 14</span>
        </div>

        <div className={styles.copy}>
          <Typography variant="h3" component="h1" sx={{ mb: 1, fontWeight: 800 }}>
            Devoptilog: Desenvolvimento Otimizado para Logística
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.78)" }}>
            Transforme a gestão de frotas com inteligência artificial e fluxo contínuo.
          </Typography>
        </div>

        {/* Card de login integrado ao hero */}
        <Box component="form" className={styles.formWrap}>
          <TextField
            label="Email ou Usuário"
            type="email"
            fullWidth
            sx={{
              "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.82)" },
              "& .MuiFormLabel-root.Mui-focused": { color: "var(--accent-color)" },
              "& .MuiOutlinedInput-input": { color: "rgba(255,255,255,0.92)" },
              "& .MuiOutlinedInput-root": {
                background: "rgba(255,255,255,0.05)",
                "& fieldset": { borderColor: "rgba(255,255,255,0.26)" },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.38)" },
                "&.Mui-focused fieldset": { borderColor: "var(--accent-color)" },
              },
            }}
          />
          <TextField
            label="Senha"
            type="password"
            fullWidth
            sx={{
              "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.82)" },
              "& .MuiFormLabel-root.Mui-focused": { color: "var(--accent-color)" },
              "& .MuiOutlinedInput-input": { color: "rgba(255,255,255,0.92)" },
              "& .MuiOutlinedInput-root": {
                background: "rgba(255,255,255,0.05)",
                "& fieldset": { borderColor: "rgba(255,255,255,0.26)" },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.38)" },
                "&.Mui-focused fieldset": { borderColor: "var(--accent-color)" },
              },
            }}
          />
          <Box className={styles.buttons}>
            <Button component={Link} href="/login" variant="contained" size="large">
              Entrar
            </Button>
            <Button
              component={Link}
              href="/signup"
              variant="outlined"
              size="large"
              sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)", ":hover": { borderColor: "#fff" } }}
            >
              Cadastre-se Grátis
            </Button>
            <Button
              component={Link}
              href="/dashboard"
              variant="outlined"
              size="large"
              sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)", ":hover": { borderColor: "#fff" } }}
            >
              Ver dashboard
            </Button>
            <Button
              onClick={cycleTheme}
              variant="text"
              size="large"
              sx={{ color: "#fff" }}
              aria-label="Mudar cor"
            >
              Mudar cor
            </Button>
          </Box>
        </Box>

        <div className={styles.footerNote}>Melhor experiência começa com login ou cadastro.</div>
      </section>
    </main>
  );
}
