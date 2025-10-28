'use client';
import { useState } from 'react';
import { Upload, TrendingUp, TrendingDown, DollarSign, Calendar, PieChart, BarChart3, Filter } from 'lucide-react';

interface CustoRow {
  id: number;
  data: string;
  frota: string;
  centroCusto: string;
  tipoDespesa: string;
  valor: number;
  fornecedor?: string;
  observacao?: string;
  mes: string;
}

export default function CustosOperacionaisPage() {
  const [importing, setImporting] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('todos');
  const [selectedFrota, setSelectedFrota] = useState('todos');

  // Dados de exemplo (serão substituídos pela importação)
  const [custos, setCustos] = useState<CustoRow[]>([
    { id: 1, data: '2025-01-15', frota: 'Frota 1', centroCusto: 'Manutenção', tipoDespesa: 'Peças', valor: 3250.00, fornecedor: 'Auto Peças SP', observacao: 'Troca de pastilhas', mes: '2025-01' },
    { id: 2, data: '2025-01-20', frota: 'Frota 2', centroCusto: 'Combustível', tipoDespesa: 'Diesel', valor: 4870.00, fornecedor: 'Shell', mes: '2025-01' },
    { id: 3, data: '2025-01-25', frota: 'Frota 1', centroCusto: 'Pneus', tipoDespesa: 'Recapagem', valor: 1200.00, fornecedor: 'Recapadora Central', mes: '2025-01' },
    { id: 4, data: '2025-08-10', frota: 'Frota 3', centroCusto: 'Manutenção', tipoDespesa: 'Oficina', valor: 5600.00, fornecedor: 'Mecânica Rodoviária', mes: '2025-08' },
    { id: 5, data: '2025-08-15', frota: 'Frota 2', centroCusto: 'Combustível', tipoDespesa: 'Diesel', valor: 5120.00, fornecedor: 'Ipiranga', mes: '2025-08' },
  ]);

  const handleImportGoogleSheets = async () => {
    setImporting(true);
    
    try {
      const response = await fetch('/api/custos/import-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheetUrl: 'https://docs.google.com/spreadsheets/d/1zgLlFH1_8HoIqmZlwH1W0b0Bs_q_N2mF/edit'
        })
      });

      const result = await response.json();

      if (result.success) {
        setCustos(result.data);
        alert(`✅ ${result.message}\n\n${result.data.length} lançamentos importados\nPeríodo: ${result.periodo}`);
      } else {
        alert(`❌ Erro: ${result.error}\n\nVerifique se a planilha está pública.`);
      }
    } catch (error) {
      console.error('Erro ao importar:', error);
      alert('❌ Erro ao conectar com o servidor.');
    } finally {
      setImporting(false);
    }
  };

  // Filtros
  const custosFiltrados = custos.filter(c => {
    const matchMonth = selectedMonth === 'todos' || c.mes === selectedMonth;
    const matchFrota = selectedFrota === 'todos' || c.frota === selectedFrota;
    return matchMonth && matchFrota;
  });

  // Cálculos
  const totalGeral = custosFiltrados.reduce((sum, c) => sum + c.valor, 0);
  
  const porCentroCusto = custosFiltrados.reduce((acc, c) => {
    acc[c.centroCusto] = (acc[c.centroCusto] || 0) + c.valor;
    return acc;
  }, {} as Record<string, number>);

  const porFrota = custosFiltrados.reduce((acc, c) => {
    acc[c.frota] = (acc[c.frota] || 0) + c.valor;
    return acc;
  }, {} as Record<string, number>);

  const porMes = custosFiltrados.reduce((acc, c) => {
    acc[c.mes] = (acc[c.mes] || 0) + c.valor;
    return acc;
  }, {} as Record<string, number>);

  const mesesDisponiveis = [...new Set(custos.map(c => c.mes))].sort();
  const frotasDisponiveis = [...new Set(custos.map(c => c.frota))].sort();

  const ticketMedio = custosFiltrados.length > 0 ? totalGeral / custosFiltrados.length : 0;

  return (
    <div style={{ maxWidth: 1600, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <DollarSign size={56} color="#ef4444" />
          <div>
            <h1 style={{ margin: 0, fontSize: 36, color: '#e5e7eb' }}>
              💰 Custos Operacionais - EJG Transportes
            </h1>
            <p style={{ margin: '8px 0 0', color: '#9aa3b0', fontSize: 18 }}>
              Análise financeira completa - Jan/Ago 2025
            </p>
          </div>
        </div>

        <button
          onClick={handleImportGoogleSheets}
          disabled={importing}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            background: importing ? '#666' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
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
      </div>

      {/* Google Sheets Banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)', 
        border: '2px solid #ef4444', 
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
          background: 'linear-gradient(135deg, #ef4444, #dc2626)', 
          borderRadius: 16, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: 40
        }}>
          📊
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 8px', color: '#ef4444', fontSize: 20 }}>
            🔗 Conectado ao Google Sheets - Custos Janeiro/Agosto 2025
          </h3>
          <p style={{ margin: 0, color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>
            <strong>Link:</strong> <a href="https://docs.google.com/spreadsheets/d/1zgLlFH1_8HoIqmZlwH1W0b0Bs_q_N2mF/edit" target="_blank" rel="noopener noreferrer" style={{ color: '#ef4444', textDecoration: 'underline' }}>
              Planilha de Custos Reais EJG
            </a>
            <br />
            <span style={{ opacity: 0.8 }}>
              Dados reais: Frota 1, 2, 3 | Centros de Custo | Tipos de Despesas | Janeiro e Agosto 2025
            </span>
          </p>
        </div>
        <button
          onClick={handleImportGoogleSheets}
          style={{
            padding: '12px 24px',
            background: '#ef4444',
            border: 'none',
            borderRadius: 8,
            color: 'white',
            fontSize: 14,
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          🔄 Sincronizar Agora
        </button>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 32, padding: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', color: '#9aa3b0', marginBottom: 8, fontSize: 14 }}>
            <Filter size={16} style={{ display: 'inline', marginRight: 8 }} />
            Mês
          </label>
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ width: '100%', padding: 12, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 14 }}
          >
            <option value="todos">📅 Todos os Meses</option>
            {mesesDisponiveis.map(mes => (
              <option key={mes} value={mes}>
                {new Date(mes + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', color: '#9aa3b0', marginBottom: 8, fontSize: 14 }}>
            <Filter size={16} style={{ display: 'inline', marginRight: 8 }} />
            Frota
          </label>
          <select 
            value={selectedFrota}
            onChange={(e) => setSelectedFrota(e.target.value)}
            style={{ width: '100%', padding: 12, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 14 }}
          >
            <option value="todos">🚚 Todas as Frotas</option>
            {frotasDisponiveis.map(frota => (
              <option key={frota} value={frota}>{frota}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button
            onClick={() => { setSelectedMonth('todos'); setSelectedFrota('todos'); }}
            style={{
              padding: '12px 24px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 8,
              color: '#fff',
              fontSize: 14,
              cursor: 'pointer'
            }}
          >
            🔄 Limpar Filtros
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: 24, borderRadius: 12, color: 'white' }}>
          <DollarSign size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 32, fontWeight: 'bold' }}>R$ {totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Custo Total</div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: 24, borderRadius: 12, color: 'white' }}>
          <BarChart3 size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 32, fontWeight: 'bold' }}>{custosFiltrados.length}</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Lançamentos</div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', padding: 24, borderRadius: 12, color: 'white' }}>
          <TrendingUp size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 32, fontWeight: 'bold' }}>R$ {ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Ticket Médio</div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', padding: 24, borderRadius: 12, color: 'white' }}>
          <Calendar size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 32, fontWeight: 'bold' }}>{Object.keys(porMes).length}</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Meses Analisados</div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* Por Centro de Custo */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 24 }}>
          <h3 style={{ margin: '0 0 20px', color: '#ef4444', fontSize: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <PieChart size={24} />
            Custos por Centro de Custo
          </h3>
          
          {Object.entries(porCentroCusto)
            .sort(([, a], [, b]) => b - a)
            .map(([centro, valor], idx) => {
              const percent = (valor / totalGeral * 100);
              const colors = ['#ef4444', '#f59e0b', '#8b5cf6', '#3b82f6', '#10b981'];
              return (
                <div key={centro} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ color: '#cbd5e1', fontSize: 14 }}>{centro}</span>
                    <span style={{ color: colors[idx % colors.length], fontWeight: 'bold', fontSize: 14 }}>
                      R$ {valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({percent.toFixed(1)}%)
                    </span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, height: 12, overflow: 'hidden' }}>
                    <div style={{ background: colors[idx % colors.length], width: `${percent}%`, height: '100%', transition: 'width 0.5s' }} />
                  </div>
                </div>
              );
            })}
        </div>

        {/* Por Frota */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 24 }}>
          <h3 style={{ margin: '0 0 20px', color: '#3b82f6', fontSize: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart3 size={24} />
            Custos por Frota
          </h3>
          
          {Object.entries(porFrota)
            .sort(([, a], [, b]) => b - a)
            .map(([frota, valor], idx) => {
              const percent = (valor / totalGeral * 100);
              const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
              return (
                <div key={frota} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ color: '#cbd5e1', fontSize: 14 }}>{frota}</span>
                    <span style={{ color: colors[idx % colors.length], fontWeight: 'bold', fontSize: 14 }}>
                      R$ {valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({percent.toFixed(1)}%)
                    </span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, height: 12, overflow: 'hidden' }}>
                    <div style={{ background: colors[idx % colors.length], width: `${percent}%`, height: '100%', transition: 'width 0.5s' }} />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Tabela Detalhada */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: 20, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ margin: 0, color: '#e5e7eb', fontSize: 20 }}>📋 Lançamentos Detalhados</h3>
        </div>
        
        <div style={{ overflowX: 'auto', maxHeight: 500, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, background: '#1e293b', zIndex: 10 }}>
              <tr>
                <th style={{ padding: 16, textAlign: 'left', color: '#9aa3b0', fontWeight: 'bold', fontSize: 14, borderBottom: '2px solid rgba(255,255,255,0.1)' }}>Data</th>
                <th style={{ padding: 16, textAlign: 'left', color: '#9aa3b0', fontWeight: 'bold', fontSize: 14, borderBottom: '2px solid rgba(255,255,255,0.1)' }}>Frota</th>
                <th style={{ padding: 16, textAlign: 'left', color: '#9aa3b0', fontWeight: 'bold', fontSize: 14, borderBottom: '2px solid rgba(255,255,255,0.1)' }}>Centro de Custo</th>
                <th style={{ padding: 16, textAlign: 'left', color: '#9aa3b0', fontWeight: 'bold', fontSize: 14, borderBottom: '2px solid rgba(255,255,255,0.1)' }}>Tipo Despesa</th>
                <th style={{ padding: 16, textAlign: 'left', color: '#9aa3b0', fontWeight: 'bold', fontSize: 14, borderBottom: '2px solid rgba(255,255,255,0.1)' }}>Fornecedor</th>
                <th style={{ padding: 16, textAlign: 'right', color: '#9aa3b0', fontWeight: 'bold', fontSize: 14, borderBottom: '2px solid rgba(255,255,255,0.1)' }}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {custosFiltrados
                .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                .map((custo, idx) => (
                <tr key={custo.id} style={{ 
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  background: idx % 2 === 0 ? 'rgba(0,0,0,0.1)' : 'transparent'
                }}>
                  <td style={{ padding: 16, color: '#cbd5e1', fontSize: 14 }}>
                    {new Date(custo.data).toLocaleDateString('pt-BR')}
                  </td>
                  <td style={{ padding: 16, color: '#3b82f6', fontSize: 14, fontWeight: 'bold' }}>{custo.frota}</td>
                  <td style={{ padding: 16, color: '#e5e7eb', fontSize: 14 }}>{custo.centroCusto}</td>
                  <td style={{ padding: 16, color: '#9aa3b0', fontSize: 14 }}>{custo.tipoDespesa}</td>
                  <td style={{ padding: 16, color: '#cbd5e1', fontSize: 14 }}>{custo.fornecedor || '-'}</td>
                  <td style={{ padding: 16, textAlign: 'right', color: '#ef4444', fontSize: 16, fontWeight: 'bold' }}>
                    R$ {custo.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
