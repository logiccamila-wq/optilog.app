'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/utils/api';

type Vehicle = {
  id: number;
  plate?: string;
  modelo?: string;
  km?: number;
};

type Tire = {
  id: number;
  vehicle_id: number | null;
  position: string | null;
  life?: number;
};

const POSITIONS: { key: string; label: string }[] = [
  { key: 'front_left', label: 'Dianteiro Esquerdo' },
  { key: 'front_right', label: 'Dianteiro Direito' },
  { key: 'rear_left', label: 'Traseiro Esquerdo' },
  { key: 'rear_right', label: 'Traseiro Direito' },
];

export default function PneusMovimentacaoPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [tires, setTires] = useState<Tire[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const vs = await apiFetch('/vehicles');
        const ts = await apiFetch('/tires');
        setVehicles(
          (vs || []).map((v: any) => ({
            id: Number(v.id),
            plate: v.plate || v.plate,
            modelo: v.modelo || v.model,
            km: v.km || v.odometer,
          }))
        );
        setTires(
          (ts || []).map((t: any) => ({
            id: Number(t.id),
            vehicle_id: t.vehicle_id == null ? null : Number(t.vehicle_id),
            position: t.position || null,
            life: t.life,
          }))
        );
        if ((vs || []).length > 0) setSelectedVehicleId(Number(vs[0].id));
      } catch (e: any) {
        setError(e?.message || 'Falha ao carregar dados');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const selectedVehicle = useMemo(
    () => vehicles.find((v) => v.id === selectedVehicleId) || null,
    [vehicles, selectedVehicleId]
  );

  const tiresByPosition = useMemo(() => {
    const map: Record<string, Tire | null> = {};
    POSITIONS.forEach((p) => (map[p.key] = null));
    if (!selectedVehicleId) return map;
    for (const t of tires) {
      if (t.vehicle_id === selectedVehicleId && t.position) {
        if (POSITIONS.some((p) => p.key === t.position)) {
          map[t.position] = t;
        }
      }
    }
    return map;
  }, [tires, selectedVehicleId]);

  const availableTires = useMemo(() => {
    return tires.filter((t) => !selectedVehicleId || t.vehicle_id !== selectedVehicleId);
  }, [tires, selectedVehicleId]);

  const handleDragStart = (e: React.DragEvent, tireId: number) => {
    e.dataTransfer.setData('text/plain', String(tireId));
  };

  const handleDropOnPosition = async (e: React.DragEvent, posKey: string) => {
    e.preventDefault();
    const text = e.dataTransfer.getData('text/plain');
    const tireId = Number(text);
    if (!tireId || !selectedVehicleId) return;
    try {
      const updated = await apiFetch(`/tires/${tireId}`, {
        method: 'PUT',
        body: JSON.stringify({ vehicle_id: selectedVehicleId, position: posKey }),
      });
      setTires((prev) =>
        prev.map((t) =>
          t.id === tireId
            ? { ...t, vehicle_id: Number(updated.vehicle_id), position: updated.position }
            : t
        )
      );
    } catch (e: any) {
      setError(e?.message || 'Falha ao mover pneu');
    }
  };

  const allowDrop = (e: React.DragEvent) => e.preventDefault();

  const Header = () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 0',
      }}
    >
      <h1 style={{ margin: 0 }}>Gestão de Pneus – Movimentação</h1>
      <div style={{ fontSize: '0.9rem', color: '#666' }}>
        {loading ? 'Carregando…' : error ? `Erro: ${error}` : ''}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '1rem 2rem' }}>
      <Header />
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1rem' }}>
        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: '0.5rem' }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Veículos</div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              maxHeight: 480,
              overflowY: 'auto',
            }}
          >
            {vehicles.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVehicleId(v.id)}
                style={{
                  textAlign: 'left',
                  border: '1px solid #ccc',
                  borderRadius: 6,
                  padding: '8px 10px',
                  background: selectedVehicleId === v.id ? '#eef6ff' : '#fff',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontWeight: 600 }}>{v.plate || `Veículo ${v.id}`}</div>
                <div style={{ fontSize: 12, color: '#555' }}>{v.modelo || '-'}</div>
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateRows: '340px 1fr', gap: '1rem' }}>
          {/* Grade de posições do veículo selecionado */}
          <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: '0.5rem' }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>
              Posições – {selectedVehicle ? selectedVehicle.plate : 'Selecione um veículo'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, height: 280 }}>
              {POSITIONS.map((p) => {
                const tire = tiresByPosition[p.key];
                return (
                  <div
                    key={p.key}
                    onDrop={(e) => handleDropOnPosition(e, p.key)}
                    onDragOver={allowDrop}
                    style={{
                      border: '2px dashed #bbb',
                      borderRadius: 8,
                      padding: 12,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      background: '#fafafa',
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{p.label}</div>
                    {tire ? (
                      <div
                        style={{
                          border: '1px solid #ccc',
                          borderRadius: 6,
                          padding: '8px',
                          background: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600 }}>Pneu #{tire.id}</div>
                          <div style={{ fontSize: 12, color: '#555' }}>
                            Vida: {tire.life ?? '-'}%
                          </div>
                        </div>
                        <div style={{ fontSize: 12, color: '#777' }}>
                          Arraste outro pneu aqui para trocar
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          border: '1px solid #eee',
                          borderRadius: 6,
                          padding: '8px',
                          background: '#fff',
                          color: '#888',
                          textAlign: 'center',
                        }}
                      >
                        Solte um pneu aqui
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lista de pneus disponíveis para arrastar */}
          <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: '0.5rem' }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Pneus disponíveis</div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 10,
              }}
            >
              {availableTires.length === 0 && (
                <div style={{ color: '#666' }}>
                  Nenhum pneu disponível fora do veículo selecionado.
                </div>
              )}
              {availableTires.map((t) => (
                <div
                  key={t.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, t.id)}
                  title={`Arraste para uma posição do veículo ${selectedVehicle?.plate || ''}`}
                  style={{
                    border: '1px solid #ccc',
                    borderRadius: 6,
                    padding: 10,
                    background: '#fff',
                    cursor: 'grab',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                  }}
                >
                  <div style={{ fontWeight: 600 }}>Pneu #{t.id}</div>
                  <div style={{ fontSize: 12, color: '#555' }}>Vida: {t.life ?? '-'}%</div>
                  <div style={{ fontSize: 12, color: '#777' }}>
                    Atual: {t.vehicle_id ? `Veículo ${t.vehicle_id}` : 'Estoque'}
                    {t.position ? ` – ${t.position}` : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
