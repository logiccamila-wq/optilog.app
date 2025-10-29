#!/usr/bin/env node
/**
 * Verificador de Sincronização com GitHub
 * Compara arquivos locais com repositório remoto
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPO_ROOT = path.join(__dirname, '..');

/**
 * Executa comando git e retorna saída
 */
function gitCommand(cmd) {
  try {
    const result = execSync(`git ${cmd}`, {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return result.trim();
  } catch (error) {
    return null;
  }
}

/**
 * Verifica se está em um repositório git
 */
function isGitRepo() {
  return gitCommand('rev-parse --is-inside-work-tree') === 'true';
}

/**
 * Obtém branch atual
 */
function getCurrentBranch() {
  return gitCommand('rev-parse --abbrev-ref HEAD');
}

/**
 * Obtém URL do repositório remoto
 */
function getRemoteUrl() {
  return gitCommand('config --get remote.origin.url');
}

/**
 * Verifica se há mudanças não commitadas
 */
function hasUncommittedChanges() {
  const status = gitCommand('status --porcelain');
  return status && status.length > 0;
}

/**
 * Lista arquivos modificados
 */
function getModifiedFiles() {
  const status = gitCommand('status --porcelain');
  if (!status) return [];

  return status
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => {
      const parts = line.trim().split(/\s+/);
      const statusCode = parts[0];
      const filePath = parts.slice(1).join(' ');

      let status = 'modificado';
      if (statusCode.includes('M')) status = 'modificado';
      else if (statusCode.includes('A')) status = 'novo';
      else if (statusCode.includes('D')) status = 'deletado';
      else if (statusCode.includes('R')) status = 'renomeado';
      else if (statusCode.includes('?')) status = 'não rastreado';

      return { status, file: filePath };
    });
}

/**
 * Obtém último commit local
 */
function getLastLocalCommit() {
  const hash = gitCommand('rev-parse HEAD');
  const message = gitCommand('log -1 --pretty=%B');
  const author = gitCommand('log -1 --pretty=%an');
  const date = gitCommand('log -1 --pretty=%ar');

  return { hash, message, author, date };
}

/**
 * Verifica se branch está à frente do remoto
 */
function commitsAhead() {
  const result = gitCommand('rev-list --count @{u}..HEAD 2>/dev/null');
  return result ? parseInt(result) : 0;
}

/**
 * Verifica se branch está atrás do remoto
 */
function commitsBehind() {
  const result = gitCommand('rev-list --count HEAD..@{u} 2>/dev/null');
  return result ? parseInt(result) : 0;
}

/**
 * Busca atualizações do remoto
 */
function fetchRemote() {
  try {
    execSync('git fetch origin', {
      cwd: REPO_ROOT,
      stdio: 'ignore',
    });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Obtém último commit do remoto
 */
function getLastRemoteCommit(branch) {
  const hash = gitCommand(`rev-parse origin/${branch}`);
  const message = gitCommand(`log origin/${branch} -1 --pretty=%B`);
  const author = gitCommand(`log origin/${branch} -1 --pretty=%an`);
  const date = gitCommand(`log origin/${branch} -1 --pretty=%ar`);

  return { hash, message, author, date };
}

/**
 * Verifica status de sincronização
 */
function checkSyncStatus() {
  console.log('🔍 VERIFICADOR DE SINCRONIZAÇÃO COM GITHUB\n');
  console.log('='.repeat(60));

  // Verifica se é repositório git
  if (!isGitRepo()) {
    console.log('❌ Erro: Não é um repositório Git');
    return { synced: false, error: 'not_a_git_repo' };
  }

  // Informações básicas
  const branch = getCurrentBranch();
  const remoteUrl = getRemoteUrl();

  console.log(`📂 Branch: ${branch}`);
  console.log(`🔗 Remote: ${remoteUrl || 'Não configurado'}\n`);

  if (!remoteUrl) {
    console.log('❌ Erro: Repositório remoto não configurado');
    return { synced: false, error: 'no_remote' };
  }

  // Busca atualizações
  console.log('📡 Buscando atualizações do remoto...');
  const fetched = fetchRemote();

  if (!fetched) {
    console.log('⚠️  Aviso: Não foi possível buscar atualizações do remoto\n');
  } else {
    console.log('✅ Atualizações buscadas\n');
  }

  // Último commit local
  const localCommit = getLastLocalCommit();
  console.log('💻 Último commit LOCAL:');
  console.log(`   Hash: ${localCommit.hash?.substring(0, 8)}`);
  console.log(`   Mensagem: ${localCommit.message}`);
  console.log(`   Autor: ${localCommit.author}`);
  console.log(`   Data: ${localCommit.date}\n`);

  // Último commit remoto
  const remoteCommit = getLastRemoteCommit(branch);
  if (remoteCommit.hash) {
    console.log('☁️  Último commit REMOTO:');
    console.log(`   Hash: ${remoteCommit.hash?.substring(0, 8)}`);
    console.log(`   Mensagem: ${remoteCommit.message}`);
    console.log(`   Autor: ${remoteCommit.author}`);
    console.log(`   Data: ${remoteCommit.date}\n`);
  }

  // Status de commits
  const ahead = commitsAhead();
  const behind = commitsBehind();

  console.log('📊 Status de sincronização:');
  console.log(`   Commits à frente: ${ahead}`);
  console.log(`   Commits atrás: ${behind}\n`);

  // Arquivos modificados
  const hasChanges = hasUncommittedChanges();
  const modifiedFiles = getModifiedFiles();

  if (hasChanges) {
    console.log(`⚠️  ${modifiedFiles.length} arquivo(s) com alterações não commitadas:\n`);

    modifiedFiles.forEach(({ status, file }) => {
      const icon = status === 'novo' ? '➕' : status === 'deletado' ? '➖' : status === 'modificado' ? '📝' : '❓';
      console.log(`   ${icon} [${status}] ${file}`);
    });

    console.log();
  } else {
    console.log('✅ Não há alterações não commitadas\n');
  }

  // Determina se está sincronizado
  const synced = ahead === 0 && behind === 0 && !hasChanges;

  console.log('='.repeat(60));
  if (synced) {
    console.log('✅ SINCRONIZADO: Seu repositório está atualizado!\n');
  } else {
    console.log('⚠️  NÃO SINCRONIZADO: Ações necessárias:\n');

    if (hasChanges) {
      console.log('   📝 Você tem alterações não commitadas:');
      console.log('      git add .');
      console.log('      git commit -m "Sua mensagem de commit"');
      console.log();
    }

    if (ahead > 0) {
      console.log('   ⬆️  Você tem commits locais não enviados:');
      console.log(`      git push origin ${branch}`);
      console.log();
    }

    if (behind > 0) {
      console.log('   ⬇️  Há commits no remoto que você não tem:');
      console.log(`      git pull origin ${branch}`);
      console.log();
    }
  }
  console.log('='.repeat(60) + '\n');

  return {
    synced,
    branch,
    remoteUrl,
    ahead,
    behind,
    hasChanges,
    modifiedFiles,
    localCommit,
    remoteCommit,
  };
}

/**
 * Main
 */
async function main() {
  const args = process.argv.slice(2);
  const json = args.includes('--json');

  const result = checkSyncStatus();

  if (json) {
    console.log(JSON.stringify(result, null, 2));
  }

  process.exit(result.synced ? 0 : 1);
}

// Executa se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { checkSyncStatus };
