# Deployment Scripts

This folder contains deployment/ops scripts for the Optilog app.

## deploy_final_aggressive.ps1

A PowerShell script that orchestrates local boot of all services with:

- Port killing (to avoid conflicts)
- Dependency install (npm/yarn/pip)
- Parallel start for Next.js, Backend, Tire-Ops, ML and Streamlit
- Health checks with retries
- Detailed logging to `deploy_final_aggressive.log`

Quick start (PowerShell from repo root):

```
pwsh -NoProfile -ExecutionPolicy Bypass -File ".\scripts\deploy_final_aggressive.ps1" -FullResetDb
```

Flags:

- `-FullResetDb`: runs a full DB reset routine if available, then starts services

Logs:

- Main log at `c:\Users\Pichau\devoptilog-app\deploy_final_aggressive.log`

Notes:

- If Streamlit is used, ensure Python and dependencies are installed
- For custom ports, adapt the script variables inside as needed

## Legacy scripts

Older scripts like `deploy_full_ultra.ps1` and `setup_full_ultra.ps1` remain for reference and may be deprecated in favor of `deploy_final_aggressive.ps1`.
