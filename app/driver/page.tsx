"use client";
import Link from 'next/link';

export default function DriverAppPage() {
  return (
    <main className="container" style={{ display: 'grid', gap: 12 }}>
      <h1>App do Motorista</h1>
      <p style={{ color: '#909095' }}>
        Versão web de validação. Funcionalidades previstas: abastecimento, checklist, rotas e comprovantes.
      </p>
      <ul>
        <li>Abastecimento: registrar abastecimentos com foto do recibo</li>
        <li>Checklist: início/fim de turno e condições do veículo</li>
        <li>Rotas: ver paradas do dia e status de entrega</li>
        <li>Documentos: CNH/CRLV e comprovantes em nuvem</li>
      </ul>
      <p>
        Por agora, use os módulos do <Link href="/dashboard/logistica">Dashboard &rarr; Logística</Link> para simulação.
      </p>
    </main>
  );
}