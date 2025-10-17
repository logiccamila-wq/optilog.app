Param(
  [string]$ProjectId = "studio-4793785332-8ea02",
  [string]$AllowedOrigins = "https://studio-4793785332-8ea02.web.app,https://studio-4793785332-8ea02.firebaseapp.com",
  [string]$AdminEmails = ""
)

Write-Host "== Optilog Deploy Script ==" -ForegroundColor Cyan
Write-Host "Project: $ProjectId" -ForegroundColor Cyan

function Get-FirebaseCmd {
  $cmd = Get-Command firebase -ErrorAction SilentlyContinue
  if ($cmd) { return "firebase" }
  Write-Warning "Firebase CLI not found; using 'npx firebase-tools' (requires npm)."
  return "npx firebase-tools"
}

function Ensure-Project {
  param([string]$fb)
  Write-Host "Selecting Firebase project: $ProjectId" -ForegroundColor Gray
  & $fb use $ProjectId 2>&1 | Write-Host
  if ($LASTEXITCODE -ne 0) {
    Write-Warning "Not authenticated. Attempting 'firebase login'..."
    & $fb login 2>&1 | Write-Host
    & $fb use $ProjectId 2>&1 | Write-Host
    if ($LASTEXITCODE -ne 0) { throw "Failed to select project $ProjectId" }
  }
}

function Set-FunctionsEnv {
  param([string]$fb)
  Write-Host "Setting Functions env (region us-central1)" -ForegroundColor Gray
  if ($AllowedOrigins -and $AllowedOrigins.Length -gt 0) {
    & $fb functions:env:set ALLOWED_ORIGINS="$AllowedOrigins" --region=us-central1 2>&1 | Write-Host
  }
  if ($AdminEmails -and $AdminEmails.Length -gt 0) {
    & $fb functions:env:set ADMIN_EMAILS="$AdminEmails" --region=us-central1 2>&1 | Write-Host
  }
}

function Deploy-Functions {
  param([string]$fb)
  Write-Host "Deploying Functions (deleteAuthUserCallable, updateAuthUserCallable, importUsersFromCSV, geminiProxy, githubProxy)" -ForegroundColor Gray
  & $fb deploy --only functions:deleteAuthUserCallable,functions:updateAuthUserCallable,functions:importUsersFromCSV,functions:geminiProxy,functions:githubProxy 2>&1 | Write-Host
  if ($LASTEXITCODE -ne 0) { throw "Functions deploy failed." }
}

function Deploy-Hosting {
  param([string]$fb)
  Write-Host "Deploying Firebase Hosting (web frameworks)" -ForegroundColor Gray
  & $fb deploy --only hosting 2>&1 | Write-Host
  if ($LASTEXITCODE -ne 0) { throw "Hosting deploy failed." }
}

try {
  $fb = Get-FirebaseCmd
  Ensure-Project -fb $fb
  Set-FunctionsEnv -fb $fb
  Deploy-Functions -fb $fb
  Deploy-Hosting -fb $fb
  Write-Host "";
  Write-Host "== Deploy Completed ==" -ForegroundColor Green
  Write-Host ("Hosting: https://{0}.web.app" -f $ProjectId) -ForegroundColor Green
  Write-Host ("Callable: https://us-central1-{0}.cloudfunctions.net/deleteAuthUserCallable" -f $ProjectId) -ForegroundColor Green
  Write-Host ("Callable: https://us-central1-{0}.cloudfunctions.net/updateAuthUserCallable" -f $ProjectId) -ForegroundColor Green
  Write-Host ("Storage Trigger: importUsersFromCSV (ver Console → Functions → Logs)" ) -ForegroundColor Green
  Write-Host ("HTTP: https://us-central1-{0}.cloudfunctions.net/geminiProxy" -f $ProjectId) -ForegroundColor Green
  Write-Host ("HTTP: https://us-central1-{0}.cloudfunctions.net/githubProxy" -f $ProjectId) -ForegroundColor Green
} catch {
  Write-Error $_
  Write-Host "If you hit space errors (ENOSPC), free disk space and retry." -ForegroundColor Yellow
}