export async function GET() {
  return new Response(JSON.stringify({ health: 'ok' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}