'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, MapPin, Package, FileText, CheckCircle } from 'lucide-react';

export default function CheckinCargaPage() {
  const router = useRouter();
  const [etapa, setEtapa] = useState<'coleta' | 'transito' | 'entrega'>('coleta');
  const [fotos, setFotos] = useState<{[key: string]: File | null}>({
    carga: null,
    lacre: null,
    nf: null,
    assinatura: null
  });
  const [localizacao, setLocalizacao] = useState<{lat: number, lng: number} | null>(null);
  const [observacoes, setObservacoes] = useState('');

  const handleFotoChange = (tipo: string, file: File | null) => {
    setFotos(prev => ({ ...prev, [tipo]: file }));
  };

  const obterLocalizacao = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocalizacao({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          alert('Erro ao obter localização: ' + error.message);
        }
      );
    } else {
      alert('Geolocalização não suportada neste dispositivo');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!localizacao) {
      alert('Capte a localização antes de continuar');
      return;
    }

    if (etapa === 'coleta' && (!fotos.carga || !fotos.lacre || !fotos.nf)) {
      alert('Todas as fotos são obrigatórias para check-in de coleta');
      return;
    }

    if (etapa === 'entrega' && (!fotos.carga || !fotos.assinatura)) {
      alert('Fotos da carga e assinatura são obrigatórias para entrega');
      return;
    }

    const formData = new FormData();
    formData.append('etapa', etapa);
    formData.append('localizacao', JSON.stringify(localizacao));
    formData.append('observacoes', observacoes);
    formData.append('dataHora', new Date().toISOString());

    Object.entries(fotos).forEach(([tipo, file]) => {
      if (file) formData.append(tipo, file);
    });

    try {
      const response = await fetch('/api/motorista/checkin', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        alert('✅ Check-in registrado com sucesso!\n\nProtocolo: ' + result.protocolo);
        router.push('/motorista/dashboard');
      } else {
        alert('Erro: ' + result.error);
      }
    } catch (error) {
      alert('Erro ao enviar check-in');
      console.error(error);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: 24
    }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Package size={64} color="white" style={{ marginBottom: 16 }} />
          <h1 style={{ margin: 0, fontSize: 32, color: 'white', fontWeight: 'bold' }}>
            📦 Check-in de Carga
          </h1>
          <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>
            Registre a coleta, trânsito ou entrega da carga
          </p>
        </div>

        {/* Seletor de Etapa */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
          {[
            { id: 'coleta', label: '🚚 Coleta', icon: '📤' },
            { id: 'transito', label: '🛣️ Trânsito', icon: '📍' },
            { id: 'entrega', label: '✅ Entrega', icon: '📥' }
          ].map((opcao) => (
            <button
              key={opcao.id}
              onClick={() => setEtapa(opcao.id as any)}
              style={{
                padding: 16,
                background: etapa === opcao.id ? 'white' : 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: 12,
                color: etapa === opcao.id ? '#667eea' : 'white',
                fontSize: 14,
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 4 }}>{opcao.icon}</div>
              {opcao.label}
            </button>
          ))}
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} style={{
          background: 'white',
          borderRadius: 16,
          padding: 24
        }}>
          {/* Localização */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: '#374151' }}>
              <MapPin size={16} style={{ display: 'inline', marginRight: 6 }} />
              Localização Atual *
            </label>
            <button
              type="button"
              onClick={obterLocalizacao}
              style={{
                width: '100%',
                padding: 12,
                background: localizacao ? '#10b981' : '#667eea',
                border: 'none',
                borderRadius: 8,
                color: 'white',
                fontSize: 14,
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              {localizacao ? (
                <>
                  <CheckCircle size={20} />
                  Localização Capturada ({localizacao.lat.toFixed(6)}, {localizacao.lng.toFixed(6)})
                </>
              ) : (
                <>
                  <MapPin size={20} />
                  Capturar Localização GPS
                </>
              )}
            </button>
          </div>

          {/* Fotos - Coleta */}
          {etapa === 'coleta' && (
            <>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: '#374151' }}>
                  <Camera size={16} style={{ display: 'inline', marginRight: 6 }} />
                  Foto da Carga *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => handleFotoChange('carga', e.target.files?.[0] || null)}
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '2px dashed #d1d5db',
                    borderRadius: 8,
                    fontSize: 14
                  }}
                />
                {fotos.carga && <div style={{ color: '#10b981', fontSize: 13, marginTop: 4 }}>✓ {fotos.carga.name}</div>}
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: '#374151' }}>
                  <Camera size={16} style={{ display: 'inline', marginRight: 6 }} />
                  Foto do Lacre/Selo *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => handleFotoChange('lacre', e.target.files?.[0] || null)}
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '2px dashed #d1d5db',
                    borderRadius: 8,
                    fontSize: 14
                  }}
                />
                {fotos.lacre && <div style={{ color: '#10b981', fontSize: 13, marginTop: 4 }}>✓ {fotos.lacre.name}</div>}
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: '#374151' }}>
                  <FileText size={16} style={{ display: 'inline', marginRight: 6 }} />
                  Foto da Nota Fiscal *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => handleFotoChange('nf', e.target.files?.[0] || null)}
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '2px dashed #d1d5db',
                    borderRadius: 8,
                    fontSize: 14
                  }}
                />
                {fotos.nf && <div style={{ color: '#10b981', fontSize: 13, marginTop: 4 }}>✓ {fotos.nf.name}</div>}
              </div>
            </>
          )}

          {/* Fotos - Trânsito */}
          {etapa === 'transito' && (
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: '#374151' }}>
                <Camera size={16} style={{ display: 'inline', marginRight: 6 }} />
                Foto da Carga (Verificação)
              </label>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handleFotoChange('carga', e.target.files?.[0] || null)}
                style={{
                  width: '100%',
                  padding: 12,
                  border: '2px dashed #d1d5db',
                  borderRadius: 8,
                  fontSize: 14
                }}
              />
              {fotos.carga && <div style={{ color: '#10b981', fontSize: 13, marginTop: 4 }}>✓ {fotos.carga.name}</div>}
            </div>
          )}

          {/* Fotos - Entrega */}
          {etapa === 'entrega' && (
            <>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: '#374151' }}>
                  <Camera size={16} style={{ display: 'inline', marginRight: 6 }} />
                  Foto da Carga Entregue *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => handleFotoChange('carga', e.target.files?.[0] || null)}
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '2px dashed #d1d5db',
                    borderRadius: 8,
                    fontSize: 14
                  }}
                />
                {fotos.carga && <div style={{ color: '#10b981', fontSize: 13, marginTop: 4 }}>✓ {fotos.carga.name}</div>}
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: '#374151' }}>
                  <FileText size={16} style={{ display: 'inline', marginRight: 6 }} />
                  Foto da Assinatura/Canho *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => handleFotoChange('assinatura', e.target.files?.[0] || null)}
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '2px dashed #d1d5db',
                    borderRadius: 8,
                    fontSize: 14
                  }}
                />
                {fotos.assinatura && <div style={{ color: '#10b981', fontSize: 13, marginTop: 4 }}>✓ {fotos.assinatura.name}</div>}
              </div>
            </>
          )}

          {/* Observações */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: '#374151' }}>
              💬 Observações (Opcional)
            </label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Descreva qualquer ocorrência, avaria ou informação relevante..."
              rows={4}
              style={{
                width: '100%',
                padding: 12,
                border: '1px solid #d1d5db',
                borderRadius: 8,
                fontSize: 14,
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Botões */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="button"
              onClick={() => router.back()}
              style={{
                flex: 1,
                padding: 16,
                background: '#9ca3af',
                border: 'none',
                borderRadius: 8,
                color: 'white',
                fontSize: 16,
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Voltar
            </button>
            <button
              type="submit"
              style={{
                flex: 2,
                padding: 16,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none',
                borderRadius: 8,
                color: 'white',
                fontSize: 16,
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              ✅ Confirmar Check-in
            </button>
          </div>
        </form>

        {/* Info */}
        <div style={{
          background: 'rgba(255,255,255,0.9)',
          borderRadius: 12,
          padding: 16,
          marginTop: 24
        }}>
          <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
            ℹ️ <strong>Informação:</strong><br />
            • A localização GPS é capturada automaticamente para rastreio<br />
            • Todas as fotos são obrigatórias conforme o tipo de check-in<br />
            • O protocolo será enviado via WhatsApp após confirmação<br />
            • Dados são sincronizados com a Torre de Controle em tempo real
          </div>
        </div>
      </div>
    </div>
  );
}
