const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
// Detecta server standalone tanto em .next-aggressive quanto em .next
const candidates = [
  path.join('.next-aggressive', 'standalone', 'server.js'),
  path.join('.next', 'standalone', 'server.js'),
];
const standaloneServer = candidates.find((p) => fs.existsSync(p));
const useStandalone = !!standaloneServer;

let cmd;
let args;

if (useStandalone) {
  // Prefer Next standalone server build para produção/hosts como Render
  cmd = 'node';
  args = [standaloneServer];
  console.log('Using standalone server.js on port', port, '->', standaloneServer);
} else {
  // Fallback para next start
  cmd = 'next';
  args = ['start', '-p', String(port)];
  console.log('Using next start on port', port);
}

const child = spawn(cmd, args, {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: { ...process.env, PORT: String(port) },
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
