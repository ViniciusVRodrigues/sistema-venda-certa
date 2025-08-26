# Backend API - Sistema Venda Certa

API RESTful desenvolvida com Express, Sequelize e MySQL para o sistema de vendas.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Superset do JavaScript
- **Sequelize** - ORM para MySQL
- **MySQL** - Banco de dados relacional
- **Bcryptjs** - Hash de senhas
- **Joi** - Validação de dados
- **Helmet** - Segurança HTTP
- **CORS** - Cross-Origin Resource Sharing

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── config/          # Configurações (banco, etc)
│   ├── controllers/     # Controladores da API
│   ├── models/          # Modelos do Sequelize
│   ├── routes/          # Definição de rotas
│   ├── middleware/      # Middlewares customizados
│   └── server.ts        # Arquivo principal do servidor
├── tests/               # Testes automatizados
├── .env.example         # Exemplo de variáveis de ambiente
├── package.json         # Dependências e scripts
└── tsconfig.json        # Configuração do TypeScript
```

## ⚙️ Configuração e Instalação

### 1. Pré-requisitos

- Node.js 18+ 
- MySQL 8.0+
- npm ou yarn

### 2. Instalação das dependências

```bash
cd backend
npm install
```

### 3. Configuração do banco de dados

1. Crie um banco de dados MySQL:
```sql
CREATE DATABASE sistema_venda_certa;
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

3. Edite o arquivo `.env` com suas configurações:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=sua_senha
DB_DATABASE=sistema_venda_certa
PORT=3001
NODE_ENV=development
JWT_SECRET=sua_chave_secreta_jwt
CORS_ORIGIN=http://localhost:5173
```

### 4. Executar a aplicação

#### Desenvolvimento (com hot reload):
```bash
npm run dev
```

#### Produção:
```bash
npm run build
npm start
```

## 📚 API Endpoints

### Health Check
- `GET /api/health` - Verificar status da API

### 🔐 Autenticação
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/logout` - Fazer logout
- `GET /api/auth/me` - Obter perfil do usuário logado

### 👥 Clientes
- `GET /api/clientes` - Listar clientes (com paginação e busca)
- `GET /api/clientes/:id` - Buscar cliente por ID
- `POST /api/clientes` - Criar novo cliente
- `PUT /api/clientes/:id` - Atualizar cliente
- `DELETE /api/clientes/:id` - Excluir cliente

### 📦 Produtos
- `GET /api/produtos` - Listar produtos (com filtros)
- `GET /api/produtos/:id` - Buscar produto por ID
- `GET /api/produtos/categorias` - Listar categorias de produtos
- `GET /api/produtos/marcas` - Listar marcas de produtos
- `POST /api/produtos` - Criar novo produto (🔒 protegido)
- `PUT /api/produtos/:id` - Atualizar produto (🔒 protegido)
- `DELETE /api/produtos/:id` - Excluir produto (🔒 protegido)

### 🏷️ Categorias
- `GET /api/categorias` - Listar categorias
- `GET /api/categorias/tree` - Obter árvore de categorias
- `GET /api/categorias/:id` - Buscar categoria por ID
- `GET /api/categorias/slug/:slug` - Buscar categoria por slug
- `POST /api/categorias` - Criar nova categoria (🔒 protegido)
- `PUT /api/categorias/:id` - Atualizar categoria (🔒 protegido)
- `DELETE /api/categorias/:id` - Excluir categoria (🔒 protegido)

### 🛒 Pedidos
- `GET /api/pedidos` - Listar pedidos (🔒 protegido)
- `GET /api/pedidos/:id` - Buscar pedido por ID (🔒 protegido)
- `GET /api/pedidos/stats` - Estatísticas de pedidos (🔒 protegido)
- `POST /api/pedidos` - Criar novo pedido (🔒 protegido)
- `PUT /api/pedidos/:id` - Atualizar pedido (🔒 protegido)
- `DELETE /api/pedidos/:id` - Excluir pedido (🔒 protegido)

### Exemplo de uso

#### Fazer login:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "senha": "123456"
  }'
```

#### Criar produto (com autenticação):
```bash
curl -X POST http://localhost:3001/api/produtos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu_token_jwt" \
  -d '{
    "nome": "iPhone 15",
    "preco": 4999.99,
    "categoria": "Smartphones",
    "marca": "Apple",
    "estoque": 50
  }'
```

#### Criar pedido:
```bash
curl -X POST http://localhost:3001/api/pedidos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu_token_jwt" \
  -d '{
    "clienteId": 1,
    "metodoPagamento": "pix",
    "itens": [
      {
        "produtoId": 1,
        "quantidade": 2,
        "observacoes": "Entrega rápida"
      }
    ]
  }'
```

## 🗃️ Modelos de Dados

### Cliente
```typescript
{
  id: number;           // Primary key
  nome: string;         // Nome completo (obrigatório)
  email: string;        // Email único (obrigatório)
  senha: string;        // Senha hash (obrigatório)
  telefone?: string;    // Telefone (opcional)
  avatar?: string;      // URL do avatar (opcional)
  isVip?: boolean;      // Cliente VIP (padrão: false)
  isBlocked?: boolean;  // Cliente bloqueado (padrão: false)
  totalPedidos?: number;// Total de pedidos (padrão: 0)
  totalGasto?: number;  // Total gasto (padrão: 0.00)
  ultimoPedidoData?: Date; // Data do último pedido
  createdAt: Date;      // Data de criação
  updatedAt: Date;      // Data de atualização
}
```

### Produto
```typescript
{
  id: number;           // Primary key
  nome: string;         // Nome do produto (obrigatório)
  descricao?: string;   // Descrição do produto
  preco: number;        // Preço (obrigatório)
  precoPromocional?: number; // Preço promocional
  categoria?: string;   // Categoria do produto
  marca?: string;       // Marca do produto
  sku?: string;         // Código SKU único
  codigoBarras?: string; // Código de barras
  estoque: number;      // Quantidade em estoque (obrigatório)
  estoqueMinimo?: number; // Estoque mínimo
  imagemPrincipal?: string; // URL da imagem principal
  imagens?: string;     // JSON array de URLs de imagens
  peso?: number;        // Peso em kg
  dimensoes?: string;   // Dimensões (LxWxH em cm)
  ativo: boolean;       // Produto ativo (padrão: true)
  destaque: boolean;    // Produto em destaque (padrão: false)
  avaliacaoMedia?: number; // Avaliação média (0-5)
  totalAvaliacoes?: number; // Total de avaliações
  totalVendas?: number; // Total de vendas
  tags?: string;        // Tags para busca
  createdAt: Date;      // Data de criação
  updatedAt: Date;      // Data de atualização
}
```

### Categoria
```typescript
{
  id: number;           // Primary key
  nome: string;         // Nome da categoria (obrigatório)
  descricao?: string;   // Descrição da categoria
  slug: string;         // Slug único para URLs (obrigatório)
  imagem?: string;      // URL da imagem da categoria
  icone?: string;       // Ícone da categoria
  cor?: string;         // Cor em hexadecimal (#RRGGBB)
  parentId?: number;    // ID da categoria pai (para subcategorias)
  ordem?: number;       // Ordem de exibição
  ativo: boolean;       // Categoria ativa (padrão: true)
  destaque: boolean;    // Categoria em destaque (padrão: false)
  totalProdutos?: number; // Total de produtos na categoria
  createdAt: Date;      // Data de criação
  updatedAt: Date;      // Data de atualização
}
```

### Pedido
```typescript
{
  id: number;           // Primary key
  clienteId: number;    // ID do cliente (obrigatório)
  numeroComanda: string; // Número único do pedido
  status: OrderStatus;  // Status do pedido (pendente, confirmado, etc.)
  metodoPagamento: PaymentMethod; // Método de pagamento
  subtotal: number;     // Subtotal dos itens
  desconto?: number;    // Valor do desconto
  taxaEntrega?: number; // Taxa de entrega
  total: number;        // Valor total do pedido
  observacoes?: string; // Observações do pedido
  enderecoEntrega?: string; // Endereço de entrega
  telefoneContato?: string; // Telefone para contato
  dataEntrega?: Date;   // Data de entrega
  dataConfirmacao?: Date; // Data de confirmação
  dataCancelamento?: Date; // Data de cancelamento
  motivoCancelamento?: string; // Motivo do cancelamento
  createdAt: Date;      // Data de criação
  updatedAt: Date;      // Data de atualização
}

// Status possíveis do pedido
enum OrderStatus {
  PENDENTE = 'pendente',
  CONFIRMADO = 'confirmado',
  PREPARANDO = 'preparando',
  ENVIADO = 'enviado',
  ENTREGUE = 'entregue',
  CANCELADO = 'cancelado'
}

// Métodos de pagamento
enum PaymentMethod {
  DINHEIRO = 'dinheiro',
  CARTAO_CREDITO = 'cartao_credito',
  CARTAO_DEBITO = 'cartao_debito',
  PIX = 'pix',
  BOLETO = 'boleto'
}
```

### Item do Pedido
```typescript
{
  id: number;           // Primary key
  pedidoId: number;     // ID do pedido (obrigatório)
  produtoId: number;    // ID do produto (obrigatório)
  nomeProduto: string;  // Nome do produto no momento da compra
  precoProduto: number; // Preço do produto no momento da compra
  quantidade: number;   // Quantidade do item (obrigatório)
  subtotal: number;     // Subtotal do item (preço × quantidade)
  observacoes?: string; // Observações específicas do item
  createdAt: Date;      // Data de criação
  updatedAt: Date;      // Data de atualização
}
```

## 🧪 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Compila TypeScript para JavaScript
- `npm start` - Inicia servidor de produção
- `npm run lint` - Executa linter
- `npm test` - Executa testes
- `npm run db:migrate` - Executa migrações do banco
- `npm run db:seed` - Executa seeds do banco

## 🔧 Próximos Passos

Esta implementação agora inclui um sistema completo de e-commerce. Funcionalidades adicionais que podem ser implementadas:

1. **Sistema de arquivo (uploads)**
   - Upload de imagens para produtos
   - Upload de avatares para clientes
   - Armazenamento em cloud (AWS S3, Cloudinary)

2. **Funcionalidades avançadas**
   - Sistema de avaliações e comentários
   - Carrinho de compras persistente
   - Wishlist/Lista de desejos
   - Cupons de desconto
   - Sistema de notificações

3. **Relatórios e analytics**
   - Dashboard administrativo
   - Relatórios de vendas
   - Métricas de produtos
   - Análise de comportamento

4. **Integração com pagamentos**
   - Gateway de pagamento (Stripe, PayPal, PagSeguro)
   - PIX automático
   - Boleto bancário

5. **Deploy e infraestrutura**
   - Dockerização completa
   - CI/CD com GitHub Actions
   - Deploy em cloud (AWS, Heroku, Railway)
   - Monitoramento e logs

## ✅ Funcionalidades Implementadas

### 🔐 Autenticação JWT
- ✅ Login com email e senha
- ✅ Proteção de rotas sensíveis
- ✅ Middleware de autenticação
- ✅ Verificação de usuário bloqueado

### 📦 Gestão de Produtos
- ✅ CRUD completo de produtos
- ✅ Busca e filtros avançados
- ✅ Controle de estoque
- ✅ Categorização e marcas
- ✅ Produtos em destaque
- ✅ Preços promocionais

### 🏷️ Sistema de Categorias
- ✅ Categorias hierárquicas (pai/filho)
- ✅ Slug para URLs amigáveis
- ✅ Ordenação personalizada
- ✅ Categorias em destaque
- ✅ Cores e ícones

### 🛒 Sistema de Pedidos
- ✅ Criação de pedidos completos
- ✅ Controle de status (pendente → entregue)
- ✅ Múltiplos métodos de pagamento
- ✅ Cálculo automático de totais
- ✅ Histórico de pedidos
- ✅ Estatísticas de vendas

### 👥 Gestão de Clientes
- ✅ Cadastro com validações
- ✅ Perfil VIP e bloqueio
- ✅ Histórico de compras
- ✅ Estatísticas do cliente

### 🛡️ Segurança
- ✅ Rate limiting por endpoint
- ✅ Headers de segurança (Helmet)
- ✅ Validação de entrada (Joi)
- ✅ Hash de senhas (bcrypt)
- ✅ CORS configurado

### 🧪 Testes
- ✅ Testes de integração completos
- ✅ Cobertura de todos os endpoints
- ✅ Validação de autenticação
- ✅ Testes de erro

## 📝 Validações

A API inclui validações para:
- ✅ Nome: 2-255 caracteres
- ✅ Email: formato válido e único
- ✅ Senha: mínimo 6 caracteres (hash automático)
- ✅ Telefone: formato brasileiro (opcional)

## 🛡️ Segurança

- Senhas são automaticamente criptografadas com bcrypt
- Headers de segurança com Helmet
- CORS configurado
- Validação de entrada com Joi
- Logs de desenvolvimento

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request