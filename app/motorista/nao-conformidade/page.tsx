'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Camera, FileText, Send, ArrowLeft } from 'lucide-react';

export default function NaoConformidadePage() {
  const router = useRouter();
  const [tipo, setTipo] = useState('');
  const [gravidade, setGravidade] = useState('');
  const [descricao, setDescricao] = useState('');
  const [foto, setFoto] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    try {
      const formData = new FormData();
      formData.append('tipo', tipo);
      formData.append('gravidade', gravidade);
      formData.append('descricao', descricao);
      if (foto) formData.append('foto', foto);

      const response = await fetch('/api/nao-conformidade', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        alert(`✅ Não Conformidade registrada!\n\nProtocolo: ${result.protocolo}\n\nA auditoria virtual será notificada automaticamente.`);
        router.push('/motorista/dashboard');
      } else {
        alert(`❌ Erro: ${result.error}`);
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('❌ Erro ao enviar.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', padding: 16 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={() => router.push('/motorista/dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'none',
            border: 'none',
            color: '#3b82f6',
            fontSize: 16,
            cursor: 'pointer',
            marginBottom: 16
          }}
        >
          <ArrowLeft size={20} />
          Voltar ao Dashboard
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 60,
            height: 60,
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AlertTriangle size={32} color="#fff" />
          </div>
          <div>
            <h1 style={{ margin: 0, color: '#e5e7eb', fontSize: 28, fontWeight: 'bold' }}>
              Não Conformidade
            </h1>
            <p style={{ margin: '4px 0 0', color: '#9aa3b0', fontSize: 16 }}>
              Reporte problemas imediatamente
            </p>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} style={{ 
        background: 'rgba(255,255,255,0.05)', 
        border: '1px solid rgba(255,255,255,0.1)', 
        borderRadius: 20, 
        padding: 24 
      }}>
        {/* Tipo */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', color: '#e5e7eb', marginBottom: 8, fontSize: 16, fontWeight: 'bold' }}>
            Tipo de Não Conformidade
          </label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            required
            style={{
              width: '100%',
              padding: 16,
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              color: '#fff',
              fontSize: 16
            }}
          >
            <option value="">Selecione...</option>
            <option value="avaria-carga">🚨 Avaria na Carga</option>
            <option value="problema-veiculo">🔧 Problema no Veículo</option>
            <option value="acidente">⚠️ Acidente/Sinistro</option>
            <option value="roubo-furto">🚔 Roubo/Furto</option>
            <option value="desvio-rota">🗺️ Desvio de Rota Forçado</option>
            <option value="documentacao">📄 Problema com Documentação</option>
            <option value="cliente">👤 Problema com Cliente</option>
            <option value="outro">❓ Outro</option>
          </select>
        </div>

        {/* Gravidade */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', color: '#e5e7eb', marginBottom: 8, fontSize: 16, fontWeight: 'bold' }}>
            Gravidade
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[
              { value: 'baixa', label: 'Baixa', color: '#10b981' },
              { value: 'media', label: 'Média', color: '#f59e0b' },
              { value: 'alta', label: 'Alta', color: '#ef4444' }
            ].map((g) => (
              <button
                key={g.value}
                type="button"
                onClick={() => setGravidade(g.value)}
                style={{
                  padding: 16,
                  background: gravidade === g.value ? g.color : 'rgba(255,255,255,0.05)',
                  border: `2px solid ${gravidade === g.value ? g.color : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 12,
                  color: gravidade === g.value ? '#fff' : '#9aa3b0',
                  fontSize: 16,
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Descrição */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', color: '#e5e7eb', marginBottom: 8, fontSize: 16, fontWeight: 'bold' }}>
            Descrição Detalhada
          </label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descreva o problema com o máximo de detalhes possível..."
            required
            rows={6}
            style={{
              width: '100%',
              padding: 16,
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              color: '#fff',
              fontSize: 16,
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
        </div>

        {/* Foto */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', color: '#e5e7eb', marginBottom: 8, fontSize: 16, fontWeight: 'bold' }}>
            <Camera size={20} style={{ display: 'inline', marginRight: 8 }} />
            Foto (obrigatório)
          </label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => setFoto(e.target.files?.[0] || null)}
            required
            style={{
              width: '100%',
              padding: 16,
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              color: '#fff',
              fontSize: 16
            }}
          />
          {foto && (
            <p style={{ margin: '8px 0 0', color: '#10b981', fontSize: 14 }}>
              ✓ Foto selecionada: {foto.name}
            </p>
          )}
        </div>

        {/* Info Box */}
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid #3b82f6',
          borderRadius: 12,
          padding: 16,
          marginBottom: 24
        }}>
          <p style={{ margin: 0, color: '#93c5fd', fontSize: 14, lineHeight: 1.6 }}>
            <strong>ℹ️ Processamento Automático:</strong>
            <br />• Auditoria Virtual será notificada imediatamente
            <br />• Consultoria SASSMAQ/ISO analisará o caso
            <br />• Impacta KPIs de conformidade e segurança
            <br />• Protocolo será enviado via WhatsApp
          </p>
        </div>

        {/* Botão Enviar */}
        <button
          type="submit"
          disabled={enviando}
          style={{
            width: '100%',
            padding: 18,
            background: enviando ? '#666' : 'linear-gradient(135deg, #ef4444, #dc2626)',
            border: 'none',
            borderRadius: 12,
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
            cursor: enviando ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12
          }}
        >
          <Send size={24} />
          {enviando ? '⏳ Enviando...' : 'Enviar Não Conformidade'}
        </button>
      </form>
    </div>
  );
}
