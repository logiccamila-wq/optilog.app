#!/bin/bash

echo "🚀 OptiLog.app - Deploy Rápido Netlify"
echo "======================================"
echo ""

# Verificar se netlify CLI está instalado
if ! command -v netlify &> /dev/null
then
    echo "📦 Instalando Netlify CLI..."
    npm install -g netlify-cli
fi

echo "✅ Netlify CLI instalado!"
echo ""

# Login
echo "🔐 Fazendo login no Netlify..."
netlify login

echo ""
echo "🏗️  Linkando projeto ao site Netlify..."
netlify link

echo ""
echo "⚙️  Configurando variáveis de ambiente..."
echo ""
echo "Por favor, configure as seguintes variáveis no dashboard do Netlify:"
echo "https://app.netlify.com → Seu Site → Site settings → Environment variables"
echo ""
echo "Variáveis necessárias:"
echo "  - DATABASE_URL"
echo "  - DATABASE_URL_UNPOOLED"
echo "  - JWT_SECRET"
echo "  - NEXTAUTH_SECRET"
echo "  - NEXT_PUBLIC_API_URL"
echo ""

read -p "Pressione ENTER quando terminar de configurar as variáveis... "

echo ""
echo "🚀 Iniciando deploy..."
netlify deploy --prod

echo ""
echo "✅ Deploy concluído!"
echo ""
echo "🌐 Acesse seu site em: https://app.netlify.com"
echo ""
