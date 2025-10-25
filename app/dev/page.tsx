"use client";
import React from "react";
import { appConfig } from "@/config/app.config";

function usePing(url?: string) {
  const [status, setStatus] = React.useState<"idle"|"ok"|"fail">("idle");
  const [message, setMessage] = React.useState<string>("");
  const onPing = async () => {
    if (!url) { setStatus("fail"); setMessage("URL não configurada"); return; }
    try {
      const res = await fetch(url, { method: "GET" });
      setStatus(res.ok ? "ok" : "fail");
      setMessage(res.ok ? `OK (${res.status})` : `Falha (${res.status})`);
    } catch (e: any) {
      setStatus("fail");
      setMessage(e?.message || "Erro inesperado");
    }
  };
  return { status, message, onPing };
}

export default function DevToolsPage() {
  const n8nUrl = appConfig.integration?.n8n?.baseUrl && appConfig.integration?.n8n?.healthPath
    ? `${appConfig.integration.n8n.baseUrl}${appConfig.integration.n8n.healthPath}`
    : undefined;
  const { status: n8nStatus, message: n8nMsg, onPing: pingN8n } = usePing(n8nUrl);

  const apiHealthUrl = "/api/health"; // rota já existente para checagem
  const { status: apiStatus, message: apiMsg, onPing: pingApi } = usePing(apiHealthUrl);

  const zohoConfigured = !!appConfig.integration?.zohoMail?.enabled;
  const sefazConfigured = !!appConfig.integration?.sefaz?.enabled;

  const companyName = appConfig.about?.companyName || 'Optilog';
  const organizations = appConfig.about?.organizations || [];
  const aiProviders = appConfig.about?.aiProviders || ['Gemini', 'ChatGPT'];

  return (
    <main className="container" style={{ padding: "2rem", maxWidth: 960 }}>
      <h1>Ferramentas de Desenvolvimento</h1>
      <p>Central de utilitários e checagens para integrações e modo desenvolvedor.</p>

      {/* Creditos / empresas envolvidas */}
      <section style={{ marginTop: "1.5rem" }}>
        <h2>Equipes e Provedores</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
          <div style={{ border: "1px solid #333", borderRadius: 8, padding: "1rem" }}>
            <h3>Empresa</h3>
            <p><strong>{companyName}</strong></p>
            {organizations.length > 0 && (
              <>
                <p style={{ marginBottom: 8 }}>Organizações envolvidas:</p>
                <ul>
                  {organizations.map((org) => (
                    <li key={org}>{org}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div style={{ border: "1px solid #333", borderRadius: 8, padding: "1rem" }}>
            <h3>Provedores de IA</h3>
            <ul>
              {aiProviders.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Integrações</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
          <div style={{ border: "1px solid #333", borderRadius: 8, padding: "1rem" }}>
            <h3>n8n</h3>
            <p>Base: <code>{appConfig.integration?.n8n?.baseUrl || "não configurado"}</code></p>
            <button onClick={pingN8n} style={{ padding: "0.5rem 1rem" }}>Testar Health</button>
            <p>Status: <strong>{n8nStatus}</strong> {n8nMsg && `- ${n8nMsg}`}</p>
          </div>
          <div style={{ border: "1px solid #333", borderRadius: 8, padding: "1rem" }}>
            <h3>Zoho Mail</h3>
            <p>API: <code>{appConfig.integration?.zohoMail?.apiBaseUrl || "não configurado"}</code></p>
            <p>Token presente: <strong>{zohoConfigured ? "sim" : "não"}</strong></p>
            <p>Use uma rota interna para enviar testes de e-mail com segurança.</p>
          </div>
          <div style={{ border: "1px solid #333", borderRadius: 8, padding: "1rem" }}>
            <h3>SEFAZ (CT-e)</h3>
            <p>Ambiente: <code>{appConfig.integration?.sefaz?.env || "não definido"}</code></p>
            <p>Endpoint: <code>{appConfig.integration?.sefaz?.cteBaseUrl || "não configurado"}</code></p>
            <p>Configuração: <strong>{sefazConfigured ? "presente" : "ausente"}</strong></p>
            <p>Operações sensíveis: valide certificados e ambiente antes de produção.</p>
          </div>
        </div>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Servidor / API</h2>
        <p>Checar saúde do servidor Next e rotas internas.</p>
        <button onClick={pingApi} style={{ padding: "0.5rem 1rem" }}>Ping /api/health</button>
        <p>Status: <strong>{apiStatus}</strong> {apiMsg && `- ${apiMsg}`}</p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Modo Desenvolvedor (Android)</h2>
        <ul>
          <li>Depuração USB via ADB</li>
          <li>Ajustes de animação (escala de animação/transition)</li>
          <li>Monitoramento de desempenho (CPU, GPU, processos)</li>
          <li>Limitar processos em segundo plano</li>
          <li>Simular locais (GPS mock)</li>
          <li>Forçar renderização 2D</li>
          <li>Desbloqueio OEM (bootloader)</li>
        </ul>
        <h3>Como ativar</h3>
        <ol>
          <li>Abra <strong>Configurações</strong> do aparelho.</li>
          <li>Acesse <strong>Sobre o telefone</strong> e toque 7x em <strong>Número de compilação</strong>.</li>
          <li>Digite seu PIN se solicitado; as <strong>Opções do desenvolvedor</strong> aparecerão.</li>
        </ol>
        <p><strong>Precauções:</strong> alterações incorretas podem afetar desempenho e estabilidade.</p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Utilitários de browser</h2>
        <p>Para simular localização no navegador, use as DevTools (Sensors) do Chrome.
        Você também pode passar <code>?mockLocation=lat,lng</code> em URLs internas e ler esse valor no app.</p>
      </section>
    </main>
  );
}