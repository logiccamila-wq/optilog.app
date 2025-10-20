#!/bin/bash
set -euo pipefail

install_deps() {
  local dir="$1"
  echo "[postcreate] Installing dependencies in $dir..."
  (cd "$dir" && if [ -f package-lock.json ]; then npm ci || npm install; else npm install; fi)
}

install_deps .
install_deps "frontend"
install_deps "functions"

# Install Playwright browsers and dependencies (cache to workspace)
export PLAYWRIGHT_BROWSERS_PATH="/workspaces/.cache/ms-playwright"
if command -v npx >/dev/null 2>&1; then
  echo "[postcreate] Installing Playwright Chromium with deps..."
  npx --yes playwright install --with-deps chromium || true
else
  echo "[postcreate] Skipping Playwright install (npx not found)"
fi

echo "[postcreate] Done."
