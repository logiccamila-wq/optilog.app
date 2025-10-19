const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const dataDir = path.join(__dirname, 'data');

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
  } catch (_) {
    return [];
  }
}

function writeJson(file, data) {
  try {
    fs.writeFileSync(path.join(dataDir, file), JSON.stringify(data, null, 2));
  } catch (_) {}
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(payload));
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const method = req.method || 'GET';

  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    return res.end();
  }

  if (parsed.pathname === '/ping' && method === 'GET') {
    return sendJson(res, 200, { message: 'pong', port: PORT });
  }

  if (parsed.pathname === '/tires') {
    if (method === 'GET') {
      const tires = readJson('tires.json');
      return sendJson(res, 200, tires);
    }
    if (method === 'POST') {
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          const tires = readJson('tires.json');
          const id = payload.id || `tire-${Date.now()}`;
          const created = { id, ...payload };
          tires.push(created);
          writeJson('tires.json', tires);
          return sendJson(res, 201, created);
        } catch (e) {
          return sendJson(res, 400, { error: 'invalid_json' });
        }
      });
      return;
    }
  }

  if (parsed.pathname === '/vehicles' && method === 'GET') {
    const vehicles = readJson('vehicles.json');
    return sendJson(res, 200, vehicles);
  }

  if (parsed.pathname === '/shipments') {
    if (method === 'GET') {
      const shipments = readJson('shipments.json');
      return sendJson(res, 200, shipments);
    }
    if (method === 'POST') {
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          const shipments = readJson('shipments.json');
          const id = payload.id || `SHP-${Date.now()}`;
          const created = { id, ...payload };
          shipments.push(created);
          writeJson('shipments.json', shipments);
          return sendJson(res, 201, created);
        } catch (e) {
          return sendJson(res, 400, { error: 'invalid_json' });
        }
      });
      return;
    }
  }

  // Orders
  if (parsed.pathname === '/orders') {
    if (method === 'GET') {
      const orders = readJson('orders.json');
      return sendJson(res, 200, orders);
    }
    if (method === 'POST') {
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          const orders = readJson('orders.json');
          const id = payload.id || `ORD-${Date.now()}`;
          const created = { id, ...payload };
          orders.push(created);
          writeJson('orders.json', orders);
          return sendJson(res, 201, created);
        } catch (e) {
          return sendJson(res, 400, { error: 'invalid_json' });
        }
      });
      return;
    }
  }

  // Finance
  if (parsed.pathname === '/invoices' && method === 'GET') {
    const invoices = readJson('invoices.json');
    return sendJson(res, 200, invoices);
  }
  if (parsed.pathname === '/receivables' && method === 'GET') {
    const receivables = readJson('receivables.json');
    return sendJson(res, 200, receivables);
  }
  if (parsed.pathname === '/payables' && method === 'GET') {
    const payables = readJson('payables.json');
    return sendJson(res, 200, payables);
  }

  // Catalog basics (optional)
  if (parsed.pathname === '/customers' && method === 'GET') {
    const customers = readJson('customers.json');
    return sendJson(res, 200, customers);
  }
  if (parsed.pathname === '/products' && method === 'GET') {
    const products = readJson('products.json');
    return sendJson(res, 200, products);
  }

  sendJson(res, 404, { error: 'not_found' });
});

server.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});