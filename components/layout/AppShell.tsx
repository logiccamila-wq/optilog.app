import React from 'react';
import SidebarNav from '@/components/layout/SidebarNav';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-[260px_1fr] gap-4 px-4 py-6">
      <SidebarNav />
      <div>{children}</div>
    </div>
  );
}
