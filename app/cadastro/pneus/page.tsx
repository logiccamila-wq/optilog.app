'use client';
import { useState } from 'react';
import { Tire, Plus, Search, TrendingDown, AlertTriangle } from 'lucide-react';

interface Pneu {
  id: number;
  numero: string;
  marca: string;
  modelo: string;
  medida: string; // 295/80R22.5
  tipo: 'novo' | 'recapado' | 'usado';
  dot: string; // semana/ano fabricação
  posicao: string; // Dianteiro Esq, Traseiro Dir Ext, etc
  veiculo?: string;
  kmAtual: number;
  kmInstalacao: number;
  vidaUtil: number; // km
  pressaoIdeal: number; // PSI
  recapagens: number;
  status: 'ativo' | 'estoque' | 'sucateado';
  valorCompra: number;
  fornecedor: string;
}

export default function GestPneusPage() {
  const [pneus, setPneus] = useState<Pneu[]>([
    {
      id: 1, numero: 'PN001', marca: 'Michelin', modelo: 'XZA2 Energy', medida: '295/80R22.5',
      tipo: 'novo', dot: '3524', posicao: 'Dianteiro Esq', veiculo: 'ABC-1D23',
      kmAtual: 12500, kmInstalacao: 0, vidaUtil: 150000, pressaoIdeal: 120, recapagens: 0,
      status: 'ativo', valorCompra: 1850, fornecedor: 'Pneus Rodovia'
    },
    {
      id: 2, numero: 'PN002', marca: 'Pirelli', modelo: 'Formula G', medida: '275/80R22.5',
      tipo: 'recapado', dot: '1823', posicao: 'Estoque', veiculo: undefined,
      kmAtual: 95000, kmInstalacao: 0, vidaUtil: 120000, pressaoIdeal: 115, recapagens: 1,
      status: 'estoque', valorCompra: 780, fornecedor: 'Recapadora Central'
    }
  ]);

  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'all' | 'ativo' | 'estoque' | 'sucateado'>('all');

  const pneusFiltrados = pneus.filter(p => {
    const matchBusca = p.numero.toLowerCase().includes(busca.toLowerCase()) ||
                      p.marca.toLowerCase().includes(busca.toLowerCase()) ||
                      p.veiculo?.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === 'all' || p.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  // Cálculos
  const totalPneus = pneus.length;
  const pneusAtivos = pneus.filter(p => p.status === 'ativo').length;
  const pneusEstoque = pneus.filter(p => p.status === 'estoque').length;
  const pneusRecapados = pneus.filter(p => p.tipo === 'recapado').length;
  const pneusAlerta = pneus.filter(p => {
    const kmRestante = p.vidaUtil - (p.kmAtual - p.kmInstalacao);
    return kmRestante < 20000 && p.status === 'ativo';
  }).length;

  const custoPneusAtivos = pneus.filter(p => p.status === 'ativo')
    .reduce((sum, p) => sum + p.valorCompra, 0);

  return (
    <div style={{ maxWidth: 1800, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <Tire size={56} color="#64748b" />
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 36, color: '#e5e7eb' }}>
            🛞 Gestão de Pneus
          </h1>
          <p style={{ margin: '8px 0 0', color: '#9aa3b0', fontSize: 18 }}>
            Controle de vida útil, recapagem, pressão e rodízio
          </p>
        </div>
        <button style={{
          background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
          color: 'white',
          border: 'none',
          padding: '16px 32px',
          borderRadius: 12,
          fontSize: 16,
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <Plus size={20} />
          Cadastrar Pneu
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16, marginBottom: 32 }}>
        <div style={{
          background: 'rgba(100, 116, 139, 0.1)',
          border: '2px solid #64748b',
          borderRadius: 12,
          padding: 20,
          textAlign: 'center'
        }}>
          <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 8 }}>Total Cadastrados</div>
          <div style={{ color: '#64748b', fontSize: 36, fontWeight: 'bold' }}>{totalPneus}</div>
        </div>

        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '2px solid #10b981',
          borderRadius: 12,
          padding: 20,
          textAlign: 'center'
        }}>
          <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 8 }}>Em Uso (Ativos)</div>
          <div style={{ color: '#10b981', fontSize: 36, fontWeight: 'bold' }}>{pneusAtivos}</div>
        </div>

        <div style={{
          background: 'rgba(99, 102, 241, 0.1)',
          border: '2px solid #6366f1',
          borderRadius: 12,
          padding: 20,
          textAlign: 'center'
        }}>
          <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 8 }}>Em Estoque</div>
          <div style={{ color: '#6366f1', fontSize: 36, fontWeight: 'bold' }}>{pneusEstoque}</div>
        </div>

        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '2px solid #f59e0b',
          borderRadius: 12,
          padding: 20,
          textAlign: 'center'
        }}>
          <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 8 }}>Recapados</div>
          <div style={{ color: '#f59e0b', fontSize: 36, fontWeight: 'bold' }}>{pneusRecapados}</div>
        </div>

        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '2px solid #ef4444',
          borderRadius: 12,
          padding: 20,
          textAlign: 'center'
        }}>
          <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 8 }}>Alerta Troca</div>
          <div style={{ color: '#ef4444', fontSize: 36, fontWeight: 'bold' }}>{pneusAlerta}</div>
        </div>

        <div style={{
          background: 'rgba(139, 92, 246, 0.1)',
          border: '2px solid #8b5cf6',
          borderRadius: 12,
          padding: 20,
          textAlign: 'center'
        }}>
          <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 8 }}>Custo Ativos</div>
          <div style={{ color: '#8b5cf6', fontSize: 28, fontWeight: 'bold' }}>
            R$ {(custoPneusAtivos / 1000).toFixed(0)}k
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div style={{
          flex: 1,
          background: 'rgba(255,255,255,0.03)',
          border: '2px solid rgba(255,255,255,0.1)',
          borderRadius: 12,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <Search size={20} color="#9aa3b0" />
          <input
            type="text"
            placeholder="Buscar por número, marca ou veículo..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#e5e7eb',
              fontSize: 15,
              outline: 'none'
            }}
          />
        </div>

        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value as any)}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '2px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            padding: '12px 16px',
            color: '#e5e7eb',
            fontSize: 15,
            cursor: 'pointer',
            minWidth: 180
          }}
        >
          <option value="all">Todos os Status</option>
          <option value="ativo">Ativos (em uso)</option>
          <option value="estoque">Em Estoque</option>
          <option value="sucateado">Sucateados</option>
        </select>
      </div>

      {/* Lista de Pneus */}
      <div style={{ display: 'grid', gap: 16 }}>
        {pneusFiltrados.map(pneu => {
          const kmRodado = pneu.kmAtual - pneu.kmInstalacao;
          const kmRestante = pneu.vidaUtil - kmRodado;
          const percentualVida = (kmRestante / pneu.vidaUtil) * 100;

          const corStatus = {
            ativo: '#10b981',
            estoque: '#6366f1',
            sucateado: '#6b7280'
          }[pneu.status];

          const corVida = percentualVida > 40 ? '#10b981' : percentualVida > 20 ? '#f59e0b' : '#ef4444';

          return (
            <div
              key={pneu.id}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `2px solid ${corStatus}`,
                borderRadius: 16,
                padding: 24,
                display: 'grid',
                gridTemplateColumns: '200px 1fr 300px',
                gap: 24,
                alignItems: 'center'
              }}
            >
              {/* Info Básica */}
              <div>
                <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 4 }}>Número</div>
                <div style={{ color: '#e5e7eb', fontSize: 24, fontWeight: 'bold', marginBottom: 12 }}>
                  {pneu.numero}
                </div>
                <div style={{
                  background: corStatus,
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 'bold',
                  display: 'inline-block'
                }}>
                  {pneu.status.toUpperCase()}
                </div>
                <div style={{ marginTop: 8 }}>
                  <div style={{ color: '#9aa3b0', fontSize: 12 }}>
                    {pneu.tipo === 'novo' ? '🆕 Novo' : pneu.tipo === 'recapado' ? '♻️ Recapado' : '📦 Usado'}
                  </div>
                </div>
              </div>

              {/* Detalhes */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 4 }}>Marca/Modelo</div>
                  <div style={{ color: '#e5e7eb', fontSize: 15, fontWeight: 'bold' }}>
                    {pneu.marca}
                  </div>
                  <div style={{ color: '#9aa3b0', fontSize: 13 }}>{pneu.modelo}</div>
                </div>

                <div>
                  <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 4 }}>Medida</div>
                  <div style={{ color: '#e5e7eb', fontSize: 15, fontWeight: 'bold' }}>
                    {pneu.medida}
                  </div>
                  <div style={{ color: '#9aa3b0', fontSize: 13 }}>DOT: {pneu.dot}</div>
                </div>

                <div>
                  <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 4 }}>Posição/Veículo</div>
                  <div style={{ color: '#e5e7eb', fontSize: 15, fontWeight: 'bold' }}>
                    {pneu.posicao}
                  </div>
                  <div style={{ color: '#9aa3b0', fontSize: 13 }}>
                    {pneu.veiculo || 'Sem veículo'}
                  </div>
                </div>

                <div>
                  <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 4 }}>Pressão Ideal</div>
                  <div style={{ color: '#e5e7eb', fontSize: 15, fontWeight: 'bold' }}>
                    {pneu.pressaoIdeal} PSI
                  </div>
                </div>

                <div>
                  <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 4 }}>Recapagens</div>
                  <div style={{ color: '#e5e7eb', fontSize: 15, fontWeight: 'bold' }}>
                    {pneu.recapagens}x
                  </div>
                  <div style={{ color: '#9aa3b0', fontSize: 12 }}>
                    {pneu.recapagens < 2 ? 'Pode recap' : 'Limite atingido'}
                  </div>
                </div>

                <div>
                  <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 4 }}>Valor Compra</div>
                  <div style={{ color: '#10b981', fontSize: 15, fontWeight: 'bold' }}>
                    R$ {pneu.valorCompra.toFixed(0)}
                  </div>
                </div>
              </div>

              {/* Vida Útil */}
              <div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: '#9aa3b0', fontSize: 13 }}>Vida Útil</span>
                    <span style={{ color: corVida, fontSize: 13, fontWeight: 'bold' }}>
                      {percentualVida.toFixed(0)}%
                    </span>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8, height: 24, overflow: 'hidden' }}>
                    <div style={{
                      background: corVida,
                      width: `${Math.max(0, percentualVida)}%`,
                      height: '100%',
                      transition: 'width 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 'bold',
                      color: 'white'
                    }}>
                      {kmRestante.toLocaleString('pt-BR')} km
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, fontSize: 12 }}>
                  <div>
                    <div style={{ color: '#9aa3b0' }}>KM Rodado</div>
                    <div style={{ color: '#e5e7eb', fontWeight: 'bold' }}>
                      {kmRodado.toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#9aa3b0' }}>KM Restante</div>
                    <div style={{ color: corVida, fontWeight: 'bold' }}>
                      {kmRestante.toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#9aa3b0' }}>Total</div>
                    <div style={{ color: '#e5e7eb', fontWeight: 'bold' }}>
                      {pneu.vidaUtil.toLocaleString('pt-BR')}
                    </div>
                  </div>
                </div>

                {percentualVida < 20 && pneu.status === 'ativo' && (
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid #ef4444',
                    borderRadius: 8,
                    padding: '8px 12px',
                    marginTop: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 13
                  }}>
                    <AlertTriangle size={16} color="#ef4444" />
                    <span style={{ color: '#ef4444', fontWeight: 'bold' }}>
                      Trocar em breve! Menos de 20% vida útil
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {pneusFiltrados.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 0',
          color: '#9aa3b0'
        }}>
          <Tire size={64} style={{ marginBottom: 16, opacity: 0.3 }} />
          <div style={{ fontSize: 18 }}>Nenhum pneu encontrado</div>
        </div>
      )}
    </div>
  );
}
