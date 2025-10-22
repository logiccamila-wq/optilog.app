'use client';

import { useState, useEffect } from 'react';
import { getWebSocketService, WebSocketService } from '../../lib/websocket';
import { useDriverWebSocket } from '@/hooks/useWebSocket';

import { useAuth } from '@/app/providers/AuthProvider';
import AccessDenied from '@/components/AccessDenied';
import { hasAnyRole } from '@/lib/rbac';
import Link from 'next/link';
import MOPPChecklist from '@/components/driver/MOPPChecklist';

const STAGES = [
  'AGUARDANDO ORDEM',
  'INÍCIO (CHECKLIST OK)',
  'VIAGEM EM ANDAMENTO',
  'CHEGADA AO CLIENTE',
  'CONCLUÍDO'
];

const JOURNEY_STAGES = [
  { id: 'waiting', label: 'Aguardando Ordem', icon: '⏳' },
  { id: 'started', label: 'Jornada Iniciada', icon: '🚀' },
  { id: 'in_transit', label: 'Em Trânsito', icon: '🚛' },
  { id: 'at_client', label: 'No Cliente', icon: '🏢' },
  { id: 'completed', label: 'Concluído', icon: '✅' }
];

export default function DriverAppPage() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="text-gray-600">Carregando permissões…</div>
      </div>
    );
  }
  if (!hasAnyRole(user, ["driver", "admin"])) {
    return <AccessDenied />;
  }
  const [activeTab, setActiveTab] = useState<'jornada'|'checklist'|'lancamentos'|'ia'|'performance'>('jornada');
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { at: '10:30', sender: 'Encarregado', text: 'O cliente confirmou a janela de descarga. Proceda com o checklist.' },
    { at: '10:35', sender: 'Você', text: 'Checklist iniciado. Documentação OK.' },
  ]);

  // Driver and Vehicle IDs (in production, these would come from authentication/context)
  const driverId = 'driver_001';
  const vehicleId = 'vehicle_001';
  
  // WebSocket integration
  const {
    isConnected,
    currentLocation,
    startJourney: wsStartJourney,
    endJourney: wsEndJourney,
    startBreak: wsStartBreak,
    endBreak: wsEndBreak,
    startDelivery,
    completeDelivery,
    sendAlert
  } = useDriverWebSocket(driverId, vehicleId);

  // Estados do controle de jornada
  const [journeyStarted, setJourneyStarted] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [journeyStartTime, setJourneyStartTime] = useState<Date | null>(null);
  const [breakStartTime, setBreakStartTime] = useState<Date | null>(null);
  const [totalWorkTime, setTotalWorkTime] = useState(0);
  const [totalBreakTime, setTotalBreakTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // WebSocket e localização
  const [wsService, setWsService] = useState<WebSocketService | null>(null);

  // Estados do checklist
  const [ack, setAck] = useState(false);
  const [extintor, setExtintor] = useState(false);
  const [pneus, setPneus] = useState(false);
  const [moppStatus, setMoppStatus] = useState<'APTO'|'PENDENTE'|'IMPEDIDO'|null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('moppChecklistStatus');
      if (raw) setMoppStatus(raw as any);
    } catch {}
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'moppChecklistStatus' && e.newValue) {
        setMoppStatus(e.newValue as any);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Estados da viagem
  const [tripData] = useState({
    orderId: '#20250915',
    client: 'Petroquímica Vale do Rio',
    cargo: 'Ácido Sulfúrico (UN 1830)',
    destination: 'Av. Industrial, 1500 - Cubatão/SP',
    estimatedArrival: '14:30',
    distance: '85 km',
    route: 'BR-116 → SP-160 → Rodovia Cônego Domênico Rangoni'
  });

  // Inicializar WebSocket e geolocalização
  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Inicializar WebSocket
        const ws = getWebSocketService();
        setWsService(ws);
        
        await ws.connect();
        ws.sendAlert(driverId, vehicleId, { level: 'info', message: 'Driver conectado' });
        
        // Configurar listeners
        ws.subscribe('notification', (message) => {
          console.log('Notificação recebida:', message);
          // Aqui você pode adicionar notificações toast
        });
        
        // Geolocalização é gerenciada pelo hook useDriverWebSocket; nenhuma ação adicional aqui.
      } catch (error) {
        console.error('Erro ao inicializar serviços:', error);
      }
    };
    
    initializeServices();
    
    return () => {
      if (wsService) {
        wsService.disconnect();
      }
    };
  }, []);

  // Atualizar tempo atual a cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Calcular tempo trabalhado
      if (journeyStarted && journeyStartTime && !onBreak) {
        const workTime = Math.floor((new Date().getTime() - journeyStartTime.getTime()) / 1000 / 60);
        setTotalWorkTime(workTime);
      }
      
      // Calcular tempo de intervalo
      if (onBreak && breakStartTime) {
        const breakTime = Math.floor((new Date().getTime() - breakStartTime.getTime()) / 1000 / 60);
        setTotalBreakTime(breakTime);
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [journeyStarted, journeyStartTime, onBreak, breakStartTime]);

  // Funções de controle de jornada
  const startJourney = () => {
    const canStart = (moppStatus === 'APTO') || (ack && pneus && extintor);
    if (!canStart) {
      if (wsService) {
        wsService.sendAlert(driverId, vehicleId, { level: 'error', message: 'Tentativa de iniciar jornada com checklist não APTO' });
      }
      alert('Checklist MOPP não está APTO. Conclua o checklist antes de iniciar a jornada.');
      return;
    }
    setJourneyStarted(true);
    setJourneyStartTime(new Date());
    setCurrentStageIndex(1);
    wsStartJourney('Jornada iniciada pelo motorista');
  };

  const startBreak = () => {
    setOnBreak(true);
    setBreakStartTime(new Date());
    wsStartBreak('Pausa iniciada pelo motorista');
  };

  const endBreak = () => {
    setOnBreak(false);
    setBreakStartTime(null);
    wsEndBreak('Pausa finalizada pelo motorista');
  };

  const endJourney = () => {
    setJourneyStarted(false);
    setOnBreak(false);
    setCurrentStageIndex(4);
    wsEndJourney('Jornada finalizada pelo motorista');
  };

  // Ações no Cliente
  const arriveAtClient = () => {
    setCurrentStageIndex(3);
    if (wsService) {
      wsService.sendAlert(driverId, vehicleId, { level: 'info', message: 'Chegada ao cliente' });
    }
  };

  const enterWaiting = () => {
    if (wsService) {
      wsService.sendAlert(driverId, vehicleId, { level: 'warning', message: 'Em espera no cliente' });
    }
  };

  const beginUnload = () => {
    startDelivery('Início de descarga');
  };

  const endUnload = () => {
    completeDelivery('Fim de descarga');
    setCurrentStageIndex(4);
  };

  const resumeTrip = () => {
    setCurrentStageIndex(2);
    if (wsService) {
      wsService.sendStatusChange(driverId, vehicleId, { status: 'in_transit', location: currentLocation || undefined });
      wsService.sendAlert(driverId, vehicleId, { level: 'info', message: 'Viagem retomada' });
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const brand = 'var(--color-brand)';
  const onBrand = 'var(--color-on-brand)';
  const textColor = 'var(--color-text)';
  const secondary = 'var(--color-secondary)';
  const border = 'var(--color-border)';
  const tabs = [
    { key: 'jornada', label: '🚦 Jornada & Status' },
    { key: 'checklist', label: '✅ Checklist MOPP' },
    { key: 'lancamentos', label: '⛽ Lançamentos' },
    { key: 'ia', label: '🧠 Assistente IA' },
    { key: 'performance', label: '📊 Performance + Chat IA' },
  ] as const;

  const sendChat = () => {
    const msg = chatInput.trim();
    if (!msg) return;
    const at = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [...prev, { at, sender: 'Você', text: msg }]);
    setChatInput('');
  };

  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const askAI = async () => {
    const q = aiQuestion.trim();
    if (!q) return;
    setAiLoading(true);
    setAiAnswer(null);
    try {
      const context = `Contexto do motorista:\n- Etapa atual: ${STAGES[currentStageIndex]}\n- Jornada iniciada: ${journeyStarted ? 'sim' : 'não'}\n- Em intervalo: ${onBreak ? 'sim' : 'não'}\n- Tempo trabalhado: ${formatTime(totalWorkTime)}\n- Tempo de intervalo: ${formatTime(totalBreakTime)}\n- DriverId: ${driverId}, VehicleId: ${vehicleId}\n${currentLocation ? `- Localização: ${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}` : ''}`;

      const prompt = `Você é um assistente para um motorista de cargas perigosas. Responda de forma breve e prática, focando segurança e eficiência.\n${context}\n\nPergunta: ${q}`;
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, stub: true })
      });
      const data = await res.json();
      const text =
        data?.output?.[0]?.content?.[0]?.text ??
        data?.choices?.[0]?.message?.content ??
        data?.content?.[0]?.text ??
        JSON.stringify(data);
      setAiAnswer(text);
    } catch (e: any) {
      setAiAnswer(`Erro: ${e?.message || String(e)}`);
    } finally {
      setAiLoading(false);
    }
  };

  const PDF_URL = encodeURIComponent('https://lundinmining.com.br/wp-content/uploads/2024/06/CHECK-LIST-TRANSPORTE-PRODUTOS-PERIGOSOS.pdf');
  const PROXY_SRC = `/api/proxy-pdf?url=${PDF_URL}`;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)', color: textColor }}>
      {/* Links rápidos removidos temporariamente para depuração */}
      <header className="sticky top-0 shadow-md z-10" style={{ backgroundColor: secondary }}>
        <div className="container mx-auto px-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold" style={{ color: brand }}>App Motorista | Carga Química</h1>
                <p className="text-sm mb-2" style={{ color: 'var(--color-text)' }}>Ordem: #20250915 | Carga: Ácido Sulfúrico (UN 1830)</p>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs" style={{ color: 'var(--color-text)' }}>
                  {isConnected ? 'Conectado' : 'Desconectado'}
                </span>
                {currentLocation && (
                  <span className="text-xs ml-2" style={{ color: 'var(--color-text)' }}>
                    GPS: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                  </span>
                )}
              </div>
            </div>
      
            <nav className="flex overflow-x-auto space-x-4 border-b" style={{ borderColor: border }}>
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex-shrink-0 p-2 transition font-medium`}
                  style={
                    activeTab === tab.key
                      ? { color: brand, borderBottom: `2px solid ${brand}` }
                      : { color: textColor }
                  }
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </header>
      
        <main className="container mx-auto p-4 pt-6">
          {activeTab === 'jornada' && (
            <div className="space-y-6">
              {/* Informações da Viagem */}
              <div className="rounded-xl shadow p-6" style={{ backgroundColor: secondary, borderRadius: 'var(--radius)' }}>
                <h2 className="text-xl font-bold mb-4" style={{ color: brand }}>📋 Informações da Viagem</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Cliente:</strong> {tripData.client}</p>
                    <p><strong>Destino:</strong> {tripData.destination}</p>
                    <p><strong>Distância:</strong> {tripData.distance}</p>
                  </div>
                  <div>
                    <p><strong>Previsão Chegada:</strong> {tripData.estimatedArrival}</p>
                    <p><strong>Rota:</strong> {tripData.route}</p>
                    <p><strong>Hora Atual:</strong> {currentTime.toLocaleTimeString('pt-BR')}</p>
                  </div>
                </div>
              </div>
      
              {/* Controle de Jornada */}
              <div className="rounded-xl shadow p-6" style={{ backgroundColor: secondary, borderRadius: 'var(--radius)' }}>
                <h2 className="text-xl font-bold mb-4" style={{ color: brand }}>⏰ Controle de Jornada</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                  <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--color-bg)' }}>
                    <p className="font-semibold">Tempo Trabalhado</p>
                    <p className="text-lg" style={{ color: brand }}>{formatTime(totalWorkTime)}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--color-bg)' }}>
                    <p className="font-semibold">Tempo Intervalo</p>
                    <p className="text-lg" style={{ color: brand }}>{formatTime(totalBreakTime)}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--color-bg)' }}>
                    <p className="font-semibold">Status</p>
                    <p className="text-lg" style={{ color: onBreak ? '#f59e0b' : journeyStarted ? '#10b981' : '#6b7280' }}>
                      {onBreak ? '⏸️ Intervalo' : journeyStarted ? '🚛 Trabalhando' : '⏳ Parado'}
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--color-bg)' }}>
                    <p className="font-semibold">Limite Diário</p>
                    <p className="text-lg" style={{ color: totalWorkTime > 480 ? '#ef4444' : brand }}>8h 00m</p>
                  </div>
                </div>
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-sm font-semibold">Checklist MOPP:</span>
                  <span className="px-2 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: moppStatus==='APTO' ? '#10b981' : moppStatus==='IMPEDIDO' ? '#ef4444' : '#f59e0b', color: 'white' }}>
                    {moppStatus || 'PENDENTE'}
                  </span>
                </div>
      
                <div className="flex flex-wrap gap-3">
                  {!journeyStarted ? (
                    <button
                      onClick={startJourney}
                      disabled={!((moppStatus === 'APTO') || (ack && pneus && extintor))}
                      className="flex-1 min-w-[200px] font-bold py-3 rounded-lg hover:opacity-90"
                      style={{ backgroundColor: '#10b981', color: 'white', opacity: ((moppStatus === 'APTO') || (ack && pneus && extintor)) ? 1 : 0.5, cursor: ((moppStatus === 'APTO') || (ack && pneus && extintor)) ? 'pointer' : 'not-allowed' }}
                    >
                      🚀 Iniciar Jornada
                    </button>
                  ) : (
                    <>
                      {!onBreak ? (
                        <button
                          onClick={startBreak}
                          className="flex-1 min-w-[150px] font-bold py-3 rounded-lg hover:opacity-90"
                          style={{ backgroundColor: '#f59e0b', color: 'white' }}
                        >
                          ⏸️ Iniciar Intervalo
                        </button>
                      ) : (
                        <button
                          onClick={endBreak}
                          className="flex-1 min-w-[150px] font-bold py-3 rounded-lg hover:opacity-90"
                          style={{ backgroundColor: '#10b981', color: 'white' }}
                        >
                          ▶️ Finalizar Intervalo
                        </button>
                      )}
                      <button
                        onClick={endJourney}
                        className="flex-1 min-w-[150px] font-bold py-3 rounded-lg hover:opacity-90"
                        style={{ backgroundColor: '#ef4444', color: 'white' }}
                      >
                        🏁 Finalizar Jornada
                      </button>
                    </>
                  )}
                </div>

                {/* Ações no Cliente */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  <button onClick={arriveAtClient} className="font-bold py-2 rounded-lg hover:opacity-90" style={{ backgroundColor: '#3b82f6', color: 'white' }}>📍 Chegada ao Cliente</button>
                  <button onClick={enterWaiting} className="font-bold py-2 rounded-lg hover:opacity-90" style={{ backgroundColor: '#f59e0b', color: 'white' }}>⏳ Em Espera</button>
                  <button onClick={beginUnload} className="font-bold py-2 rounded-lg hover:opacity-90" style={{ backgroundColor: '#10b981', color: 'white' }}>📥 Início de Descarga</button>
                  <button onClick={endUnload} className="font-bold py-2 rounded-lg hover:opacity-90" style={{ backgroundColor: '#ef4444', color: 'white' }}>✅ Fim de Descarga</button>
                  <button onClick={resumeTrip} className="font-bold py-2 rounded-lg hover:opacity-90 md:col-span-2" style={{ backgroundColor: '#2563eb', color: 'white' }}>🚛 Início/Retomar Viagem</button>
                </div
                >
              </div>
      
              {/* Status da Missão */}
              <div className="rounded-xl shadow p-6" style={{ backgroundColor: secondary, borderRadius: 'var(--radius)' }}>
                <h2 className="text-xl font-bold mb-4" style={{ color: brand }}>🎯 Status Atual da Missão</h2>
                <div className="text-center p-4 rounded-lg font-extrabold text-2xl transition" style={{ backgroundColor: brand, color: onBrand, borderRadius: 'var(--radius)' }}>
                  {STAGES[currentStageIndex]}
                </div>
      
                <div className="mt-6">
                  <h3 className="font-semibold mb-2" style={{ color: textColor }}>Progresso da Entrega</h3>
                  <div className="flex flex-wrap gap-2 justify-center text-sm">
                    {STAGES.map((s, idx) => (
                      <span
                        key={s}
                        className={`px-3 py-1 rounded-full border`}
                        style={{
                          borderColor: idx <= currentStageIndex ? brand : border,
                          backgroundColor: idx <= currentStageIndex ? brand : secondary,
                          color: idx <= currentStageIndex ? onBrand : textColor,
                          borderRadius: 'var(--radius)'
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
      
              <div className="mt-8 border-t pt-4" style={{ borderColor: border }}>
                <h3 className="font-semibold mb-3" style={{ color: textColor }}>💬 Chat com Encarregado</h3>
                <div className="h-40 p-3 rounded-lg overflow-y-auto mb-3 text-sm" style={{ backgroundColor: secondary, borderRadius: 'var(--radius)' }}>
                  {chatMessages.map((m, i) => (
                    <p key={i} style={{ textAlign: m.sender === 'Você' ? 'right' as const : 'left' as const, color: m.sender === 'Você' ? brand : textColor }}>
                      <strong>{m.at} ({m.sender}):</strong> {m.text}
                    </p>
                  ))}
                </div>
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendChat();
                    }
                  }}
                  className="w-full p-2 border rounded-lg"
                  style={{ borderColor: border, backgroundColor: secondary, color: textColor, borderRadius: 'var(--radius)' }}
                  rows={1}
                  placeholder="Enviar mensagem..."
                />
                <button
                  onClick={sendChat}
                  className="w-full font-bold py-2 mt-2 rounded-lg hover:opacity-90"
                  style={{ backgroundColor: brand, color: onBrand, borderRadius: 'var(--radius)' }}
                >
                  Enviar Mensagem
                </button>
              </div>
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className="rounded-xl shadow p-6" style={{ backgroundColor: secondary, borderRadius: 'var(--radius)' }}>
              <h2 className="text-2xl font-bold mb-2" style={{ color: brand }}>Checklist Pré-Viagem (MOPP)</h2>
              <p className="text-sm mb-4" style={{ color: textColor }}>Confirmação obrigatória para transporte de produtos perigosos.</p>
      
              <div className="mb-4">
                <p className="text-sm mb-2" style={{ color: textColor }}>Documento oficial exigido:</p>
                <a
                  href={PROXY_SRC}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm"
                  style={{ color: brand }}
                >
                  Abrir PDF em nova aba
                </a>
                <button onClick={() => window.print()} className="ml-3 text-sm font-semibold px-3 py-1 rounded" style={{ backgroundColor: brand, color: onBrand, borderRadius: 'var(--radius)' }}>
                  Exportar PDF
                </button>
                <div className="mt-2 rounded-lg overflow-hidden border" style={{ borderColor: border, borderRadius: 'var(--radius)' }}>
                  <iframe
                    src={PROXY_SRC}
                    title="Checklist Oficial - Produtos Perigosos"
                    style={{ width: '100%', height: '70vh', border: '0' }}
                  />
                </div>
                <p className="text-xs mt-2" style={{ color: textColor }}>
                  Se o site bloquear visualização em iframe, use o botão acima.
                </p>
              </div>
      
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!ack) {
                    alert('É obrigatório confirmar leitura e execução do checklist oficial.');
                    return;
                  }
                  const status = (ack && pneus && extintor) ? 'APTO' : 'PENDENTE';
                  const payload = {
                    driverId,
                    vehicleId,
                    driverName: user?.name || 'Motorista',
                    status,
                    items: { extintor, pneus, ack },
                    submittedAt: new Date().toISOString(),
                    source: 'driver_page'
                  };
                  try {
                    localStorage.setItem('moppChecklist', JSON.stringify(payload));
                    localStorage.setItem('moppChecklistStatus', status);
                    setMoppStatus(status as any);
                  } catch {}
                  try {
                    await fetch('/api/checklist', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(payload)
                    });
                  } catch (err) {
                    console.warn('Falha ao enviar checklist para API:', err);
                  }
                  if (status !== 'APTO') {
                    alert('Checklist enviado, mas há pendências. Corrija para iniciar a jornada.');
                    return;
                  }
                  alert('Checklist APTO! Pronto para iniciar jornada.');
                  setCurrentStageIndex(1);
                  setActiveTab('jornada');
                }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: secondary, borderRadius: 'var(--radius)' }}>
                  <label className="text-sm" style={{ color: textColor }}>Extintor de incêndio carregado e inspecionado</label>
                  <input type="checkbox" checked={extintor} onChange={(e) => setExtintor(e.target.checked)} className="h-5 w-5 rounded border" style={{ borderColor: border, borderRadius: 'var(--radius)' }} />
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: secondary, borderRadius: 'var(--radius)' }}>
                  <label className="text-sm" style={{ color: textColor }}>Pneus em boas condições e calibrados</label>
                  <input type="checkbox" checked={pneus} onChange={(e) => setPneus(e.target.checked)} className="h-5 w-5 rounded border" style={{ borderColor: border, borderRadius: 'var(--radius)' }} />
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: secondary, borderRadius: 'var(--radius)' }}>
                  <label className="text-sm" style={{ color: textColor }}>Declaro que li e executei o checklist do documento oficial (obrigatório)</label>
                  <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} className="h-5 w-5 rounded border" style={{ borderColor: border, borderRadius: 'var(--radius)' }} />
                </div>
                <button type="submit" disabled={!ack} className="w-full font-bold py-2 rounded-lg" style={{ backgroundColor: brand, color: onBrand, borderRadius: 'var(--radius)', opacity: ack ? 1 : 0.5 }}>
                  Enviar Checklist
                </button>
              </form>
            </div>
          )}

          {activeTab === 'lancamentos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl shadow p-6" style={{ backgroundColor: secondary, borderRadius: 'var(--radius)' }}>
                <h3 className="font-semibold mb-3" style={{ color: textColor }}>Registrar Abastecimento</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert('Abastecimento registrado. O financeiro será notificado.');
                  }}
                  id="fuel-form"
                  className="space-y-3"
                >
                  <input className="w-full p-2 border rounded-lg" placeholder="Litros" type="number" style={{ borderColor: border, backgroundColor: secondary, color: textColor, borderRadius: 'var(--radius)' }} />
                  <input className="w-full p-2 border rounded-lg" placeholder="Valor (R$)" type="number" step="0.01" style={{ borderColor: border, backgroundColor: secondary, color: textColor, borderRadius: 'var(--radius)' }} />
                  <input className="w-full p-2 border rounded-lg" placeholder="Posto" type="text" style={{ borderColor: border, backgroundColor: secondary, color: textColor, borderRadius: 'var(--radius)' }} />
                  <button className="w-full font-bold py-2 rounded-lg" style={{ backgroundColor: brand, color: onBrand, borderRadius: 'var(--radius)' }}>
                    Salvar
                  </button>
                </form>
              </div>
              <div className="rounded-xl shadow p-6" style={{ backgroundColor: secondary, borderRadius: 'var(--radius)' }}>
                <h3 className="font-semibold mb-3" style={{ color: textColor }}>Registrar Despesa</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert('Despesa registrada e enviada para aprovação do Encarregado.');
                  }}
                  id="expense-form"
                  className="space-y-3"
                >
                  <input className="w-full p-2 border rounded-lg" placeholder="Tipo de despesa" type="text" style={{ borderColor: border, backgroundColor: secondary, color: textColor, borderRadius: 'var(--radius)' }} />
                  <input className="w-full p-2 border rounded-lg" placeholder="Valor (R$)" type="number" step="0.01" style={{ borderColor: border, backgroundColor: secondary, color: textColor, borderRadius: 'var(--radius)' }} />
                  <textarea className="w-full p-2 border rounded-lg" placeholder="Descrição" rows={2} style={{ borderColor: border, backgroundColor: secondary, color: textColor, borderRadius: 'var(--radius)' }} />
                  <button className="w-full font-bold py-2 rounded-lg" style={{ backgroundColor: brand, color: onBrand, borderRadius: 'var(--radius)' }}>
                    Salvar
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'ia' && (
            <div className="rounded-xl shadow p-6" style={{ backgroundColor: secondary, borderRadius: 'var(--radius)' }}>
              <h3 className="font-semibold mb-3" style={{ color: textColor }}>Assistente IA</h3>
              <p className="text-sm" style={{ color: textColor }}>Em breve: orientações de segurança, melhores rotas e resposta a incidentes.</p>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="rounded-xl shadow p-6" style={{ backgroundColor: secondary, borderRadius: 'var(--radius)' }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: brand }}>📊 Performance + Chat IA</h3>
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg)' }}>
                  <p className="text-sm font-semibold" style={{ color: textColor }}>Performance Score</p>
                  <p className="text-4xl font-extrabold" style={{ color: brand }}>
                    {Math.max(0, Math.min(100, (journeyStarted ? 85 : 70) - (onBreak ? 5 : 0) + Math.min(20, Math.floor(totalWorkTime/60))))}%
                  </p>
                  <div className="mt-2 flex">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const stars = Math.round(Math.max(0, Math.min(100, (journeyStarted ? 85 : 70) - (onBreak ? 5 : 0) + Math.min(20, Math.floor(totalWorkTime/60)))) / 20);
                      return <span key={i} style={{ color: i < stars ? brand : border }}>★</span>;
                    })}
                  </div>
                  <p className="text-xs mt-2" style={{ color: textColor }}>Baseado em jornada, pausas e progresso</p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg)' }}>
                  <p className="text-sm font-semibold" style={{ color: textColor }}>Pontualidade</p>
                  <div className="w-full h-2 rounded" style={{ backgroundColor: border }}>
                    <div className="h-2 rounded" style={{ width: `${Math.min(100, 60 + (journeyStarted ? 20 : 0))}%`, backgroundColor: brand }}></div>
                  </div>
                  <p className="text-xs mt-2" style={{ color: textColor }}>Chegada prevista: {tripData.estimatedArrival}</p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg)' }}>
                  <p className="text-sm font-semibold" style={{ color: textColor }}>Segurança</p>
                  <div className="w-full h-2 rounded" style={{ backgroundColor: border }}>
                    <div className="h-2 rounded" style={{ width: `${pneus && extintor ? 95 : 80}%`, backgroundColor: '#10b981' }}></div>
                  </div>
                  <p className="text-xs mt-2" style={{ color: textColor }}>Checklist e alertas de risco</p>
                </div>
              </div>

              {/* Assistente IA */}
              <div className="mt-4">
                <h4 className="font-semibold mb-2" style={{ color: textColor }}>🧠 Assistente IA</h4>
                <textarea
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  rows={3}
                  className="w-full p-2 border rounded-lg"
                  style={{ borderColor: border, backgroundColor: 'var(--color-bg)', color: textColor, borderRadius: 'var(--radius)' }}
                  placeholder="Ex.: Alguma recomendação de segurança para a próxima etapa?"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={askAI}
                    disabled={aiLoading || !aiQuestion.trim()}
                    className="font-bold py-2 px-4 rounded-lg hover:opacity-90"
                    style={{ backgroundColor: brand, color: onBrand }}
                  >
                    {aiLoading ? 'Consultando...' : 'Perguntar à IA'}
                  </button>
                  <button
                    onClick={() => { setAiQuestion(''); setAiAnswer(null); }}
                    className="font-bold py-2 px-4 rounded-lg hover:opacity-90"
                    style={{ backgroundColor: secondary, color: textColor, border: `1px solid ${border}` }}
                  >
                    Limpar
                  </button>
                </div>
                {aiAnswer && (
                  <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius)' }}>
                    <p className="text-sm whitespace-pre-wrap" style={{ color: textColor }}>{aiAnswer}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
  );
}

