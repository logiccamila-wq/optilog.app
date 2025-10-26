"use client";
import AgentAvatar from '@/components/chat/AgentAvatar';

export default function ChatMessage({ text, fromAgent }: { text: string; fromAgent?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      {fromAgent && <AgentAvatar size={40} />}
      <div style={{ background: fromAgent ? '#f3f3f3' : '#e6f0ff', padding: 12, borderRadius: 8 }}>
        <div dangerouslySetInnerHTML={{ __html: text }} />
      </div>
    </div>
  );
}