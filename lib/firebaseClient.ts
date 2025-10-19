// Firebase stub: retorna null e evita imports de firebase/* quando desativado
const disabled = process.env.NEXT_PUBLIC_DISABLE_FIREBASE === '1' || process.env.NEXT_PUBLIC_DISABLE_FIREBASE === 'true';

export const app: any = null;
export const auth: any = null;

export async function getDb(): Promise<null> {
  return null;
}

export async function getAuthInstance(): Promise<null> {
  return null;
}

export function isFirebaseConfigured(): boolean {
  return !disabled && false;
}
