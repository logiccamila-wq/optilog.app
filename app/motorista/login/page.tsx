'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, User, Lock, MapPin, Package } from 'lucide-react';

export default function LoginMotoristaPage() {
  const router = useRouter();
  const [cpf, setCpf] = useState('');
  const [placaCavalo, setPlacaCavalo] = useState('');
  const [placaReboque, setPlacaReboque] = useState('');
  const [numeroCTE, setNumeroCTE] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/motorista/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cpf,
          placaCavalo: placaCavalo.toUpperCase(),
          placaReboque: placaReboque.toUpperCase(),
          numeroCTE
        })
      });

      const result = await response.json();

      if (result.success) {
        // Salvar dados no localStorage
        localStorage.setItem('motorista', JSON.stringify(result.motorista));
        localStorage.setItem('veiculo', JSON.stringify({ placaCavalo, placaReboque }));
        localStorage.setItem('cte', numeroCTE);
        
        // Redirecionar para dashboard do motorista
        router.push('/motorista/dashboard');
      } else {
        alert(`❌ Erro: ${result.error}`);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('❌ Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: 24
    }}>
      <div style={{ maxWidth: 500, width: '100%' }}>
        {/* Logo/Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ 
            width: 100, 
            height: 100, 
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: 48
          }}>
            🚚
          </div>
          <h1 style={{ margin: '0 0 8px', color: '#e5e7eb', fontSize: 32, fontWeight: 'bold' }}>
            OptiLog Mobile
          </h1>
          <p style={{ margin: 0, color: '#9aa3b0', fontSize: 16 }}>
            Login do Motorista
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin} style={{ 
          background: 'rgba(255,255,255,0.05)', 
          border: '1px solid rgba(255,255,255,0.1)', 
          borderRadius: 20, 
          padding: 32 
        }}>
          {/* CPF */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', color: '#9aa3b0', marginBottom: 8, fontSize: 14, fontWeight: '500' }}>
              <User size={16} style={{ display: 'inline', marginRight: 8 }} />
              CPF
            </label>
            <input
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value.replace(/\D/g, ''))}
              placeholder="000.000.000-00"
              maxLength={11}
              required
              style={{
                width: '100%',
                padding: 16,
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                color: '#fff',
                fontSize: 16,
                outline: 'none',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          {/* Placa Cavalo */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', color: '#9aa3b0', marginBottom: 8, fontSize: 14, fontWeight: '500' }}>
              <Truck size={16} style={{ display: 'inline', marginRight: 8 }} />
              Placa do Cavalo
            </label>
            <input
              type="text"
              value={placaCavalo}
              onChange={(e) => setPlacaCavalo(e.target.value.toUpperCase())}
              placeholder="ABC-1234"
              maxLength={8}
              required
              style={{
                width: '100%',
                padding: 16,
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                color: '#fff',
                fontSize: 16,
                fontWeight: 'bold',
                textTransform: 'uppercase',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          {/* Placa Reboque */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', color: '#9aa3b0', marginBottom: 8, fontSize: 14, fontWeight: '500' }}>
              <Truck size={16} style={{ display: 'inline', marginRight: 8 }} />
              Placa do Reboque (opcional)
            </label>
            <input
              type="text"
              value={placaReboque}
              onChange={(e) => setPlacaReboque(e.target.value.toUpperCase())}
              placeholder="XYZ-5678"
              maxLength={8}
              style={{
                width: '100%',
                padding: 16,
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                color: '#fff',
                fontSize: 16,
                fontWeight: 'bold',
                textTransform: 'uppercase',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          {/* Número CTE */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', color: '#9aa3b0', marginBottom: 8, fontSize: 14, fontWeight: '500' }}>
              <Package size={16} style={{ display: 'inline', marginRight: 8 }} />
              Número do CT-e (Ordem de Carga)
            </label>
            <input
              type="text"
              value={numeroCTE}
              onChange={(e) => setNumeroCTE(e.target.value)}
              placeholder="000123456"
              required
              style={{
                width: '100%',
                padding: 16,
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                color: '#fff',
                fontSize: 16,
                fontFamily: 'monospace',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          {/* Info Box */}
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid #3b82f6',
            borderRadius: 12,
            padding: 16,
            marginBottom: 24
          }}>
            <p style={{ margin: 0, color: '#93c5fd', fontSize: 13, lineHeight: 1.6 }}>
              <strong>ℹ️ Importante:</strong> Ao fazer login, você terá acesso a:
              <br />• Dashboard de roteirização em tempo real
              <br />• Monitoramento logístico da viagem
              <br />• Check-in/Check-out de cargas
              <br />• Registro de não conformidades
              <br />• KPIs e metas de desempenho
            </p>
          </div>

          {/* Botão Login */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: 16,
              background: loading ? '#666' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              border: 'none',
              borderRadius: 12,
              color: 'white',
              fontSize: 18,
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
            }}
          >
            {loading ? '⏳ Entrando...' : '🚀 Iniciar Viagem'}
          </button>
        </form>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <p style={{ margin: 0, color: '#6b7280', fontSize: 13 }}>
            Problemas para acessar? Contate a operação
          </p>
        </div>
      </div>
    </div>
  );
}
