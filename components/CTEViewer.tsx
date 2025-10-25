import React, { useState, useEffect } from 'react';
import { CTEDocument, CTEItem } from '@/lib/shared-types';

interface CTEViewerProps {
  cteId?: string;
  initialData?: CTEDocument;
  onStatusChange?: (status: CTEDocument['status']) => void;
}

export const CTEViewer: React.FC<CTEViewerProps> = ({
  cteId,
  initialData,
  onStatusChange,
}) => {
  const [cte, setCte] = useState<CTEDocument | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cteId && !initialData) {
      const fetchCTE = async () => {
        try {
          const response = await fetch(`/api/cte/${cteId}`);
          const data = await response.json();
          setCte(data);
        } catch (e) {
          setError('Erro ao carregar CTE');
          console.error(e);
        } finally {
          setLoading(false);
        }
      };

      fetchCTE();
    }
  }, [cteId, initialData]);

  if (loading) return <div>Carregando CTE...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!cte) return <div>CTE não encontrado</div>;

  const handleStatusChange = async (newStatus: CTEDocument['status']) => {
    try {
      const response = await fetch(`/api/cte/${cte.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      setCte(prev => prev ? { ...prev, status: data.status } : null);
      onStatusChange?.(data.status);
    } catch (e) {
      setError('Erro ao atualizar status');
      console.error(e);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'full',
      timeStyle: 'short'
    }).format(new Date(date));
  };

  return (
    <div className="cte-viewer">
      <div className="cte-header">
        <h2>CT-e Nº {cte.number}</h2>
        <div className="cte-status">
          <span>Status: {cte.status}</span>
          {onStatusChange && (
            <select
              value={cte.status}
              onChange={(e) => handleStatusChange(e.target.value as CTEDocument['status'])}
            >
              <option value="draft">Rascunho</option>
              <option value="issued">Emitido</option>
              <option value="cancelled">Cancelado</option>
              <option value="completed">Concluído</option>
            </select>
          )}
        </div>
      </div>

      <div className="cte-companies">
        <div className="cte-company">
          <h3>Remetente</h3>
          <p>{cte.sender.name}</p>
          <p>CNPJ/CPF: {cte.sender.document}</p>
          <p>{cte.sender.address}</p>
          <p>{cte.sender.city} - {cte.sender.state}</p>
        </div>

        <div className="cte-company">
          <h3>Destinatário</h3>
          <p>{cte.receiver.name}</p>
          <p>CNPJ/CPF: {cte.receiver.document}</p>
          <p>{cte.receiver.address}</p>
          <p>{cte.receiver.city} - {cte.receiver.state}</p>
        </div>
      </div>

      <div className="cte-details">
        <h3>Detalhes da Carga</h3>
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Quantidade</th>
              <th>Valor Unit.</th>
              <th>Valor Total</th>
            </tr>
          </thead>
          <tbody>
            {cte.items.map((item: CTEItem) => (
              <tr key={item.id}>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>{formatCurrency(item.unitValue)}</td>
                <td>{formatCurrency(item.totalValue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cte-summary">
        <h3>Resumo</h3>
        <p>Peso Total: {cte.weight} kg</p>
        <p>Volume: {cte.volume} m³</p>
        <p>Valor Total: {formatCurrency(cte.value)}</p>
        <p>Emissão: {formatDate(cte.issuedAt)}</p>
      </div>

      <style jsx>{`
        .cte-viewer {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .cte-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .cte-companies {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .cte-company {
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }

        .cte-details table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }

        .cte-details th,
        .cte-details td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        .cte-summary {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
        }

        select {
          padding: 5px 10px;
          border-radius: 4px;
          border: 1px solid #ddd;
          margin-left: 10px;
        }
      `}</style>
    </div>
  );
};