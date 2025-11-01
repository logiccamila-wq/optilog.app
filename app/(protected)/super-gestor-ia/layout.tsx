'use client';
import React from 'react';

export default function SuperGestorIALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 text-center text-sm font-semibold">
        🔐 MÓDULO EXCLUSIVO - Super Gestor IA/ML
      </div>
      <main>{children}</main>
    </div>
  );
}