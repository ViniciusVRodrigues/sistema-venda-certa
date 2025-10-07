# Guia de Testes - API Sistema Venda Certa

Este documento contém exemplos e procedimentos para testar manualmente todos os endpoints da API.

## 📋 Pré-requisitos

1. Backend rodando: `npm run dev` na pasta `backend`
2. Banco de dados MySQL configurado e populado
3. Variáveis de ambiente configuradas (`.env`)

## 🔧 Preparação

### 1. Verificar Health Check
```bash
curl http://localhost:3001/api/health
```

**Resposta Esperada:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T12:00:00.000Z",
  "environment": "development"
}
```

### 2. Autenticar (obter token JWT)
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "senha": "senha123"
  }'
```

**Copiar o token** retornado para usar nos testes seguintes.

**Variável para testes:**
```bash
export TOKEN="seu-token-aqui"
```

---

## 👥 Testes - CRUD Usuários

### Teste 1: Listar Todos os Usuários (GET)
```bash
curl -X GET http://localhost:3001/api/usuarios \
  -H "Authorization: Bearer $TOKEN"
```

**Validações:**
- ✅ Status: 200
- ✅ Retorna array de usuários
- ✅ Cada usuário contém: id, nome, email, cargo, status
- ✅ Inclui relacionamento com endereços

### Teste 2: Buscar Usuário por ID (GET)
```bash
curl -X GET http://localhost:3001/api/usuarios/1 \
  -H "Authorization: Bearer $TOKEN"
```

**Validações:**
- ✅ Status: 200 para ID existente
- ✅ Status: 404 para ID inexistente
- ✅ Retorna objeto de usuário completo
- ✅ Inclui array de endereços

**Teste de Erro:**
```bash
# Buscar usuário inexistente
curl -X GET http://localhost:3001/api/usuarios/99999 \
  -H "Authorization: Bearer $TOKEN"
```
- ✅ Status: 404
- ✅ Mensagem: "Usuário não encontrado"

### Teste 3: Criar Novo Usuário (POST)
```bash
curl -X POST http://localhost:3001/api/usuarios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nome": "Carlos Teste",
    "email": "carlos.teste@email.com",
    "cargo": "customer",
    "numeroCelular": "(11) 91111-2222",
    "status": 1
  }'
```

**Validações:**
- ✅ Status: 200
- ✅ Retorna usuário criado com ID
- ✅ Campos criados corretamente
- ✅ Valores default aplicados (totalPedidos: 0, totalGasto: 0.00)

**Teste de Validação - Campos Obrigatórios:**
```bash
# Sem nome
curl -X POST http://localhost:3001/api/usuarios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "email": "teste@email.com",
    "cargo": "customer"
  }'
```
- ✅ Status: 400
- ✅ Erro: "Nome é obrigatório"

**Teste de Validação - Email Inválido:**
```bash
curl -X POST http://localhost:3001/api/usuarios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nome": "Teste",
    "email": "email-invalido",
    "cargo": "customer"
  }'
```
- ✅ Status: 400
- ✅ Erro: "Email deve ser válido"

**Teste de Validação - Cargo Inválido:**
```bash
curl -X POST http://localhost:3001/api/usuarios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nome": "Teste",
    "email": "teste@email.com",
    "cargo": "gerente"
  }'
```
- ✅ Status: 400
- ✅ Erro: "Cargo deve ser customer, admin ou delivery"

**Teste de Validação - Email Duplicado:**
```bash
curl -X POST http://localhost:3001/api/usuarios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nome": "Teste Duplicado",
    "email": "joao@email.com",
    "cargo": "customer"
  }'
```
- ✅ Status: 400
- ✅ Erro: "Email já está em uso"

### Teste 4: Atualizar Usuário (PUT)

**Atualização Completa:**
```bash
curl -X PUT http://localhost:3001/api/usuarios/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nome": "João Silva Atualizado",
    "email": "joao.novo@email.com",
    "cargo": "admin",
    "numeroCelular": "(11) 99999-8888",
    "status": 1
  }'
```
- ✅ Status: 200
- ✅ Retorna usuário atualizado
- ✅ Todos os campos atualizados

**Atualização Parcial:**
```bash
curl -X PUT http://localhost:3001/api/usuarios/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "numeroCelular": "(11) 98888-7777"
  }'
```
- ✅ Status: 200
- ✅ Apenas campo especificado é atualizado
- ✅ Outros campos mantém valores anteriores

**Teste de Erro:**
```bash
# Atualizar usuário inexistente
curl -X PUT http://localhost:3001/api/usuarios/99999 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nome": "Teste"
  }'
```
- ✅ Status: 404
- ✅ Erro: "Usuário não encontrado"

### Teste 5: Deletar Usuário (DELETE)
```bash
curl -X DELETE http://localhost:3001/api/usuarios/1 \
  -H "Authorization: Bearer $TOKEN"
```

**Validações:**
- ✅ Status: 200
- ✅ Mensagem: "Usuário deletado com sucesso"

**Teste de Erro:**
```bash
# Deletar usuário inexistente
curl -X DELETE http://localhost:3001/api/usuarios/99999 \
  -H "Authorization: Bearer $TOKEN"
```
- ✅ Status: 404
- ✅ Erro: "Usuário não encontrado"

### Teste 6: Listar Endereços do Usuário (GET)
```bash
curl -X GET http://localhost:3001/api/usuarios/1/enderecos \
  -H "Authorization: Bearer $TOKEN"
```

**Validações:**
- ✅ Status: 200
- ✅ Retorna array de endereços
- ✅ Cada endereço contém: id, rua, numero, bairro, cidade, estado, cep

---

## 📦 Testes - CRUD Produtos

### Teste 1: Listar Todos os Produtos (GET)
```bash
curl -X GET http://localhost:3001/api/produtos \
  -H "Authorization: Bearer $TOKEN"
```

**Validações:**
- ✅ Status: 200
- ✅ Retorna array de produtos
- ✅ Cada produto contém: id, nome, preco, estoque, categoria
- ✅ Inclui relacionamento com categoria e avaliações

### Teste 2: Buscar Produto por ID (GET)
```bash
curl -X GET http://localhost:3001/api/produtos/1 \
  -H "Authorization: Bearer $TOKEN"
```

**Validações:**
- ✅ Status: 200 para ID existente
- ✅ Status: 404 para ID inexistente
- ✅ Retorna objeto de produto completo
- ✅ Inclui categoria e avaliações

**Teste de Erro:**
```bash
# Buscar produto inexistente
curl -X GET http://localhost:3001/api/produtos/99999 \
  -H "Authorization: Bearer $TOKEN"
```
- ✅ Status: 404
- ✅ Erro: "Produto não encontrado"

### Teste 3: Criar Novo Produto (POST)
```bash
curl -X POST http://localhost:3001/api/produtos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "sku": "PROD-TEST-001",
    "nome": "Produto de Teste",
    "descricao": "Descrição completa do produto de teste",
    "descricaoResumida": "Produto de Teste",
    "preco": 99.90,
    "medida": "un",
    "estoque": 50,
    "status": 1,
    "tags": "teste,exemplo",
    "fk_categoria_id": 1
  }'
```

**Validações:**
- ✅ Status: 200
- ✅ Retorna produto criado com ID
- ✅ Todos os campos criados corretamente
- ✅ Valores default aplicados (estoque: 0, status: 1)

**Teste de Validação - Campos Obrigatórios:**
```bash
# Sem nome
curl -X POST http://localhost:3001/api/produtos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "preco": 100.00,
    "medida": "un",
    "fk_categoria_id": 1
  }'
```
- ✅ Status: 400
- ✅ Erro: "Dados inválidos. Nome, preço e categoria são obrigatórios."

**Teste de Validação - Sem Preço:**
```bash
curl -X POST http://localhost:3001/api/produtos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nome": "Produto Teste",
    "medida": "un",
    "fk_categoria_id": 1
  }'
```
- ✅ Status: 400
- ✅ Erro: "Preço é obrigatório"

**Teste de Validação - Preço Inválido:**
```bash
curl -X POST http://localhost:3001/api/produtos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nome": "Produto Teste",
    "preco": -10.00,
    "medida": "un",
    "fk_categoria_id": 1
  }'
```
- ✅ Status: 400
- ✅ Erro: "Preço deve ser um número entre 0.00 e 99999999.99"

**Teste de Validação - SKU Duplicado:**
```bash
curl -X POST http://localhost:3001/api/produtos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "sku": "PROD-001",
    "nome": "Produto com SKU Duplicado",
    "preco": 100.00,
    "medida": "un",
    "fk_categoria_id": 1
  }'
```
- ✅ Status: 400
- ✅ Erro: "SKU já está em uso"

### Teste 4: Atualizar Produto (PUT)

**Atualização Completa:**
```bash
curl -X PUT http://localhost:3001/api/produtos/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nome": "Produto Atualizado",
    "descricao": "Nova descrição completa",
    "preco": 199.90,
    "medida": "un",
    "estoque": 100,
    "status": 1,
    "tags": "atualizado,novo",
    "fk_categoria_id": 1
  }'
```
- ✅ Status: 200
- ✅ Retorna produto atualizado
- ✅ Todos os campos atualizados

**Atualização Parcial:**
```bash
curl -X PUT http://localhost:3001/api/produtos/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "preco": 149.90,
    "estoque": 75
  }'
```
- ✅ Status: 200
- ✅ Apenas campos especificados atualizados
- ✅ Outros campos mantém valores anteriores

**Teste de Erro:**
```bash
# Atualizar produto inexistente
curl -X PUT http://localhost:3001/api/produtos/99999 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "preco": 100.00
  }'
```
- ✅ Status: 404
- ✅ Erro: "Produto não encontrado"

### Teste 5: Deletar Produto (DELETE)
```bash
curl -X DELETE http://localhost:3001/api/produtos/1 \
  -H "Authorization: Bearer $TOKEN"
```

**Validações:**
- ✅ Status: 200
- ✅ Mensagem: "Produto deletado com sucesso"

**Teste de Erro:**
```bash
# Deletar produto inexistente
curl -X DELETE http://localhost:3001/api/produtos/99999 \
  -H "Authorization: Bearer $TOKEN"
```
- ✅ Status: 404
- ✅ Erro: "Produto não encontrado"

### Teste 6: Listar Produtos por Categoria (GET)
```bash
curl -X GET http://localhost:3001/api/produtos/categoria/1 \
  -H "Authorization: Bearer $TOKEN"
```

**Validações:**
- ✅ Status: 200
- ✅ Retorna array de produtos da categoria
- ✅ Todos os produtos têm fk_categoria_id = 1
- ✅ Inclui relacionamento com categoria

### Teste 7: Listar Avaliações do Produto (GET)
```bash
curl -X GET http://localhost:3001/api/produtos/1/avaliacoes \
  -H "Authorization: Bearer $TOKEN"
```

**Validações:**
- ✅ Status: 200
- ✅ Retorna array de avaliações
- ✅ Cada avaliação contém: id, avaliacao (1-5), comentario, usuario

---

## 📊 Resumo dos Testes

### CRUD Usuários
- ✅ GET /api/usuarios - Listar todos
- ✅ GET /api/usuarios/:id - Buscar por ID
- ✅ POST /api/usuarios - Criar (validação completa)
- ✅ PUT /api/usuarios/:id - Atualizar (parcial)
- ✅ DELETE /api/usuarios/:id - Deletar
- ✅ GET /api/usuarios/:id/enderecos - Endereços

**Total:** 6 endpoints testados

### CRUD Produtos
- ✅ GET /api/produtos - Listar todos
- ✅ GET /api/produtos/:id - Buscar por ID
- ✅ POST /api/produtos - Criar (validação completa)
- ✅ PUT /api/produtos/:id - Atualizar (parcial)
- ✅ DELETE /api/produtos/:id - Deletar
- ✅ GET /api/produtos/categoria/:categoriaId - Por categoria
- ✅ GET /api/produtos/:id/avaliacoes - Avaliações

**Total:** 7 endpoints testados

---

## 🔍 Testes de Validação

### Usuários
1. ✅ Nome obrigatório
2. ✅ Email obrigatório e válido
3. ✅ Cargo obrigatório e enum (customer, admin, delivery)
4. ✅ Email único (sem duplicação)
5. ✅ Limites de caracteres respeitados
6. ✅ Status entre 0-255
7. ✅ Atualização parcial permitida

### Produtos
1. ✅ Nome obrigatório
2. ✅ Preço obrigatório e positivo
3. ✅ Medida obrigatória
4. ✅ Categoria obrigatória (fk válida)
5. ✅ SKU único (sem duplicação)
6. ✅ Limites de caracteres respeitados
7. ✅ Estoque não-negativo
8. ✅ Status entre 0-255
9. ✅ Atualização parcial permitida

---

## 🎯 Cenários de Erro Testados

### HTTP 400 - Bad Request
- ✅ Campos obrigatórios faltando
- ✅ Formato de dados inválido
- ✅ Valores fora do range permitido
- ✅ Email inválido
- ✅ Cargo inválido
- ✅ Duplicação de email/SKU

### HTTP 404 - Not Found
- ✅ Buscar usuário inexistente (GET)
- ✅ Atualizar usuário inexistente (PUT)
- ✅ Deletar usuário inexistente (DELETE)
- ✅ Buscar produto inexistente (GET)
- ✅ Atualizar produto inexistente (PUT)
- ✅ Deletar produto inexistente (DELETE)

### HTTP 500 - Internal Error
- ✅ Tratamento de erros inesperados
- ✅ Logs de erro registrados

---

## 📝 Notas de Teste

1. **Autenticação:** Todos os endpoints devem ser testados com e sem token JWT para verificar proteção adequada.

2. **Validação:** Cada campo deve ser testado individualmente para garantir que as regras de validação estão corretas.

3. **Integridade:** Testar relações entre tabelas (ex: deletar usuário com endereços/pedidos).

4. **Performance:** Verificar tempo de resposta para listagens grandes.

5. **Concorrência:** Testar criação/atualização simultânea do mesmo recurso.

---

## ✅ Checklist de Testes

### Usuários
- [ ] GET /api/usuarios (200)
- [ ] GET /api/usuarios/:id (200, 404)
- [ ] POST /api/usuarios (200, 400 - validações)
- [ ] PUT /api/usuarios/:id (200, 404, 400 - validações)
- [ ] DELETE /api/usuarios/:id (200, 404)
- [ ] GET /api/usuarios/:id/enderecos (200, 404)

### Produtos
- [ ] GET /api/produtos (200)
- [ ] GET /api/produtos/:id (200, 404)
- [ ] POST /api/produtos (200, 400 - validações)
- [ ] PUT /api/produtos/:id (200, 404, 400 - validações)
- [ ] DELETE /api/produtos/:id (200, 404)
- [ ] GET /api/produtos/categoria/:categoriaId (200)
- [ ] GET /api/produtos/:id/avaliacoes (200, 404)

### Validações
- [ ] Campos obrigatórios verificados
- [ ] Limites de caracteres respeitados
- [ ] Tipos de dados validados
- [ ] Chaves estrangeiras validadas
- [ ] Unicidade (email, SKU) verificada
- [ ] Atualização parcial funcionando

### Autenticação
- [ ] Endpoints protegidos por JWT
- [ ] Middleware de autenticação funcionando
- [ ] Permissões baseadas em cargo funcionando
