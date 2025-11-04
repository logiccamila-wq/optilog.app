import { neon } from '@neondatabase/serverless';

let cachedSql: any | null = null;

export function getSql(): any {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL não está definido. Configure a variável de ambiente DATABASE_URL.'
    );
  }
  if (!cachedSql) {
    // neon() pode retornar tipos complexos; para desbloquear a checagem, tratamos como `any`.
    cachedSql = neon(url) as any;
  }
  return cachedSql;
}

export function isDatabaseConfigured(): boolean {
  return !!process.env.DATABASE_URL;
}

// Default export for query execution
async function db(query: string, params?: any[]) {
  const sql = getSql();
  try {
    const result = await sql(query, params);
    return result as any[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export default db;
