import Link from "next/link";

export default function ReceiptPage({ params }: { params: { id: string } }) {
  // Demo: dados estáticos só para apresentação
  const payment = {
    status: "Pagamento concluído",
    title: "Você pagou $ 7,00",
    method: "Visa",
    total: "$ 7,00",
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold">Recibo</h1>
        <p className="text-sm text-gray-600">Transação #{params.id}</p>
      </header>

      <div className="rounded-lg border bg-white/60 p-6 shadow-sm space-y-4">
        <div>
          <div className="text-lg font-semibold">{payment.title}</div>
          <div className="text-sm text-green-700">{payment.status}</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500">Método de pagamento</div>
            <div className="font-medium">{payment.method}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Total</div>
            <div className="font-medium">{payment.total}</div>
          </div>
        </div>
        <div className="pt-2">
          <Link href="/finance/billing" className="text-sm text-indigo-600 hover:text-indigo-700">
            Voltar para faturamento
          </Link>
        </div>
      </div>
    </div>
  );
}