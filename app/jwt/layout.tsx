'use client';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function JwtLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const isLogin = pathname?.startsWith('/jwt/login');
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!isLogin && !token) {
      router.replace('/jwt/login');
    }
    setChecked(true);
  }, [pathname, router]);

  if (!checked) {
    return <div style={{ padding: '2rem' }}>Carregando...</div>;
  }

  return <>{children}</>;
}
