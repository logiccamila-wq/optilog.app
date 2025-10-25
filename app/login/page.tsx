'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro na autenticação');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
      }

      setTimeout(() => router.push('/dashboard'), 1000);
    } catch (err: any) {
      setError(err.message || 'Erro ao processar requisição');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo">
          <h1>OptiLog</h1>
          <div className="subtitle">Sistema de Gestão Inteligente</div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="input-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <div className="footer-links">
            <a href="/forgot-password">Esqueceu a senha?</a>
            <a href="/signup">Criar conta</a>
          </div>
        </form>
      </div>

      <div className="background-animation" />

      <style jsx>{`
+        .login-container {
+          min-height: 100vh;
+          display: flex;
+          align-items: center;
+          justify-content: center;
+          background: #0F0F1A;
+          position: relative;
+          overflow: hidden;
+        }
+
+        .login-card {
+          background: rgba(15, 15, 26, 0.8);
+          backdrop-filter: blur(10px);
+          border: 1px solid rgba(106, 27, 154, 0.2);
+          border-radius: 16px;
+          padding: 40px;
+          width: 100%;
+          max-width: 400px;
+          position: relative;
+          z-index: 1;
+        }
+
+        .logo {
+          text-align: center;
+          margin-bottom: 40px;
+        }
+
+        h1 {
+          color: #06B6D4;
+          font-size: 2.5rem;
+          font-weight: 700;
+          margin: 0;
+          text-transform: uppercase;
+          letter-spacing: 2px;
+        }
+
+        .subtitle {
+          color: #EC4899;
+          font-size: 0.875rem;
+          margin-top: 8px;
+        }
+
+        .login-form {
+          display: flex;
+          flex-direction: column;
+          gap: 20px;
+        }
+
+        .input-group {
+          display: flex;
+          flex-direction: column;
+          gap: 8px;
+        }
+
+        label {
+          color: #ffffff;
+          font-size: 0.875rem;
+          font-weight: 500;
+        }
+
+        input {
+          background: rgba(255, 255, 255, 0.05);
+          border: 1px solid rgba(106, 27, 154, 0.3);
+          border-radius: 8px;
+          padding: 12px 16px;
+          color: #ffffff;
+          font-size: 1rem;
+          transition: all 0.2s;
+        }
+
+        input:focus {
+          outline: none;
+          border-color: #06B6D4;
+          box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.2);
+        }
+
+        .login-button {
+          background: linear-gradient(135deg, #06B6D4, #6A1B9A);
+          color: white;
+          border: none;
+          border-radius: 8px;
+          padding: 14px;
+          font-size: 1rem;
+          font-weight: 600;
+          cursor: pointer;
+          transition: all 0.2s;
+        }
+
+        .login-button:hover:not(:disabled) {
+          transform: translateY(-1px);
+          box-shadow: 0 4px 12px rgba(6, 182, 212, 0.2);
+        }
+
+        .login-button:disabled {
+          opacity: 0.7;
+          cursor: not-allowed;
+        }
+
+        .error-message {
+          background: rgba(239, 68, 68, 0.1);
+          border: 1px solid rgba(239, 68, 68, 0.2);
+          color: #ef4444;
+          padding: 12px;
+          border-radius: 8px;
+          font-size: 0.875rem;
+        }
+
+        .footer-links {
+          display: flex;
+          justify-content: space-between;
+          font-size: 0.875rem;
+        }
+
+        .footer-links a {
+          color: #06B6D4;
+          text-decoration: none;
+          transition: color 0.2s;
+        }
+
+        .footer-links a:hover {
+          color: #EC4899;
+        }
+
+        .background-animation {
+          position: absolute;
+          top: 0;
+          left: 0;
+          right: 0;
+          bottom: 0;
+          background: 
+            radial-gradient(circle at top right, rgba(6, 182, 212, 0.1), transparent 50%),
+            radial-gradient(circle at bottom left, rgba(236, 72, 153, 0.1), transparent 50%);
+          animation: pulse 10s ease infinite;
+          z-index: 0;
+        }
+
+        @keyframes pulse {
+          0% {
+            transform: scale(1);
+            opacity: 0.5;
+          }
+          50% {
+            transform: scale(1.2);
+            opacity: 0.8;
+          }
+          100% {
+            transform: scale(1);
+            opacity: 0.5;
+          }
+        }
+
+        @media (max-width: 480px) {
+          .login-card {
+            margin: 20px;
+            padding: 30px;
+          }
+
+          h1 {
+            font-size: 2rem;
+          }
+        }
+      `}</style>
    </div>
  );
}
