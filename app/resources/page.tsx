import Link from 'next/link';

export default function ResourcesPage() {
  const items = [
    { label: 'Cronograma (docs/roadmaps.md)', href: '/modules/roadmap' },
    { label: 'Estrutura do Projeto (docs/structure.md)', href: 'https://github.com/' },
    { label: 'Kits Frontend', href: '/kits/frontend' },
    { label: 'Kits Backend', href: '/kits/backend' },
    { label: 'API Data (docs/data-api.md)', href: '/docs/data-api.md' },
    { label: 'DevTools (modo desenvolvedor)', href: '/dev' },
  ];

  return (
    <section>
      <h1 style={{ marginTop: 0 }}>Recursos & Kits</h1>
      <p style={{ color: '#9aa3b0' }}>
        Documentação, kits e atalhos para acelerar desenvolvimento.
      </p>
      <ul style={{ paddingLeft: 18 }}>
        {items.map((i) => (
          <li key={i.label}>
            <Link href={i.href} style={{ color: '#9ecfff', textDecoration: 'none' }}>
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 16, fontSize: 13, color: '#9aa3b0' }}>
        Dica: use o script de scaffold em <code>scripts/scaffold.js</code> para criar módulos.
      </div>
    </section>
  );
}
