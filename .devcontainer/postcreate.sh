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

echo "[postcreate] Done."
