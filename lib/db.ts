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
