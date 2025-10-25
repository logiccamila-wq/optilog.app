"use client";
import React, { useEffect, useState } from "react";

type Meeting = {
  date: string;
  participants: string;
  scope: { q9001: boolean; e14001: boolean; s45001: boolean };
  notes: string;
};

type AgendaItem = { title: string; description?: string; owner?: string; dueDate?: string };

type Entrada = { type: string; details: string };

type ActionItem = {
  title: string;
  responsible: string;
  deadline: string;
  status: "Planejada" | "Em andamento" | "Concluída";
};

type KPI = { name: string; target: string; current: string; notes?: string };

type TurtleDiagram = {
  process: string;
  inputs: string;
  outputs: string;
  resources: string;
  controls: string;
  metrics: string;
};

const STORAGE_KEY = "mgmt_review_iso";

const defaultEntradas = [
  "Desempenho de processos e conformidade",
  "Resultados de auditorias (internas/externas)",
  "Feedback de clientes e partes interessadas",
  "Status de ações de revisões anteriores",
  "Mudanças internas/externas (contexto)",
  "Conformidade legal e outros requisitos",
  "Desempenho ambiental (ISO 14001)",
  "SSO: incidentes, treinamentos e inspeções (ISO 45001)",
  "Recursos e capacidades",
  "Riscos e oportunidades",
];

function exportCSV(filename: string, rows: string[][]) {
  const processRow = (row: string[]) =>
    row
      .map((val) => {
        const inner = (val ?? "").toString().replace(/"/g, '""');
        if (inner.search(/[",\n]/g) >= 0) return '"' + inner + '"';
        return inner;
      })
      .join(",");
  const csvContent = rows.map(processRow).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function RevisaoGestaoPage() {
  const [meeting, setMeeting] = useState<Meeting>({
    date: new Date().toISOString().slice(0, 10),
    participants: "",
    scope: { q9001: true, e14001: true, s45001: true },
    notes: "",
  });
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [entradas, setEntradas] = useState<Entrada[]>(
    defaultEntradas.map((t) => ({ type: t, details: "" }))
  );
  const [acoes, setAcoes] = useState<ActionItem[]>([]);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [turtle, setTurtle] = useState<TurtleDiagram>({
    process: "Revisão pela Direção",
    inputs: defaultEntradas.join("; "),
    outputs: "Ata, plano de ações, decisões, atualização de metas",
    resources: "Equipe, dados, infraestrutura",
    controls: "Calendário, procedimento, checklist, registros",
    metrics: "Conclusão de ações, cumprimento de metas, NCs",
  });

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        setMeeting(data.meeting ?? meeting);
        setAgenda(data.agenda ?? []);
        setEntradas(data.entradas ?? entradas);
        setAcoes(data.acoes ?? []);
        setKpis(data.kpis ?? []);
        setTurtle(data.turtle ?? turtle);
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const data = { meeting, agenda, entradas, acoes, kpis, turtle };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [meeting, agenda, entradas, acoes, kpis, turtle]);

  const exportAta = () => {
    const ata = {
      meeting,
      agenda,
      entradas,
      decisoes: acoes,
      kpis,
      turtle,
      createdAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(ata, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ata-revisao-${meeting.date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAcoesCSV = () => {
    const rows: string[][] = [
      ["Ação", "Responsável", "Prazo", "Status"],
      ...acoes.map((x) => [x.title, x.responsible, x.deadline, x.status]),
    ];
    exportCSV(`plano-acoes-${meeting.date}.csv`, rows);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Revisão de Gestão — ISO 9001 + 14001 + 45001</h1>
      <p className="text-sm text-gray-600">Padronize suas reuniões de revisão, garanta conformidade e foque em melhoria contínua.</p>

      {/* Meeting header */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded">
        <div>
          <label className="block text-sm font-medium">Data</label>
          <input type="date" className="mt-1 w-full border rounded p-2"
            value={meeting.date}
            onChange={(e) => setMeeting({ ...meeting, date: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Participantes</label>
          <input type="text" className="mt-1 w-full border rounded p-2"
            placeholder="Direção, QSMS, Operações, Comercial..."
            value={meeting.participants}
            onChange={(e) => setMeeting({ ...meeting, participants: e.target.value })}
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Escopo</label>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1 text-sm"><input type="checkbox" checked={meeting.scope.q9001} onChange={(e)=>setMeeting({...meeting, scope:{...meeting.scope, q9001: e.target.checked}})} />9001</label>
            <label className="flex items-center gap-1 text-sm"><input type="checkbox" checked={meeting.scope.e14001} onChange={(e)=>setMeeting({...meeting, scope:{...meeting.scope, e14001: e.target.checked}})} />14001</label>
            <label className="flex items-center gap-1 text-sm"><input type="checkbox" checked={meeting.scope.s45001} onChange={(e)=>setMeeting({...meeting, scope:{...meeting.scope, s45001: e.target.checked}})} />45001</label>
          </div>
        </div>
        <div className="md:col-span-3">
          <label className="block text-sm font-medium">Notas</label>
          <textarea className="mt-1 w-full border rounded p-2" rows={2}
            placeholder="Objetivos da reunião, contexto, prioridades..."
            value={meeting.notes}
            onChange={(e) => setMeeting({ ...meeting, notes: e.target.value })}
          />
        </div>
      </section>

      {/* Agenda */}
      <section className="border p-4 rounded">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-medium">Pauta (Agenda)</h2>
          <button className="px-3 py-1 border rounded" onClick={()=>setAgenda([...agenda, { title: "Novo item" }])}>Adicionar item</button>
        </div>
        <div className="space-y-3">
          {agenda.map((it, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <input className="border rounded p-2" placeholder="Título"
                value={it.title}
                onChange={(e)=>{
                  const a = [...agenda]; a[idx] = { ...it, title: e.target.value }; setAgenda(a);
                }}
              />
              <input className="border rounded p-2" placeholder="Responsável"
                value={it.owner ?? ""}
                onChange={(e)=>{ const a=[...agenda]; a[idx]={...it, owner:e.target.value}; setAgenda(a); }}
              />
              <input type="date" className="border rounded p-2"
                value={it.dueDate ?? ""}
                onChange={(e)=>{ const a=[...agenda]; a[idx]={...it, dueDate:e.target.value}; setAgenda(a); }}
              />
              <button className="border rounded" onClick={()=>{ const a=[...agenda]; a.splice(idx,1); setAgenda(a); }}>Remover</button>
              <textarea className="md:col-span-4 border rounded p-2" rows={2} placeholder="Descrição"
                value={it.description ?? ""}
                onChange={(e)=>{ const a=[...agenda]; a[idx]={...it, description:e.target.value}; setAgenda(a); }}
              />
            </div>
          ))}
          {agenda.length === 0 && <p className="text-sm text-gray-600">Adicione tópicos a serem discutidos.</p>}
        </div>
      </section>

      {/* Entradas */}
      <section className="border p-4 rounded">
        <h2 className="font-medium mb-2">Entradas (ISO 9.3.2)</h2>
        <div className="space-y-3">
          {entradas.map((en, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input className="border rounded p-2" value={en.type} onChange={(e)=>{
                const x=[...entradas]; x[idx]={...en, type:e.target.value}; setEntradas(x);
              }} />
              <textarea className="border rounded p-2" rows={2} placeholder="Resumo, dados e conclusões"
                value={en.details}
                onChange={(e)=>{ const x=[...entradas]; x[idx]={...en, details:e.target.value}; setEntradas(x); }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Ações (saídas) */}
      <section className="border p-4 rounded">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-medium">Plano de Ações (Saídas)</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded" onClick={()=>setAcoes([...acoes, { title: "Nova ação", responsible: "", deadline: "", status: "Planejada" }])}>Adicionar ação</button>
            <button className="px-3 py-1 border rounded" onClick={exportAcoesCSV}>Exportar CSV</button>
          </div>
        </div>
        <div className="space-y-3">
          {acoes.map((ac, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2">
              <input className="border rounded p-2" placeholder="Ação"
                value={ac.title}
                onChange={(e)=>{ const x=[...acoes]; x[idx]={...ac, title:e.target.value}; setAcoes(x); }}
              />
              <input className="border rounded p-2" placeholder="Responsável"
                value={ac.responsible}
                onChange={(e)=>{ const x=[...acoes]; x[idx]={...ac, responsible:e.target.value}; setAcoes(x); }}
              />
              <input type="date" className="border rounded p-2"
                value={ac.deadline}
                onChange={(e)=>{ const x=[...acoes]; x[idx]={...ac, deadline:e.target.value}; setAcoes(x); }}
              />
              <select className="border rounded p-2" value={ac.status}
                onChange={(e)=>{ const x=[...acoes]; x[idx]={...ac, status: e.target.value as ActionItem["status"]}; setAcoes(x); }}
              >
                <option>Planejada</option>
                <option>Em andamento</option>
                <option>Concluída</option>
              </select>
              <button className="border rounded" onClick={()=>{ const x=[...acoes]; x.splice(idx,1); setAcoes(x); }}>Remover</button>
            </div>
          ))}
          {acoes.length === 0 && <p className="text-sm text-gray-600">Inclua ações com responsável, prazo e status.</p>}
        </div>
      </section>

      {/* KPIs */}
      <section className="border p-4 rounded">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-medium">KPIs</h2>
          <button className="px-3 py-1 border rounded" onClick={()=>setKpis([...kpis, { name: "Novo KPI", target: "", current: "" }])}>Adicionar KPI</button>
        </div>
        <div className="space-y-3">
          {kpis.map((k, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <input className="border rounded p-2" placeholder="Nome"
                value={k.name}
                onChange={(e)=>{ const x=[...kpis]; x[idx]={...k, name:e.target.value}; setKpis(x); }}
              />
              <input className="border rounded p-2" placeholder="Meta"
                value={k.target}
                onChange={(e)=>{ const x=[...kpis]; x[idx]={...k, target:e.target.value}; setKpis(x); }}
              />
              <input className="border rounded p-2" placeholder="Atual"
                value={k.current}
                onChange={(e)=>{ const x=[...kpis]; x[idx]={...k, current:e.target.value}; setKpis(x); }}
              />
              <input className="border rounded p-2" placeholder="Notas"
                value={k.notes ?? ""}
                onChange={(e)=>{ const x=[...kpis]; x[idx]={...k, notes:e.target.value}; setKpis(x); }}
              />
            </div>
          ))}
          {kpis.length === 0 && <p className="text-sm text-gray-600">Cadastre KPIs de qualidade, ambiental e SSO.</p>}
        </div>
      </section>

      {/* Turtle diagram */}
      <section className="border p-4 rounded">
        <h2 className="font-medium mb-2">Diagrama de Tartaruga (Processo)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input className="border rounded p-2" placeholder="Processo" value={turtle.process} onChange={(e)=>setTurtle({...turtle, process:e.target.value})} />
          <input className="border rounded p-2" placeholder="Entradas" value={turtle.inputs} onChange={(e)=>setTurtle({...turtle, inputs:e.target.value})} />
          <input className="border rounded p-2" placeholder="Saídas" value={turtle.outputs} onChange={(e)=>setTurtle({...turtle, outputs:e.target.value})} />
          <input className="border rounded p-2" placeholder="Recursos" value={turtle.resources} onChange={(e)=>setTurtle({...turtle, resources:e.target.value})} />
          <input className="border rounded p-2" placeholder="Controles" value={turtle.controls} onChange={(e)=>setTurtle({...turtle, controls:e.target.value})} />
          <input className="border rounded p-2" placeholder="Métricas" value={turtle.metrics} onChange={(e)=>setTurtle({...turtle, metrics:e.target.value})} />
        </div>
      </section>

      {/* Actions */}
      <section className="flex gap-2">
        <button className="px-3 py-2 border rounded" onClick={exportAta}>Exportar Ata (JSON)</button>
        <button className="px-3 py-2 border rounded" onClick={exportAcoesCSV}>Exportar Plano de Ações (CSV)</button>
      </section>

      <p className="text-xs text-gray-500">
        Conformidade: ISO 9001/14001/45001 — Revisão pela Direção (9.3). Registre decisões e ações com evidência e acompanhe KPIs para melhoria contínua.
      </p>
    </div>
  );
}