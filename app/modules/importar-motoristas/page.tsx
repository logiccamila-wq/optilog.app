'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Upload, User, Phone, MapPin, FileText, CreditCard, CheckCircle, XCircle, Search, Filter, UserPlus, ArrowLeft } from 'lucide-react';

interface Motorista {
  id: number;
  nome: string;
  apelido: string;
  ativo: string;
  cidade: string;
  telefone: string;
  cpf: string;
  rg: string;
  tipo?: string;
}

export default function ImportarMotoristasPage() {
  const [importing, setImporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAtivo, setFilterAtivo] = useState('todos');
  const [filterTipo, setFilterTipo] = useState('todos');

  const [motoristas, setMotoristas] = useState<Motorista[]>([
    { id: 1, nome: 'JAILSON PEREIRA DE BARROS', apelido: 'JAILSON', ativo: 'SIM', cidade: 'Cabo de Santo Agostinho', telefone: '', cpf: '04979633455', rg: '6741375', tipo: 'SSP' },
    { id: 4, nome: 'RIVANIO VICENTE ALEIXO', apelido: 'RIVANIO', ativo: 'SIM', cidade: 'Cabo de Santo Agostinho', telefone: '81986281545', cpf: '05394253463', rg: '', tipo: 'PRÓPRIO' },
    { id: 5, nome: 'ENIO GOMES BARBOSA JÚNIOR', apelido: 'ENIO', ativo: 'SIM', cidade: 'Cabo de Santo Agostinho', telefone: '8188770000', cpf: '69648212449', rg: '4042216', tipo: 'AGREGADO' },
    { id: 8, nome: 'EDNALDO HELENO DE BARROS', apelido: 'EDNALDO', ativo: 'SIM', cidade: 'CABO DE SANTO AGOSTINHO', telefone: '81994049752', cpf: '88786811487', rg: '4915332', tipo: 'PE' },
    { id: 21, nome: 'NILTON CARLOS GOMES DA SILVA', apelido: 'NILTON', ativo: 'SIM', cidade: 'Jaboatão dos Guararapes', telefone: '', cpf: '05058861461', rg: '6076189', tipo: 'PRÓPRIO' },
    { id: 22, nome: 'MARCIO FRANCISCO DO NASCIMENTO', apelido: 'MARCIO', ativo: 'SIM', cidade: 'Recife', telefone: '', cpf: '88733173400', rg: '4826095', tipo: 'AGREGADO' },
    { id: 27, nome: 'JOSÉ ANTÔNIO DOS SANTOS', apelido: 'JOSÉ ANTÔNIO', ativo: 'SIM', cidade: 'Recife', telefone: '81981132528', cpf: '80850243491', rg: '4487747', tipo: 'PRÓPRIO' },
    { id: 35, nome: 'RUAN VINÍCIUS DE OLIVEIRA CUNHA', apelido: 'RUAN', ativo: 'SIM', cidade: 'Cabo de Santo Agostinho', telefone: '81994605480', cpf: '12765894418', rg: '9987102', tipo: 'SDS' },
    { id: 36, nome: 'GEISIEL LOPES DE ALBUQUERQUE', apelido: 'GEISIEL', ativo: 'SIM', cidade: 'CABO DE SANTO AGOSTINHO', telefone: '', cpf: '04929876451', rg: '6078078', tipo: 'SDS' },
    { id: 38, nome: 'DANILO SANTOS DE SOUZA', apelido: 'DANILO', ativo: 'SIM', cidade: 'Salvador', telefone: '71992859904', cpf: '02107351554', rg: '835617904', tipo: 'SSP' },
    { id: 39, nome: 'MESSIAS AUGUSTO DA SILVA', apelido: 'MESSIAS', ativo: 'SIM', cidade: 'Escada', telefone: '', cpf: '85634000459', rg: '3693016', tipo: 'AGREGADO' },
  ]);

  const handleImportGoogleSheets = async () => {
    setImporting(true);
    
    try {
      const response = await fetch('/api/motoristas/import-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheetUrl: 'https://docs.google.com/spreadsheets/d/1PQp-oaeCtYqXx-IW7XKKFJGNTaZwT06K/edit'
        })
      });

      const result = await response.json();

      if (result.success) {
        setMotoristas(result.data);
        alert(`✅ ${result.message}\n\n${result.data.length} motoristas cadastrados`);
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

  const motoristasFiltrados = motoristas.filter(m => {
    const matchSearch = m.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       m.apelido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       m.cpf.includes(searchTerm);
    const matchAtivo = filterAtivo === 'todos' || m.ativo === filterAtivo;
    const matchTipo = filterTipo === 'todos' || m.tipo === filterTipo;
    return matchSearch && matchAtivo && matchTipo;
  });

  const stats = {
    total: motoristas.length,
    ativos: motoristas.filter(m => m.ativo === 'SIM').length,
    inativos: motoristas.filter(m => m.ativo === 'NÃO').length,
    proprios: motoristas.filter(m => m.tipo === 'PRÓPRIO').length,
    agregados: motoristas.filter(m => m.tipo === 'AGREGADO').length
  };

  const tipos = [...new Set(motoristas.map(m => m.tipo).filter(Boolean))].sort();

  return (
    <div style={{ maxWidth: 1800, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Link href="/cadastro/motoristas" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#3b82f6', textDecoration: 'none', marginBottom: 16 }}>
          <ArrowLeft size={20} />
          Voltar para Cadastro
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <User size={56} color="#3b82f6" />
          <div>
            <h1 style={{ margin: 0, fontSize: 36, color: '#e5e7eb' }}>
              📋 Importar Motoristas - Google Sheets
            </h1>
            <p style={{ margin: '8px 0 0', color: '#9aa3b0', fontSize: 18 }}>
              Visualização e sincronização da planilha EJG Transportes
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
          {importing ? '⏳ Importando...' : '📥 Sincronizar Google Sheets'}
        </button>
      </div>

      {/* Google Sheets Banner */}
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
          📋
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 8px', color: '#3b82f6', fontSize: 20 }}>
            🔗 Conectado ao Google Sheets - Cadastro de Motoristas
          </h3>
          <p style={{ margin: 0, color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>
            <strong>Link:</strong> <a href="https://docs.google.com/spreadsheets/d/1PQp-oaeCtYqXx-IW7XKKFJGNTaZwT06K/edit" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
              Planilha MOTORISTAS
            </a>
            <br />
            <span style={{ opacity: 0.8 }}>
              Dados completos: Nome, Apelido, Status, Cidade, Telefone, CPF, RG, Tipo (Próprio/Agregado)
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
            cursor: 'pointer'
          }}
        >
          🔄 Sincronizar Agora
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', padding: 20, borderRadius: 12, color: 'white' }}>
          <User size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 32, fontWeight: 'bold' }}>{stats.total}</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Total de Motoristas</div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: 20, borderRadius: 12, color: 'white' }}>
          <CheckCircle size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 32, fontWeight: 'bold' }}>{stats.ativos}</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Ativos</div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: 20, borderRadius: 12, color: 'white' }}>
          <XCircle size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 32, fontWeight: 'bold' }}>{stats.inativos}</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Inativos</div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', padding: 20, borderRadius: 12, color: 'white' }}>
          <User size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 32, fontWeight: 'bold' }}>{stats.proprios}</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Próprios</div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: 20, borderRadius: 12, color: 'white' }}>
          <User size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 32, fontWeight: 'bold' }}>{stats.agregados}</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Agregados</div>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 24, marginBottom: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ display: 'block', color: '#9aa3b0', marginBottom: 8, fontSize: 14 }}>
              <Search size={16} style={{ display: 'inline', marginRight: 8 }} />
              Buscar
            </label>
            <input
              type="text"
              placeholder="Nome, apelido ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: 12, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 14 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#9aa3b0', marginBottom: 8, fontSize: 14 }}>
              <Filter size={16} style={{ display: 'inline', marginRight: 8 }} />
              Status
            </label>
            <select 
              value={filterAtivo}
              onChange={(e) => setFilterAtivo(e.target.value)}
              style={{ width: '100%', padding: 12, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 14 }}
            >
              <option value="todos">Todos</option>
              <option value="SIM">✅ Ativos</option>
              <option value="NÃO">❌ Inativos</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', color: '#9aa3b0', marginBottom: 8, fontSize: 14 }}>
              <Filter size={16} style={{ display: 'inline', marginRight: 8 }} />
              Tipo
            </label>
            <select 
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              style={{ width: '100%', padding: 12, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 14 }}
            >
              <option value="todos">Todos</option>
              {tipos.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#9aa3b0', fontSize: 14 }}>
            Mostrando {motoristasFiltrados.length} de {motoristas.length} motoristas
          </span>
          <button
            onClick={() => { setSearchTerm(''); setFilterAtivo('todos'); setFilterTipo('todos'); }}
            style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 6, color: '#fff', fontSize: 13, cursor: 'pointer' }}
          >
            🔄 Limpar Filtros
          </button>
        </div>
      </div>

      {/* Grid de Motoristas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 20 }}>
        {motoristasFiltrados.map((motorista) => (
          <div 
            key={motorista.id}
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 24, transition: 'all 0.3s', cursor: 'pointer' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ width: 60, height: 60, background: motorista.ativo === 'SIM' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #6b7280, #4b5563)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 'bold', color: '#fff' }}>
                {motorista.apelido.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 4px', color: '#e5e7eb', fontSize: 16, fontWeight: 'bold' }}>{motorista.apelido}</h3>
                <p style={{ margin: 0, color: '#9aa3b0', fontSize: 13 }}>{motorista.nome}</p>
              </div>
              {motorista.ativo === 'SIM' ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', borderRadius: 12, color: '#10b981', fontSize: 12, fontWeight: 'bold' }}>
                  <CheckCircle size={14} />ATIVO
                </span>
              ) : (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', borderRadius: 12, color: '#ef4444', fontSize: 12, fontWeight: 'bold' }}>
                  <XCircle size={14} />INATIVO
                </span>
              )}
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <MapPin size={18} color="#8b5cf6" />
                <div>
                  <div style={{ color: '#9aa3b0', fontSize: 12 }}>Cidade</div>
                  <div style={{ color: '#e5e7eb', fontSize: 14, fontWeight: '500' }}>{motorista.cidade}</div>
                </div>
              </div>

              {motorista.telefone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Phone size={18} color="#10b981" />
                  <div>
                    <div style={{ color: '#9aa3b0', fontSize: 12 }}>Telefone</div>
                    <div style={{ color: '#e5e7eb', fontSize: 14, fontWeight: '500' }}>{motorista.telefone}</div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CreditCard size={18} color="#3b82f6" />
                <div>
                  <div style={{ color: '#9aa3b0', fontSize: 12 }}>CPF</div>
                  <div style={{ color: '#e5e7eb', fontSize: 14, fontWeight: '500', fontFamily: 'monospace' }}>
                    {motorista.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                  </div>
                </div>
              </div>

              {motorista.rg && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <FileText size={18} color="#f59e0b" />
                  <div>
                    <div style={{ color: '#9aa3b0', fontSize: 12 }}>RG</div>
                    <div style={{ color: '#e5e7eb', fontSize: 14, fontWeight: '500' }}>{motorista.rg}</div>
                  </div>
                </div>
              )}

              {motorista.tipo && (
                <div style={{ marginTop: 8, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ display: 'inline-block', padding: '6px 16px', background: motorista.tipo === 'PRÓPRIO' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)', border: `1px solid ${motorista.tipo === 'PRÓPRIO' ? '#8b5cf6' : '#f59e0b'}`, borderRadius: 8, color: motorista.tipo === 'PRÓPRIO' ? '#8b5cf6' : '#f59e0b', fontSize: 12, fontWeight: 'bold' }}>
                    {motorista.tipo}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {motoristasFiltrados.length === 0 && (
        <div style={{ textAlign: 'center', padding: 60, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16 }}>
          <User size={48} color="#6b7280" style={{ marginBottom: 16 }} />
          <h3 style={{ margin: '0 0 8px', color: '#9aa3b0', fontSize: 20 }}>Nenhum motorista encontrado</h3>
          <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>Tente ajustar os filtros ou fazer uma nova busca</p>
        </div>
      )}
    </div>
  );
}
