import { jwtVerify, createRemoteJWKSet } from 'jose';

const jwksUrl = process.env.NEON_AUTH_JWKS_URL;
const issuer = process.env.NEON_AUTH_ISSUER;
const audience = process.env.NEON_AUTH_AUDIENCE;

if (!jwksUrl || !issuer || !audience) {
  throw new Error(
    'Variáveis NEON_AUTH_JWKS_URL, NEON_AUTH_ISSUER e NEON_AUTH_AUDIENCE são obrigatórias.'
  );
}

const JWKS = createRemoteJWKSet(new URL(jwksUrl));

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, JWKS, {
    issuer,
    audience,
  });
  return payload;
}
