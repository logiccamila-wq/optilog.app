"use client";
import React, { useMemo, useState } from "react";

type Choice = "SIM" | "NAO" | "NA" | null;

type Item = {
  id: string;
  label: string;
  critical?: boolean; // itens críticos impedem liberação com "NAO"
  choice: Choice;
};

type Group = {
  id: string;
  title: string;
  items: Item[];
};

const initialGroups: Group[] = [
  {
    id: "motorista",
    title: "MOTORISTA",
    items: [
      { id: "cnh", label: "CNH categoria compatível com veículo?", critical: true, choice: null },
      { id: "traje", label: "Traje mínimo: Calça, Camisa e Botina de Segurança?", critical: true, choice: null },
      { id: "condicoes", label: "Condições físicas adequadas? (sem cansaço ou sono)", critical: true, choice: null },
    ],
  },
  {
    id: "documentacao",
    title: "DOCUMENTAÇÃO",
    items: [
      { id: "crlv", label: "Possui CRLV em dia?", critical: true, choice: null },
      { id: "nf", label: "Material possui Nota Fiscal?", critical: true, choice: null },
      { id: "cte", label: "Possui CTe (Conhecimento de Transporte)?", critical: true, choice: null },
      { id: "rntrc", label: "Veículo possui cadastro do RNTRC?", critical: false, choice: null },
    ],
  },
  {
    id: "veiculo",
    title: "VEÍCULO",
    items: [
      { id: "estado", label: "Veículo em bom estado e conservação?", critical: true, choice: null },
      { id: "calcos", label: "Veículo possui os dois calços de roda?", critical: true, choice: null },
      { id: "rodas", label: "Condição das rodas, pneus e estepes estão em bom estado?", critical: true, choice: null },
      { id: "sinais", label: "Faróis, buzina, lanternas e setas em funcionamento?", critical: true, choice: null },
      { id: "cinto", label: "Cinto de segurança de 3 pontos em bom estado?", critical: true, choice: null },
      { id: "compartimento", label: "Compartimento de carga em bom estado?", critical: false, choice: null },
    ],
  },
  {
    id: "seguranca",
    title: "SEGURANÇA QUIMICA",
    items: [
      { id: "extintor", label: "Possui Extintor de incêndio adequado?", critical: true, choice: null },
      { id: "paineis", label: "Painéis de segurança de acordo com o produto (ONU/Risco)?", critical: true, choice: null },
      { id: "rotulos", label: "Rótulos de risco de acordo com o produto?", critical: true, choice: null },
      { id: "kit", label: "Possui Kit de emergência íntegro?", critical: true, choice: null },
    ],
  },
  {
    id: "produtos",
    title: "PRODUTOS QUIMICOS",
    items: [
      { id: "perigoso", label: "O carregamento possui produto perigoso/químico?", critical: true, choice: null },
      { id: "tanques", label: "Tanques, válvulas e conexões sem vazamento e corrosão?", critical: true, choice: null },
      { id: "embalagens", label: "Embalagens em perfeitas condições, sem vazamento?", critical: true, choice: null },
    ],
  },
];

export default function MOPPChecklist() {
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [driverName, setDriverName] = useState<string>("");

  const stats = useMemo(() => {
    let verified = 0;
    let nonConformities = 0;
    let hasPending = false;
    let blocked = false;

    for (const g of groups) {
      for (const it of g.items) {
        if (it.choice !== null) verified++;
        if (it.choice === null) hasPending = true;
        if (it.critical && it.choice === "NAO") {
          nonConformities++;
          blocked = true;
        }
      }
    }

    const status = blocked ? "IMPEDIDO" : hasPending ? "PENDENTE" : "APTO";
    return { verified, nonConformities, status };
  }, [groups]);

  const setChoice = (groupId: string, itemId: string, choice: Choice) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id !== groupId
          ? g
          : {
              ...g,
              items: g.items.map((it) => (it.id === itemId ? { ...it, choice } : it)),
            }
      )
    );
  };

  const pill = (active: boolean, color: string) => ({
    padding: "6px 10px",
    borderRadius: 20,
    border: `1px solid ${active ? color : "#333"}`,
    background: active ? color : "transparent",
    color: active ? "#fff" : "#ddd",
    fontSize: 12,
    minWidth: 56,
    textAlign: "center" as const,
  });

  const finalize = () => {
    const anyPending = groups.some((g) => g.items.some((it) => it.choice === null));
    const anyBlocked = groups.some((g) => g.items.some((it) => it.critical && it.choice === "NAO"));
    if (anyBlocked) {
      alert("Checklist possui NÃO em item crítico. Liberação IMPEDIDA.");
      return;
    }
    if (anyPending) {
      alert("Preencha todos os itens antes de finalizar.");
      return;
    }
    if (!driverName.trim()) {
      alert("Preencha o Nome Completo do Condutor.");
      return;
    }
    alert("Checklist Enviado com Sucesso! Próximo passo: INÍCIO (CHECKLIST OK)");
  };

  return (
    <section style={{ border: "1px solid #333", borderRadius: 12, padding: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <h2 style={{ margin: 0 }}>Checklist Digital MOPP (FOR-05-17-004-022)</h2>
          <small style={{ color: "#999" }}>
            Preencha cada item. Qualquer item <strong>NÃO</strong> crítico gera alerta. Itens <strong>NÃO</strong> críticos de segurança (⭐) impedem a liberação.
          </small>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 700, letterSpacing: 1, color: stats.status === "APTO" ? "#16a34a" : stats.status === "IMPEDIDO" ? "#ef4444" : "#f59e0b" }}>
            {stats.status}
          </div>
          <small style={{ color: "#999" }}>Itens Verificados: {stats.verified} | Não Conformidades: {stats.nonConformities}</small>
        </div>
      </header>

      <div style={{ marginTop: 12, display: "grid", gap: 16 }}>
        {groups.map((g) => (
          <div key={g.id}>
            <h3 style={{ margin: "12px 0" }}>{g.title}</h3>
            <div style={{ display: "grid", gap: 10 }}>
              {g.items.map((it) => (
                <div key={it.id} style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 12 }}>
                  <div style={{ color: "#ddd" }}>
                    {it.label} {it.critical && <span title="Crítico" style={{ color: "#f59e0b" }}>⭐</span>}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setChoice(g.id, it.id, "SIM")} style={pill(it.choice === "SIM", "#16a34a")}>SIM</button>
                    <button onClick={() => setChoice(g.id, it.id, "NAO")} style={pill(it.choice === "NAO", "#ef4444")}>NÃO</button>
                    <button onClick={() => setChoice(g.id, it.id, "NA")} style={pill(it.choice === "NA", "#64748b")}>N.A.</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        <h3 style={{ margin: "12px 0" }}>Declaração e Assinatura do Condutor</h3>
        <p style={{ color: "#bbb", marginTop: 0 }}>
          Declaro que o veículo foi inspecionado, que recebi a documentação e as informações sobre os riscos do produto a ser transportado.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, alignItems: "center" }}>
          <input
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            placeholder="Nome Completo do Condutor"
            style={{
              background: "transparent",
              border: "1px solid #333",
              color: "#ddd",
              borderRadius: 8,
              padding: "8px 10px",
            }}
          />
          <button onClick={finalize} style={{ border: "none", background: "#1e3a8a", color: "#9ecfff", borderRadius: 8, padding: "8px 12px" }}>
            Assinar e Finalizar Liberação
          </button>
        </div>
      </div>

      <footer style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <button
          onClick={() => setGroups(initialGroups)}
          style={{ border: "1px solid #1e3a8a", color: "#9ecfff", background: "transparent", borderRadius: 8, padding: "6px 10px" }}
        >
          Limpar
        </button>
      </footer>
    </section>
  );
}