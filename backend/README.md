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
- `GET /api/usuarios` - Listar todos os usuários
- `GET /api/usuarios/:id` - Buscar usuário por ID
- `POST /api/usuarios` - Criar novo usuário
- `PUT /api/usuarios/:id` - Atualizar usuário
- `DELETE /api/usuarios/:id` - Deletar usuário
- `GET /api/usuarios/:id/enderecos` - Listar endereços do usuário

#### Produtos
- `GET /api/produtos` - Listar todos os produtos
- `GET /api/produtos/:id` - Buscar produto por ID
- `POST /api/produtos` - Criar novo produto
- `PUT /api/produtos/:id` - Atualizar produto
- `DELETE /api/produtos/:id` - Deletar produto
- `GET /api/produtos/categoria/:categoriaId` - Produtos por categoria
- `GET /api/produtos/:id/avaliacoes` - Avaliações do produto

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