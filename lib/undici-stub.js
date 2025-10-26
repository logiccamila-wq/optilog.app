// Stub module to prevent Node-only 'undici' code from being bundled on the client.
// Exports minimal placeholders so any import from 'undici' or its subpaths resolves safely.

export const fetch = () => {
  throw new Error('undici fetch não disponível no navegador');
};

export const Agent = function Agent() {};
export const request = () => {
  throw new Error('undici request não disponível no navegador');
};

export default {};