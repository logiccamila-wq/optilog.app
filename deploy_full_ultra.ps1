<#
 .SYNOPSIS
 Deploy Full Ultra-Agressivo para Optilog-App
 .DESCRIPTION
 - Provisiona Docker/Postgres (se disponível)
 - Instala dependências em todos os módulos
 - Configura DATABASE_URL no backend/.env sem sobrescrever
 - Executa reset total do banco + seeds completos (-FullResetDb)
 - Move arquivos extras para backup seguro (-SkipBackupExtras opcional)
 - Sobe todos os serviços: backend, Next.js, Tire Ops, ML Service, Streamlit
 - Health checks completos
 .PARAMETER SkipDocker
 Pula provisionamento Docker/Postgres
 .PARAMETER SkipBackupExtras
 Não move arquivos extras para backup
 .PARAMETER FullResetDb
 Força reset completo do banco
 .PARAMETER BackendPort
 Define porta do backend principal (default 3011)
 .PARAMETER TireOpsPort
 Define porta do Tire Ops (default 3001)
 .PARAMETER WaitForDb
 Espera o Postgres estar pronto antes do reset/seed
 #>

param(
    [switch]$SkipDocker,
    [switch]$SkipBackupExtras,
    [switch]$FullResetDb,
    [int]$BackendPort = 3011,
    [int]$TireOpsPort = 3001,
    [switch]$WaitForDb
)

$ErrorActionPreference = "Stop"
$logFile = "deploy_full_ultra.log"
"==================== Deploy Full Ultra-Agressivo ====================" | Tee-Object $logFile

# Descobrir paths com base no local do script
$ScriptRoot = Split-Path -Parent $PSCommandPath
$WorkspaceRoot = Split-Path $ScriptRoot -Parent

# Paths principais (robustos ao local do script)
$paths = @{
    Backend         = Join-Path $ScriptRoot "backend"
    Frontend        = $ScriptRoot
    TireOpsBackend  = Join-Path $WorkspaceRoot "tire-ops\backend"
    TireOpsFrontend = Join-Path $WorkspaceRoot "tire-ops\frontend"
    MLService       = Join-Path $WorkspaceRoot "ml-service"
    Streamlit       = Join-Path $ScriptRoot "streamlit-app"
    DockerCompose   = Join-Path $WorkspaceRoot "tire-ops\docker-compose.yml"
}

# Função para log
function Log([string]$msg) { "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - $msg" | Tee-Object -FilePath $logFile -Append }

# 1️⃣ Docker/Postgres
if (-not $SkipDocker) {
    if (Get-Command docker -ErrorAction SilentlyContinue) {
        Log "🚀 Subindo Docker/Postgres..."
        Push-Location (Split-Path $paths.DockerCompose)
        try { docker compose up -d } catch { try { docker-compose up -d } catch { Log "⚠️ Falha ao subir stack Docker: $_" } }
        Pop-Location
        if ($WaitForDb) {
            Log "⏳ Esperando Postgres na porta 5432..."
            while (-not (Test-NetConnection -ComputerName "localhost" -Port 5432 -WarningAction SilentlyContinue).TcpTestSucceeded) {
                Start-Sleep -Seconds 2
            }
            Log "✅ Postgres pronto!"
        }
    } else { Log "⚠️ Docker não encontrado. Pulando provisionamento." }
}

# 2️⃣ Instalação de dependências
foreach ($dir in @($paths.Backend, $paths.Frontend, $paths.TireOpsBackend, $paths.TireOpsFrontend)) {
    if (Test-Path $dir) {
        Log "📦 Instalando dependências em $dir..."
        Push-Location $dir
        npm install
        Pop-Location
    }
}

# 3️⃣ Configura .env
$envFile = Join-Path $paths.Backend ".env"
if (-not (Test-Path $envFile)) { New-Item $envFile -ItemType File | Out-Null }
$content = Get-Content $envFile -ErrorAction SilentlyContinue
if (-not ($content -match "DATABASE_URL")) {
    "DATABASE_URL=postgres://postgres:postgres@localhost:5432/optilog" | Add-Content $envFile
    Log "✅ Adicionada DATABASE_URL padrão no backend/.env"
} else {
    Log "✅ DATABASE_URL já existe, preservando valor"
}

# 4️⃣ Reset e seed banco
Push-Location $paths.Backend
if ($FullResetDb) {
    Log "🔥 Executando db:setup-full (DROP+CREATE+SEED)..."
    npm run db:setup-full
} else {
    Log "⚡ Executando db:setup (idempotente)..."
    npm run db:setup
}
Pop-Location

# 5️⃣ Backup arquivos extras
if (-not $SkipBackupExtras) {
    Log "📁 Movendo arquivos extras para backup_extras..."
    foreach ($moduleDir in @($paths.Backend, $paths.Frontend, $paths.TireOpsBackend, $paths.TireOpsFrontend, $paths.MLService, $paths.Streamlit)) {
        if (Test-Path $moduleDir) {
            $backupDir = Join-Path $moduleDir "backup_extras"
            if (-not (Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir | Out-Null }
            Get-ChildItem $moduleDir -Recurse -File |
                Where-Object { $_.Extension -notin ".js",".ts",".tsx",".json",".css",".scss",".py" } |
                ForEach-Object { Move-Item $_.FullName $backupDir -Force }
        }
    }
}

# 6️⃣ Subir serviços
Log "🚀 Iniciando serviços..."

# Backend principal
Start-Process "powershell" "-NoExit -Command `"cd $($paths.Backend); npm run dev`""

# Next.js
Start-Process "powershell" "-NoExit -Command `"cd $($paths.Frontend); npm run dev`""

# Tire Ops backend
Start-Process "powershell" "-NoExit -Command `"cd $($paths.TireOpsBackend); npm run dev`""

# Tire Ops frontend
Start-Process "powershell" "-NoExit -Command `"cd $($paths.TireOpsFrontend); npm run dev`""

# ML Service
Start-Process "powershell" "-NoExit -Command `"cd $($paths.MLService); python app.py`""

# Streamlit
Start-Process "powershell" "-NoExit -Command `"cd $($paths.Streamlit); streamlit run app.py`""

# 7️⃣ Health checks
Start-Sleep -Seconds 10
$healthEndpoints = @(
    "http://localhost:3000/api/health",
    "http://localhost:$BackendPort/health",
    "http://localhost:$TireOpsPort/tires/health",
    "http://localhost:8501"
)
foreach ($url in $healthEndpoints) {
    try {
        $resp = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5
        if ($resp.StatusCode -eq 200) { Log "✅ Health OK: $url" } else { Log "⚠️ Health falhou: $url (Status $($resp.StatusCode))" }
    } catch { Log "❌ Health falhou: $url ($_ )" }
}

Log "==================== Deploy Finalizado ===================="