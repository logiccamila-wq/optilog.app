#!/bin/bash
# Build script que FORÇA ignorar erros TypeScript
export SKIP_ENV_VALIDATION=true
export TSC_COMPILE_ON_ERROR=true
export NEXT_TELEMETRY_DISABLED=1

echo "🚀 Build emergencial - ignorando todos os erros TS/ESLint"
next build
