export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export async function apiFetch(path: string, options: RequestInit = {}) {
  const url = `${BACKEND_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    let error = 'Erro na requisição';
    try {
      const data = await res.json();
      error = data.error || JSON.stringify(data);
    } catch {}
    throw new Error(error);
  }
  try {
    return await res.json();
  } catch {
    return undefined;
  }
}
