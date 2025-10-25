"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const body = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro na autenticação");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setSuccess(isLogin ? "Login realizado!" : "Cadastro realizado!");
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (err: any) {
      setError(err.message || "Erro ao processar requisição");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1e3a8a 0%, #1e293b 50%, #581c87 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem"
    }}>
      <div style={{ width: "100%", maxWidth: "28rem" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            display: "inline-block",
            padding: "1rem",
            background: "rgba(59, 130, 246, 0.2)",
            borderRadius: "1rem",
            marginBottom: "1rem"
          }}>
            <div style={{ fontSize: "2.5rem" }}>📦</div>
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "white", marginBottom: "0.5rem" }}>
            Optilog.app
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)" }}>
            Gestão Inteligente de Logística
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(30, 41, 59, 0.5)",
          backdropFilter: "blur(10px)",
          borderRadius: "1rem",
          border: "1px solid rgba(71, 85, 105, 1)",
          padding: "2rem"
        }}>
          
          {/* Tabs */}
          <div style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "1.5rem",
            background: "rgba(15, 23, 42, 0.5)",
            borderRadius: "0.5rem",
            padding: "0.25rem"
          }}>
            <button
              onClick={() => setIsLogin(true)}
              style={{
                flex: 1,
                padding: "0.75rem",
                borderRadius: "0.5rem",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
                background: isLogin ? "#3b82f6" : "transparent",
                color: isLogin ? "white" : "rgba(255,255,255,0.6)",
                transition: "all 0.2s"
              }}
            >
              Entrar
            </button>
            <button
              onClick={() => setIsLogin(false)}
              style={{
                flex: 1,
                padding: "0.75rem",
                borderRadius: "0.5rem",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
                background: !isLogin ? "#3b82f6" : "transparent",
                color: !isLogin ? "white" : "rgba(255,255,255,0.6)",
                transition: "all 0.2s"
              }}
            >
              Cadastrar
            </button>
          </div>

          {/* Alerts */}
          {error && (
            <div style={{
              padding: "1rem",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "0.5rem",
              marginBottom: "1rem"
            }}>
              <p style={{ color: "#fca5a5", fontSize: "0.875rem" }}>{error}</p>
            </div>
          )}

          {success && (
            <div style={{
              padding: "1rem",
              background: "rgba(34, 197, 94, 0.1)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              borderRadius: "0.5rem",
              marginBottom: "1rem"
            }}>
              <p style={{ color: "#86efac", fontSize: "0.875rem" }}>{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            
            {!isLogin && (
              <div>
                <label style={{ display: "block", color: "rgba(255,255,255,0.8)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                  Nome Completo
                </label>
                <input
                  type="text"
                  required={!isLogin}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Seu nome"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    background: "rgba(15, 23, 42, 0.5)",
                    border: "1px solid rgba(71, 85, 105, 1)",
                    borderRadius: "0.5rem",
                    color: "white",
                    fontSize: "1rem",
                    outline: "none"
                  }}
                />
              </div>
            )}

            <div>
              <label style={{ display: "block", color: "rgba(255,255,255,0.8)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu@email.com"
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  background: "rgba(15, 23, 42, 0.5)",
                  border: "1px solid rgba(71, 85, 105, 1)",
                  borderRadius: "0.5rem",
                  color: "white",
                  fontSize: "1rem",
                  outline: "none"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", color: "rgba(255,255,255,0.8)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                Senha
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  background: "rgba(15, 23, 42, 0.5)",
                  border: "1px solid rgba(71, 85, 105, 1)",
                  borderRadius: "0.5rem",
                  color: "white",
                  fontSize: "1rem",
                  outline: "none"
                }}
              />
              {!isLogin && (
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                  Mínimo 6 caracteres
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: loading ? "rgba(59, 130, 246, 0.5)" : "linear-gradient(to right, #3b82f6, #a855f7)",
                color: "white",
                fontWeight: "600",
                borderRadius: "0.5rem",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "1rem",
                transition: "all 0.2s"
              }}
            >
              {loading ? "Processando..." : (isLogin ? "Entrar" : "Criar Conta")}
            </button>
          </form>

          <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>
            {isLogin ? (
              <p>
                Não tem conta?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  style={{
                    color: "#60a5fa",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.875rem"
                  }}
                >
                  Cadastre-se
                </button>
              </p>
            ) : (
              <p>
                Já tem conta?{" "}
                <button
                  onClick={() => setIsLogin(true)}
                  style={{
                    color: "#60a5fa",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.875rem"
                  }}
                >
                  Entrar
                </button>
              </p>
            )}
          </div>
        </div>

        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem" }}>
            🔒 Dados protegidos com criptografia
          </p>
        </div>
      </div>
    </div>
  );
}