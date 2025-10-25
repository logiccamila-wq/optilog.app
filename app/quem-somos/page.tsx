'use client';

import Image from 'next/image';
import React from 'react';

function AnimatedCube() {
  const rays = Array.from({ length: 24 }).map((_, i) => {
    const angle = (i / 24) * Math.PI * 2;
    const x2 = 128 + Math.cos(angle) * 110;
    const y2 = 128 + Math.sin(angle) * 110;
    return (
      <line
        key={i}
        x1={128}
        y1={128}
        x2={x2}
        y2={y2}
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        style={{ strokeDasharray: '6 10' }}
        className="animate-[dash_6s_linear_infinite]"
      />
    );
  });

  return (
    <svg
      viewBox="0 0 256 256"
      width={300}
      height={300}
      className="animate-spin-slow"
      style={{ color: 'var(--color-brand)', filter: 'drop-shadow(0 0 10px var(--color-brand))' }}
    >
      {/* Rays */}
      <g opacity={0.75}>{rays}</g>

      {/* Cube (isometric) */}
      <g stroke="currentColor" strokeWidth={2} fill="none">
        {/* Back square */}
        <polygon points="86,86 146,66 176,96 116,116" />
        {/* Front square */}
        <polygon points="66,126 126,106 156,136 96,156" />
        {/* Connectors */}
        <line x1={86} y1={86} x2={66} y2={126} />
        <line x1={146} y1={66} x2={126} y2={106} />
        <line x1={176} y1={96} x2={156} y2={136} />
        <line x1={116} y1={116} x2={96} y2={156} />
        {/* Center node */}
        <circle
          cx={128}
          cy={128}
          r={4}
          fill="currentColor"
          className="animate-[glow_3s_ease-in-out_infinite]"
        />
      </g>
    </svg>
  );
}

export default function QuemSomosPage() {
  return (
    <main
      className="container"
      style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, alignItems: 'center' }}
    >
      <section>
        <h1 className="header" style={{ letterSpacing: '0.02em' }}>
          Quem somos
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.7, color: 'var(--color-text)' }}>
          Somos a <strong>XYZ LogicFlow Technology</strong>, uma equipe apaixonada por unir dados,
          automação e experiência do usuário para acelerar decisões operacionais. Nosso sistema
          integra <em>WMS, TMS, OMS, SCM, CRM</em> e <em>ERP</em> em um único fluxo — com dashboards
          responsivos, IA aplicada e uma arquitetura segura e escalável.
        </p>
        <p style={{ fontSize: 18, lineHeight: 1.7, marginTop: 12, color: 'var(--color-text)' }}>
          A plataforma foi projetada para visibilidade em tempo real, redução de custos e
          performance. Com temas personalizáveis e paletas dinâmicas, a identidade visual acompanha
          sua marca, enquanto os módulos colaboram de ponta a ponta.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <a
            href="/resources"
            className="inline-flex items-center justify-center rounded-lg border border-[var(--color-brand)] px-4 py-2 text-[var(--color-brand)] hover:bg-[var(--color-secondary)]"
          >
            Recursos
          </a>
          <a
            href="/signup"
            className="inline-flex items-center justify-center rounded-lg bg-[var(--color-brand)] px-4 py-2 text-[var(--color-on-brand)] hover:opacity-90"
          >
            Começar agora
          </a>
        </div>
      </section>
      <aside style={{ display: 'grid', alignContent: 'center', justifyItems: 'center', gap: 16 }}>
        <Image src="/logo-xyz.svg" alt="XYZ LogicFlow" width={220} height={220} />
        <AnimatedCube />
      </aside>
    </main>
  );
}
