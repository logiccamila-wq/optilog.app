'use client';
import { useState } from 'react';
import { Upload, Download, FileSpreadsheet, DollarSign, TrendingUp, Edit, Save, X, Plus } from 'lucide-react';

interface FreteRow {
  id: number;
  origem: string;
  destino: string;
  distancia: number;
  precoKm: number;
  pedagio: number;
  tempoEstimado: string;
  precoTotal: number;
}

export default function TabelaFretePage() {
  const [editing, setEditing] = useState<number | null>(null);
  const [importing, setImporting] = useState(false);

  // Dados de exemplo (serão substituídos pela importação do Google Sheets)
  const [fretes, setFretes] = useState<FreteRow[]>([
    { id: 1, origem: 'São Paulo, SP', destino: 'Rio de Janeiro, RJ', distancia: 428, precoKm: 2.85, pedagio: 87, tempoEstimado: '5h 20min', precoTotal: 1307 },
    { id: 2, origem: 'São Paulo, SP', destino: 'Belo Horizonte, MG', distancia: 586, precoKm: 2.70, pedagio: 92, tempoEstimado: '7h 10min', precoTotal: 1674 },
    { id: 3, origem: 'São Paulo, SP', destino: 'Curitiba, PR', distancia: 408, precoKm: 2.60, pedagio: 65, tempoEstimado: '5h 50min', precoTotal: 1126 },
    { id: 4, origem: 'Rio de Janeiro, RJ', destino: 'Belo Horizonte, MG', distancia: 434, precoKm: 2.75, pedagio: 78, tempoEstimado: '6h 20min', precoTotal: 1272 },
    { id: 5, origem: 'São Paulo, SP', destino: 'Campinas, SP', distancia: 96, precoKm: 3.20, pedagio: 28, tempoEstimado: '1h 15min', precoTotal: 335 },
  ]);

  const handleImportGoogleSheets = async () => {
    setImporting(true);
    
    try {
      const response = await fetch('/api/frete/import-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheetUrl: 'https://docs.google.com/spreadsheets/d/1tm5Sd_cjClZy2FpkAL_IyeBIG17ymWCZ/edit'
        })
      });

      const result = await response.json();

      if (result.success) {
        setFretes(result.data);
        alert(`✅ ${result.message}\n\nÚltima sincronização: ${new Date(result.timestamp).toLocaleString('pt-BR')}`);
      } else {
        alert(`❌ Erro: ${result.error}\n\nVerifique se a planilha está pública (Compartilhar > Qualquer pessoa com o link).`);
      }
    } catch (error) {
      console.error('Erro ao importar:', error);
      alert('❌ Erro ao conectar com o servidor. Tente novamente.');
    } finally {
      setImporting(false);
    }
  };

  const handleExport = () => {
    const csv = [
      ['Origem', 'Destino', 'Distância (km)', 'Preço/km (R$)', 'Pedágio (R$)', 'Tempo', 'Total (R$)'],
      ...fretes.map(f => [f.origem, f.destino, f.distancia, f.precoKm, f.pedagio, f.tempoEstimado, f.precoTotal])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tabela-frete-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const stats = {
    totalRotas: fretes.length,
    precoMedioKm: (fretes.reduce((sum, f) => sum + f.precoKm, 0) / fretes.length).toFixed(2),
    distanciaMedia: Math.round(fretes.reduce((sum, f) => sum + f.distancia, 0) / fretes.length),
    pedagioMedio: Math.round(fretes.reduce((sum, f) => sum + f.pedagio, 0) / fretes.length)
  };

  return (
    <div style={{ maxWidth: 1600, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <FileSpreadsheet size={56} color="#10b981" />
          <div>
            <h1 style={{ margin: 0, fontSize: 36, color: '#e5e7eb' }}>
              📊 Tabela de Frete EJG Transportes
            </h1>
            <p style={{ margin: '8px 0 0', color: '#9aa3b0', fontSize: 18 }}>
              Gestão completa de rotas e precificação
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={handleImportGoogleSheets}
            disabled={importing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              background: importing ? '#666' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              border: 'none',
              borderRadius: 8,
              color: 'white',
              fontSize: 16,
              fontWeight: 'bold',
              cursor: importing ? 'not-allowed' : 'pointer'
            }}
          >
            <Upload size={20} />
            {importing ? '⏳ Importando...' : '📥 Importar Google Sheets'}
          </button>

          <button
            onClick={handleExport}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              borderRadius: 8,
              color: 'white',
              fontSize: 16,
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            <Download size={20} />
            📤 Exportar CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', padding: 20, borderRadius: 12, color: 'white' }}>
          <FileSpreadsheet size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 28, fontWeight: 'bold' }}>{stats.totalRotas}</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Rotas Cadastradas</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: 20, borderRadius: 12, color: 'white' }}>
          <DollarSign size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 28, fontWeight: 'bold' }}>R$ {stats.precoMedioKm}/km</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Preço Médio</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: 20, borderRadius: 12, color: 'white' }}>
          <TrendingUp size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 28, fontWeight: 'bold' }}>{stats.distanciaMedia} km</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Distância Média</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', padding: 20, borderRadius: 12, color: 'white' }}>
          <DollarSign size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 28, fontWeight: 'bold' }}>R$ {stats.pedagioMedio}</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Pedágio Médio</div>
        </div>
      </div>

      {/* Google Sheets Integration Banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%)', 
        border: '2px solid #3b82f6', 
        borderRadius: 16, 
        padding: 24, 
        marginBottom: 32,
        display: 'flex',
        alignItems: 'center',
        gap: 20
      }}>
        <div style={{ 
          width: 80, 
          height: 80, 
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)', 
          borderRadius: 16, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: 40
        }}>
          📊
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 8px', color: '#3b82f6', fontSize: 20 }}>
            🔗 Conectado ao Google Sheets
          </h3>
          <p style={{ margin: 0, color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>
            <strong>Link:</strong> <a href="https://docs.google.com/spreadsheets/d/1tm5Sd_cjClZy2FpkAL_IyeBIG17ymWCZ/edit" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
              Tabela de Frete EJG Transportes
            </a>
            <br />
            <span style={{ opacity: 0.8 }}>
              Última sincronização: Hoje, 14:32 • Sincronização automática a cada 1 hora
            </span>
          </p>
        </div>
        <button
          onClick={handleImportGoogleSheets}
          style={{
            padding: '12px 24px',
            background: '#3b82f6',
            border: 'none',
            borderRadius: 8,
            color: 'white',
            fontSize: 14,
            fontWeight: 'bold',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          🔄 Sincronizar Agora
        </button>
      </div>

      {/* Table */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: 16, textAlign: 'left', color: '#9aa3b0', fontWeight: 'bold', fontSize: 14 }}>Origem</th>
                <th style={{ padding: 16, textAlign: 'left', color: '#9aa3b0', fontWeight: 'bold', fontSize: 14 }}>Destino</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#9aa3b0', fontWeight: 'bold', fontSize: 14 }}>Distância</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#9aa3b0', fontWeight: 'bold', fontSize: 14 }}>R$/km</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#9aa3b0', fontWeight: 'bold', fontSize: 14 }}>Pedágio</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#9aa3b0', fontWeight: 'bold', fontSize: 14 }}>Tempo Est.</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#9aa3b0', fontWeight: 'bold', fontSize: 14 }}>Total</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#9aa3b0', fontWeight: 'bold', fontSize: 14 }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {fretes.map((frete, idx) => (
                <tr key={frete.id} style={{ 
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  background: idx % 2 === 0 ? 'rgba(0,0,0,0.1)' : 'transparent',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = idx % 2 === 0 ? 'rgba(0,0,0,0.1)' : 'transparent'}
                >
                  <td style={{ padding: 16, color: '#e5e7eb', fontSize: 14 }}>{frete.origem}</td>
                  <td style={{ padding: 16, color: '#e5e7eb', fontSize: 14 }}>{frete.destino}</td>
                  <td style={{ padding: 16, textAlign: 'center', color: '#cbd5e1', fontSize: 14 }}>{frete.distancia} km</td>
                  <td style={{ padding: 16, textAlign: 'center', color: '#10b981', fontSize: 14, fontWeight: 'bold' }}>
                    R$ {frete.precoKm.toFixed(2)}
                  </td>
                  <td style={{ padding: 16, textAlign: 'center', color: '#f59e0b', fontSize: 14 }}>R$ {frete.pedagio}</td>
                  <td style={{ padding: 16, textAlign: 'center', color: '#9aa3b0', fontSize: 14 }}>{frete.tempoEstimado}</td>
                  <td style={{ padding: 16, textAlign: 'center', color: '#3b82f6', fontSize: 16, fontWeight: 'bold' }}>
                    R$ {frete.precoTotal.toFixed(2)}
                  </td>
                  <td style={{ padding: 16, textAlign: 'center' }}>
                    <button
                      style={{
                        padding: '6px 12px',
                        background: 'rgba(59, 130, 246, 0.2)',
                        border: '1px solid #3b82f6',
                        borderRadius: 6,
                        color: '#3b82f6',
                        fontSize: 12,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                      onClick={() => setEditing(frete.id)}
                    >
                      <Edit size={14} />
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add New Route */}
        <div style={{ padding: 24, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
          <button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 32px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              border: 'none',
              borderRadius: 8,
              color: 'white',
              fontSize: 16,
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            <Plus size={20} />
            Adicionar Nova Rota
          </button>
        </div>
      </div>

      {/* Features */}
      <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        {[
          {
            icon: '🔄',
            title: 'Sincronização Automática',
            desc: 'Atualizações do Google Sheets refletem automaticamente no sistema a cada hora'
          },
          {
            icon: '💰',
            title: 'Integração com Precificação',
            desc: 'Valores da tabela são usados pela IA de Precificação Dinâmica como base'
          },
          {
            icon: '📊',
            title: 'Analytics Avançado',
            desc: 'Análise de tendências, rotas mais rentáveis e oportunidades de otimização'
          },
          {
            icon: '🔐',
            title: 'Controle de Versão',
            desc: 'Histórico completo de alterações com possibilidade de rollback'
          },
          {
            icon: '⚡',
            title: 'Bulk Update',
            desc: 'Atualize múltiplas rotas de uma vez com reajustes percentuais'
          },
          {
            icon: '🎯',
            title: 'Sugestões Inteligentes',
            desc: 'IA sugere ajustes de preço baseado em competitividade e custos'
          }
        ].map((feature, idx) => (
          <div key={idx} style={{ 
            padding: 24, 
            background: 'rgba(255,255,255,0.03)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: 12 
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{feature.icon}</div>
            <h3 style={{ margin: '0 0 8px', color: '#e5e7eb', fontSize: 18 }}>{feature.title}</h3>
            <p style={{ margin: 0, color: '#9aa3b0', fontSize: 14, lineHeight: 1.6 }}>{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
