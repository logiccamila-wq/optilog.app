#!/bin/bash
set -euo pipefail

echo "======================================"
echo "Optilog.app Codespace Setup"
echo "======================================"

install_deps() {
  local dir="$1"
  if [ -d "$dir" ]; then
    echo "[postcreate] Installing dependencies in $dir..."
    (cd "$dir" && if [ -f package-lock.json ]; then npm ci || npm install; else npm install; fi)
  else
    echo "[postcreate] Skipping $dir (directory not found)"
  fi
}

# Install root dependencies (required)
install_deps .

# Install optional subdirectory dependencies (if they exist)
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

# Cleanup to save space
echo "[postcreate] Cleaning up to save storage..."
rm -rf /tmp/* 2>/dev/null || true
npm cache clean --force 2>/dev/null || true

# Show storage usage
echo "======================================"
echo "Current workspace size:"
du -sh /workspaces/${CODESPACE_NAME:-optilog.app} 2>/dev/null || du -sh . 2>/dev/null || echo "Unknown"
echo "======================================"
echo "✅ Setup complete!"
echo "📖 See CODESPACES_MANAGEMENT.md for tips on managing codespace storage"
echo "======================================"

