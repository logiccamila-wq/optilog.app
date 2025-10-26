"use client";

export default function MechanicAppPage() {
  return (
    <main className="container" style={{ display: 'grid', gap: 12 }}>
      <h1>App do Mecânico</h1>
      <p style={{ color: '#909095' }}>
        Versão web de validação. Funcionalidades previstas: ordens de serviço, manutenção preventiva e registros de peças.
      </p>
      <ul>
        <li>Abrir/fechar O.S. com fotos e laudos</li>
        <li>Agenda de preventiva por hodômetro/tempo</li>
        <li>Catálogo de peças e histórico por veículo</li>
        <li>Integração com Dashboard para alertas e KPIs</li>
      </ul>
      <p>
        Para navegação técnica, use também <a href="/dashboard/analise">Dashboard → Análise</a>.
      </p>
    </main>
  );
}