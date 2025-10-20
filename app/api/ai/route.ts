import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const prompt: string = body?.prompt ?? 'Olá!';
    const model: string = body?.model ?? 'gpt-4o-mini';

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || body?.stub === true) {
      const mocked = {
        id: 'mock-response',
        mock: true,
        model,
        input: prompt,
        output: [
          {
            type: 'message',
            role: 'assistant',
            content: [{ type: 'text', text: `Simulado (sem OPENAI_API_KEY): ${prompt}` }],
          },
        ],
        created: Math.floor(Date.now() / 1000),
      };
      return new Response(JSON.stringify(mocked), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'x-mock': 'true' },
      });
    }

    const client = new OpenAI({ apiKey });

    const response = await client.responses.create({
      model,
      input: prompt,
    });

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    console.error('Erro na rota /api/ai:', e);
    return new Response(JSON.stringify({ error: e?.message || String(e) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
