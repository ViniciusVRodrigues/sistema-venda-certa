#!/bin/bash

# Sistema Venda Certa - API Test Script
# Este script testa todos os endpoints da API

BASE_URL="http://localhost:3001/api"
TOKEN=""

echo "🚀 Testando API do Sistema Venda Certa"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_test() {
    echo -e "${BLUE}🔍 Testando: $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Test health check
print_test "Health Check"
curl -s "$BASE_URL/health" | jq '.'
if [ $? -eq 0 ]; then
    print_success "Health check passou"
else
    print_error "Health check falhou"
fi
echo

# Create a test client
print_test "Criando cliente de teste"
CLIENT_RESPONSE=$(curl -s -X POST "$BASE_URL/clientes" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João da Silva Teste",
    "email": "joao.teste@example.com",
    "senha": "123456789",
    "telefone": "(11) 99999-9999"
  }')

echo "$CLIENT_RESPONSE" | jq '.'
CLIENT_ID=$(echo "$CLIENT_RESPONSE" | jq -r '.data.id')
print_info "Cliente criado com ID: $CLIENT_ID"
echo

# Test authentication
print_test "Fazendo login"
AUTH_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao.teste@example.com",
    "senha": "123456789"
  }')

echo "$AUTH_RESPONSE" | jq '.'
TOKEN=$(echo "$AUTH_RESPONSE" | jq -r '.data.token')
print_info "Token obtido: ${TOKEN:0:50}..."
echo

# Test protected profile endpoint
print_test "Obtendo perfil do usuário"
curl -s "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo

# Create a test category
print_test "Criando categoria de teste"
CATEGORY_RESPONSE=$(curl -s -X POST "$BASE_URL/categorias" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nome": "Eletrônicos",
    "slug": "eletronicos",
    "descricao": "Categoria de produtos eletrônicos",
    "cor": "#FF5722",
    "destaque": true
  }')

echo "$CATEGORY_RESPONSE" | jq '.'
CATEGORY_ID=$(echo "$CATEGORY_RESPONSE" | jq -r '.data.id')
print_info "Categoria criada com ID: $CATEGORY_ID"
echo

# Test category tree
print_test "Obtendo árvore de categorias"
curl -s "$BASE_URL/categorias/tree" | jq '.'
echo

# Create a test product
print_test "Criando produto de teste"
PRODUCT_RESPONSE=$(curl -s -X POST "$BASE_URL/produtos" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nome": "Smartphone Samsung Galaxy",
    "descricao": "Smartphone com 128GB de armazenamento e câmera tripla",
    "preco": 1299.99,
    "precoPromocional": 999.99,
    "categoria": "Eletrônicos",
    "marca": "Samsung",
    "estoque": 50,
    "destaque": true,
    "tags": "smartphone, celular, samsung, android"
  }')

echo "$PRODUCT_RESPONSE" | jq '.'
PRODUCT_ID=$(echo "$PRODUCT_RESPONSE" | jq -r '.data.id')
print_info "Produto criado com ID: $PRODUCT_ID"
echo

# Test product listing
print_test "Listando produtos"
curl -s "$BASE_URL/produtos?page=1&limit=10" | jq '.'
echo

# Test product search
print_test "Buscando produtos por 'Samsung'"
curl -s "$BASE_URL/produtos?search=Samsung" | jq '.'
echo

# Create a test order
print_test "Criando pedido de teste"
ORDER_RESPONSE=$(curl -s -X POST "$BASE_URL/pedidos" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"clienteId\": $CLIENT_ID,
    \"metodoPagamento\": \"pix\",
    \"itens\": [
      {
        \"produtoId\": $PRODUCT_ID,
        \"quantidade\": 2,
        \"observacoes\": \"Produto em ótimo estado\"
      }
    ],
    \"observacoes\": \"Entrega rápida, por favor\",
    \"telefoneContato\": \"(11) 99999-9999\"
  }")

echo "$ORDER_RESPONSE" | jq '.'
ORDER_ID=$(echo "$ORDER_RESPONSE" | jq -r '.data.id')
print_info "Pedido criado com ID: $ORDER_ID"
echo

# Test order listing
print_test "Listando pedidos"
curl -s "$BASE_URL/pedidos" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo

# Update order status
print_test "Atualizando status do pedido para 'confirmado'"
curl -s -X PUT "$BASE_URL/pedidos/$ORDER_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "confirmado"
  }' | jq '.'
echo

# Test order statistics
print_test "Obtendo estatísticas de pedidos"
curl -s "$BASE_URL/pedidos/stats" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo

# Test rate limiting (should fail after too many requests)
print_test "Testando rate limiting (fazendo muitas requisições)"
for i in {1..5}; do
    AUTH_TEST=$(curl -s -X POST "$BASE_URL/auth/login" \
      -H "Content-Type: application/json" \
      -d '{
        "email": "wrong@email.com",
        "senha": "wrongpassword"
      }')
    echo "Tentativa $i: $(echo "$AUTH_TEST" | jq -r '.message')"
done
echo

print_success "Testes concluídos!"
print_info "Para limpar os dados de teste, você pode executar:"
print_info "- DELETE $BASE_URL/pedidos/$ORDER_ID"
print_info "- DELETE $BASE_URL/produtos/$PRODUCT_ID"
print_info "- DELETE $BASE_URL/categorias/$CATEGORY_ID"
print_info "- DELETE $BASE_URL/clientes/$CLIENT_ID"