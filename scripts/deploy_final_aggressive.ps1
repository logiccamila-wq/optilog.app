# deploy_final_aggressive.ps1
# Uso (como Admin): pwsh -NoProfile -ExecutionPolicy Bypass -File ".\deploy_final_aggressive.ps1"
param(
    [int]$NextPort = 3000,
    [int]$BackendPort = 3011,
    [int]$TireOpsPort = 3001,
    [int]$StreamlitPort = 8501,
    [switch]$FullResetDb
)

function Log($m){ $t = Get-Date -Format "yyyy-MM-dd HH:mm:ss"; "$t $m" | Tee-Object -FilePath (Join-Path $PSScriptRoot "deploy_final_aggressive.log") -Append }

# Resolve script dir
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Log "=== START deploy_final_aggressive ==="

# mata processos nas portas (seguro)
function Kill-Port([int]$p){
    try {
        $conns = Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue
        if ($null -eq $conns) { Log "No process listening on $p"; return }
        $procIds = $conns | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($procId in $procIds) {
            try {
                Log "Killing PID $procId on port $p"
                Stop-Process -Id $procId -Force -ErrorAction Stop
            } catch {
                $errMsg = $_.Exception.Message
                Log "Could not kill ${procId}: $errMsg"
            }
        }
    } catch {
        $errMsg = $_.Exception.Message
        Log "Kill-Port error ${p}: $errMsg"
    }
}
Kill-Port $NextPort; Kill-Port $BackendPort; Kill-Port $TireOpsPort; Kill-Port $StreamlitPort

# limpeza agressiva de tmp/prisma que dá EPERM
$prismaTmp = Join-Path $ScriptDir "tire-ops\backend\node_modules\.prisma\client"
if (Test-Path $prismaTmp) {
    Log "Removing prisma tmp files (if present)"
    Get-ChildItem -Path $prismaTmp -Filter "query_engine*" -ErrorAction SilentlyContinue | ForEach-Object {
        try {
            Remove-Item -LiteralPath $_.FullName -Force -ErrorAction Stop
            $name = $_.Name
            Log "Removed $name"
        } catch {
            $errMsg = $_.Exception.Message
            $name = $_.Name
            Log "Could not rm ${name}: $errMsg"
        }
    }
}

# helper: ensure package has dev script (if next present -> next dev)
function Ensure-DevScript($dir) {
    $pkg = Join-Path $dir "package.json"
    if (-not (Test-Path $pkg)) { return $null }
    try {
        $json = Get-Content $pkg -Raw | ConvertFrom-Json
        if ($null -eq $json.scripts) { $json.scripts = @{} }
        if ($json.scripts.dev) { return $true }
        # detecta framework
        $deps = @{}
        if ($json.dependencies) { $json.dependencies.PSObject.Properties | ForEach-Object { $deps[$_.Name] = $_.Value } }
        if ($json.devDependencies) { $json.devDependencies.PSObject.Properties | ForEach-Object { $deps[$_.Name] = $_.Value } }
        if ($deps.ContainsKey("next")) { $json.scripts.dev = "next dev" }
        elseif ($deps.ContainsKey("vite")) { $json.scripts.dev = "vite" }
        elseif ($deps.ContainsKey("react-scripts")) { $json.scripts.dev = "react-scripts start" }
        else { return $false }
        $json | ConvertTo-Json -Depth 10 | Set-Content -Path $pkg -Encoding UTF8
        Log "Added dev script to $pkg"
        return $true
    } catch {
        $errMsg = $_.Exception.Message
        Log "Ensure-DevScript error for ${dir}: $errMsg"; return $false
    }
}

# modules list
$modules = @(
    @{name="optilog-app"; path=Join-Path $ScriptDir "optilog-app"},
    @{name="optilog-app-backend"; path=Join-Path $ScriptDir "optilog-app\backend"},
    @{name="tire-ops-backend"; path=Join-Path $ScriptDir "tire-ops\backend"},
    @{name="tire-ops-frontend"; path=Join-Path $ScriptDir "tire-ops\frontend"}
)
# install deps quickly (ci)
foreach ($m in $modules) {
    if (Test-Path (Join-Path $m.path "package.json")) {
        Log "Installing deps for $($m.name)"
        Push-Location $m.path
        try {
            npm ci --no-audit --no-fund 2>&1 | Tee-Object -FilePath (Join-Path $ScriptDir "deploy_final_aggressive.log") -Append
        } catch {
            $errMsg = $_.Exception.Message
            Log "npm ci failed for $($m.name): $errMsg"
        }
        Pop-Location
    } else { Log "No package.json in $($m.name)" }
}

# special: ensure dev script for tire-ops frontend and optilog-app if missing (fast path)
Ensure-DevScript (Join-Path $ScriptDir "tire-ops\frontend") | Out-Null
Ensure-DevScript (Join-Path $ScriptDir "optilog-app") | Out-Null

# prisma regen for tire-ops backend
if (Test-Path (Join-Path $ScriptDir "tire-ops\backend\package.json")) {
    Push-Location (Join-Path $ScriptDir "tire-ops\backend")
    try {
        Log "Running prisma generate"
        npx prisma generate 2>&1 | Tee-Object -FilePath (Join-Path $ScriptDir "deploy_final_aggressive.log") -Append
    } catch {
        $errMsg = $_.Exception.Message
        Log "prisma generate error: $errMsg"
    }
    Pop-Location
}

# optional full reset db if flag
if ($FullResetDb) {
    if (Test-Path (Join-Path $ScriptDir "optilog-app\backend\package.json")) {
        Push-Location (Join-Path $ScriptDir "optilog-app\backend")
        Log "Running db:setup-full"
        try {
            npm run db:setup-full 2>&1 | Tee-Object -FilePath (Join-Path $ScriptDir "deploy_final_aggressive.log") -Append
        } catch {
            $errMsg = $_.Exception.Message
            Log "db:setup-full error: $errMsg"
        }
        Pop-Location
    } else { Log "db:setup-full skipped (no backend package.json)" }
}

# Helper to start a module in a new window using detected script (prefers dev)
function Start-Module($dir) {
    if (-not (Test-Path $dir)) { Log "Start-Module: missing $dir"; return }
    $pkg = Join-Path $dir "package.json"
    $cmd = $null
    if (Test-Path $pkg) {
        try {
            $json = Get-Content $pkg -Raw | ConvertFrom-Json
            if ($json.scripts.dev) { $cmd = "npm run dev" }
            elseif ($json.scripts.start) { $cmd = "npm start" }
            else {
                # fallback: try common entry files
                if (Test-Path (Join-Path $dir "app.js")) { $cmd = "node app.js" }
                elseif (Test-Path (Join-Path $dir "server.js")) { $cmd = "node server.js" }
            }
        } catch {
            $errMsg = $_.Exception.Message
            Log "Start-Module read package.json error: $errMsg"
        }
    }
    if ($cmd) {
        Log "Starting $dir with '$cmd'"
        Start-Process -FilePath pwsh -ArgumentList "-NoProfile","-NoExit","-Command",$cmd -WorkingDirectory $dir
    } else { Log "No start command found for $dir" }
}

# Start services
Start-Module (Join-Path $ScriptDir "optilog-app")        # Next (dev if available)
Start-Module (Join-Path $ScriptDir "optilog-app\backend")# backend
Start-Module (Join-Path $ScriptDir "tire-ops\backend")   # tire-ops backend
Start-Module (Join-Path $ScriptDir "tire-ops\frontend")  # tire-ops frontend

# Start ML if exists
$ml = Join-Path $ScriptDir "ml-service"
if ((Test-Path (Join-Path $ml "app.py")) -and (Get-Command python -ErrorAction SilentlyContinue)) {
    Log "Starting ML service"
    Start-Process -FilePath pwsh -ArgumentList "-NoProfile","-NoExit","-Command","python app.py" -WorkingDirectory $ml
} else { Log "ML not started (no app.py or python missing)" }

# Start Streamlit
$stream = Join-Path $ScriptDir "optilog-app\streamlit-app"
if ((Test-Path (Join-Path $stream "app.py")) -and (Get-Command python -ErrorAction SilentlyContinue)) {
    Log "Starting Streamlit"
    Start-Process -FilePath pwsh -ArgumentList "-NoProfile","-NoExit","-Command","python -m streamlit run app.py --server.port $StreamlitPort --server.headless true" -WorkingDirectory $stream
} else { Log "Streamlit not started (no app.py or python missing)" }

# wait and health-checks with retries
Start-Sleep -Seconds 6
function CheckUrl($url) {
    $try = 0
    while ($try -lt 10) {
        try { $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 6 -ErrorAction Stop; return $r.StatusCode } catch {}
        Start-Sleep -Seconds (2 * ($try + 1))
        $try++
    }
    return $null
}

$nextH = CheckUrl ("http://localhost:{0}/api/health" -f $NextPort)
$backH = CheckUrl ("http://localhost:{0}/ping" -f $BackendPort)
$tireH = CheckUrl ("http://localhost:{0}/api/health" -f $TireOpsPort)
$strH  = CheckUrl ("http://localhost:{0}/" -f $StreamlitPort)

Log ("Next health: {0}" -f ($nextH -ne $null ? $nextH : "FAIL"))
Log ("Backend health: {0}" -f ($backH -ne $null ? $backH : "FAIL"))
Log ("TireOps health: {0}" -f ($tireH -ne $null ? $tireH : "FAIL"))
Log ("Streamlit health: {0}" -f ($strH -ne $null ? $strH : "FAIL"))

Log "=== END deploy_final_aggressive ==="
