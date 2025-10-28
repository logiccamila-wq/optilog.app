#!/bin/bash
# Script para limpar cache e arquivos temporários no Codespace
# Executar: bash scripts/cleanup-codespace.sh

echo "🧹 Limpando arquivos desnecessários do Codespace..."
echo ""

# Calcular tamanho inicial
INITIAL_SIZE=$(du -sh . 2>/dev/null | awk '{print $1}')
echo "📊 Tamanho inicial: $INITIAL_SIZE"
echo ""

# Função para limpar e reportar
clean_dir() {
  local dir=$1
  local desc=$2
  if [ -d "$dir" ] || [ -f "$dir" ]; then
    local size=$(du -sh "$dir" 2>/dev/null | awk '{print $1}')
    rm -rf "$dir"
    echo "✅ Removido $desc ($size)"
  fi
}

# Limpar caches e builds
clean_dir ".next" "Next.js build cache"
clean_dir "node_modules/.cache" "NPM cache"
clean_dir ".turbo" "Turbo cache"
clean_dir "playwright-report" "Playwright reports"
clean_dir "test-results" "Test results"
clean_dir "coverage" "Coverage reports"
clean_dir ".eslintcache" "ESLint cache"
clean_dir "*.tsbuildinfo" "TypeScript build info"
clean_dir ".tmp" "Temporary files"
clean_dir "tmp" "Temporary files"

# Limpar logs
echo "🗑️  Limpando logs..."
find . -name "*.log" -type f -delete 2>/dev/null || true
find . -name "npm-debug.log*" -type f -delete 2>/dev/null || true
find . -name "yarn-debug.log*" -type f -delete 2>/dev/null || true
find . -name "yarn-error.log*" -type f -delete 2>/dev/null || true

# Limpar swap files
echo "🗑️  Limpando swap files..."
find . -name "*.swp" -type f -delete 2>/dev/null || true
find . -name "*.swo" -type f -delete 2>/dev/null || true
find . -name "*~" -type f -delete 2>/dev/null || true

# Limpar npm cache global
echo "🧹 Limpando cache global do npm..."
npm cache clean --force 2>/dev/null || true

# Limpar /tmp
echo "🧹 Limpando /tmp..."
rm -rf /tmp/* 2>/dev/null || true

echo ""
echo "✨ Limpeza concluída!"
echo ""

# Calcular tamanho final
FINAL_SIZE=$(du -sh . 2>/dev/null | awk '{print $1}')
echo "📊 Tamanho final: $FINAL_SIZE"
echo ""
echo "💡 Dica: Execute 'npm ci' para reinstalar dependências limpas"
echo "💡 Para verificar tamanho detalhado: du -sh */"
echo ""
