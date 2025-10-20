export async function GET() {
  return new Response(JSON.stringify({ status: 'stubbed' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
