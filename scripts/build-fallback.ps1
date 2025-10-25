# Build com fallback para Windows (EPERM em .next\trace)
# - Tenta build local
# - Se falhar com EPERM em trace, tenta WSL
# - Se WSL indisponível, copia para C:\dev\optilog-app e build lá

$ErrorActionPreference = 'Continue'

function Write-Info($msg) { Write-Host "[build-safe] $msg" }

$projectDir = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Write-Info "Projeto: $projectDir"

function Run-Cmd($cmd, $cwd) {
  Write-Info "cwd=$cwd > $cmd"
  Push-Location $cwd
  try {
    $out = Invoke-Expression $cmd 2>&1
    $code = $LASTEXITCODE
  } finally {
    Pop-Location
  }
  return @{ Code = $code; Out = $out }
}

# 1) Build local
Write-Info "Instalando dependências (npm ci)"
$ci = Run-Cmd 'npm ci' $projectDir
if ($ci.Code -ne 0) { Write-Info "npm ci falhou, prosseguindo mesmo assim" }

Write-Info "Executando next build (local)"
$buildLocal = Run-Cmd 'npm run build' $projectDir
Write-Host $buildLocal.Out
if ($buildLocal.Code -eq 0) { Write-Info "Build local OK"; exit 0 }

# 2) Se erro EPERM/trace, tentar WSL
$hasEPERM = $buildLocal.Out -match 'EPERM'
$hasTrace = $buildLocal.Out -match '\\.next(\\|/)trace'
if ($hasEPERM -and $hasTrace) {
  Write-Info "Detectado EPERM em .next\\trace. Tentando WSL..."
  $wslExists = (Get-Command wsl -ErrorAction SilentlyContinue) -ne $null
  if ($wslExists) {
    $wslPath = '/mnt/c/Users/Pichau/devoptilog-app/optilog-app'
    $wslCmd = "wsl bash -lc 'cd $wslPath && npm ci && npm run build'"
    $wsl = Run-Cmd $wslCmd $projectDir
    Write-Host $wsl.Out
    if ($wsl.Code -eq 0) { Write-Info "Build via WSL OK"; exit 0 }
    else { Write-Info "Build via WSL falhou: código $($wsl.Code)" }
  }
  else {
    Write-Info "WSL não disponível. Prosseguindo com cópia."
  }
}
else {
  Write-Info "Falha de build não-EPERM. Tentarei cópia para diretório não sincronizado."
}

# 3) Fallback: copiar para C:\dev\optilog-app e build lá
$targetDir = 'C:\dev\optilog-app'
Write-Info "Preparando diretório: $targetDir"
New-Item -ItemType Directory -Force -Path $targetDir | Out-Null

Write-Info "Copiando projeto com robocopy (pode demorar um pouco)"
$rc = Run-Cmd "robocopy `"$projectDir`" `"$targetDir`" /MIR /XD node_modules .next .next-aggressive .git /XF trace" $projectDir
Write-Host $rc.Out
# Códigos 0-7 são sucesso/avisos; $LASTEXITCODE pode não ser atualizado por Invoke-Expression, então verificamos pelo texto

Write-Info "Instalando dependências (npm ci) em $targetDir"
$ci2 = Run-Cmd 'npm ci' $targetDir
Write-Host $ci2.Out
if ($ci2.Code -ne 0) { Write-Info "npm ci falhou em $targetDir"; exit $ci2.Code }

Write-Info "Executando next build em $targetDir"
$buildTarget = Run-Cmd 'npm run build' $targetDir
Write-Host $buildTarget.Out
if ($buildTarget.Code -eq 0) { Write-Info "Build em $targetDir OK"; exit 0 }

Write-Info "Build falhou em todas as tentativas"
exit 1