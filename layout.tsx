// frontend/app/layout.tsx
import './globals.css'; // ajuste se tiver outro nome

export const metadata = {
  title: 'Devoptilog',
  description: 'Optimized Logistics Development',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
