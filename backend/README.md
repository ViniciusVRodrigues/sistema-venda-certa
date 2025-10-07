# Sistema Venda Certa - Backend API

Backend API desenvolvida com Express.js e Sequelize que segue meticulosamente a estrutura do banco de dados definida em `database_schema.sql`.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Sequelize** - ORM para banco de dados
- **MySQL** - Banco de dados
- **TypeScript** - Tipagem estática
- **express-validator** - Validação de dados
- **cors** - Configuração CORS
- **helmet** - Segurança HTTP
- **morgan** - Logging HTTP

## 📋 Pré-requisitos

- Node.js 18+ 
- MySQL 8.0+
- npm ou yarn

## ⚙️ Configuração

1. **Instalar dependências:**
   ```bash
   cd backend
   npm install
   ```

2. **Configurar variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```

3. **Editar arquivo `.env`:**
   ```env
   NODE_ENV=development
   PORT=3001
   
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=your_password
   DB_DATABASE=venda_certa
   
   JWT_SECRET=your-jwt-secret-key
   FRONTEND_URL=http://localhost:5173
   ```

4. **Criar banco de dados:**
   ```sql
   CREATE DATABASE venda_certa;
   ```

5. **Executar script do schema:**
   ```bash
   mysql -u root -p venda_certa < ../database_schema.sql
   ```

## 🏃‍♂️ Executando

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## 📚 Estrutura da API

### Endpoints Principais

#### Usuários

##### GET /api/usuarios
**Descrição:** Lista todos os usuários do sistema.

**Exemplo de Requisição:**
```bash
curl -X GET http://localhost:3001/api/usuarios
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "João Silva",
      "email": "joao@email.com",
      "cargo": "customer",
      "numeroCelular": "(11) 98765-4321",
      "status": 1,
      "totalPedidos": 5,
      "totalGasto": 250.50,
      "entregasFeitas": 0,
      "nota": null,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "enderecos": []
    }
  ]
}
```

##### GET /api/usuarios/:id
**Descrição:** Busca um usuário específico por ID.

**Exemplo de Requisição:**
```bash
curl -X GET http://localhost:3001/api/usuarios/1
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "cargo": "customer",
    "numeroCelular": "(11) 98765-4321",
    "status": 1,
    "totalPedidos": 5,
    "totalGasto": 250.50,
    "entregasFeitas": 0,
    "nota": null,
    "enderecos": [
      {
        "id": 1,
        "rua": "Rua das Flores",
        "numero": "123",
        "bairro": "Centro",
        "cidade": "São Paulo",
        "estado": "SP",
        "cep": "01234-567"
      }
    ]
  }
}
```

**Resposta de Erro (404):**
```json
{
  "success": false,
  "error": "Usuário não encontrado"
}
```

##### POST /api/usuarios
**Descrição:** Cria um novo usuário.

**Campos Obrigatórios:**
- `nome` (string, max 100 caracteres)
- `email` (string válido, max 150 caracteres, único)
- `cargo` (enum: "customer", "admin", "delivery")

**Campos Opcionais:**
- `numeroCelular` (string, max 20 caracteres)
- `status` (integer, 0-255, default: 1)
- `totalPedidos` (integer, default: 0)
- `totalGasto` (decimal, default: 0.00)
- `entregasFeitas` (integer, default: 0)
- `nota` (decimal, 0.0-9.9)

**Exemplo de Requisição:**
```bash
curl -X POST http://localhost:3001/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Santos",
    "email": "maria.santos@email.com",
    "cargo": "customer",
    "numeroCelular": "(11) 91234-5678",
    "status": 1
  }'
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "nome": "Maria Santos",
    "email": "maria.santos@email.com",
    "cargo": "customer",
    "numeroCelular": "(11) 91234-5678",
    "status": 1,
    "totalPedidos": 0,
    "totalGasto": 0.00,
    "entregasFeitas": 0,
    "nota": null,
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Resposta de Erro de Validação (400):**
```json
{
  "errors": [
    {
      "msg": "Email deve ser válido",
      "param": "email",
      "location": "body"
    },
    {
      "msg": "Cargo deve ser customer, admin ou delivery",
      "param": "cargo",
      "location": "body"
    }
  ]
}
```

**Resposta de Email Duplicado (400):**
```json
{
  "success": false,
  "error": "Email já está em uso"
}
```

##### PUT /api/usuarios/:id
**Descrição:** Atualiza um usuário existente (atualização parcial permitida).

**Campos Opcionais (todos):**
- `nome` (string, max 100 caracteres)
- `email` (string válido, max 150 caracteres)
- `cargo` (enum: "customer", "admin", "delivery")
- `numeroCelular` (string, max 20 caracteres)
- `status` (integer, 0-255)
- `totalPedidos` (integer)
- `totalGasto` (decimal)
- `entregasFeitas` (integer)
- `nota` (decimal, 0.0-9.9)

**Exemplo de Requisição:**
```bash
curl -X PUT http://localhost:3001/api/usuarios/1 \
  -H "Content-Type: application/json" \
  -d '{
    "numeroCelular": "(11) 99999-8888",
    "status": 1
  }'
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "cargo": "customer",
    "numeroCelular": "(11) 99999-8888",
    "status": 1,
    "totalPedidos": 5,
    "totalGasto": 250.50,
    "entregasFeitas": 0,
    "nota": null
  }
}
```

**Resposta de Erro (404):**
```json
{
  "success": false,
  "error": "Usuário não encontrado"
}
```

##### DELETE /api/usuarios/:id
**Descrição:** Remove um usuário do sistema.

**Exemplo de Requisição:**
```bash
curl -X DELETE http://localhost:3001/api/usuarios/1
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Usuário deletado com sucesso"
}
```

**Resposta de Erro (404):**
```json
{
  "success": false,
  "error": "Usuário não encontrado"
}
```

##### GET /api/usuarios/:id/enderecos
**Descrição:** Lista todos os endereços de um usuário.

**Exemplo de Requisição:**
```bash
curl -X GET http://localhost:3001/api/usuarios/1/enderecos
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "rua": "Rua das Flores",
      "numero": "123",
      "complemento": "Apto 45",
      "bairro": "Centro",
      "cidade": "São Paulo",
      "estado": "SP",
      "cep": "01234-567",
      "favorito": true,
      "fk_usuario_id": 1
    }
  ]
}
```

---

#### Produtos

##### GET /api/produtos
**Descrição:** Lista todos os produtos do sistema.

**Parâmetros de Query (opcionais):**
- `categoria` (integer) - Filtrar por categoria
- `status` (integer) - Filtrar por status
- `search` (string) - Buscar por nome ou descrição

**Exemplo de Requisição:**
```bash
curl -X GET http://localhost:3001/api/produtos
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "sku": "PROD-001",
      "nome": "Notebook Dell",
      "descricao": "Notebook Dell Inspiron 15, Intel Core i5, 8GB RAM, 256GB SSD",
      "descricaoResumida": "Notebook Dell Inspiron 15",
      "preco": 3500.00,
      "medida": "un",
      "estoque": 10,
      "status": 1,
      "tags": "notebook,dell,informatica",
      "fk_categoria_id": 1,
      "categoria": {
        "id": 1,
        "nome": "Eletrônicos",
        "descricao": "Produtos eletrônicos",
        "estaAtiva": true
      },
      "avaliacoes": []
    }
  ]
}
```

##### GET /api/produtos/:id
**Descrição:** Busca um produto específico por ID.

**Exemplo de Requisição:**
```bash
curl -X GET http://localhost:3001/api/produtos/1
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "sku": "PROD-001",
    "nome": "Notebook Dell",
    "descricao": "Notebook Dell Inspiron 15, Intel Core i5, 8GB RAM, 256GB SSD",
    "descricaoResumida": "Notebook Dell Inspiron 15",
    "preco": 3500.00,
    "medida": "un",
    "estoque": 10,
    "status": 1,
    "tags": "notebook,dell,informatica",
    "fk_categoria_id": 1,
    "categoria": {
      "id": 1,
      "nome": "Eletrônicos"
    },
    "avaliacoes": [
      {
        "id": 1,
        "avaliacao": 5,
        "comentario": "Excelente produto!",
        "usuario": {
          "id": 1,
          "nome": "João Silva"
        }
      }
    ]
  }
}
```

**Resposta de Erro (404):**
```json
{
  "success": false,
  "error": "Produto não encontrado"
}
```

##### POST /api/produtos
**Descrição:** Cria um novo produto.

**Campos Obrigatórios:**
- `nome` (string, max 100 caracteres)
- `preco` (decimal, 0.00-99999999.99)
- `medida` (string, max 20 caracteres, ex: "un", "kg", "l")
- `fk_categoria_id` (integer, ID válido de categoria)

**Campos Opcionais:**
- `sku` (string, max 30 caracteres, único)
- `descricao` (text)
- `descricaoResumida` (string, max 255 caracteres)
- `estoque` (integer, default: 0)
- `status` (integer, 0-255, default: 1)
- `tags` (string, max 255 caracteres)

**Exemplo de Requisição:**
```bash
curl -X POST http://localhost:3001/api/produtos \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "PROD-002",
    "nome": "Mouse Logitech MX Master",
    "descricao": "Mouse sem fio ergonômico com sensor de alta precisão",
    "descricaoResumida": "Mouse Logitech MX Master",
    "preco": 450.00,
    "medida": "un",
    "estoque": 25,
    "status": 1,
    "tags": "mouse,logitech,periferico",
    "fk_categoria_id": 1
  }'
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "sku": "PROD-002",
    "nome": "Mouse Logitech MX Master",
    "descricao": "Mouse sem fio ergonômico com sensor de alta precisão",
    "descricaoResumida": "Mouse Logitech MX Master",
    "preco": 450.00,
    "medida": "un",
    "estoque": 25,
    "status": 1,
    "tags": "mouse,logitech,periferico",
    "fk_categoria_id": 1,
    "createdAt": "2024-01-15T11:30:00.000Z",
    "updatedAt": "2024-01-15T11:30:00.000Z"
  }
}
```

**Resposta de Erro de Validação (400):**
```json
{
  "error": "Dados inválidos. Nome, preço e categoria são obrigatórios."
}
```

**Resposta de SKU Duplicado (400):**
```json
{
  "success": false,
  "error": "SKU já está em uso"
}
```

##### PUT /api/produtos/:id
**Descrição:** Atualiza um produto existente (atualização parcial permitida).

**Campos Opcionais (todos):**
- `sku` (string, max 30 caracteres)
- `nome` (string, max 100 caracteres)
- `descricao` (text)
- `descricaoResumida` (string, max 255 caracteres)
- `preco` (decimal, 0.00-99999999.99)
- `medida` (string, max 20 caracteres)
- `estoque` (integer)
- `status` (integer, 0-255)
- `tags` (string, max 255 caracteres)
- `fk_categoria_id` (integer)

**Exemplo de Requisição:**
```bash
curl -X PUT http://localhost:3001/api/produtos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "preco": 3200.00,
    "estoque": 15
  }'
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "sku": "PROD-001",
    "nome": "Notebook Dell",
    "descricao": "Notebook Dell Inspiron 15, Intel Core i5, 8GB RAM, 256GB SSD",
    "descricaoResumida": "Notebook Dell Inspiron 15",
    "preco": 3200.00,
    "medida": "un",
    "estoque": 15,
    "status": 1,
    "tags": "notebook,dell,informatica",
    "fk_categoria_id": 1,
    "categoria": {
      "id": 1,
      "nome": "Eletrônicos"
    }
  }
}
```

**Resposta de Erro (404):**
```json
{
  "success": false,
  "error": "Produto não encontrado"
}
```

##### DELETE /api/produtos/:id
**Descrição:** Remove um produto do sistema.

**Exemplo de Requisição:**
```bash
curl -X DELETE http://localhost:3001/api/produtos/1
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Produto deletado com sucesso"
}
```

**Resposta de Erro (404):**
```json
{
  "success": false,
  "error": "Produto não encontrado"
}
```

##### GET /api/produtos/categoria/:categoriaId
**Descrição:** Lista todos os produtos de uma categoria específica.

**Exemplo de Requisição:**
```bash
curl -X GET http://localhost:3001/api/produtos/categoria/1
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "Notebook Dell",
      "preco": 3500.00,
      "categoria": {
        "id": 1,
        "nome": "Eletrônicos"
      }
    }
  ]
}
```

##### GET /api/produtos/:id/avaliacoes
**Descrição:** Lista todas as avaliações de um produto.

**Exemplo de Requisição:**
```bash
curl -X GET http://localhost:3001/api/produtos/1/avaliacoes
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "avaliacao": 5,
      "comentario": "Excelente produto! Recomendo.",
      "fk_produto_id": 1,
      "fk_usuario_id": 1,
      "usuario": {
        "id": 1,
        "nome": "João Silva"
      }
    }
  ]
}
```

---

#### Pedidos
- `GET /api/pedidos` - Listar todos os pedidos
- `GET /api/pedidos/:id` - Buscar pedido por ID
- `POST /api/pedidos` - Criar novo pedido
- `PUT /api/pedidos/:id` - Atualizar pedido
- `DELETE /api/pedidos/:id` - Deletar pedido
- `PUT /api/pedidos/:id/status` - Atualizar status do pedido
- `GET /api/pedidos/usuario/:usuarioId` - Pedidos do usuário

#### Categorias
- `GET /api/categorias` - Listar todas as categorias
- `GET /api/categorias/ativas` - Listar categorias ativas
- `GET /api/categorias/:id` - Buscar categoria por ID
- `POST /api/categorias` - Criar nova categoria
- `PUT /api/categorias/:id` - Atualizar categoria
- `DELETE /api/categorias/:id` - Deletar categoria

#### Endereços
- `GET /api/enderecos` - Listar todos os endereços
- `GET /api/enderecos/:id` - Buscar endereço por ID
- `POST /api/enderecos` - Criar novo endereço
- `PUT /api/enderecos/:id` - Atualizar endereço
- `DELETE /api/enderecos/:id` - Deletar endereço
- `GET /api/enderecos/usuario/:usuarioId` - Endereços do usuário
- `PUT /api/enderecos/:id/favorito` - Definir endereço favorito

### Health Check
- `GET /api/health` - Status da API

## 🗄️ Modelos de Dados

### Usuario
```typescript
{
  id: number;
  nome: string;
  email: string;
  cargo: string;
  numeroCelular?: string;
  status: number;
  totalPedidos: number;
  totalGasto: number;
  entregasFeitas: number;
  nota?: number;
}
```

### Produto
```typescript
{
  id: number;
  sku?: string;
  nome: string;
  descricao?: string;
  descricaoResumida?: string;
  preco: number;
  medida: string;
  estoque: number;
  status: number;
  imagem?: Buffer;
  tags?: string;
  fk_categoria_id: number;
}
```

### Pedido
```typescript
{
  id: number;
  status: number;
  total: number;
  subtotal: number;
  taxaEntrega: number;
  statusPagamento: number;
  anotacoes?: string;
  motivoCancelamento?: string;
  estimativaEntrega?: Date;
  dataEntrega?: Date;
  fk_entregador_id?: number;
  fk_metodoPagamento_id: number;
  fk_usuario_id: number;
  fk_metodoEntrega_id: number;
  fk_endereco_id: number;
}
```

## 🔒 Validações

Todas as rotas possuem validação de entrada baseada nos constraints do banco de dados:
- Limites de caracteres exatos (VARCHAR)
- Validação de tipos numéricos (DECIMAL, INTEGER, TINYINT)
- Validação de chaves estrangeiras
- Campos obrigatórios vs opcionais
- Validação diferenciada para criação (POST) e atualização (PUT)
- Atualização parcial permitida em rotas PUT

## 📝 Códigos de Status HTTP

A API utiliza os seguintes códigos de status HTTP:

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Requisição bem-sucedida (GET, PUT, DELETE) |
| 201 | Created | Recurso criado com sucesso (POST) |
| 400 | Bad Request | Erro de validação ou dados inválidos |
| 401 | Unauthorized | Autenticação necessária ou falhou |
| 403 | Forbidden | Sem permissão para acessar o recurso |
| 404 | Not Found | Recurso não encontrado |
| 409 | Conflict | Conflito (ex: email/SKU duplicado) |
| 500 | Internal Server Error | Erro interno do servidor |

## 🔐 Autenticação

O sistema possui autenticação JWT implementada. Para usar rotas protegidas:

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@email.com",
    "senha": "senha123"
  }'
```

**Resposta:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id": 1,
      "nome": "João Silva",
      "email": "joao@email.com",
      "cargo": "customer"
    }
  }
}
```

### Usando o Token
Adicione o token no header `Authorization` das requisições:

```bash
curl -X GET http://localhost:3001/api/usuarios \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Middlewares de Autenticação
- `authenticateToken` - Autenticação básica via JWT
- `requireAdmin` - Requer privilégios de administrador
- `requireDelivery` - Requer privilégios de entregador ou admin
- `requireOwnershipOrAdmin` - Acesso a dados próprios ou admin

Para mais detalhes sobre autenticação, consulte [AUTHENTICATION_SYSTEM.md](./AUTHENTICATION_SYSTEM.md)

## 🔗 Relacionamentos

A API implementa todas as relações definidas no schema:
- **Usuario → Endereco** (1:N)
- **Usuario → Pedido** (1:N como cliente)
- **Usuario → Pedido** (1:N como entregador)
- **Categoria → Produto** (1:N)
- **Pedido → ProdutoPedido** (1:N)
- **Produto → AvaliacaoProduto** (1:N)

## 🚨 Tratamento de Erros

- Middleware de tratamento de erros global
- Validação de entrada com express-validator
- Respostas padronizadas de erro
- Logs detalhados em desenvolvimento

## 📝 Scripts Úteis

```bash
# Desenvolvimento com hot reload
npm run dev

# Build para produção
npm run build

# Executar em produção
npm start

# Linting
npm run lint

# Testes (configurar jest)
npm test
```

## 🌐 Ambiente

A API está configurada para:
- **Desenvolvimento**: Logs detalhados, sync de modelos
- **Produção**: Logs mínimos, otimizações de segurança

## 📊 Monitoramento

- Health check endpoint: `GET /api/health`
- Logs estruturados com Morgan
- Tratamento de exceções não capturadas
- Graceful shutdown em SIGTERM