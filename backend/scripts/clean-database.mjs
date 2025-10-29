#!/usr/bin/env node
/**
 * Script de Limpeza de Banco de Dados
 * Remove dados hipotéticos/teste mantendo estrutura e dados reais
 */
import 'dotenv/config';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/optilog';
const pool = new Pool({ connectionString: DATABASE_URL });

const BACKUP_DIR = process.env.BACKUP_DIR || path.join(__dirname, '../backups');

/**
 * Cria backup antes de limpar
 */
async function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(BACKUP_DIR, `backup-${timestamp}.sql`);

  console.log('📦 Criando backup do banco de dados...');

  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  // Lista de tabelas para backup
  const tables = [
    'veiculos',
    'motoristas',
    'cte',
    'antt_documents',
    'vehicles',
    'shipments',
    'maintenances',
    'tires',
    'customers',
    'products',
    'orders',
    'invoices',
    'receivables',
    'payables',
    'alerts',
    'checklist',
    'estoque',
  ];

  let backupContent = `-- Backup gerado em ${new Date().toISOString()}\n`;
  backupContent += `-- Database: ${DATABASE_URL.split('@')[1]}\n\n`;

  for (const table of tables) {
    try {
      // Verifica se tabela existe
      const tableCheck = await pool.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        )`,
        [table]
      );

      if (!tableCheck.rows[0].exists) {
        continue;
      }

      const result = await pool.query(`SELECT * FROM ${table}`);

      if (result.rows.length > 0) {
        backupContent += `\n-- Tabela: ${table}\n`;
        backupContent += `-- Registros: ${result.rows.length}\n`;
        backupContent += `DELETE FROM ${table};\n`;

        // Extrai nomes das colunas
        const columns = Object.keys(result.rows[0]);
        const columnStr = columns.join(', ');

        for (const row of result.rows) {
          const values = columns.map((col) => {
            const val = row[col];
            if (val === null) return 'NULL';
            if (typeof val === 'number') return val;
            if (typeof val === 'boolean') return val;
            if (val instanceof Date) return `'${val.toISOString()}'`;
            return `'${String(val).replace(/'/g, "''")}'`;
          });

          backupContent += `INSERT INTO ${table} (${columnStr}) VALUES (${values.join(', ')});\n`;
        }
      }
    } catch (error) {
      console.warn(`   ⚠️  Aviso: não foi possível fazer backup da tabela ${table}: ${error.message}`);
    }
  }

  fs.writeFileSync(backupFile, backupContent, 'utf8');
  console.log(`   ✅ Backup salvo em: ${backupFile}\n`);

  return backupFile;
}

/**
 * Identifica e conta dados de teste
 */
async function analyzeTestData() {
  console.log('🔍 Analisando dados de teste...\n');

  const analysis = {
    tables: [],
    totalTestRecords: 0,
    totalRealRecords: 0,
  };

  // Tabelas com flag is_test_data
  const tablesWithFlag = ['veiculos', 'motoristas', 'cte', 'antt_documents'];

  for (const table of tablesWithFlag) {
    try {
      const tableCheck = await pool.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        )`,
        [table]
      );

      if (!tableCheck.rows[0].exists) {
        continue;
      }

      const testCount = await pool.query(`SELECT COUNT(*) as count FROM ${table} WHERE is_test_data = true`);

      const realCount = await pool.query(`SELECT COUNT(*) as count FROM ${table} WHERE is_test_data = false`);

      const testNum = parseInt(testCount.rows[0].count);
      const realNum = parseInt(realCount.rows[0].count);

      analysis.tables.push({
        table,
        testRecords: testNum,
        realRecords: realNum,
      });

      analysis.totalTestRecords += testNum;
      analysis.totalRealRecords += realNum;

      console.log(`   📊 ${table.padEnd(20)} - Teste: ${testNum}, Real: ${realNum}`);
    } catch (error) {
      console.warn(`   ⚠️  Aviso: erro ao analisar ${table}: ${error.message}`);
    }
  }

  // Tabelas legadas sem flag (considerar dados antigos como teste)
  const legacyTables = [
    { name: 'vehicles', dateCol: null },
    { name: 'shipments', dateCol: 'created_at' },
    { name: 'maintenances', dateCol: 'schedule_at' },
    { name: 'customers', dateCol: 'created_at' },
    { name: 'products', dateCol: 'created_at' },
    { name: 'orders', dateCol: 'created_at' },
  ];

  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - 6); // Dados com mais de 6 meses

  for (const { name, dateCol } of legacyTables) {
    try {
      const tableCheck = await pool.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        )`,
        [name]
      );

      if (!tableCheck.rows[0].exists) {
        continue;
      }

      let query;
      if (dateCol) {
        query = `SELECT 
          COUNT(*) FILTER (WHERE ${dateCol} < $1) as old_count,
          COUNT(*) FILTER (WHERE ${dateCol} >= $1) as recent_count
          FROM ${name}`;
      } else {
        query = `SELECT COUNT(*) as old_count, 0 as recent_count FROM ${name}`;
      }

      const result = await pool.query(query, dateCol ? [cutoffDate] : []);

      const oldNum = parseInt(result.rows[0].old_count);
      const recentNum = parseInt(result.rows[0].recent_count || 0);

      analysis.tables.push({
        table: name,
        testRecords: oldNum,
        realRecords: recentNum,
      });

      analysis.totalTestRecords += oldNum;
      analysis.totalRealRecords += recentNum;

      console.log(`   📊 ${name.padEnd(20)} - Antigos: ${oldNum}, Recentes: ${recentNum}`);
    } catch (error) {
      console.warn(`   ⚠️  Aviso: erro ao analisar ${name}: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`   Total dados de teste/antigos: ${analysis.totalTestRecords}`);
  console.log(`   Total dados reais/recentes: ${analysis.totalRealRecords}`);
  console.log('='.repeat(60) + '\n');

  return analysis;
}

/**
 * Remove dados de teste
 */
async function cleanTestData(dryRun = false) {
  console.log(dryRun ? '🔍 MODO DRY-RUN (simulação)' : '🧹 Limpando dados de teste...');
  console.log();

  const results = {
    deleted: 0,
    errors: [],
  };

  // Tabelas com flag is_test_data
  const tablesWithFlag = ['veiculos', 'motoristas', 'cte', 'antt_documents'];

  for (const table of tablesWithFlag) {
    try {
      const tableCheck = await pool.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        )`,
        [table]
      );

      if (!tableCheck.rows[0].exists) {
        continue;
      }

      if (dryRun) {
        const count = await pool.query(`SELECT COUNT(*) as count FROM ${table} WHERE is_test_data = true`);

        console.log(`   🗑️  ${table}: ${count.rows[0].count} registro(s) seriam deletados`);
        results.deleted += parseInt(count.rows[0].count);
      } else {
        const result = await pool.query(`DELETE FROM ${table} WHERE is_test_data = true RETURNING id`);

        console.log(`   ✅ ${table}: ${result.rowCount} registro(s) deletado(s)`);
        results.deleted += result.rowCount;
      }
    } catch (error) {
      console.error(`   ❌ Erro ao limpar ${table}: ${error.message}`);
      results.errors.push({ table, error: error.message });
    }
  }

  // Limpar dados antigos de tabelas legadas
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - 6);

  const legacyCleanup = [
    { table: 'shipments', dateCol: 'created_at' },
    { table: 'maintenances', dateCol: 'schedule_at' },
    { table: 'customers', dateCol: 'created_at' },
    { table: 'products', dateCol: 'created_at' },
    { table: 'orders', dateCol: 'created_at' },
    { table: 'invoices', dateCol: 'issued_at' },
    { table: 'receivables', dateCol: 'due_at' },
    { table: 'payables', dateCol: 'due_at' },
    { table: 'alerts', dateCol: 'created_at' },
  ];

  for (const { table, dateCol } of legacyCleanup) {
    try {
      const tableCheck = await pool.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        )`,
        [table]
      );

      if (!tableCheck.rows[0].exists) {
        continue;
      }

      if (dryRun) {
        const count = await pool.query(`SELECT COUNT(*) as count FROM ${table} WHERE ${dateCol} < $1`, [cutoffDate]);

        console.log(`   🗑️  ${table}: ${count.rows[0].count} registro(s) antigo(s) seriam deletados`);
        results.deleted += parseInt(count.rows[0].count);
      } else {
        const result = await pool.query(`DELETE FROM ${table} WHERE ${dateCol} < $1 RETURNING id`, [cutoffDate]);

        console.log(`   ✅ ${table}: ${result.rowCount} registro(s) antigo(s) deletado(s)`);
        results.deleted += result.rowCount;
      }
    } catch (error) {
      console.error(`   ❌ Erro ao limpar ${table}: ${error.message}`);
      results.errors.push({ table, error: error.message });
    }
  }

  return results;
}

/**
 * Restaura backup
 */
async function restoreBackup(backupFile) {
  if (!fs.existsSync(backupFile)) {
    throw new Error(`Arquivo de backup não encontrado: ${backupFile}`);
  }

  console.log(`📦 Restaurando backup: ${backupFile}...`);

  const sql = fs.readFileSync(backupFile, 'utf8');

  // Executa o SQL em uma transação
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Divide por statement e executa
    const statements = sql
      .split(';\n')
      .filter((s) => s.trim() && !s.trim().startsWith('--'))
      .map((s) => s.trim() + ';');

    for (const statement of statements) {
      await client.query(statement);
    }

    await client.query('COMMIT');
    console.log('   ✅ Backup restaurado com sucesso\n');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Main
 */
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run') || args.includes('-d');
  const skipBackup = args.includes('--skip-backup');
  const restoreMode = args.includes('--restore');

  console.log('🧹 LIMPEZA DE BANCO DE DADOS\n');
  console.log('='.repeat(60));

  try {
    // Modo restore
    if (restoreMode) {
      const backupFile = args[args.indexOf('--restore') + 1];
      if (!backupFile) {
        console.error('❌ Erro: Especifique o arquivo de backup para restaurar');
        console.log('   Uso: npm run db:clean -- --restore <arquivo-backup>');
        process.exit(1);
      }

      await restoreBackup(backupFile);
      await pool.end();
      process.exit(0);
    }

    // Análise
    const analysis = await analyzeTestData();

    if (analysis.totalTestRecords === 0) {
      console.log('✅ Nenhum dado de teste encontrado. Banco já está limpo!\n');
      await pool.end();
      process.exit(0);
    }

    // Confirma ação (apenas se não for dry-run)
    if (!dryRun && !skipBackup) {
      console.log('⚠️  ATENÇÃO: Esta operação irá deletar dados do banco!');
      console.log(`   ${analysis.totalTestRecords} registro(s) será(ão) removido(s)`);
      console.log('\n   Para simular a limpeza, use: npm run db:clean -- --dry-run');
      console.log('   Para pular o backup, use: npm run db:clean -- --skip-backup\n');

      // Backup automático
      await createBackup();
    } else if (dryRun) {
      console.log('ℹ️  Modo simulação - nenhum dado será deletado\n');
    }

    // Limpa dados
    const results = await cleanTestData(dryRun);

    // Relatório final
    console.log('\n' + '='.repeat(60));
    console.log('📊 RELATÓRIO DE LIMPEZA');
    console.log('='.repeat(60));
    console.log(`Total de registros ${dryRun ? 'a deletar' : 'deletados'}: ${results.deleted}`);

    if (results.errors.length > 0) {
      console.log('\n❌ Erros encontrados:');
      results.errors.forEach(({ table, error }) => {
        console.log(`   - ${table}: ${error}`);
      });
    }

    console.log('='.repeat(60) + '\n');

    if (dryRun) {
      console.log('ℹ️  Para executar a limpeza real, remova o parâmetro --dry-run');
    } else {
      console.log('✅ Limpeza concluída com sucesso!');
      if (!skipBackup) {
        console.log(`📦 Backup disponível em: ${BACKUP_DIR}`);
      }
    }

    await pool.end();
    process.exit(results.errors.length > 0 ? 1 : 0);
  } catch (error) {
    console.error('\n❌ Erro fatal:', error.message);
    console.error(error.stack);
    await pool.end();
    process.exit(1);
  }
}

// Executa se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { createBackup, analyzeTestData, cleanTestData, restoreBackup };
