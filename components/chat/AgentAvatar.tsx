"use client";
import Image from 'next/image';

export default function AgentAvatar({ size = 48 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden' }}>
      <Image src="/icons/ejg-avatar.png" alt="EJG Chatbot" width={size} height={size} />
    </div>
  );
}