#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function copy(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`✔ Copiado: ${path.relative(process.cwd(), dest)}`);
}

function scaffold(type, name) {
  const root = process.cwd();
  const kitsDir = path.join(root, 'kits');
  if (type === 'backend' && name === 'express-basic') {
    copy(path.join(kitsDir, 'backend', 'express-basic', 'server.template.js'), path.join(root, 'backend', 'server.js'));
  } else if (type === 'backend' && name === 'ors-route-proxy') {
    copy(path.join(kitsDir, 'backend', 'ors-route-proxy', 'routeProxy.template.js'), path.join(root, 'backend', 'routeProxy.js'));
  } else if (type === 'backend' && name === 'ws-basic') {
    copy(path.join(kitsDir, 'backend', 'ws-basic', 'ws.template.js'), path.join(root, 'backend', 'ws-server.js'));
  } else if (type === 'frontend' && name === 'next-module') {
    copy(path.join(kitsDir, 'frontend', 'next-module', 'page.template.tsx'), path.join(root, 'app', 'dashboard', name, 'page.tsx'));
  } else if (type === 'frontend' && name === 'livemap') {
    copy(path.join(kitsDir, 'frontend', 'livemap', 'LiveMap.template.tsx'), path.join(root, 'components', 'LiveMap.tsx'));
  } else {
    console.error('Kit não reconhecido.');
    process.exit(1);
  }
}

const [, , type, name] = process.argv;
if (!type || !name) {
  console.log('Uso: node scripts/scaffold.js <backend|frontend> <kit-name>');
  process.exit(1);
}
scaffold(type, name);