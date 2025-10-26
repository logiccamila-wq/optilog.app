// js/main.js
const SUPABASE_REF = "gctoafawwupbzlqykdmr";
const FUNCTION_SLUG = "quick-endpoint";

// Se sua função requer auth (verify_jwt: true), ajuste includeAuth para true
// e assegure-se de obter o access token via Supabase Auth no cliente.
const includeAuth = false; // <- toggle para true se quiser enviar Authorization

document.getElementById("callFunction").addEventListener("click", async () => {
  const resultEl = document.getElementById("result");
  resultEl.textContent = "Carregando...";

  try {
    const url = `https://${SUPABASE_REF}.supabase.co/functions/v1/${FUNCTION_SLUG}`;
    const headers = {
      "Accept": "application/json",
    };

    if (includeAuth) {
      // Exemplo: obter token do Supabase client (supondo que supabase client esteja inicializado)
      // const token = (await supabase.auth.getSession()).data.session?.access_token;
      // if (token) headers['Authorization'] = `Bearer ${token}`;
      console.warn("includeAuth está true, mas você precisa inicializar e popular o token no cliente.");
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
      // credentials: 'include' // só se precisar enviar cookies (geralmente não)
    });

    const text = await response.text();
    let parsed;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch (e) {
      parsed = text;
    }

    if (!response.ok) {
      resultEl.textContent = `Erro HTTP ${response.status} ${response.statusText}\n\n${typeof parsed === 'string' ? parsed : JSON.stringify(parsed, null, 2)}`;
      console.error("Function error:", response.status, parsed);
      return;
    }

    resultEl.textContent = parsed ? JSON.stringify(parsed, null, 2) : "Resposta vazia";
  } catch (err) {
    resultEl.textContent = "Erro de requisição: " + (err.message || String(err));
    console.error(err);
  }
});
