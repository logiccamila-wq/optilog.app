'use client';
import { useState } from 'react';

const STAGES = [
  'AGUARDANDO ORDEM',
  'INÍCIO (CHECKLIST OK)',
  'VIAGEM EM ANDAMENTO',
  'CHEGADA AO CLIENTE',
  'CONCLUÍDO'
];

export default function DriverAppPage() {
  const [activeTab, setActiveTab] = useState<'jornada'|'checklist'|'lancamentos'|'ia'|'performance'>('jornada');
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { at: '10:30', sender: 'Encarregado', text: 'O cliente confirmou a janela de descarga. Proceda com o checklist.' },
    { at: '10:35', sender: 'Você', text: 'Checklist iniciado. Documentação OK.' },
  ]);

  const brand = 'var(--color-brand)';
  const onBrand = 'var(--color-on-brand)';
  const textColor = 'var(--color-text)';
  const secondary = 'var(--color-secondary)';
  const border = 'var(--color-border)';

  const sendChat = () => {
    const msg = chatInput.trim();
    if (!msg) return;
    const at = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [...prev, { at, sender: 'Você', text: msg }]);
    setChatInput('');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)', color: textColor }}>
      <header className="sticky top-0 shadow-md z-10" style={{ backgroundColor: secondary }}>
        <div className="container mx-auto px-4 pt-4">
          <h1 className="text-xl font-bold" style={{ color: brand }}>App Motorista | Carga Química</h1>
          <p className="text-sm mb-2" style={{ color: 'var(--color-text)' }}>Ordem: #20250915 | Carga: Ácido Sulfúrico (UN 1830)</p>

          <nav className="flex overflow-x-auto space-x-4 border-b" style={{ borderColor: border }}>
            {[{ key: 'jornada', label: '🚦 Jornada & Status' }, { key: 'checklist', label: '✅ Checklist MOPP' }, { key: 'lancamentos', label: '⛽ Lançamentos' }, { key: 'ia', label: '🧠 Assistente IA' }, { key: 'performance', label: '📊 Performance' }].map((tab) => (
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
          <div className="rounded-xl shadow p-6" style={{ backgroundColor: secondary, borderRadius: 'var(--radius)' }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: brand }}>Status Atual da Missão</h2>
            <div className="text-center p-4 rounded-lg font-extrabold text-2xl transition" style={{ backgroundColor: brand, color: onBrand, borderRadius: 'var(--radius)' }}>
              {STAGES[currentStageIndex]}
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2" style={{ color: textColor }}>Monitoramento da Carga</h3>
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
            <h2 className="text-2xl font-bold mb-4" style={{ color: brand }}>Checklist Pré-Viagem (MOPP)</h2>
            <p className="text-sm mb-4" style={{ color: textColor }}>Confirmação obrigatória para transporte de produtos perigosos.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Checklist Enviado com Sucesso! Próximo passo: INÍCIO (CHECKLIST OK)');
                setCurrentStageIndex(1);
                setActiveTab('jornada');
              }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: secondary, borderRadius: 'var(--radius)' }}>
                <label className="text-sm" style={{ color: textColor }}>Extintor de incêndio carregado e inspecionado</label>
                <input type="checkbox" className="h-5 w-5 rounded border" style={{ borderColor: border, borderRadius: 'var(--radius)' }} />
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: secondary, borderRadius: 'var(--radius)' }}>
                <label className="text-sm" style={{ color: textColor }}>Pneus em boas condições e calibrados</label>
                <input type="checkbox" className="h-5 w-5 rounded border" style={{ borderColor: border, borderRadius: 'var(--radius)' }} />
              </div>
              <button type="submit" className="w-full font-bold py-2 rounded-lg" style={{ backgroundColor: brand, color: onBrand, borderRadius: 'var(--radius)' }}>
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
            <h3 className="font-semibold mb-3" style={{ color: textColor }}>Performance</h3>
            <p className="text-sm" style={{ color: textColor }}>KPIs do motorista e da jornada serão exibidos aqui.</p>
          </div>
        )}
      </main>
    </div>
  );
}
