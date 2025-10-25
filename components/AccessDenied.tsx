'use client';

import React from 'react';
import Link from 'next/link';

export default function AccessDenied() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="bg-white border rounded-lg shadow-sm p-6 max-w-md text-center">
        <div className="text-4xl mb-2">🔒</div>
        <h2 className="text-xl font-semibold mb-2">Acesso Negado</h2>
        <p className="text-gray-600 mb-4">Você não tem permissão para acessar esta área.</p>
        <Link href="/" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}