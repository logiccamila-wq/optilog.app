import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

(async () => {
  try {
    // Inserir OSs de teste
    const result = await sql`
      INSERT INTO service_orders (vehicle_id, type, priority, description, scheduled_date) VALUES
      (1, 'preventiva', 'media', 'Revisão preventiva dos 30.000 km - troca de óleo, filtros e verificação geral', '2024-10-30'),
      (2, 'corretiva', 'alta', 'Reparo do sistema de freios - ruído anormal detectado', '2024-10-29'),
      (3, 'preventiva', 'baixa', 'Inspeção mensal - verificação de pneus, luzes e fluidos', '2024-11-02'),
      (1, 'corretiva', 'urgente', 'Vazamento de óleo no motor - parar imediatamente para reparo', '2024-10-28'),
      (4, 'preditiva', 'media', 'Análise de vibração no motor baseada em dados dos sensores', '2024-11-01')
      ON CONFLICT (number) DO NOTHING
      RETURNING id, number, status
    `;
    
    console.log('OSs criadas:', result);
    
    // Buscar todas as OSs
    const all = await sql`SELECT * FROM service_orders ORDER BY created_at DESC LIMIT 10`;
    console.log('\nTotal OSs no banco:', all.length);
    
    all.forEach(os => {
      console.log(`- ${os.number} [${os.status}]: ${os.description.substring(0, 50)}...`);
    });
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    process.exit(0);
  }
})();