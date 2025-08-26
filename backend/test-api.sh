#!/bin/bash

# Script para testar a API básica
echo "🚀 Testando API Sistema Venda Certa..."

# Verificar se o servidor está rodando
echo "📡 Testando health check..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/health)

if [ "$response" -eq 200 ]; then
    echo "✅ Health check passou"
else
    echo "❌ Servidor não está rodando na porta 3001"
    echo "   Execute: cd backend && npm run dev"
    exit 1
fi

# Testar listagem de clientes
echo "👥 Testando listagem de clientes..."
curl -s http://localhost:3001/api/clientes | jq '.' > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Endpoint de listagem funcionando"
else
    echo "❌ Erro na listagem de clientes"
fi

# Testar criação de cliente
echo "➕ Testando criação de cliente..."
response=$(curl -s -X POST http://localhost:3001/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste Cliente",
    "email": "teste@email.com",
    "senha": "123456",
    "telefone": "(11) 99999-9999"
  }' \
  -w "%{http_code}")

if [[ "$response" == *"201"* ]]; then
    echo "✅ Criação de cliente funcionando"
else
    echo "⚠️  Criação pode ter falhado (possivelmente cliente já existe)"
fi

echo "🎉 Testes básicos concluídos!"