"use client";
import React, { useCallback, useState } from "react";
import { app } from "@/lib/firebaseClient";
import { getStorage, ref as storageRef, uploadBytes } from "firebase/storage";
import { getFunctions, httpsCallable } from "firebase/functions";

export default function AdminPage() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string>("");

  const [uidUpdate, setUidUpdate] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("");
  const [disabled, setDisabled] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const [uidDelete, setUidDelete] = useState("");
  const [serverStatus, setServerStatus] = useState<string>("");

  const uploadCsv = useCallback(async () => {
    if (!csvFile) {
      setMessage("Selecione um arquivo CSV primeiro.");
      return;
    }
    try {
      setUploading(true);
      setMessage("");
      const storage = getStorage(app);
      const path = `csv-imports/${csvFile.name}`;
      const ref = storageRef(storage, path);
      const metadata = { contentType: "text/csv" };
      await uploadBytes(ref, await csvFile.arrayBuffer(), metadata);
      setMessage(`Upload concluído: ${path}. A função importará usuários em alguns segundos.`);
    } catch (e: any) {
      setMessage(`Falha no upload: ${e?.message || String(e)}`);
    } finally {
      setUploading(false);
    }
  }, [csvFile]);

  const callUpdateUser = useCallback(async () => {
    try {
      const functions = getFunctions(app, "us-central1");
      const fn = httpsCallable(functions, "updateAuthUserCallable");
      const payload: any = { uid: uidUpdate };
      if (displayName) payload.displayName = displayName;
      if (role) payload.role = role;
      if (phoneNumber) payload.phoneNumber = phoneNumber;
      payload.disabled = !!disabled;
      const res = await fn(payload);
      setMessage(`Atualização OK: ${JSON.stringify(res.data)}`);
    } catch (e: any) {
      setMessage(`Erro ao atualizar: ${e?.message || String(e)}`);
    }
  }, [uidUpdate, displayName, role, phoneNumber, disabled]);

  const callDeleteUser = useCallback(async () => {
    try {
      const functions = getFunctions(app, "us-central1");
      const fn = httpsCallable(functions, "deleteAuthUserCallable");
      const res = await fn({ uid: uidDelete });
      setMessage(`Exclusão OK: ${JSON.stringify(res.data)}`);
    } catch (e: any) {
      setMessage(`Erro ao excluir: ${e?.message || String(e)}`);
    }
  }, [uidDelete]);

  const checkServer = useCallback(async () => {
    try {
      const res = await fetch("/nextServer/status");
      const json = await res.json();
      setServerStatus(JSON.stringify(json));
    } catch (e: any) {
      setServerStatus(`Erro: ${e?.message || String(e)}`);
    }
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: 16 }}>
      <h1>Admin</h1>
      <p style={{ color: "#bbb" }}>Upload de CSV para importar usuários, e ações de atualização/remoção via Functions callable.</p>

      <section style={{ marginTop: 24, padding: 16, border: "1px solid #333", borderRadius: 8 }}>
        <h2>Upload CSV</h2>
        <p style={{ color: "#aaa" }}>Formato: cabeçalho mínimo `email`; opcionais: `displayName,password,role,disabled,phoneNumber`.</p>
        <input type="file" accept=".csv,text/csv" onChange={(e) => setCsvFile(e.target.files?.[0] || null)} />
        <div style={{ marginTop: 8 }}>
          <button onClick={uploadCsv} disabled={uploading} style={{ padding: "6px 12px" }}>{uploading ? "Enviando..." : "Enviar CSV"}</button>
        </div>
      </section>

      <section style={{ marginTop: 24, padding: 16, border: "1px solid #333", borderRadius: 8 }}>
        <h2>Atualizar Usuário</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <input placeholder="UID" value={uidUpdate} onChange={(e) => setUidUpdate(e.target.value)} />
          <input placeholder="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          <input placeholder="Role (ex: admin)" value={role} onChange={(e) => setRole(e.target.value)} />
          <input placeholder="Telefone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={disabled} onChange={(e) => setDisabled(e.target.checked)} /> Desabilitado
          </label>
        </div>
        <div style={{ marginTop: 8 }}>
          <button onClick={callUpdateUser} style={{ padding: "6px 12px" }}>Atualizar</button>
        </div>
      </section>

      <section style={{ marginTop: 24, padding: 16, border: "1px solid #333", borderRadius: 8 }}>
        <h2>Excluir Usuário</h2>
        <input placeholder="UID para excluir" value={uidDelete} onChange={(e) => setUidDelete(e.target.value)} />
        <div style={{ marginTop: 8 }}>
          <button onClick={callDeleteUser} style={{ padding: "6px 12px", background: "#a33", color: "#fff" }}>Excluir</button>
        </div>
      </section>

      <section style={{ marginTop: 24, padding: 16, border: "1px solid #333", borderRadius: 8 }}>
        <h2>Verificar Servidor</h2>
        <button onClick={checkServer} style={{ padding: "6px 12px" }}>Checar /nextServer/status</button>
        {serverStatus && <pre style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{serverStatus}</pre>}
      </section>

      {message && (
        <div style={{ marginTop: 16, padding: 12, border: "1px solid #444", borderRadius: 8, background: "#111" }}>
          <strong>Resultado:</strong>
          <div>{message}</div>
        </div>
      )}
    </div>
  );
}