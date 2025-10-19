import functions from 'firebase-functions';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import csvParser from 'csv-parser';

let adminApp;
function ensureAdmin() {
  if (!adminApp) adminApp = initializeApp();
  return adminApp;
}

async function isAuthorized(req) {
  try {
    const app = ensureAdmin();
    const auth = getAuth(app);
    const hdr = req.headers.authorization || '';
    const m = hdr.match(/^Bearer\s+(.+)$/i);
    if (!m) return false;
    const idToken = m[1];
    const decoded = await auth.verifyIdToken(idToken);
    const allowedEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const isAdminClaim = !!decoded.admin || (!!decoded.role && decoded.role === 'admin');
    const isAllowedEmail = !!decoded.email && allowedEmails.includes(decoded.email);
    return isAdminClaim || isAllowedEmail;
  } catch (e) {
    return false;
  }
}

function isAdminContext(context) {
  try {
    if (!context?.auth) return false;
    const allowedEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const t = context.auth.token || {};
    const isAdminClaim = !!t.admin || !!t.isAdmin || t.role === 'admin';
    const isAllowedEmail = !!t.email && allowedEmails.includes(t.email);
    return isAdminClaim || isAllowedEmail;
  } catch {
    return false;
  }
}

function setCors(req, res, methods = 'GET, POST, OPTIONS') {
  const allowed = (process.env.ALLOWED_ORIGINS || '*')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const origin = req.headers.origin;
  const allowOrigin = allowed.includes('*')
    ? '*'
    : origin && allowed.includes(origin)
      ? origin
      : allowed[0] || '*';
  res.set('Access-Control-Allow-Origin', allowOrigin);
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.set('Access-Control-Allow-Methods', methods);
}

// HTTP proxy para Google AI Gemini API
// Configure o segredo via: firebase functions:secrets:set GEMINI_API_KEY
export const geminiProxy = functions.region('us-central1').https.onRequest(async (req, res) => {
  setCors(req, res, 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).send('');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { prompt, model = 'gemini-1.5-flash-latest' } = req.body || {};
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Missing GEMINI_API_KEY' });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`;
    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: String(prompt) }],
        },
      ],
    };

    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    return res.status(r.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: String(err && err.message ? err.message : err) });
  }
});

// HTTP proxy para GitHub API (resumo de repo: issues e PRs)
// Configure o segredo via: firebase functions:secrets:set GITHUB_TOKEN
export const githubProxy = functions.region('us-central1').https.onRequest(async (req, res) => {
  setCors(req, res, 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).send('');
  if (req.method !== 'GET' && req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });

  try {
    const payload = req.method === 'POST' ? req.body || {} : req.query || {};
    const repo = payload.repo || process.env.GITHUB_REPO; // formato: owner/name
    if (!repo) return res.status(400).json({ error: 'Missing repo (owner/name)' });

    const token = process.env.GITHUB_TOKEN || '';
    const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'optilog-dashboard' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const [repoRes, prsRes, issuesRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${repo}`, { headers }),
      fetch(`https://api.github.com/repos/${repo}/pulls?state=open&per_page=1`, { headers }),
      fetch(
        `https://api.github.com/search/issues?q=repo:${repo}+type:issue+state:open&per_page=1`,
        { headers }
      ),
    ]);
    const repoJson = await repoRes.json();
    const prsLink = prsRes.headers.get('link');
    const issuesJson = await issuesRes.json();
    let openPrs = 0;
    if (prsLink) {
      const m = prsLink.match(/&page=(\d+)>; rel="last"/);
      openPrs = m ? Number(m[1]) : 0;
    }
    const summary = {
      full_name: repoJson.full_name,
      stargazers_count: repoJson.stargazers_count,
      forks_count: repoJson.forks_count,
      watchers_count: repoJson.subscribers_count,
      open_issues_count: issuesJson?.total_count ?? repoJson.open_issues_count,
      open_prs_count: openPrs,
    };
    return res.status(200).json(summary);
  } catch (err) {
    return res.status(500).json({ error: String(err && err.message ? err.message : err) });
  }
});

// Admin: deleteAuthUser
export const deleteAuthUser = functions.region('us-central1').https.onRequest(async (req, res) => {
  setCors(req, res, 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).send('');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!(await isAuthorized(req))) return res.status(401).json({ error: 'unauthorized' });
  try {
    const app = ensureAdmin();
    const auth = getAuth(app);
    const db = getFirestore(app);
    const { uid, email, deleteFirestore = true } = req.body || {};
    let userId = uid;
    if (!userId && email) {
      const u = await auth.getUserByEmail(String(email));
      userId = u.uid;
    }
    if (!userId) return res.status(400).json({ error: 'Missing uid or email' });
    await auth.deleteUser(String(userId));
    if (deleteFirestore) {
      try {
        await db.collection('users').doc(String(userId)).delete();
      } catch {}
    }
    return res.status(200).json({ ok: true, uid: String(userId) });
  } catch (err) {
    return res.status(500).json({ error: String(err && err.message ? err.message : err) });
  }
});

// Admin: updateAuthUser
export const updateAuthUser = functions.region('us-central1').https.onRequest(async (req, res) => {
  setCors(req, res, 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).send('');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!(await isAuthorized(req))) return res.status(401).json({ error: 'unauthorized' });
  try {
    const app = ensureAdmin();
    const auth = getAuth(app);
    const db = getFirestore(app);
    const {
      uid,
      email,
      displayName,
      password,
      disabled,
      phoneNumber,
      photoURL,
      customClaims,
      updateFirestore,
    } = req.body || {};
    let userId = uid;
    if (!userId && email) {
      const u = await auth.getUserByEmail(String(email));
      userId = u.uid;
    }
    if (!userId) return res.status(400).json({ error: 'Missing uid or email' });
    const updatePayload = {};
    if (typeof displayName === 'string') updatePayload.displayName = displayName;
    if (typeof password === 'string') updatePayload.password = password;
    if (typeof disabled === 'boolean') updatePayload.disabled = disabled;
    if (typeof phoneNumber === 'string') updatePayload.phoneNumber = phoneNumber;
    if (typeof photoURL === 'string') updatePayload.photoURL = photoURL;
    const u = await auth.updateUser(String(userId), updatePayload);
    if (customClaims && typeof customClaims === 'object') {
      await auth.setCustomUserClaims(String(userId), customClaims);
    }
    if (updateFirestore && typeof updateFirestore === 'object') {
      try {
        await db.collection('users').doc(String(userId)).set(updateFirestore, { merge: true });
      } catch {}
    }
    return res
      .status(200)
      .json({ ok: true, user: { uid: u.uid, email: u.email, displayName: u.displayName } });
  } catch (err) {
    return res.status(500).json({ error: String(err && err.message ? err.message : err) });
  }
});

// Admin: importação em massa via CSV do Storage
// Espera body: { bucket?: string, file: string, createMissing?: boolean, updateExisting?: boolean, defaultClaims?: object }
export const importUsersCsv = functions.region('us-central1').https.onRequest(async (req, res) => {
  setCors(req, res, 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).send('');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!(await isAuthorized(req))) return res.status(401).json({ error: 'unauthorized' });
  try {
    const app = ensureAdmin();
    const auth = getAuth(app);
    const db = getFirestore(app);
    const storage = getStorage(app);
    const {
      bucket,
      file,
      createMissing = true,
      updateExisting = true,
      defaultClaims = {},
    } = req.body || {};
    if (!file) return res.status(400).json({ error: 'Missing file' });
    const b = bucket ? storage.bucket(bucket) : storage.bucket();
    const [buf] = await b.file(String(file)).download();
    const text = buf.toString('utf-8');
    const rows = parseCsv(text);
    if (rows.length === 0) return res.status(400).json({ error: 'Empty CSV' });
    const header = rows[0].map((h) => String(h).trim().toLowerCase());
    const required = ['email'];
    for (const r of required) {
      if (!header.includes(r)) return res.status(400).json({ error: `Missing column: ${r}` });
    }
    let created = 0,
      updated = 0,
      failed = 0;
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0) continue;
      const obj = mapRow(header, row);
      const email = obj.email?.trim();
      if (!email) {
        failed++;
        continue;
      }
      try {
        let user;
        try {
          user = await auth.getUserByEmail(email);
        } catch {}
        if (!user && createMissing) {
          user = await auth.createUser({
            email,
            displayName: obj.displayname || obj.display_name || obj.name,
            password: obj.password,
            disabled: obj.disabled === 'true',
          });
          created++;
        } else if (user && updateExisting) {
          const u2 = await auth.updateUser(user.uid, {
            displayName: obj.displayname || obj.display_name || obj.name,
            disabled: obj.disabled === 'true' ? true : obj.disabled === 'false' ? false : undefined,
            phoneNumber: obj.phonenumber || obj.phone_number,
          });
          user = u2;
          updated++;
        }
        if (user) {
          // claims e Firestore
          const claims = { ...defaultClaims };
          if (obj.role) claims.role = obj.role;
          await auth.setCustomUserClaims(user.uid, claims);
          const fsData = {
            email,
            displayName: user.displayName || obj.displayname || obj.name,
            role: claims.role || null,
            updatedAt: Date.now(),
          };
          await db.collection('users').doc(user.uid).set(fsData, { merge: true });
        }
      } catch {
        failed++;
      }
    }
    return res.status(200).json({ ok: true, created, updated, failed });
  } catch (err) {
    return res.status(500).json({ error: String(err && err.message ? err.message : err) });
  }
});

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.length > 0);
  const rows = [];
  for (const line of lines) rows.push(splitCsvLine(line));
  return rows;
}

function splitCsvLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur);
  return result.map((s) => s.trim());
}

function mapRow(header, row) {
  const obj = {};
  for (let i = 0; i < header.length; i++) obj[header[i]] = row[i];
  return obj;
}

// Storage trigger: importar usuários de CSV em csv-imports/*.csv
export const importUsersFromCSV = functions
  .region('us-central1')
  .storage.object()
  .onFinalize(async (object) => {
    try {
      const name = object.name || '';
      const bucketName = object.bucket;
      const contentType = object.contentType || '';
      if (!name || !bucketName) return;
      if (!name.endsWith('.csv')) {
        console.log('[importUsersFromCSV] ignorando arquivo não-CSV', name);
        return;
      }
      if (!name.startsWith('csv-imports/')) {
        console.log('[importUsersFromCSV] ignorando caminho', name);
        return;
      }
      if (contentType && !(contentType.startsWith('text/csv') || contentType.includes('csv'))) {
        console.log('[importUsersFromCSV] ignorando contentType', contentType);
        return;
      }

      const app = ensureAdmin();
      const auth = getAuth(app);
      const db = getFirestore(app);
      const storage = getStorage(app);
      const bucket = storage.bucket(bucketName);

      const rows = [];
      await new Promise((resolve, reject) => {
        bucket
          .file(name)
          .createReadStream()
          .on('error', reject)
          .pipe(csvParser())
          .on('data', (row) => rows.push(row))
          .on('end', resolve);
      });

      let created = 0,
        updated = 0,
        failed = 0;
      for (const raw of rows) {
        const obj = {};
        for (const k of Object.keys(raw)) obj[String(k).toLowerCase().trim()] = raw[k];
        const email = String(obj.email || '').trim();
        if (!email) {
          failed++;
          continue;
        }
        try {
          let user;
          try {
            user = await auth.getUserByEmail(email);
          } catch {}
          const displayName = obj.displayname || obj.display_name || obj.name || undefined;
          const disabled =
            typeof obj.disabled === 'string' ? obj.disabled.toLowerCase() === 'true' : undefined;
          const phoneNumber = obj.phonenumber || obj.phone_number || undefined;
          if (!user) {
            user = await auth.createUser({
              email,
              displayName,
              disabled,
              phoneNumber,
              password: obj.password,
            });
            created++;
          } else {
            const payload = {};
            if (displayName !== undefined) payload.displayName = displayName;
            if (typeof disabled === 'boolean') payload.disabled = disabled;
            if (phoneNumber) payload.phoneNumber = phoneNumber;
            if (obj.password) payload.password = obj.password;
            await auth.updateUser(user.uid, payload);
            updated++;
          }
          const claims = {};
          if (obj.role) claims.role = obj.role;
          if (Object.keys(claims).length > 0) await auth.setCustomUserClaims(user.uid, claims);
          const fsData = {
            email,
            displayName: displayName || user.displayName || null,
            role: claims.role || null,
            updatedAt: Date.now(),
          };
          await db.collection('users').doc(user.uid).set(fsData, { merge: true });
        } catch (e) {
          failed++;
        }
      }
      console.log(
        `[importUsersFromCSV] ${name} -> created: ${created}, updated: ${updated}, failed: ${failed}`
      );
      return;
    } catch (err) {
      console.error('[importUsersFromCSV] error:', err);
      return;
    }
  });

// Callable: deleteAuthUser
export const deleteAuthUserCallable = functions
  .region('us-central1')
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'A função deve ser chamada enquanto autenticado.'
      );
    }
    if (!isAdminContext(context)) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Apenas usuários administradores podem excluir outros usuários.'
      );
    }
    const uidToDelete = data?.uid;
    if (!uidToDelete) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'O UID a ser excluído é obrigatório.'
      );
    }
    try {
      const app = ensureAdmin();
      const auth = getAuth(app);
      await auth.deleteUser(String(uidToDelete));
      const deleteFirestore = data?.deleteFirestore === true;
      if (deleteFirestore) {
        const db = getFirestore(app);
        try {
          await db.collection('users').doc(String(uidToDelete)).delete();
        } catch {}
      }
      return { success: true, message: `Usuário ${uidToDelete} excluído.` };
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Não foi possível excluir o usuário.',
        error?.message
      );
    }
  });

// Callable: updateAuthUser
export const updateAuthUserCallable = functions
  .region('us-central1')
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'A função deve ser chamada enquanto autenticado.'
      );
    }
    const uidToUpdate = data?.uid;
    if (!uidToUpdate) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'O UID a ser atualizado é obrigatório.'
      );
    }
    const isAdmin = isAdminContext(context);
    if (!isAdmin && context.auth.uid !== uidToUpdate) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Você não tem permissão para atualizar este usuário.'
      );
    }
    const {
      email,
      password,
      displayName,
      photoURL,
      disabled,
      phoneNumber,
      customClaims,
      updateFirestore,
    } = data || {};
    const updateData = {};
    if (typeof email === 'string') updateData.email = email;
    if (typeof password === 'string') updateData.password = password;
    if (typeof displayName === 'string') updateData.displayName = displayName;
    if (typeof photoURL === 'string') updateData.photoURL = photoURL;
    if (typeof phoneNumber === 'string') updateData.phoneNumber = phoneNumber;
    if (typeof disabled === 'boolean') updateData.disabled = disabled;
    if (
      Object.keys(updateData).length === 0 &&
      !(customClaims && isAdmin) &&
      !(updateFirestore && isAdmin)
    ) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Nenhum campo válido fornecido para atualização.'
      );
    }
    try {
      const app = ensureAdmin();
      const auth = getAuth(app);
      const u = await auth.updateUser(String(uidToUpdate), updateData);
      if (isAdmin && customClaims && typeof customClaims === 'object') {
        await auth.setCustomUserClaims(String(uidToUpdate), customClaims);
      }
      if (isAdmin && updateFirestore && typeof updateFirestore === 'object') {
        const db = getFirestore(app);
        try {
          await db
            .collection('users')
            .doc(String(uidToUpdate))
            .set(updateFirestore, { merge: true });
        } catch {}
      }
      return {
        success: true,
        message: `Usuário ${uidToUpdate} atualizado.`,
        user: { uid: u.uid, email: u.email, displayName: u.displayName },
      };
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Não foi possível atualizar o usuário.',
        error?.message
      );
    }
  });

export const fpaForecastCallable = functions
  .region('us-central1')
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Autenticação obrigatória.');
    }
    const receivables = Array.isArray(data?.receivables) ? data.receivables : [];
    const payables = Array.isArray(data?.payables) ? data.payables : [];
    const horizon = Number(data?.horizonMonths ?? 6);
    if (!Array.isArray(receivables) || !Array.isArray(payables)) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'receivables e payables devem ser arrays.'
      );
    }
    const now = new Date();
    function monthStart(d) {
      return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
    }
    function addMonths(d, n) {
      const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1));
      return x;
    }
    function parseDate(v) {
      try {
        return new Date(v);
      } catch {
        return new Date();
      }
    }
    const buckets = new Map();
    const addItem = (item, sign) => {
      const amt = Number(item.amount ?? item.valor ?? 0);
      const dt = parseDate(item.dueDate ?? item.date ?? now);
      const key = `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}`;
      const b = buckets.get(key) || { receivables: 0, payables: 0 };
      if (sign > 0) b.receivables += amt;
      else b.payables += amt;
      buckets.set(key, b);
    };
    for (const it of receivables) addItem(it, +1);
    for (const it of payables) addItem(it, -1);
    const forecast = [];
    for (let i = 0; i < horizon; i++) {
      const d = addMonths(now, i);
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
      const b = buckets.get(key) || { receivables: 0, payables: 0 };
      forecast.push({
        month: key,
        monthStart: monthStart(d).toISOString(),
        receivables: Number(b.receivables.toFixed(2)),
        payables: Number(b.payables.toFixed(2)),
        net: Number((b.receivables - b.payables).toFixed(2)),
      });
    }
    let savedId = null;
    if (data?.save === true) {
      try {
        const db = getFirestore(ensureAdmin());
        const uid = context.auth.uid;
        const ref = await db
          .collection('users')
          .doc(uid)
          .collection('financeForecasts')
          .add({
            createdAt: Date.now(),
            horizon,
            forecast,
            inputSizes: { receivables: receivables.length, payables: payables.length },
          });
        savedId = ref.id;
      } catch (e) {}
    }
    return { ok: true, forecast, savedId };
  });

export const riskScoreCallable = functions
  .region('us-central1')
  .https.onCall(async (data, context) => {
    if (!context.auth)
      throw new functions.https.HttpsError('unauthenticated', 'Autenticação obrigatória.');
    const WC = Number(data?.WC ?? data?.workingCapital ?? 0);
    const RE = Number(data?.RE ?? data?.retainedEarnings ?? 0);
    const EBIT = Number(data?.EBIT ?? data?.operatingIncome ?? 0);
    const MVE = Number(data?.MVE ?? data?.marketValueEquity ?? 0);
    const S = Number(data?.S ?? data?.sales ?? 0);
    const TA = Number(data?.TA ?? data?.totalAssets ?? 0);
    const TL = Number(data?.TL ?? data?.totalLiabilities ?? 0);
    if (TA <= 0 || TL <= 0)
      throw new functions.https.HttpsError('invalid-argument', 'TA e TL devem ser positivos.');
    const Z =
      1.2 * (WC / TA) + 1.4 * (RE / TA) + 3.3 * (EBIT / TA) + 0.6 * (MVE / TL) + 1.0 * (S / TA);
    let risk = 'Baixo';
    let explanation = 'Saudável';
    if (Z < 1.81) {
      risk = 'Alto';
      explanation = 'Zona de risco de falência.';
    } else if (Z < 2.99) {
      risk = 'Médio';
      explanation = 'Zona cinzenta, atenção.';
    }
    const result = { zScore: Number(Z.toFixed(3)), risk, explanation };
    return { ok: true, result };
  });

export const cfoChatbotCallable = functions
  .region('us-central1')
  .https.onCall(async (data, context) => {
    if (!context.auth)
      throw new functions.https.HttpsError('unauthenticated', 'Autenticação obrigatória.');
    const question = String(data?.question || '').trim();
    if (!question)
      throw new functions.https.HttpsError('invalid-argument', 'Pergunta obrigatória.');
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey)
      throw new functions.https.HttpsError(
        'failed-precondition',
        'GEMINI_API_KEY não configurada.'
      );
    const model = String(data?.model || 'gemini-1.5-flash-latest');
    const sys =
      'Você é um CFO virtual da Optilog. Responda com precisão financeira, cite fórmulas quando útil e proponha verificações práticas. Responda em português.';
    const body = {
      contents: [{ role: 'user', parts: [{ text: `${sys}\n\nPergunta: ${question}` }] }],
    };
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`;
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await r.json();
    let text = '';
    try {
      const c = json?.candidates?.[0];
      const parts = c?.content?.parts;
      if (Array.isArray(parts)) {
        const firstText = parts.find((p) => typeof p.text === 'string')?.text;
        if (firstText) text = firstText;
      }
    } catch {}
    return { ok: true, text, raw: json };
  });

export const economistaVirtualCallable = functions
  .region('us-central1')
  .https.onCall(async (data, context) => {
    if (!context.auth)
      throw new functions.https.HttpsError('unauthenticated', 'Autenticação obrigatória.');
    const query = String(data?.query || '').trim();
    if (!query) throw new functions.https.HttpsError('invalid-argument', 'Query obrigatória.');
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey)
      throw new functions.https.HttpsError(
        'failed-precondition',
        'GEMINI_API_KEY não configurada.'
      );
    const model = String(data?.model || 'gemini-1.5-flash-latest');
    const sys =
      'Você é o Economista Virtual da Optilog. Traga visão macroeconômica, cenários, riscos e oportunidades para logística e química, em português.';
    const body = { contents: [{ role: 'user', parts: [{ text: `${sys}\n\nTópico: ${query}` }] }] };
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`;
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await r.json();
    let text = '';
    try {
      const c = json?.candidates?.[0];
      const parts = c?.content?.parts;
      if (Array.isArray(parts)) {
        const firstText = parts.find((p) => typeof p.text === 'string')?.text;
        if (firstText) text = firstText;
      }
    } catch {}
    return { ok: true, text, raw: json };
  });
