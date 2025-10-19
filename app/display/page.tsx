'use client'
import Card from '@/components/ui/card'
import { useEffect, useState } from 'react'

export default function DisplayPage() {
  const [isFs, setFs] = useState(false)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'f') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().then(() => setFs(true)).catch(() => {})
        } else {
          document.exitFullscreen().then(() => setFs(false)).catch(() => {})
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <main style={{ padding: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {[
          { title: 'Entregas Hoje', value: '128', desc: 'Total de pedidos em rota' },
          { title: 'Veículos Ativos', value: '42', desc: 'Telemetria e status' },
          { title: 'Alertas', value: '5', desc: 'Ocorrências e exceções' },
          { title: 'Eficiência', value: '94%', desc: 'Rotas otimizadas' },
          { title: 'Tempo Médio', value: '27m', desc: 'Por entrega' },
          { title: 'Inventário', value: '12k', desc: 'Itens no estoque' },
        ].map((k) => (
          <Card key={k.title} title={k.title} description={k.desc} className="text-center">
            <div style={{ fontSize: 48, fontWeight: 800, color: '#e5e7eb' }}>{k.value}</div>
          </Card>
        ))}
      </div>
      <div style={{ marginTop: 12, color: '#9aa3b0', fontSize: 13 }}>
        Pressione "F" para {isFs ? 'sair do' : 'entrar em'} fullscreen. Para TV via HDMI, abra esta página.
      </div>
    </main>
  )
}