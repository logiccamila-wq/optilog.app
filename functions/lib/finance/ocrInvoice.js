"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.manualInvoiceOCR = exports.processInvoiceOCR = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const uuid_1 = require("uuid");
// Inicializar o app se ainda não estiver inicializado
try {
    admin.initializeApp();
}
catch (e) {
    console.log('Admin SDK já inicializado');
}
/**
 * Função para processar OCR em faturas/notas fiscais
 * Extrai informações relevantes e cria lançamentos contábeis automatizados
 */
exports.processInvoiceOCR = functions.storage.object().onFinalize(async (object) => {
    // Verificar se é um arquivo de fatura/nota fiscal
    const filePath = object.name;
    if (!filePath)
        return;
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
        const invoiceId = (0, uuid_1.v4)();
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
            const payableId = (0, uuid_1.v4)();
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
    }
    catch (error) {
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
/**
 * Função HTTP para processar OCR manualmente
 */
exports.manualInvoiceOCR = functions.https.onCall(async (data, context) => {
    // Verificar autenticação
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Usuário deve estar autenticado para usar esta função');
    }
    const { companyId, fileUrl } = data;
    if (!companyId || !fileUrl) {
        throw new functions.https.HttpsError('invalid-argument', 'Parâmetros companyId e fileUrl são obrigatórios');
    }
    try {
        // Simulação de OCR - em produção, usar Vision API
        const ocrResult = await simulateOCR(fileUrl);
        // Extrair dados da fatura
        const invoiceData = extractInvoiceData(ocrResult);
        return {
            success: true,
            data: invoiceData
        };
    }
    catch (error) {
        console.error('Erro ao processar OCR manual:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});
// Função auxiliar para simular OCR (substituir por chamada real à Vision API)
async function simulateOCR(fileUrl) {
    // Em produção, usar:
    // const vision = require('@google-cloud/vision');
    // const client = new vision.ImageAnnotatorClient();
    // const [result] = await client.textDetection(fileUrl);
    console.log(`Simulando OCR para: ${fileUrl}`);
    // Simulação de resultado
    return {
        text: `DANFE
NF-e: 123456
Série: 1
CNPJ Emissor: 12.345.678/0001-99
CNPJ Destinatário: 98.765.432/0001-01
Valor Total: R$ 1.234,56
Data Emissão: 01/10/2023
Data Vencimento: 31/10/2023
Item 1: Serviço de Transporte - R$ 1.000,00
Item 2: Taxa de Carregamento - R$ 234,56`,
        confidence: 0.95
    };
}
// Função para extrair dados estruturados do texto OCR
function extractInvoiceData(ocrResult) {
    const text = ocrResult.text;
    // Extrair informações usando regex (simplificado)
    const numberMatch = text.match(/NF-e:\s*(\d+)/);
    const serieMatch = text.match(/Série:\s*(\d+)/);
    const totalMatch = text.match(/Valor Total:\s*R\$\s*([\d.,]+)/);
    const issuerCNPJMatch = text.match(/CNPJ Emissor:\s*([\d./-]+)/);
    const recipientCNPJMatch = text.match(/CNPJ Destinatário:\s*([\d./-]+)/);
    const dueDateMatch = text.match(/Data Vencimento:\s*(\d{2}\/\d{2}\/\d{4})/);
    // Extrair itens (simplificado)
    const itemsRegex = /Item \d+:.*?R\$\s*([\d.,]+)/g;
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
