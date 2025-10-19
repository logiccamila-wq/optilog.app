const OpenAI = require('openai');

const apiKey = process.env.OPENAI_API_KEY;
let client;
if (apiKey) {
  client = new OpenAI({ apiKey });
}

async function gerarCodigo(prompt) {
  if (!client) throw new Error('OPENAI_API_KEY não definida');
  const response = await client.responses.create({
    model: 'gpt-4o-mini',
    input: [
      {
        role: 'system',
        content: 'Você gera código conciso e funcional. Responda apenas com código.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.2,
  });
  const text = response.output_text || response.content?.[0]?.text || JSON.stringify(response);
  return text;
}

module.exports = { gerarCodigo };
