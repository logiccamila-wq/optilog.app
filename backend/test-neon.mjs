import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;

if (!url) {
  console.log('NO_DATABASE_URL');
  process.exit(0);
}

const sql = neon(url);

(async () => {
  try {
    const rows = await sql`select 1 as ok`;
    console.log('NEON_OK', rows[0]);
    process.exit(0);
  } catch (err) {
    console.error('NEON_ERR', err?.message || String(err));
    process.exit(1);
  }
})();
