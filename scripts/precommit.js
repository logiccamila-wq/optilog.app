#!/usr/bin/env node

const { execSync } = require('child_process');

function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' });
    return output.split('\n').map((f) => f.trim()).filter(Boolean);
  } catch (e) {
    console.error('Falha ao obter arquivos staged:', e.message);
    process.exit(1);
  }
}

// Padrões que não devem ser commitados
const blocked = [
  // env & segredos
  /^\.env(\..+)?$/,
  /^.*\/\.env(\..+)?$/,
  // caches/build
  /^node_modules\//,
  /^\.next\//,
  /^\.firebase\//,
  /^android\/app\/build\//,
  /^\.dart_tool\//,
  /^\.gradle\//,
  /^dist\//,
  /^build\//,
  // IDE/sistema
  /^\.vscode\//,
  /^\.idea\//,
];

// Exemplos permitidos
const allowedExamples = [
  /^\.env\.example$/,
  /^.*\/\.env\.example$/,
  /^\.env\.local\.example$/,
  /^.*\/\.env\.local\.example$/,
];

function isAllowedExample(file) {
  return allowedExamples.some((re) => re.test(file));
}

function isBlocked(file) {
  if (isAllowedExample(file)) return false;
  return blocked.some((re) => re.test(file));
}

const staged = getStagedFiles();
const violations = staged.filter(isBlocked);

if (violations.length > 0) {
  console.error('\nPre-commit bloqueado: os seguintes arquivos/pastas não devem ser versionados:\n');
  for (const v of violations) console.error(' - ' + v);
  console.error('\nUse `git restore --staged <path>` para removê-los do staging. Se necessário, ajuste seu `.gitignore`.');
  process.exit(1);
}

// Se chegou até aqui, tudo certo
process.exit(0);