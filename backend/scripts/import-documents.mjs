#!/usr/bin/env node
/**
 * Script de Importação de Documentos PDF
 * Suporta: CRLV, CNH, CT-e, ANTT
 */
import 'dotenv/config';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pdfParse from 'pdf-parse';
import jsQR from 'jsqr';
import sharp from 'sharp';
import { PNG } from 'pngjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/optilog';
const pool = new Pool({ connectionString: DATABASE_URL });

// Configurações
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '../uploads');
const BATCH_SIZE = 10; // Processar 10 PDFs por vez

/**
 * Extrai texto de PDF
 */
async function extractPdfText(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error(`Erro ao extrair texto do PDF ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Tenta ler QR Code de PDF (converte primeira página para imagem)
 */
async function extractQRCode(filePath) {
  try {
    // Nota: Para extrair QR code de PDF, precisamos converter para imagem primeiro
    // Esta é uma implementação simplificada - em produção, use pdf2pic ou similar
    console.log(`QR Code extraction from ${filePath} - feature not fully implemented`);
    return null;
  } catch (error) {
    console.error(`Erro ao extrair QR Code de ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Extrai dados de CRLV do texto
 */
function extractCRLVData(text, filePath) {
  const data = {
    renavam: null,
    placa: null,
    chassis: null,
    tipo: null,
    modelo: null,
    marca: null,
    ano_fabricacao: null,
    ano_modelo: null,
    categoria: null,
    eixos: null,
    capacidade_carga: null,
    proprietario_cpf_cnpj: null,
    proprietario_nome: null,
    crlv_pdf_path: filePath,
  };

  // Patterns para extração
  const patterns = {
    renavam: /RENAVAM[:\s]*(\d{11})/i,
    placa: /PLACA[:\s]*([A-Z]{3}[-\s]?\d[A-Z\d]\d{2})/i,
    chassis: /CHASSIS[:\s]*([A-Z0-9]{17})/i,
    marca: /MARCA[\/MODELO]*[:\s]*([A-Z\s]+)/i,
    modelo: /MODELO[:\s]*([^\n]+)/i,
    ano_fabricacao: /ANO\s+FABRICA[ÇC][ÃA]O[:\s]*(\d{4})/i,
    ano_modelo: /ANO\s+MODELO[:\s]*(\d{4})/i,
    categoria: /CATEGORIA[:\s]*([^\n]+)/i,
    capacidade: /CAPACIDADE[:\s]*(\d+[.,]?\d*)/i,
    proprietario: /PROPRIET[ÁA]RIO[:\s]*([^\n]+)/i,
    cpf_cnpj: /CPF\/CNPJ[:\s]*(\d{11,14})/i,
  };

  // Extrair usando patterns
  for (const [key, pattern] of Object.entries(patterns)) {
    const match = text.match(pattern);
    if (match) {
      if (key === 'capacidade') {
        data.capacidade_carga = parseFloat(match[1].replace(',', '.'));
      } else if (key === 'proprietario') {
        data.proprietario_nome = match[1].trim();
      } else if (key === 'cpf_cnpj') {
        data.proprietario_cpf_cnpj = match[1];
      } else {
        data[key] = match[1].trim();
      }
    }
  }

  return data;
}

/**
 * Extrai dados de CNH do texto
 */
function extractCNHData(text, filePath) {
  const data = {
    renach: null,
    cpf: null,
    nome: null,
    data_nascimento: null,
    categoria_cnh: null,
    validade_cnh: null,
    primeira_habilitacao: null,
    numero_registro: null,
    cnh_pdf_path: filePath,
  };

  const patterns = {
    renach: /RENACH[:\s]*(\d{11})/i,
    cpf: /CPF[:\s]*(\d{11})/i,
    nome: /NOME[:\s]*([A-Z\s]+)/i,
    data_nascimento: /DATA\s+NASCIMENTO[:\s]*(\d{2}\/\d{2}\/\d{4})/i,
    categoria: /CATEGORIA[:\s]*([A-E]{1,2})/i,
    validade: /VALIDADE[:\s]*(\d{2}\/\d{2}\/\d{4})/i,
    primeira_habilitacao: /PRIMEIRA\s+HABILITA[ÇC][ÃA]O[:\s]*(\d{2}\/\d{2}\/\d{4})/i,
    registro: /N[ÚU]MERO\s+REGISTRO[:\s]*(\d+)/i,
  };

  for (const [key, pattern] of Object.entries(patterns)) {
    const match = text.match(pattern);
    if (match) {
      if (key === 'categoria') {
        data.categoria_cnh = match[1];
      } else if (key === 'validade') {
        data.validade_cnh = convertBrazilianDate(match[1]);
      } else if (key === 'data_nascimento') {
        data.data_nascimento = convertBrazilianDate(match[1]);
      } else if (key === 'primeira_habilitacao') {
        data.primeira_habilitacao = convertBrazilianDate(match[1]);
      } else if (key === 'registro') {
        data.numero_registro = match[1];
      } else {
        data[key] = match[1].trim();
      }
    }
  }

  return data;
}

/**
 * Extrai dados de CT-e do texto
 */
function extractCTeData(text, filePath) {
  const data = {
    numero: null,
    chave_acesso: null,
    serie: null,
    data_emissao: null,
    remetente_cnpj: null,
    remetente_nome: null,
    destinatario_cnpj: null,
    destinatario_nome: null,
    valor_total: null,
    valor_frete: null,
    peso_total: null,
    natureza_carga: null,
    pdf_path: filePath,
  };

  const patterns = {
    chave: /CHAVE\s+ACESSO[:\s]*(\d{44})/i,
    numero: /N[ÚU]MERO[:\s]*(\d+)/i,
    serie: /S[ÉE]RIE[:\s]*(\d+)/i,
    data_emissao: /EMISS[ÃA]O[:\s]*(\d{2}\/\d{2}\/\d{4})/i,
    remetente_cnpj: /REMETENTE.*?CNPJ[:\s]*(\d{14})/is,
    remetente_nome: /REMETENTE.*?RAZ[ÃA]O\s+SOCIAL[:\s]*([^\n]+)/is,
    destinatario_cnpj: /DESTINAT[ÁA]RIO.*?CNPJ[:\s]*(\d{14})/is,
    destinatario_nome: /DESTINAT[ÁA]RIO.*?RAZ[ÃA]O\s+SOCIAL[:\s]*([^\n]+)/is,
    valor_total: /VALOR\s+TOTAL[:\s]*R?\$?\s*(\d+[.,]\d{2})/i,
    valor_frete: /VALOR\s+FRETE[:\s]*R?\$?\s*(\d+[.,]\d{2})/i,
    peso: /PESO\s+TOTAL[:\s]*(\d+[.,]?\d*)/i,
    natureza: /NATUREZA\s+CARGA[:\s]*([^\n]+)/i,
  };

  for (const [key, pattern] of Object.entries(patterns)) {
    const match = text.match(pattern);
    if (match) {
      if (key === 'chave') {
        data.chave_acesso = match[1];
      } else if (key === 'valor_total' || key === 'valor_frete') {
        const field = key === 'valor_total' ? 'valor_total' : 'valor_frete';
        data[field] = parseFloat(match[1].replace('.', '').replace(',', '.'));
      } else if (key === 'peso') {
        data.peso_total = parseFloat(match[1].replace(',', '.'));
      } else if (key === 'data_emissao') {
        data.data_emissao = convertBrazilianDate(match[1]);
      } else if (key === 'remetente_cnpj') {
        data.remetente_cnpj = match[1];
      } else if (key === 'remetente_nome') {
        data.remetente_nome = match[1].trim();
      } else if (key === 'destinatario_cnpj') {
        data.destinatario_cnpj = match[1];
      } else if (key === 'destinatario_nome') {
        data.destinatario_nome = match[1].trim();
      } else if (key === 'natureza') {
        data.natureza_carga = match[1].trim();
      } else {
        data[key] = match[1].trim();
      }
    }
  }

  return data;
}

/**
 * Converte data brasileira (DD/MM/YYYY) para formato PostgreSQL
 */
function convertBrazilianDate(dateStr) {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`;
}

/**
 * Valida dados antes de inserir
 */
function validateCRLVData(data) {
  if (!data.placa) {
    return { valid: false, error: 'Placa não encontrada' };
  }
  return { valid: true };
}

function validateCNHData(data) {
  if (!data.cpf || !data.nome) {
    return { valid: false, error: 'CPF ou nome não encontrado' };
  }
  if (data.cpf.length !== 11) {
    return { valid: false, error: 'CPF inválido' };
  }
  return { valid: true };
}

function validateCTeData(data) {
  if (!data.chave_acesso || !data.numero) {
    return { valid: false, error: 'Chave de acesso ou número não encontrado' };
  }
  if (data.chave_acesso.length !== 44) {
    return { valid: false, error: 'Chave de acesso inválida' };
  }
  return { valid: true };
}

/**
 * Insere CRLV no banco
 */
async function insertCRLV(data) {
  const query = `
    INSERT INTO veiculos (
      renavam, placa, chassis, tipo, modelo, marca, 
      ano_fabricacao, ano_modelo, categoria, eixos, 
      capacidade_carga, proprietario_cpf_cnpj, proprietario_nome, 
      crlv_pdf_path, is_test_data
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, false)
    ON CONFLICT (placa) 
    DO UPDATE SET 
      renavam = EXCLUDED.renavam,
      chassis = EXCLUDED.chassis,
      tipo = EXCLUDED.tipo,
      modelo = EXCLUDED.modelo,
      marca = EXCLUDED.marca,
      ano_fabricacao = EXCLUDED.ano_fabricacao,
      ano_modelo = EXCLUDED.ano_modelo,
      categoria = EXCLUDED.categoria,
      eixos = EXCLUDED.eixos,
      capacidade_carga = EXCLUDED.capacidade_carga,
      proprietario_cpf_cnpj = EXCLUDED.proprietario_cpf_cnpj,
      proprietario_nome = EXCLUDED.proprietario_nome,
      crlv_pdf_path = EXCLUDED.crlv_pdf_path,
      updated_at = NOW()
    RETURNING id
  `;

  const values = [
    data.renavam,
    data.placa,
    data.chassis,
    data.tipo,
    data.modelo,
    data.marca,
    data.ano_fabricacao,
    data.ano_modelo,
    data.categoria,
    data.eixos,
    data.capacidade_carga,
    data.proprietario_cpf_cnpj,
    data.proprietario_nome,
    data.crlv_pdf_path,
  ];

  const result = await pool.query(query, values);
  return result.rows[0]?.id;
}

/**
 * Insere CNH no banco
 */
async function insertCNH(data) {
  const query = `
    INSERT INTO motoristas (
      renach, cpf, nome, data_nascimento, categoria_cnh, 
      validade_cnh, primeira_habilitacao, numero_registro, 
      cnh_pdf_path, is_test_data
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, false)
    ON CONFLICT (cpf) 
    DO UPDATE SET 
      renach = EXCLUDED.renach,
      nome = EXCLUDED.nome,
      data_nascimento = EXCLUDED.data_nascimento,
      categoria_cnh = EXCLUDED.categoria_cnh,
      validade_cnh = EXCLUDED.validade_cnh,
      primeira_habilitacao = EXCLUDED.primeira_habilitacao,
      numero_registro = EXCLUDED.numero_registro,
      cnh_pdf_path = EXCLUDED.cnh_pdf_path,
      updated_at = NOW()
    RETURNING id
  `;

  const values = [
    data.renach,
    data.cpf,
    data.nome,
    data.data_nascimento,
    data.categoria_cnh,
    data.validade_cnh,
    data.primeira_habilitacao,
    data.numero_registro,
    data.cnh_pdf_path,
  ];

  const result = await pool.query(query, values);
  return result.rows[0]?.id;
}

/**
 * Insere CT-e no banco
 */
async function insertCTe(data) {
  const query = `
    INSERT INTO cte (
      numero, chave_acesso, serie, data_emissao,
      remetente_cnpj, remetente_nome,
      destinatario_cnpj, destinatario_nome,
      valor_total, valor_frete, peso_total,
      natureza_carga, pdf_path, is_test_data
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, false)
    ON CONFLICT (chave_acesso) 
    DO UPDATE SET 
      numero = EXCLUDED.numero,
      serie = EXCLUDED.serie,
      data_emissao = EXCLUDED.data_emissao,
      remetente_cnpj = EXCLUDED.remetente_cnpj,
      remetente_nome = EXCLUDED.remetente_nome,
      destinatario_cnpj = EXCLUDED.destinatario_cnpj,
      destinatario_nome = EXCLUDED.destinatario_nome,
      valor_total = EXCLUDED.valor_total,
      valor_frete = EXCLUDED.valor_frete,
      peso_total = EXCLUDED.peso_total,
      natureza_carga = EXCLUDED.natureza_carga,
      pdf_path = EXCLUDED.pdf_path,
      updated_at = NOW()
    RETURNING id
  `;

  const values = [
    data.numero,
    data.chave_acesso,
    data.serie,
    data.data_emissao,
    data.remetente_cnpj,
    data.remetente_nome,
    data.destinatario_cnpj,
    data.destinatario_nome,
    data.valor_total,
    data.valor_frete,
    data.peso_total,
    data.natureza_carga,
    data.pdf_path,
  ];

  const result = await pool.query(query, values);
  return result.rows[0]?.id;
}

/**
 * Registra log de importação
 */
async function logImport(type, fileName, filePath, status, imported, failed, errors, executionTime) {
  const query = `
    INSERT INTO import_logs (
      import_type, file_name, file_path, status, 
      records_imported, records_failed, error_messages, execution_time_ms
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `;

  await pool.query(query, [
    type,
    fileName,
    filePath,
    status,
    imported,
    failed,
    errors ? JSON.stringify(errors) : null,
    executionTime,
  ]);
}

/**
 * Detecta tipo de documento pelo conteúdo
 */
function detectDocumentType(text, fileName) {
  const lowerText = text.toLowerCase();
  const lowerName = fileName.toLowerCase();

  if (lowerText.includes('crlv') || lowerText.includes('certificado de registro') || lowerName.includes('crlv')) {
    return 'crlv';
  }
  if (lowerText.includes('cnh') || lowerText.includes('carteira nacional de habilita') || lowerName.includes('cnh')) {
    return 'cnh';
  }
  if (lowerText.includes('ct-e') || lowerText.includes('conhecimento de transporte') || lowerName.includes('cte')) {
    return 'cte';
  }
  if (lowerText.includes('antt') || lowerText.includes('rntrc') || lowerName.includes('antt')) {
    return 'antt';
  }

  return 'unknown';
}

/**
 * Processa um único PDF
 */
async function processPDF(filePath) {
  const startTime = Date.now();
  const fileName = path.basename(filePath);

  console.log(`\n📄 Processando: ${fileName}`);

  try {
    // Extrai texto
    const text = await extractPdfText(filePath);
    if (!text) {
      throw new Error('Não foi possível extrair texto do PDF');
    }

    // Detecta tipo
    const docType = detectDocumentType(text, fileName);
    console.log(`   Tipo detectado: ${docType.toUpperCase()}`);

    let data, validation, insertResult;

    switch (docType) {
      case 'crlv':
        data = extractCRLVData(text, filePath);
        validation = validateCRLVData(data);
        if (!validation.valid) {
          throw new Error(validation.error);
        }
        insertResult = await insertCRLV(data);
        console.log(`   ✅ CRLV importado - ID: ${insertResult}, Placa: ${data.placa}`);
        break;

      case 'cnh':
        data = extractCNHData(text, filePath);
        validation = validateCNHData(data);
        if (!validation.valid) {
          throw new Error(validation.error);
        }
        insertResult = await insertCNH(data);
        console.log(`   ✅ CNH importada - ID: ${insertResult}, CPF: ${data.cpf}`);
        break;

      case 'cte':
        data = extractCTeData(text, filePath);
        validation = validateCTeData(data);
        if (!validation.valid) {
          throw new Error(validation.error);
        }
        insertResult = await insertCTe(data);
        console.log(`   ✅ CT-e importado - ID: ${insertResult}, Número: ${data.numero}`);
        break;

      default:
        throw new Error('Tipo de documento não reconhecido');
    }

    const executionTime = Date.now() - startTime;
    await logImport(docType, fileName, filePath, 'success', 1, 0, null, executionTime);

    return { success: true, type: docType };
  } catch (error) {
    const executionTime = Date.now() - startTime;
    console.error(`   ❌ Erro: ${error.message}`);

    await logImport('unknown', fileName, filePath, 'error', 0, 1, [error.message], executionTime);

    return { success: false, error: error.message };
  }
}

/**
 * Processa múltiplos PDFs em batch
 */
async function processBatch(files) {
  const results = {
    total: files.length,
    success: 0,
    failed: 0,
    errors: [],
  };

  for (const file of files) {
    const result = await processPDF(file);
    if (result.success) {
      results.success++;
    } else {
      results.failed++;
      results.errors.push({ file: path.basename(file), error: result.error });
    }
  }

  return results;
}

/**
 * Main
 */
async function main() {
  const args = process.argv.slice(2);

  console.log('🚀 Iniciando importação de documentos...\n');
  console.log(`📂 Diretório de uploads: ${UPLOAD_DIR}`);

  try {
    // Verifica diretório
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      console.log('⚠️  Diretório de uploads criado');
    }

    // Lista PDFs
    let pdfFiles = fs
      .readdirSync(UPLOAD_DIR)
      .filter((f) => f.toLowerCase().endsWith('.pdf'))
      .map((f) => path.join(UPLOAD_DIR, f));

    // Se arquivos específicos foram passados como argumento
    if (args.length > 0) {
      pdfFiles = args.filter((f) => fs.existsSync(f) && f.toLowerCase().endsWith('.pdf'));
    }

    if (pdfFiles.length === 0) {
      console.log('⚠️  Nenhum arquivo PDF encontrado para processar');
      console.log(`   Coloque os PDFs em: ${UPLOAD_DIR}`);
      await pool.end();
      process.exit(0);
    }

    console.log(`📊 ${pdfFiles.length} arquivo(s) PDF encontrado(s)\n`);

    // Processa em batch
    const results = await processBatch(pdfFiles);

    // Relatório final
    console.log('\n' + '='.repeat(60));
    console.log('📊 RELATÓRIO DE IMPORTAÇÃO');
    console.log('='.repeat(60));
    console.log(`Total de arquivos: ${results.total}`);
    console.log(`✅ Sucesso: ${results.success}`);
    console.log(`❌ Falhas: ${results.failed}`);

    if (results.errors.length > 0) {
      console.log('\n❌ Erros:');
      results.errors.forEach(({ file, error }) => {
        console.log(`   - ${file}: ${error}`);
      });
    }

    console.log('='.repeat(60) + '\n');

    await pool.end();
    process.exit(results.failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('❌ Erro fatal:', error.message);
    await pool.end();
    process.exit(1);
  }
}

// Executa se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { processPDF, processBatch, extractPdfText };
