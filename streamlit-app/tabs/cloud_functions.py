import streamlit as st

def render():
    st.header("Cloud Functions (TypeScript)")
    
    # Seletor de função
    function_options = ["forecast.ts", "reconcile.ts", "ocrInvoice.ts"]
    selected_function = st.selectbox("Selecione uma função para ver o código:", function_options)
    
    if selected_function == "forecast.ts":
        st.code('''
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import fetch from "node-fetch";
admin.initializeApp();

export const generateCashForecast = functions.https.onCall(async (data, ctx) => {
  const { companyId, horizonDays = 90 } = data;
  // 1) Query payables/receivables + accounts balances
  const db = admin.firestore();
  // Sample: aggregate historic inflows/outflows
  // 2) Call internal ML endpoint or Vertex AI
  // For POC: simple moving-average projection
  const projections = []; // build array of {date, projectedBalance}

  // TODO: replace with a real ML model call
  return { companyId, horizonDays, projections };
});
        ''', language="typescript")
    
    elif selected_function == "reconcile.ts":
        st.code('''
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

export const reconcileBankStatement = functions.https.onCall(async (data, ctx) => {
  const { companyId, accountId, statementId } = data;
  const db = admin.firestore();

  // 1. Load statement entries
  // 2. Try match against transactions by amount and date window
  // 3. Mark matched transactions / create reconciliation doc
  // 4. Return summary
  return { matched: 12, unmatched: 3 };
});
        ''', language="typescript")
    
    elif selected_function == "ocrInvoice.ts":
        st.code('''
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";

// Inicializar o app se ainda não estiver inicializado
try {
  admin.initializeApp();
} catch (e) {
  console.log('Admin SDK já inicializado');
}

/**
 * Função para processar OCR em faturas/notas fiscais
 * Extrai informações relevantes e cria lançamentos contábeis automatizados
 */
export const processInvoiceOCR = functions.storage.object().onFinalize(async (object) => {
  // Verificar se é um arquivo de fatura/nota fiscal
  const filePath = object.name;
  if (!filePath) return;
  
  // Verificar se é um PDF ou imagem
  if (!filePath.endsWith('.pdf') && !filePath.endsWith('.jpg') && !filePath.endsWith('.png')) {
    console.log('Arquivo não é PDF ou imagem, ignorando:', filePath);
    return;
  }

  // Extrair companyId do caminho (assumindo estrutura: invoices/{companyId}/...)
  const pathParts = filePath.split('/');
  if (pathParts.length < 3 || pathParts[0] !== 'invoices') {
    console.log('Caminho de arquivo inválido:', filePath);
    return;
  }
  
  const companyId = pathParts[1];
  const db = admin.firestore();
  
  try {
    // 1. Obter URL de download do arquivo
    const bucket = admin.storage().bucket(object.bucket);
    const [signedUrl] = await bucket.file(filePath).getSignedUrl({
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutos
    });
    
    // 2. Chamar a Vision API para OCR (simulado aqui)
    console.log(`Processando OCR para arquivo: ${filePath}`);
    
    // Simulação de resultado de OCR - em produção, usar Vision API
    const ocrResult = await simulateOCR(signedUrl);
    
    // 3. Extrair informações relevantes da fatura
    const invoiceData = extractInvoiceData(ocrResult);
    
    // 4. Criar documento de fatura no Firestore
    const invoiceId = uuidv4();
    await db.collection('invoices').doc(invoiceId).set({
      companyId,
      fileUrl: `gs://${object.bucket}/${filePath}`,
      pdfUrl: signedUrl,
      number: invoiceData.number,
      serie: invoiceData.serie,
      total: invoiceData.total,
      issuerCNPJ: invoiceData.issuerCNPJ,
      recipientCNPJ: invoiceData.recipientCNPJ,
      status: 'processed',
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
      items: invoiceData.items,
      rawOcrText: ocrResult.text
    });
    
    // 5. Criar lançamento contábil automatizado
    if (invoiceData.total > 0) {
      const payableId = uuidv4();
      await db.collection('payables').doc(payableId).set({
        companyId,
        supplierId: invoiceData.issuerCNPJ,
        dueDate: invoiceData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias se não especificado
        amount: invoiceData.total,
        currency: 'BRL',
        status: 'pending',
        invoiceRef: invoiceId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        description: `NF ${invoiceData.number} - ${invoiceData.issuerName || 'Fornecedor'}`
      });
      
      console.log(`Lançamento contábil criado: ${payableId} para fatura ${invoiceId}`);
    }
    
    return { success: true, invoiceId, data: invoiceData };
    
  } catch (error) {
    console.error('Erro ao processar OCR da fatura:', error);
    
    // Registrar erro no Firestore para auditoria
    await db.collection('auditLogs').add({
      companyId,
      action: 'invoice_ocr_error',
      filePath,
      error: error.message,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return { success: false, error: error.message };
  }
});

// Função auxiliar para simular OCR (substituir por chamada real à Vision API)
async function simulateOCR(fileUrl: string) {
  console.log(`Simulando OCR para: ${fileUrl}`);
  
  // Simulação de resultado
  return {
    text: `DANFE\nNF-e: 123456\nSérie: 1\nCNPJ Emissor: 12.345.678/0001-99\nCNPJ Destinatário: 98.765.432/0001-01\nValor Total: R$ 1.234,56\nData Emissão: 01/10/2023\nData Vencimento: 31/10/2023\nItem 1: Serviço de Transporte - R$ 1.000,00\nItem 2: Taxa de Carregamento - R$ 234,56`,
    confidence: 0.95
  };
}

// Função para extrair dados estruturados do texto OCR
function extractInvoiceData(ocrResult: { text: string, confidence: number }) {
  const text = ocrResult.text;
  
  // Extrair informações usando regex (simplificado)
  const numberMatch = text.match(/NF-e:\\s*(\\d+)/);
  const serieMatch = text.match(/Série:\\s*(\\d+)/);
  const totalMatch = text.match(/Valor Total:\\s*R\\$\\s*([\\d.,]+)/);
  const issuerCNPJMatch = text.match(/CNPJ Emissor:\\s*([\\d./-]+)/);
  const recipientCNPJMatch = text.match(/CNPJ Destinatário:\\s*([\\d./-]+)/);
  const dueDateMatch = text.match(/Data Vencimento:\\s*(\\d{2}\\/\\d{2}\\/\\d{4})/);
  
  // Extrair itens (simplificado)
  const itemsRegex = /Item \\d+:.*?R\\$\\s*([\\d.,]+)/g;
  const items = [];
  let itemMatch;
  
  while ((itemMatch = itemsRegex.exec(text)) !== null) {
    items.push({
      description: itemMatch[0].split('-')[0].trim(),
      value: parseFloat(itemMatch[1].replace('.', '').replace(',', '.'))
    });
  }
  
  // Converter data de vencimento
  let dueDate = null;
  if (dueDateMatch && dueDateMatch[1]) {
    const parts = dueDateMatch[1].split('/');
    dueDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  }
  
  // Formatar valor total
  let total = 0;
  if (totalMatch && totalMatch[1]) {
    total = parseFloat(totalMatch[1].replace('.', '').replace(',', '.'));
  }
  
  return {
    number: numberMatch ? numberMatch[1] : 'Desconhecido',
    serie: serieMatch ? serieMatch[1] : '1',
    total,
    issuerCNPJ: issuerCNPJMatch ? issuerCNPJMatch[1] : 'Desconhecido',
    recipientCNPJ: recipientCNPJMatch ? recipientCNPJMatch[1] : 'Desconhecido',
    dueDate,
    items
  };
}
        ''', language="typescript")
