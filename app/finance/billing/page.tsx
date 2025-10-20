export default function BillingPage() {
  // Demo data — substituir por dados reais da API quando disponível
  const currentPlan = {
    name: "Pró",
    cycle: "Mensal",
    nextCharge: "08/11/2025 20:00",
  };

  const history = [
    {
      id: "inv_20251010",
      title: "Plano Pro",
      amount: "$ 3",
      date: "2025/10/10 20:00",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Plano e Faturamento</h1>
        <p className="text-sm text-gray-600">Veja seu plano de assinatura e informações de cobrança.</p>
      </header>

      {/* Plano de Assinatura */}
      <section className="rounded-lg border bg-white/50 p-6 shadow-sm">
        <h2 className="text-lg font-medium mb-4">Plano de Assinatura</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-500">Plano Atual</div>
            <div className="text-xl font-semibold">{currentPlan.name}</div>
            <div className="text-sm text-gray-600 mt-1">
              Cobrado {currentPlan.cycle.toLowerCase()}, próxima data de cobrança
            </div>
            <div className="mt-1 font-medium">{currentPlan.nextCharge}</div>
          </div>
          <div className="flex sm:items-end gap-3 sm:justify-end">
            <a
              href="#upgrade-annual"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Mudar para o plano anual
            </a>
            <a
              href="#ver-planos"
              className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Ver planos e recursos
            </a>
          </div>
        </div>
      </section>

      {/* Histórico de cobrança */}
      <section className="rounded-lg border bg-white/50 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Histórico de cobrança</h2>
          <a
            href="#billing-settings"
            className="text-sm text-indigo-600 hover:text-indigo-700"
          >
            Gerenciar configuração de cobrança
          </a>
        </div>
        <div className="divide-y">
          {history.map((h) => (
            <div key={h.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2">
              <div>
                <div className="font-medium">{h.title}</div>
                <div className="text-xs text-gray-600">{h.date}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="font-semibold">{h.amount}</div>
                <a
                  href={`/finance/billing/receipt/${h.id}`}
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  Obter fatura
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Zona de perigo */}
      <section className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-medium text-red-800 mb-2">Zona de perigo</h2>
        <p className="text-sm text-red-700">
          Cancelar inscrição — se você cancelar agora, poderá continuar acessando sua assinatura até que a atual expire.
        </p>
        <div className="mt-4">
          <button
            className="inline-flex items-center justify-center rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
          >
            Cancelar inscrição
          </button>
        </div>
      </section>
    </div>
  );
}