# Script para atualizar uma pasta local Windows com o repositório GitHub remoto
# Uso: abra PowerShell como administrador e rode este script.

param(
  [string]$LocalPath = "C:\Users\Camila Lareste\Documents\optilog.app-main",
  [string]$RepoUrl = "https://github.com/logiccamila-wq/optilog.app.git",
  [switch]$ForceClone
)

Write-Host "Atualizando pasta: $LocalPath" -ForegroundColor Cyan

if (-not (Test-Path $LocalPath)) {
  Write-Host "Pasta não existe. Criando e clonando repositório..." -ForegroundColor Yellow
  New-Item -ItemType Directory -Path $LocalPath -Force | Out-Null
  git clone $RepoUrl $LocalPath
  exit $LASTEXITCODE
}

Set-Location -Path $LocalPath

# Se não for repo git, clona
if (-not (Test-Path (Join-Path $LocalPath ".git"))) {
  Write-Host "Pasta existe mas não é um repositório git. Clonando conteúdo..." -ForegroundColor Yellow
  Remove-Item -Recurse -Force -Path (Join-Path $LocalPath "*")
  git clone $RepoUrl $LocalPath
  exit $LASTEXITCODE
}

# Atualizar remoto e resetar para main
Write-Host "Buscando alterações do remoto..." -ForegroundColor Cyan
git fetch --all

# Backup rápido: criar branch com snapshot local (opcional)
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupBranch = "local-backup-$timestamp"
Write-Host "Criando backup local na branch $backupBranch" -ForegroundColor Yellow
git checkout -b $backupBranch

# Volta para main e reseta
git checkout main
git reset --hard origin/main
git clean -fd

Write-Host "Sincronização completa. Instale dependências e rode build se necessário." -ForegroundColor Green
Write-Host "Recomendações:
  cd $LocalPath
  npm install
  npm run build
  npm run dev
" -ForegroundColor Gray

exit 0
