Param(
  [Parameter(Mandatory=$false)] [string]$ProjectId,
  [Parameter(Mandatory=$false)] [string]$ApiKey,
  [Parameter(Mandatory=$false)] [string]$Repo
)

Write-Host "==> Configurando secrets/vars do GitHub para Neon..." -ForegroundColor Cyan

# Verifica GH CLI
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Error "GitHub CLI (gh) não encontrado. Instale com: https://cli.github.com/"
  exit 1
}

# Detecta repo atual se não informado
if (-not $Repo) {
  try {
    $Repo = (git config --get remote.origin.url)
    if ($Repo -match 'github.com[:/](.+?)(?:\.git)?$') {
      $Repo = $Matches[1]
    }
  } catch {
    Write-Warning "Não foi possível detectar repo via git; use o parâmetro -Repo org/nome"
  }
}

if (-not $Repo) {
  Write-Error "Repo não definido. Use -Repo org/nome ou execute dentro de um clone com remote origin."
  exit 1
}

# Sinaliza o contexto do repositório para gh
& gh repo view $Repo | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Error "Falha ao acessar repo $Repo com gh. Verifique se está autenticado: gh auth login"
  exit 1
}

# Obtém valores de parâmetros ou variáveis de ambiente
if (-not $ProjectId) { $ProjectId = $env:NEON_PROJECT_ID }
if (-not $ApiKey) { $ApiKey = $env:NEON_API_KEY }

if (-not $ProjectId -or -not $ApiKey) {
  Write-Error "NEON_PROJECT_ID e/ou NEON_API_KEY ausentes. Forneça via parâmetros ou env vars."
  exit 1
}

Write-Host "-> Definindo variável de repositório NEON_PROJECT_ID..."
& gh variable set NEON_PROJECT_ID -b "$ProjectId" -R "$Repo"
if ($LASTEXITCODE -ne 0) { Write-Error "Falha ao setar NEON_PROJECT_ID"; exit 1 }

Write-Host "-> Definindo secret NEON_API_KEY..."
& gh secret set NEON_API_KEY -b "$ApiKey" -R "$Repo"
if ($LASTEXITCODE -ne 0) { Write-Error "Falha ao setar NEON_API_KEY"; exit 1 }

Write-Host "Pronto! Secrets/vars configurados. Workflows de Neon funcionarão em PRs." -ForegroundColor Green