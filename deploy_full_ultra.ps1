<# 
 .SYNOPSIS 
 Deploy completo ultra-hardcore para o projeto Optilog. 
 Inclui backend, frontend, microserviço Tire Ops, ML Service, Streamlit, Postgres/pgAdmin via Docker, backups, seeds e health checks. 
 
 .PARAMETER SkipDocker 
 Pula provisionamento Docker. 
 
 .PARAMETER SkipBackupExtras 
 Evita mover arquivos “extras” para backup. 
 
 .PARAMETER FullResetDb 
 Força DROP+CREATE+SEED completo do banco. 
 #> 
 
 param( 
     [switch]$SkipDocker, 
     [switch]$SkipBackupExtras, 
     [switch]$FullResetDb 
 ) 
 
 # Caminhos principais 
 $Root = "C:\Users\Pichau\devoptilog-app\optilog-app" 
 $Backend = "$Root\backend" 
 $Frontend = "$Root" 
 $TireOpsBackend = "C:\Users\Pichau\devoptilog-app\tire-ops\backend" 
 $TireOpsFrontend = "C:\Users\Pichau\devoptilog-app\tire-ops\frontend" 
 $MLService = "C:\Users\Pichau\devoptilog-app\ml-service" 
 $StreamlitApp = "$Root\streamlit-app" 
 $DockerComposeFile = "C:\Users\Pichau\devoptilog-app\tire-ops\docker-compose.yml" 
 $LogFile = "$Root\deploy_full_ultra.log" 
 
 # Função para log 
 function Log($message) { 
     $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss" 
     "$timestamp : $message" | Tee-Object -FilePath $LogFile -Append 
 } 
 
 Log "=== Início do Deploy Ultra-Hardcore ===" 
 
 # 1. Provisionar Docker/Postgres 
 if (-not $SkipDocker) { 
     if (Get-Command docker -ErrorAction SilentlyContinue) { 
         Log "Verificando Docker Compose..." 
         Push-Location (Split-Path $DockerComposeFile) 
         docker compose up -d 
         Pop-Location 
         Log "Docker Compose executado." 
     } else { 
         Log "Docker não encontrado, pulando provisionamento de Postgres/pgAdmin." 
     } 
 } 
 
 # 2. Instalar dependências 
 $dirs = @($Backend, $Frontend, $TireOpsBackend, $TireOpsFrontend) 
 foreach ($d in $dirs) { 
     if (Test-Path $d) { 
         Log "Instalando dependências em $d" 
         Push-Location $d 
         npm install 
         Pop-Location 
     } 
 } 
 
 # 3. Garantir DATABASE_URL 
 $EnvFile = "$Backend\.env" 
 if (!(Test-Path $EnvFile)) { New-Item $EnvFile -ItemType File } 
 if (-not (Get-Content $EnvFile | Select-String "DATABASE_URL")) { 
     Add-Content $EnvFile "DATABASE_URL=postgres://postgres:postgres@localhost:5432/optilog" 
     Log "DATABASE_URL padrão adicionado ao .env" 
 } else { 
     Log "DATABASE_URL já presente, não sobrescrevendo" 
 } 
 
 # 4. Backup de arquivos extras 
 if (-not $SkipBackupExtras) { 
     $modules = @($Backend, $Frontend, $TireOpsBackend, $TireOpsFrontend, $MLService, $StreamlitApp) 
     foreach ($m in $modules) { 
         $backupDir = Join-Path $m "backup_extras" 
         if (!(Test-Path $backupDir)) { New-Item $backupDir -ItemType Directory } 
         Get-ChildItem $m -File | Where-Object { $_.Extension -notin ".js",".ts",".json",".mjs",".tsx",".css",".html" } | 
         ForEach-Object { 
             Move-Item $_.FullName $backupDir -Force 
             Log "Movido $($_.Name) para backup_extras em $m" 
         } 
     } 
 } 
 
 # 5. Reset e seed do banco 
 Push-Location $Backend 
 if ($FullResetDb) { 
     Log "Executando db:setup-full (DROP+CREATE+SEED)" 
     npm run db:setup-full 
 } else { 
     Log "Executando db:setup (seed idempotente)" 
     npm run db:setup 
 } 
 Pop-Location 
 
 # 6. Subir serviços 
 Log "Iniciando serviços..." 
 
 # Backend principal 
 Start-Process "powershell" -ArgumentList "-NoExit","-Command `"$Backend\npm run dev`"" 
 # Next.js 
 Start-Process "powershell" -ArgumentList "-NoExit","-Command `"$Frontend\npm run dev`"" 
 # Tire Ops backend 
 Start-Process "powershell" -ArgumentList "-NoExit","-Command `"$TireOpsBackend\npm run dev`"" 
 # Tire Ops frontend 
 Start-Process "powershell" -ArgumentList "-NoExit","-Command `"$TireOpsFrontend\npm run dev`"" 
 # ML Service 
 Start-Process "python" -ArgumentList "$MLService\app.py" 
 # Streamlit 
 Start-Process "streamlit" -ArgumentList "run $StreamlitApp\app.py" 
 
 # 7. Health checks 
 $healthEndpoints = @{ 
     "Next API" = "http://localhost:3000/api/health" 
     "Backend Principal" = "http://localhost:3011/health" 
     "Tire Ops" = "http://localhost:3001/tires/health" 
     "Streamlit" = "http://localhost:8501" 
 } 
 
 foreach ($name in $healthEndpoints.Keys) { 
     try { 
         $resp = Invoke-WebRequest -Uri $healthEndpoints[$name] -UseBasicParsing -TimeoutSec 5 
         if ($resp.StatusCode -eq 200) { 
             Log "$name OK" 
         } else { 
             Log "$name NÃO OK (Status: $($resp.StatusCode))" 
         } 
     } catch { 
         Log "$name NÃO OK (Erro: $_)" 
     } 
 } 
 
 Log "=== Deploy Ultra-Hardcore Concluído ==="