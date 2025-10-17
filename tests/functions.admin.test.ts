import { describe, it, expect } from 'vitest';

// Import Cloud Functions ESM bundle
import * as fns from '../functions/index.js';

describe('Cloud Functions admin endpoints', () => {
  it('exports deleteAuthUser', () => {
    expect(typeof fns.deleteAuthUser).toBe('function');
  });
  it('exports updateAuthUser', () => {
    expect(typeof fns.updateAuthUser).toBe('function');
  });
  it('exports importUsersCsv', () => {
    expect(typeof fns.importUsersCsv).toBe('function');
  });
});

function makeRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: undefined,
    status(code) { this.statusCode = code; return this; },
    json(obj) { this.body = obj; return this; },
    send(txt) { this.body = txt; return this; },
    set(h, v) { this.headers[h] = v; return this; },
  };
  return res;
}

describe('deleteAuthUser HTTP surface', () => {
  it('rejects non-POST with 405', async () => {
    const req = { method: 'GET', headers: {} };
    const res = makeRes();
    await fns.deleteAuthUser(req, res);
    expect(res.statusCode).toBe(405);
    expect(res.body && res.body.error).toBe('Method not allowed');
  });
});