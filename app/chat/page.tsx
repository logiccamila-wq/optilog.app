"use client";
import ChatMessage from '@/components/chat/ChatMessage';

export default function ChatPage() {
  return (
    <main className="container" style={{ display: 'grid', gap: 12 }}>
      <h1>Chat • EJG Bot</h1>
      <ChatMessage fromAgent text={"Olá! Eu sou o <strong>EJG Bot</strong>. Como posso ajudar?"} />
      <ChatMessage text={"Quero ver os KPIs de entregas de hoje."} />
      <ChatMessage fromAgent text={"Perfeito. Acesse o módulo <a href=\"/dashboard/visao-geral\">Visão Geral</a> para os KPIs atualizados."} />
    </main>
  );
}