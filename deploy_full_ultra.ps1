<#
 .SYNOPSIS
 Ultra-aggressive deploy for Optilog full stack
 #>
 
 param(
     [switch]$SkipDocker,
     [switch]$SkipBackupExtras,
     [switch]$FullResetDb,
     [switch]$WaitForDb,
     [int]$BackendPort = 3011,
     [int]$TireOpsPort = 3001
 )
 
 $ErrorActionPreference = "Stop"
 
 $ScriptDir = Split-Path -Parent $PSCommandPath
 $LogFile = Join-Path $ScriptDir "deploy_full_ultra.log"
 
 function Log {
     param([string]$Message)
     $TimeStamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
     $Line = "$TimeStamp - $Message"
     Write-Host $Line
     Add-Content $LogFile $Line
 }
 
 # --- WaitForDb Function ---
 function WaitForDb {
     param([int]$TimeoutSec = 90)
     $Elapsed = 0
     while ($true) {
         try {
             $tcp = Test-NetConnection -ComputerName "localhost" -Port 5432 -WarningAction SilentlyContinue
             if ($tcp.TcpTestSucceeded) { Log "Postgres is up"; break }
         } catch {}
         Start-Sleep -Seconds 2
         $Elapsed += 2
         if ($Elapsed -ge $TimeoutSec) { throw "Postgres did not start in $TimeoutSec seconds." }
     }
 }
 
 # --- Backup Extras ---
 function BackupExtras {
     param([string]$ModulePath)
     $BackupDir = Join-Path $ModulePath "backup_extras"
     if (!(Test-Path $BackupDir)) { New-Item -ItemType Directory -Path $BackupDir | Out-Null }
     Get-ChildItem $ModulePath -Recurse -File -Exclude *.js,*.ts,*.json,*.mjs,*.ps1,*.tsx,*.css,*.scss,*.py |
         ForEach-Object {
             Move-Item $_.FullName $BackupDir -Force
             Log "Moved extra file: $($_.FullName)"
         }
 }
 
 # --- Docker Provision ---
 if (-not $SkipDocker) {
     try {
         Push-Location (Join-Path $ScriptDir "tire-ops")
         Log "Starting Docker Compose..."
         try { docker compose up -d } catch { docker-compose up -d }
         Pop-Location
     } catch {
         Log "Docker Compose failed or not installed. Skipping Docker. $_"
     }
 }
 
 # --- Wait for Postgres ---
 if ($WaitForDb) { WaitForDb -TimeoutSec 90 }
 
 # --- Install Dependencies ---
 $Modules = @(
     (Join-Path $ScriptDir 'backend'),
     $ScriptDir,
     (Join-Path $ScriptDir 'tire-ops\backend'),
     (Join-Path $ScriptDir 'tire-ops\frontend')
 )
 foreach ($mod in $Modules) {
     if (Test-Path $mod) {
         Push-Location $mod
         Log "Installing npm dependencies in $mod"
         npm install
         Pop-Location
     }
 }
 
 # --- Ensure DATABASE_URL ---
 $EnvFile = Join-Path $ScriptDir 'backend\.env'
 if (!(Test-Path $EnvFile)) { New-Item -ItemType File -Path $EnvFile | Out-Null }
 if (-not (Select-String "DATABASE_URL" $EnvFile -Quiet)) {
     Add-Content $EnvFile "DATABASE_URL=postgres://postgres:postgres@localhost:5432/optilog"
     Log "Added default DATABASE_URL to backend/.env"
 } else {
     Log "DATABASE_URL already present, preserving value"
 }
 
 # --- Backup Extras ---
 if (-not $SkipBackupExtras) {
     $BackupModules = @('backend','frontend','tire-ops\backend','tire-ops\frontend','ml-service','streamlit-app')
     foreach ($mod in $BackupModules) {
         $Path = Join-Path $ScriptDir $mod
         if (Test-Path $Path) { BackupExtras -ModulePath $Path }
     }
 }
 
 # --- Database Setup ---
 Push-Location (Join-Path $ScriptDir 'backend')
 if ($FullResetDb) {
     Log "Running db:setup-full (DROP+CREATE+SEED)"
     npm run db:setup-full
 } else {
     Log "Running db:setup (idempotent)"
     npm run db:setup
 }
 Pop-Location
 
 # --- Start Services ---
 Log "Starting services..."
 
 # Backend
 Start-Process powershell -ArgumentList "-NoExit","-Command","cd `"$(Join-Path $ScriptDir 'backend')`"; npm run dev"
 Log "Started service: Backend"
 
 # Next
 Start-Process powershell -ArgumentList "-NoExit","-Command","cd `"$ScriptDir`"; npm run dev"
 Log "Started service: Next"
 
 # TireOps Backend
 Start-Process powershell -ArgumentList "-NoExit","-Command","cd `"$(Join-Path $ScriptDir 'tire-ops\backend')`"; npm run dev"
 Log "Started service: TireOps Backend"
 
 # TireOps Frontend
 Start-Process powershell -ArgumentList "-NoExit","-Command","cd `"$(Join-Path $ScriptDir 'tire-ops\frontend')`"; npm run dev"
 Log "Started service: TireOps Frontend"
 
 # ML Service
 Start-Process powershell -ArgumentList "-NoExit","-Command","cd `"$(Join-Path $ScriptDir 'ml-service')`"; python app.py"
 Log "Started service: MLService"
 
 # Streamlit (corrigido path)
 Start-Process powershell -ArgumentList "-NoExit","-Command","cd `"$(Join-Path $ScriptDir 'streamlit-app')`"; streamlit run app.py"
 Log "Started service: Streamlit"
 
 # --- Health Checks ---
 Start-Sleep -Seconds 10
 $HealthEndpoints = @{
     "Next API" = "http://localhost:3000/api/health"
     "Backend"  = "http://localhost:$BackendPort/health"
     "TireOps"  = "http://localhost:$TireOpsPort/tires/health"
     "Streamlit"= "http://localhost:8501"
 }
 foreach ($name in $HealthEndpoints.Keys) {
     try {
         $resp = Invoke-WebRequest -Uri $HealthEndpoints[$name] -UseBasicParsing -TimeoutSec 5
         if ($resp.StatusCode -eq 200) { Log "$name health OK" } else { Log "$name health FAILED (Status $($resp.StatusCode))" }
     } catch {
         Log "$name health FAILED ($_ )"
     }
 }
 
 Log "Ultra-aggressive deploy completed successfully!"