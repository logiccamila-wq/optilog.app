# Guia de Limpeza Segura do Workspace

Este guia ajuda a reduzir o tamanho do workspace (>8GB) removendo caches e binários que não precisam estar no repositório e organizando artefatos pesados.

## Principais fontes de peso observadas
- Binários do Next SWC em `node_modules` (esperado, mas não devem ser versionados).
- Caches do Firebase Studio e build do Next dentro de `.firebase/*`.
- SDK do Flutter inteiro dentro do repositório (`frontend/src/flutter_windows_*`), incluindo `dart-sdk` e `engine` (~GBs).
- Arquivos executáveis como `frontend/Notion Setup*.exe` (>80MB) e compactados (`*.zip`, `*.7z`).
- Caches do `.next` e pacotes gerados (`webpack/*.pack`).
- Bases locais (`*.db`) e outros artefatos gerados.

## Regras de ignore (já atualizadas)
- `.gitignore` inclui agora: `.firebase/`, `.vercel/`, `.netlify/`, `.vscode/`, `.idea/`, `*.exe`, `*.msi`, `*.zip`, `*.7z`, `*.rar`, `*.db`, `frontend/src/flutter_*/*`, `android/.gradle/`, `android/.idea/`, `android/app/build/`.

## Limpeza segura (PowerShell)
- Mover itens grandes para `backups/` (recomendado):
```
# Crie pasta de backups se necessário
New-Item -ItemType Directory -Force -Path .\backups\manual-cleanup

# Mover executáveis e compactados não essenciais
Get-ChildItem -Path .\optilog-app\frontend -File -Include *.exe, *.zip, *.7z, *.rar -Recurse | ForEach-Object {
  Move-Item $_.FullName .\backups\manual-cleanup\
}

# Mover SDK Flutter fora do repo (ajuste o destino conforme sua máquina)
$flutterPath = ".\optilog-app\frontend\src\flutter_windows_3.24.3-stable"
if (Test-Path $flutterPath) { Move-Item $flutterPath "C:\tools\flutter\flutter_windows_3.24.3-stable" }
```

- Remover caches gerados (pode ser recriado facilmente):
```
# Remover caches do Next.js
Get-ChildItem -Path . -Directory -Filter .next -Recurse -Force | Remove-Item -Recurse -Force

# Remover caches do Firebase Studio
if (Test-Path ".\optilog-app\.firebase") { Remove-Item -Recurse -Force .\optilog-app\.firebase }

# Remover node_modules de projetos experimentais dentro de frontend
if (Test-Path ".\optilog-app\frontend\novo-projeto\node_modules") { Remove-Item -Recurse -Force .\optilog-app\frontend\novo-projeto\node_modules }
```

- Limpar objetos do Git (se necessário):
```
# Execute dentro de .\optilog-app se houver objetos grandes
cd .\optilog-app
# Compacta e limpa objetos soltos
git gc --prune=now --aggressive
```

## Boas práticas contínuas
- Não versione SDKs (Flutter, Android, etc.): mantenha-os fora do repo e configure paths locais.
- Não versione executáveis ou instaladores; armazene em `Downloads/` ou `backups/` fora do projeto.
- Caches (`.next`, `.firebase`) e `node_modules` não devem entrar no Git.
- Use `pnpm` ou workspaces para evitar duplicação de dependências em projetos múltiplos.
- Monitore tamanhos periodicamente:
```
# Top 25 arquivos (MB) e top 15 pastas (GB)
$ErrorActionPreference = "SilentlyContinue";
Write-Output "Top 25 files by size (MB):";
Get-ChildItem -Path . -Recurse -File -Force | Sort-Object Length -Descending | Select-Object -First 25 @{Name="SizeMB";Expression={[math]::Round($_.Length/1MB,2)}}, FullName;
Write-Output "`nTop 15 directories by size (GB):";
Get-ChildItem -Path . -Directory -Force | ForEach-Object { $size = (Get-ChildItem $_.FullName -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum; [PSCustomObject]@{Dir=$_.FullName; SizeGB=[math]::Round($size/1GB,2)} } | Sort-Object SizeGB -Descending | Select-Object -First 15
```

## Próximos passos
- Aplicar as remoções/movimentações acima.
- Confirmar que a app sobe normalmente com `npm run dev`.
- Se necessário, automatizar limpeza com script `scripts/cleanup.ps1` (podemos criar depois com modo `dry-run`).