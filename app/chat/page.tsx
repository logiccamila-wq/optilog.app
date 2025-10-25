'use client';
import { useState } from 'react';
import ChatMessage from '@/components/chat/ChatMessage';

export default function ChatPage() {
  const [messages, setMessages] = useState<Array<{ text: string; fromAgent?: boolean }>>([
    { fromAgent: true, text: 'Olá! Eu sou o <strong>EJG Bot</strong>. Como posso ajudar?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const onSend = async () => {
    const q = input.trim();
    if (!q) return;
    setMessages((m) => [...m, { text: q }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch(`/api/search-docs?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (Array.isArray(data.items) && data.items.length > 0) {
        const first = data.items[0];
        setMessages((m) => [
          ...m,
          {
            fromAgent: true,
            text: `Encontrei no <em>${first.title}</em>:<br/><blockquote>${first.snippet}</blockquote><br/>Veja mais em <a href="/api/docs" target="_blank" rel="noopener">/api/docs</a> ou na documentação local.`,
          },
        ]);
      } else {
        setMessages((m) => [
          ...m,
          {
            fromAgent: true,
            text: 'Não encontrei conteúdo relacionado na documentação local. Tente outra palavra-chave ou acesse o link oficial do manual Sicro2 na página de documentação.',
          },
        ]);
      }
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        {
          fromAgent: true,
          text: `Ocorreu um erro ao consultar a documentação: ${e?.message || 'erro desconhecido'}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container" style={{ display: 'grid', gap: 12 }}>
      <h1>Chat • EJG Bot</h1>
      <div style={{ display: 'grid', gap: 8 }}>
        {messages.map((m, i) => (
          <ChatMessage key={i} fromAgent={m.fromAgent} text={m.text} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte sobre custos Sicro2, PBTC, etc."
          style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
        />
        <button
          onClick={onSend}
          disabled={loading}
          style={{ padding: '8px 12px', borderRadius: 6 }}
        >
          {loading ? 'Consultando...' : 'Enviar'}
        </button>
      </div>
      <p style={{ fontSize: 12, color: '#666' }}>
        Fonte local: documentação em <code>/docs/sicro2-manual.md</code> e API{' '}
        <code>/api/search-docs</code>.
      </p>
    </main>
  );
}
