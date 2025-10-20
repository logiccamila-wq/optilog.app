# deploy_full_ultra.ps1
# Ultra-aggressive full deployment do projeto OpTiLog

$ErrorActionPreference = 'Stop'

# --- Configurações ---
$backendPath       = "C:\Users\Pichau\devoptilog-app\optilog-app\backend"
$frontendPath      = "C:\Users\Pichau\devoptilog-app\optilog-app"
$tireOpsBackend    = "C:\Users\Pichau\devoptilog-app\tire-ops\backend"
$tireOpsFrontend   = "C:\Users\Pichau\devoptilog-app\tire-ops\frontend"
$mlServicePath     = "C:\Users\Pichau\devoptilog-app\ml-service"
$streamlitPath     = "C:\Users\Pichau\devoptilog-app\optilog-app\streamlit-app"
$dockerComposePath = "C:\Users\Pichau\devoptilog-app\tire-ops"
$envFile           = "$backendPath\.env"

# --- Função para criar backup de arquivos não pertencentes ao projeto ---
function Backup-Extras($path) {
    $backupPath = "$path\backup_extras"
    if (!(Test-Path $backupPath)) { New-Item -ItemType Directory -Path $backupPath | Out-Null }
    Get-ChildItem $path -File |
      Where-Object { $_.Name -notmatch "package|package-lock|yarn.lock|Dockerfile|docker-compose|\.json|\.env|\.ts$|\.js$|\.tsx$|\.mjs$|\.ps1$|\.css$|\.html$|\.md$|\.yaml$|\.yml$|\.gitignore|\.nvmrc|\.npmrc|\.prettierrc|\.prettierignore|\.eslintrc|tsconfig|tailwind\.config|postcss\.config|next\.config|vercel\.json|render\.yaml|apphosting\.yaml" } |
      ForEach-Object { Move-Item $_.FullName $backupPath -Force }
}

# --- Passo 1: Docker Compose (Postgres + pgAdmin) ---
Write-Host "🚀 Subindo Postgres/pgAdmin via Docker..."
Set-Location $dockerComposePath
if (Get-Command docker -ErrorAction SilentlyContinue) {
  try { docker compose down -v } catch { try { docker-compose down -v } catch { Write-Host "⚠ Falha ao derrubar stack docker" } }
  try { docker compose up -d } catch { try { docker-compose up -d } catch { Write-Host "⚠ Falha ao subir stack docker" } }
} else {
  Write-Host "ℹ Docker não encontrado. Continuando sem provisionamento via Docker."
}

# --- Passo 2: Instalação de dependências ---
Write-Host "📦 Instalando dependências..."
Set-Location $backendPath;  npm install
Set-Location $frontendPath; npm install
Set-Location $tireOpsBackend;  npm install
Set-Location $tireOpsFrontend; npm install

# --- Passo 3: Configurar .env se não existir ---
if (!(Test-Path $envFile)) {
    Write-Host "⚙️ Criando arquivo .env com DATABASE_URL padrão..."
@"
DATABASE_URL=postgres://postgres:postgres@localhost:5432/optilog
"@ | Out-File $envFile -Encoding UTF8
} else {
    $envText = Get-Content $envFile -Raw
    if ($envText -notmatch "(?m)^DATABASE_URL=") {
        Add-Content $envFile "`nDATABASE_URL=postgres://postgres:postgres@localhost:5432/optilog"
        Write-Host "ℹ DATABASE_URL adicionado ao .env do backend"
    }
}

# --- Passo 4: Reset completo do banco + seed ---
Write-Host "🗄️ Resetando banco e aplicando seeds..."
Set-Location $backendPath
npm run db:setup-full

# --- Passo 5: Backup de arquivos extras ---
Write-Host "💾 Fazendo backup de arquivos extras fora do padrão..."
Backup-Extras $frontendPath
Backup-Extras $backendPath
Backup-Extras $tireOpsBackend
Backup-Extras $tireOpsFrontend

# --- Passo 6: Inicialização de serviços ---
Write-Host "⚡ Inicializando serviços..."

# Backend principal
Start-Process "powershell" -ArgumentList "-NoExit", "-Command cd '$backendPath'; npm run start"

# Microserviço Tire Ops
Start-Process "powershell" -ArgumentList "-NoExit", "-Command cd '$tireOpsBackend'; npm run start"

# Frontend Next.js
Start-Process "powershell" -ArgumentList "-NoExit", "-Command cd '$frontendPath'; npm run dev"

# ML Service (ajuste para app.py)
Start-Process "powershell" -ArgumentList "-NoExit", "-Command cd '$mlServicePath'; python app.py"

# Streamlit Dashboard
Start-Process "powershell" -ArgumentList "-NoExit", "-Command cd '$streamlitPath'; streamlit run app.py"

# --- Passo 7: Health Check (básico) ---
Write-Host "🔍 Validando endpoints..."
try { Invoke-WebRequest http://localhost:3000/api/health -UseBasicParsing | Out-Null; Write-Host "Frontend Next.js OK" } catch { Write-Host "Frontend Next.js indisponível" }
try { Invoke-WebRequest http://localhost:3011/health -UseBasicParsing | Out-Null; Write-Host "Backend principal OK" } catch { Write-Host "Backend principal indisponível" }
try { Invoke-WebRequest http://localhost:3001/tires/health -UseBasicParsing | Out-Null; Write-Host "Tire Ops OK" } catch { Write-Host "Tire Ops Backend indisponível" }

Write-Host "✅ Deploy completo executado. Todos os serviços rodando!"