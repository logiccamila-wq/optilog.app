'use client';
import { useEffect, useState } from 'react';
import { FileText, Building2, User, Calendar, CheckCircle, TrendingUp, Award } from 'lucide-react';

export default function ContratoSistemaPage() {
  const [contrato, setContrato] = useState<any>(null);

  useEffect(() => {
    fetch('/api/empresa/contrato')
      .then(res => res.json())
      .then(data => setContrato(data));
  }, []);

  if (!contrato) {
    return <div style={{ padding: 32, color: '#9aa3b0' }}>Carregando contrato...</div>;
  }

  const { contratante, contratada, contrato: dadosContrato, analytics } = contrato;

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <FileText size={56} color="#6366f1" />
        <div>
          <h1 style={{ margin: 0, fontSize: 36, color: '#e5e7eb' }}>
            📄 Contrato de Prestação de Serviços
          </h1>
          <p style={{ margin: '8px 0 0', color: '#9aa3b0', fontSize: 18 }}>
            XYZ Logic Flow ↔ EJG Transportes • Cliente Piloto
          </p>
        </div>
      </div>

      {/* Status Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 32,
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>Status do Contrato</div>
          <div style={{ fontSize: 32, fontWeight: 'bold' }}>{dadosContrato.status}</div>
          <div style={{ fontSize: 14, opacity: 0.9, marginTop: 4 }}>
            {analytics.diasDesdeContrato} dias em execução • {analytics.diasRestantes} dias restantes
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>Progresso Geral</div>
          <div style={{ fontSize: 48, fontWeight: 'bold' }}>{analytics.percentualConcluido}%</div>
          <div style={{ fontSize: 14, opacity: 0.9, marginTop: 4 }}>
            {analytics.modulosImplementados} de {analytics.modulosTotal} módulos
          </div>
        </div>
      </div>

      {/* Partes do Contrato */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* Contratante */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '2px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 16,
          padding: 24
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <Building2 size={32} color="#ef4444" />
            <h3 style={{ margin: 0, fontSize: 22, color: '#e5e7eb', fontWeight: 'bold' }}>
              CONTRATANTE
            </h3>
          </div>

          <div style={{ display: 'grid', gap: 16 }}>
            <div>
              <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 4 }}>Razão Social</div>
              <div style={{ color: '#e5e7eb', fontSize: 18, fontWeight: 'bold' }}>
                {contratante.razaoSocial}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 4 }}>CNPJ</div>
                <div style={{ color: '#e5e7eb', fontSize: 15, fontFamily: 'monospace' }}>
                  {contratante.cnpj}
                </div>
              </div>
              <div>
                <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 4 }}>Regime Tributário</div>
                <div style={{ 
                  color: '#ef4444', 
                  fontSize: 15, 
                  fontWeight: 'bold',
                  background: 'rgba(239, 68, 68, 0.1)',
                  padding: '4px 8px',
                  borderRadius: 6,
                  width: 'fit-content'
                }}>
                  {contratante.regimeTributario}
                </div>
              </div>
            </div>

            <div>
              <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 4 }}>Endereço</div>
              <div style={{ color: '#e5e7eb', fontSize: 15 }}>
                {contratante.cidade}/{contratante.estado}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 4 }}>Faturamento</div>
                <div style={{ color: '#10b981', fontSize: 16, fontWeight: 'bold' }}>
                  R$ {(contratante.faturamentoAnual / 1000000).toFixed(1)}M/ano
                </div>
              </div>
              <div>
                <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 4 }}>Funcionários</div>
                <div style={{ color: '#e5e7eb', fontSize: 16, fontWeight: 'bold' }}>
                  {contratante.funcionarios}
                </div>
              </div>
              <div>
                <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 4 }}>Frota</div>
                <div style={{ color: '#e5e7eb', fontSize: 16, fontWeight: 'bold' }}>
                  {contratante.frota} veículos
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contratada */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '2px solid rgba(99, 102, 241, 0.3)',
          borderRadius: 16,
          padding: 24
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <User size={32} color="#6366f1" />
            <h3 style={{ margin: 0, fontSize: 22, color: '#e5e7eb', fontWeight: 'bold' }}>
              CONTRATADA
            </h3>
          </div>

          <div style={{ display: 'grid', gap: 16 }}>
            <div>
              <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 4 }}>Razão Social</div>
              <div style={{ color: '#e5e7eb', fontSize: 18, fontWeight: 'bold' }}>
                {contratada.razaoSocial}
              </div>
            </div>

            <div>
              <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 4 }}>CNPJ</div>
              <div style={{ color: '#e5e7eb', fontSize: 15, fontFamily: 'monospace' }}>
                {contratada.cnpj}
              </div>
            </div>

            <div>
              <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 4 }}>Endereço</div>
              <div style={{ color: '#e5e7eb', fontSize: 14, lineHeight: 1.6 }}>
                {contratada.endereco}<br />
                {contratada.bairro}<br />
                {contratada.cidade}/{contratada.estado}
              </div>
            </div>

            <div>
              <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 4 }}>Representante Legal</div>
              <div style={{ color: '#e5e7eb', fontSize: 16, fontWeight: 'bold' }}>
                {contratada.representante}
              </div>
              <div style={{ color: '#9aa3b0', fontSize: 13, marginTop: 4 }}>
                {contratada.cargo}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dados do Contrato */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '2px solid rgba(139, 92, 246, 0.3)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 32
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <Calendar size={32} color="#8b5cf6" />
          <h3 style={{ margin: 0, fontSize: 22, color: '#e5e7eb', fontWeight: 'bold' }}>
            DADOS DO CONTRATO
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div>
            <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 4 }}>Tipo de Contrato</div>
            <div style={{ color: '#e5e7eb', fontSize: 15, fontWeight: 'bold' }}>
              {dadosContrato.tipo}
            </div>
          </div>
          <div>
            <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 4 }}>Data Assinatura</div>
            <div style={{ color: '#e5e7eb', fontSize: 15 }}>
              {new Date(dadosContrato.dataAssinatura).toLocaleDateString('pt-BR')}
            </div>
          </div>
          <div>
            <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 4 }}>Início Vigência</div>
            <div style={{ color: '#10b981', fontSize: 15, fontWeight: 'bold' }}>
              {new Date(dadosContrato.dataInicio).toLocaleDateString('pt-BR')}
            </div>
          </div>
          <div>
            <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 4 }}>Término Vigência</div>
            <div style={{ color: '#f59e0b', fontSize: 15, fontWeight: 'bold' }}>
              {new Date(dadosContrato.dataTermino).toLocaleDateString('pt-BR')}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 8 }}>Base Legal</div>
          <div style={{ display: 'grid', gap: 8 }}>
            {dadosContrato.baseLegal.map((lei: string, idx: number) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  color: '#cbd5e1',
                  fontSize: 14
                }}
              >
                📜 {lei}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 8 }}>Escopo de Serviços</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {dadosContrato.escopo.map((item: string, idx: number) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  color: '#cbd5e1',
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <CheckCircle size={16} color="#10b981" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 24 }}>
        <div style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          borderRadius: 16,
          padding: 24,
          color: 'white'
        }}>
          <TrendingUp size={32} style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 4 }}>ROI Estimado</div>
          <div style={{ fontSize: 36, fontWeight: 'bold' }}>{analytics.roi}%</div>
          <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>Retorno sobre Investimento</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: 16,
          padding: 24,
          color: 'white'
        }}>
          <CheckCircle size={32} style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 4 }}>Módulos Entregues</div>
          <div style={{ fontSize: 36, fontWeight: 'bold' }}>
            {analytics.modulosImplementados}/{analytics.modulosTotal}
          </div>
          <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
            {Math.round((analytics.modulosImplementados / analytics.modulosTotal) * 100)}% concluído
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          borderRadius: 16,
          padding: 24,
          color: 'white'
        }}>
          <Award size={32} style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 4 }}>Satisfação Cliente</div>
          <div style={{ fontSize: 36, fontWeight: 'bold' }}>{analytics.satisfacaoCliente}/5</div>
          <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>Avaliação Geral</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          borderRadius: 16,
          padding: 24,
          color: 'white'
        }}>
          <FileText size={32} style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 4 }}>Cliente Piloto</div>
          <div style={{ fontSize: 28, fontWeight: 'bold', marginTop: 8 }}>
            {dadosContrato.clientePiloto ? 'SIM' : 'NÃO'}
          </div>
          <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>Parceria Estratégica</div>
        </div>
      </div>
    </div>
  );
}
