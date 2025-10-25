'use client';

import React, { useEffect, useState } from 'react';
import { useDriverWebSocket } from '@/hooks/useWebSocket';
import { useAuth } from '@/app/providers/AuthProvider';
import AccessDenied from '@/components/AccessDenied';
import { hasAnyRole } from '@/lib/rbac';



export default function DriverAppPage() {
  const { user, loading } = useAuth();
  const driverId = 'driver_001';
  const vehicleId = 'vehicle_001';

  // Hooks movidos para o topo do componente para evitar chamadas condicionais
  const [activeTab, setActiveTab] = useState<
    'jornada' | 'checklist' | 'lancamentos' | 'ia' | 'performance'
  >('jornada');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ at: string; sender: string; text: string }>>([]);
  const [journeyStarted, setJourneyStarted] = useState(false);

  const { isConnected, currentLocation, startJourney, endJourney, startBreak } = useDriverWebSocket(
    driverId,
    vehicleId
  );

  const [ack, setAck] = useState(false);
  const [extintor, setExtintor] = useState(false);
  const [pneus, setPneus] = useState(false);
  const [moppStatus, setMoppStatus] = useState<'APTO' | 'PENDENTE' | 'IMPEDIDO' | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('moppChecklistStatus');
      if (raw) setMoppStatus(raw as any);
    } catch (e) {
      console.error('Erro ao carregar status do MOPP:', e);
    }
  }, []);



  if (loading) return <div className="p-8">Carregando permissões…</div>;
  if (!hasAnyRole(user, ['driver', 'admin'])) return <AccessDenied />;

  const tripData = {
    orderId: '#20250915',
    client: 'Cliente Exemplo',
    cargo: 'Carga Exemplo',
    destination: 'Destino Exemplo',
    estimatedArrival: '14:30',
    distance: '85 km',
    route: 'BR-116',
  };

  const handleStartJourney = () => {
    const canStart = moppStatus === 'APTO' || (ack && pneus && extintor);
    if (!canStart) {
      alert('Checklist MOPP não está APTO. Conclua o checklist antes de iniciar a jornada.');
      return;
    }
    setJourneyStarted(true);
    startJourney?.('Iniciando jornada');
  };

  const handleEndJourney = () => {
    setJourneyStarted(false);
    endJourney?.('Finalizando jornada');
  };

  const sendChat = () => {
    const msg = chatInput.trim();
    if (!msg) return;
    const at = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setChatMessages((s) => [...s, { at, sender: 'Você', text: msg }]);
    setChatInput('');
  };

  const PDF_URL = encodeURIComponent(
    'https://lundinmining.com.br/wp-content/uploads/2024/06/CHECK-LIST-TRANSPORTE-PRODUTOS-PERIGOSOS.pdf'
  );
  const PROXY_SRC = `/api/proxy-pdf?url=${PDF_URL}`;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <header className="sticky top-0 bg-white shadow py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">App Motorista</h1>
            <p className="text-sm">Ordem: {tripData.orderId} | Carga: {tripData.cargo}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm">{isConnected ? 'Conectado' : 'Desconectado'}</span>
            {currentLocation && (
              <span className="text-sm">GPS: {String(currentLocation.lat ?? '-')}, {String(currentLocation.lng ?? '-')}</span>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <nav className="mb-4">
          {[
            { key: 'jornada', label: 'Jornada' },
            { key: 'checklist', label: 'Checklist' },
            { key: 'lancamentos', label: 'Lançamentos' },
            { key: 'ia', label: 'IA' },
            { key: 'performance', label: 'Performance' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`mr-2 px-3 py-1 rounded ${activeTab === t.key ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {activeTab === 'jornada' && (
          <section className="space-y-4">
            <div className="p-4 rounded shadow bg-white">
              <h2 className="font-bold">Informações da Viagem</h2>
              <p className="text-sm">Cliente: {tripData.client}</p>
              <p className="text-sm">Destino: {tripData.destination}</p>
              <p className="text-sm">Previsão: {tripData.estimatedArrival}</p>
            </div>

            <div className="p-4 rounded shadow bg-white">
              <h2 className="font-bold">Controle de Jornada</h2>
              <div className="flex gap-2 mt-3">
                {!journeyStarted ? (
                  <button onClick={handleStartJourney} className="px-4 py-2 bg-green-600 text-white rounded">
                    🚀 Iniciar Jornada
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => startBreak?.('Iniciando pausa')}
                      className="px-4 py-2 bg-yellow-500 text-white rounded"
                    >
                      ⏸️ Iniciar Intervalo
                    </button>
                    <button onClick={handleEndJourney} className="px-4 py-2 bg-red-600 text-white rounded">
                      🏁 Finalizar Jornada
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="p-4 rounded shadow bg-white">
              <h3 className="font-semibold mb-2">Chat com Encarregado</h3>
              <div className="h-40 overflow-y-auto p-2 border mb-2">
                {chatMessages.map((m, i) => (
                  <div key={i} className="text-sm">
                    <strong>{m.at} ({m.sender}):</strong> {m.text}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="flex-1 p-2 border rounded" />
                <button onClick={sendChat} className="px-4 py-2 bg-blue-600 text-white rounded">Enviar</button>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'checklist' && (
          <section className="p-4 rounded shadow bg-white">
            <h2 className="font-bold">Checklist Pré-Viagem (MOPP)</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const status = ack && pneus && extintor ? 'APTO' : 'PENDENTE';
                try {
                  localStorage.setItem('moppChecklistStatus', status);
                  setMoppStatus(status as any);
                } catch (error) {
                  console.error('Erro ao salvar checklist:', error);
                }
                alert(`Checklist salvo: ${status}`);
              }}
              className="space-y-3 mt-3"
            >
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={extintor} onChange={(e) => setExtintor(e.target.checked)} /> Extintor
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={pneus} onChange={(e) => setPneus(e.target.checked)} /> Pneus
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} /> Li e concordo
              </label>
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Salvar Checklist</button>
                <a href={PROXY_SRC} target="_blank" rel="noreferrer" className="px-4 py-2 bg-gray-100 rounded">Abrir PDF</a>
              </div>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
