const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
const standaloneServer = path.join('.next', 'standalone', 'server.js');
const useStandalone = fs.existsSync(standaloneServer);

let cmd, args;
if (useStandalone) {
  cmd = 'node';
  args = [standaloneServer];
  console.log('Using standalone server:', standaloneServer);
} else {
  cmd = 'next';
  args = ['start', '-p', String(port)];
  console.log('Using next start on port', port);
}

const child = spawn(cmd, args, {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

child.on('exit', (code) => {
  process.exit(code || 0);
});