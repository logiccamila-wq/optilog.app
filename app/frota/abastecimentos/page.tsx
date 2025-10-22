"use client";
import AccessControl from "@/components/AccessControl";
import { Role } from "@/lib/rbac";

export default function AbastecimentosPage() {
  return (
    <AccessControl allowedRoles={["admin", "driver"] as Role[]}>
      <main style={{ maxWidth: 900, margin: "24px auto", padding: "0 16px" }}>
        <h1 style={{ marginTop: 0 }}>Abastecimentos</h1>
        <p style={{ color: "#aaa" }}>Registre e consulte abastecimentos por veículo.</p>

        <div style={{ border: "1px solid #333", borderRadius: 10, padding: 16, marginTop: 16 }}>
          <h3 style={{ marginTop: 0 }}>Novo lançamento</h3>
          <form style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
            <input placeholder="Veículo" />
            <input placeholder="Litros" type="number" />
            <input placeholder="Valor" type="number" />
            <input placeholder="Data" type="date" />
            <button type="button" style={{ border: "1px solid #1e3a8a", color: "#9ecfff", background: "transparent", borderRadius: 8, padding: "6px 10px" }}>
              Salvar (mock)
            </button>
          </form>
        </div>

        <div style={{ border: "1px solid #333", borderRadius: 10, padding: 16, marginTop: 16 }}>
          <h3 style={{ marginTop: 0 }}>Histórico (mock)</h3>
          <ul>
            <li>ABC-1234 — 45 L — R$ 270,00 — 2025-10-10</li>
            <li>XYZ-9876 — 32 L — R$ 192,00 — 2025-10-08</li>
          </ul>
        </div>
      </main>
    </AccessControl>
  );
}