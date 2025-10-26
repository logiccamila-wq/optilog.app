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
exports.signContract = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
try {
    admin.initializeApp();
}
catch (e) { }
exports.signContract = functions.https.onCall(async (data, context) => {
    const { companyId, contractText, contractor, contracted, signer } = data || {};
    if (!companyId || !contractText || !contractor?.cnpj || !contracted?.cnpj || !signer?.name) {
        throw new functions.https.HttpsError('invalid-argument', 'Parâmetros obrigatórios ausentes.');
    }
    const db = admin.firestore();
    const docRef = await db.collection('contracts').add({
        companyId,
        contractText,
        contractor, // { name, cnpj }
        contracted, // { name, cnpj }
        signer, // { name, doc, email }
        signedAt: admin.firestore.FieldValue.serverTimestamp(),
        userId: context.auth?.uid || null,
        userAgent: (context.rawRequest?.headers?.['user-agent']) || null,
        ip: (context.rawRequest?.headers?.['x-forwarded-for']) || null,
        status: 'signed'
    });
    return { success: true, id: docRef.id };
});
