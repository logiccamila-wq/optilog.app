import { neon, neonConfig } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL não está definido nas variáveis de ambiente.');
}

// Configure connection pooling and optimizations
neonConfig.fetchConnectionCache = true; // Enable connection caching
neonConfig.pipelineConnect = 'password'; // Optimize connection handshake

const db = neon(DATABASE_URL, {
  // Enable query result caching for better performance
  fullResults: false, // Return only rows, not metadata, for faster responses
  arrayMode: false,   // Use object mode for easier access
});

export default db;
