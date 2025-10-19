'use client';
import React, { useState } from 'react';
import { apiFetch } from '../utils/api';

export default function HomePage() {
  const [ping, setPing] = useState('');

  const handlePing = async () => {
    try {
      const res = await apiFetch('/ping');
      setPing(res.message || 'Backend ativo!');
    } catch {
      setPing('Erro ao conectar backend');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Bem-vindo ao OptiLog</h1>
      <button onClick={handlePing}>Testar Backend</button>
      {ping && <p>{ping}</p>}
    </div>
  );
}
