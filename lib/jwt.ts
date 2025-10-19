import { NextRequest } from 'next/server';

// Lazy import to avoid bundling unless used
let josePromise: Promise<typeof import('jose')> | null = null;
function getJose() {
  if (!josePromise) josePromise = import('jose');
  return josePromise;
}

export type VerifiedToken = {
  payload: Record<string, any>;
  token: string;
};

export async function extractBearer(req: NextRequest): Promise<string | null> {
  const header = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!header) return null;
  const m = /^(Bearer)\s+(.+)$/i.exec(header);
  return m ? m[2] : null;
}

export async function verifyToken(token: string): Promise<VerifiedToken | null> {
  const jwksUrl = process.env.NEON_AUTH_JWKS_URL;
  const issuer = process.env.NEON_AUTH_ISSUER;
  const audience = process.env.NEON_AUTH_AUDIENCE;
  if (!jwksUrl) return null;

  const jose = await getJose();
  const JWKS = jose.createRemoteJWKSet(new URL(jwksUrl));

  try {
    const { payload } = await jose.jwtVerify(token, JWKS, {
      issuer: issuer || undefined,
      audience: audience || undefined,
    });
    return { payload, token };
  } catch {
    return null;
  }
}