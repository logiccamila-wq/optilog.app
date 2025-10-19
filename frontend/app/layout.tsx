import '../styles/globals.css';
import React from 'react';

export const metadata = {
  title: 'OptiLog',
  description: 'Frontend simples integrado ao backend',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
