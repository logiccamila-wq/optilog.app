import { neon } from '@neondatabase/serverless';

let cachedSql: ReturnType<typeof neon> | null = null;

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL não está definido. Configure em .env ou Vercel Environment Variables.');
  }
  if (!cachedSql) {
    cachedSql = neon(url);
  }
  return cachedSql;
}