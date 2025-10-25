import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL não está definido nas variáveis de ambiente.');
}

const db = neon(DATABASE_URL);

export default db;
