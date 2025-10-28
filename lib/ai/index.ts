import OpenAI from 'openai';

export type AIProvider = 'openai';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIOptions {
  model?: string;
  temperature?: number;
}

function getProvider(): AIProvider {
  const p = (process.env.AI_PROVIDER || process.env.NEXT_PUBLIC_AI_PROVIDER || 'openai').toLowerCase();
  return 'openai';
}

export async function chat(messages: AIMessage[], options: AIOptions = {}) {
  const provider = getProvider();
  switch (provider) {
    case 'openai':
    default: {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY não definida');
      const model = options.model || process.env.OPENAI_MODEL || 'gpt-4o-mini';
      const res = await client.chat.completions.create({
        model,
        temperature: options.temperature ?? 0.3,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      });
      const text = res.choices?.[0]?.message?.content || '';
      return { provider: 'openai', model, text, raw: res };
    }
  }
}
