'use client';
import { useState } from 'react';
import { TrendingUp, TrendingDown, Target, Users, Award, AlertCircle } from 'lucide-react';

interface Funcionario {
  id: number;
  nome: string;
  cargo: string;
  setor: string;
  kpis: {
    nome: string;
    metaEsperada: number;
    metaRealizada: number;
    unidade: string;
  }[];
}

export default function KPIsMetasPage() {
  const [setorFiltro, setSetorFiltro] = useState('todos');
  
  const funcionarios: Funcionario[] = [
    {
      id: 1,
      nome: 'João Motorista',
      cargo: 'Motorista',
      setor: 'Operações',
      kpis: [
        { nome: 'Entregas no Prazo', metaEsperada: 95, metaRealizada: 98, unidade: '%' },
        { nome: 'Consumo Combustível', metaEsperada: 4.2, metaRealizada: 3.9, unidade: 'km/L' },
        { nome: 'Índice de Segurança', metaEsperada: 90, metaRealizada: 95, unidade: '%' },
        { nome: 'Avaliação Cliente', metaEsperada: 4.5, metaRealizada: 4.8, unidade: '/5' }
      ]
    },
    {
      id: 2,
      nome: 'Maria Silva',
      cargo: 'Analista de Operações',
      setor: 'Operações',
      kpis: [
        { nome: 'Rotas Otimizadas', metaEsperada: 120, metaRealizada: 135, unidade: '/mês' },
        { nome: 'Redução de Custos', metaEsperada: 15, metaRealizada: 18, unidade: '%' },
        { nome: 'Tempo Resposta', metaEsperada: 30, metaRealizada: 22, unidade: 'min' },
        { nome: 'Satisfação Motoristas', metaEsperada: 85, metaRealizada: 88, unidade: '%' }
      ]
    },
    {
      id: 3,
      nome: 'Carlos Santos',
      cargo: 'Gerente Financeiro',
      setor: 'Financeiro',
      kpis: [
        { nome: 'Margem Bruta', metaEsperada: 30, metaRealizada: 32, unidade: '%' },
        { nome: 'Inadimplência', metaEsperada: 5, metaRealizada: 3, unidade: '%' },
        { nome: 'Custos Operacionais', metaEsperada: 85, metaRealizada: 82, unidade: '%' },
        { nome: 'Receita Mensal', metaEsperada: 500000, metaRealizada: 547000, unidade: 'R$' }
      ]
    }
  ];

  const setores = ['todos', ...new Set(funcionarios.map(f => f.setor))];
  const funcionariosFiltrados = setorFiltro === 'todos' 
    ? funcionarios 
    : funcionarios.filter(f => f.setor === setorFiltro);

  const calcularDesempenhoGeral = (funcionario: Funcionario) => {
    const total = funcionario.kpis.reduce((acc, kpi) => {
      const percentual = (kpi.metaRealizada / kpi.metaEsperada) * 100;
      return acc + percentual;
    }, 0);
    return Math.round(total / funcionario.kpis.length);
  };

  return (
    <div style={{ maxWidth: 1600, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <Target size={56} color="#8b5cf6" />
        <div>
          <h1 style={{ margin: 0, fontSize: 36, color: '#e5e7eb' }}>
            🎯 KPIs e Metas - Gestão de Desempenho
          </h1>
          <p style={{ margin: '8px 0 0', color: '#9aa3b0', fontSize: 18 }}>
            Acompanhamento em tempo real de todos os funcionários
          </p>
        </div>
      </div>

      {/* Stats Gerais */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', padding: 24, borderRadius: 12, color: 'white' }}>
          <Users size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 32, fontWeight: 'bold' }}>{funcionarios.length}</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Funcionários Monitorados</div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: 24, borderRadius: 12, color: 'white' }}>
          <TrendingUp size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 32, fontWeight: 'bold' }}>
            {funcionarios.filter(f => calcularDesempenhoGeral(f) >= 100).length}
          </div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Batendo/Superando Metas</div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: 24, borderRadius: 12, color: 'white' }}>
          <AlertCircle size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 32, fontWeight: 'bold' }}>
            {funcionarios.filter(f => calcularDesempenhoGeral(f) < 100).length}
          </div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Abaixo da Meta</div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: 24, borderRadius: 12, color: 'white' }}>
          <Award size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 32, fontWeight: 'bold' }}>
            {Math.round(funcionarios.reduce((acc, f) => acc + calcularDesempenhoGeral(f), 0) / funcionarios.length)}%
          </div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Desempenho Médio</div>
        </div>
      </div>

      {/* Filtro */}
      <div style={{ marginBottom: 32 }}>
        <label style={{ display: 'block', color: '#9aa3b0', marginBottom: 8, fontSize: 14 }}>
          Filtrar por Setor
        </label>
        <select
          value={setorFiltro}
          onChange={(e) => setSetorFiltro(e.target.value)}
          style={{
            padding: 12,
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            color: '#fff',
            fontSize: 16,
            minWidth: 250
          }}
        >
          {setores.map(setor => (
            <option key={setor} value={setor}>
              {setor === 'todos' ? 'Todos os Setores' : setor}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de Funcionários */}
      <div style={{ display: 'grid', gap: 24 }}>
        {funcionariosFiltrados.map((funcionario) => {
          const desempenhoGeral = calcularDesempenhoGeral(funcionario);
          const corDesempenho = desempenhoGeral >= 100 ? '#10b981' : desempenhoGeral >= 80 ? '#f59e0b' : '#ef4444';

          return (
            <div
              key={funcionario.id}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 16,
                padding: 24
              }}
            >
              {/* Header do Funcionário */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    width: 60,
                    height: 60,
                    background: `linear-gradient(135deg, ${corDesempenho}, ${corDesempenho}dd)`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: '#fff'
                  }}>
                    {funcionario.nome.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: '#e5e7eb', fontSize: 20, fontWeight: 'bold' }}>
                      {funcionario.nome}
                    </h3>
                    <p style={{ margin: '4px 0 0', color: '#9aa3b0', fontSize: 14 }}>
                      {funcionario.cargo} • {funcionario.setor}
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, color: '#9aa3b0', marginBottom: 4 }}>Desempenho Geral</div>
                  <div style={{ fontSize: 36, fontWeight: 'bold', color: corDesempenho }}>
                    {desempenhoGeral}%
                  </div>
                  {desempenhoGeral >= 100 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', color: '#10b981', fontSize: 13, fontWeight: 'bold' }}>
                      <TrendingUp size={16} />
                      Superando Meta
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', color: '#ef4444', fontSize: 13, fontWeight: 'bold' }}>
                      <TrendingDown size={16} />
                      Abaixo da Meta
                    </div>
                  )}
                </div>
              </div>

              {/* KPIs */}
              <div style={{ display: 'grid', gap: 16 }}>
                {funcionario.kpis.map((kpi, idx) => {
                  const percentual = (kpi.metaRealizada / kpi.metaEsperada) * 100;
                  const cor = percentual >= 100 ? '#10b981' : percentual >= 80 ? '#f59e0b' : '#ef4444';
                  const isMelhorMenos = kpi.nome.includes('Custo') || kpi.nome.includes('Inadimplência') || kpi.nome.includes('Tempo');
                  const status = isMelhorMenos
                    ? (kpi.metaRealizada <= kpi.metaEsperada ? 'superando' : 'abaixo')
                    : (kpi.metaRealizada >= kpi.metaEsperada ? 'superando' : 'abaixo');

                  return (
                    <div key={idx} style={{ padding: 16, background: 'rgba(0,0,0,0.2)', borderRadius: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div>
                          <div style={{ color: '#cbd5e1', fontSize: 15, fontWeight: '500', marginBottom: 4 }}>
                            {kpi.nome}
                          </div>
                          <div style={{ color: '#9aa3b0', fontSize: 13 }}>
                            Meta: {kpi.metaEsperada}{kpi.unidade === 'R$' ? '' : ' '}{kpi.unidade === 'R$' ? 'R$ ' + kpi.metaEsperada.toLocaleString('pt-BR') : kpi.unidade}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 20, fontWeight: 'bold', color: cor }}>
                            {kpi.unidade === 'R$' ? 'R$ ' + kpi.metaRealizada.toLocaleString('pt-BR') : kpi.metaRealizada + kpi.unidade}
                          </div>
                          <div style={{ fontSize: 12, color: status === 'superando' ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                            {status === 'superando' ? '✓ Atingido' : '⚠ Não atingido'}
                          </div>
                        </div>
                      </div>

                      <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, height: 10, overflow: 'hidden' }}>
                        <div style={{
                          background: cor,
                          width: `${Math.min(percentual, 100)}%`,
                          height: '100%',
                          transition: 'width 0.5s'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
