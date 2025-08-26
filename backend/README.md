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

### Clientes
- `GET /api/clientes` - Listar clientes (com paginação e busca)
- `GET /api/clientes/:id` - Buscar cliente por ID
- `POST /api/clientes` - Criar novo cliente
- `PUT /api/clientes/:id` - Atualizar cliente
- `DELETE /api/clientes/:id` - Excluir cliente

### Exemplo de uso

#### Criar cliente:
```bash
curl -X POST http://localhost:3001/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "senha": "123456",
    "telefone": "(11) 99999-9999"
  }'
```

#### Listar clientes:
```bash
curl http://localhost:3001/api/clientes?page=1&limit=10&search=João
```

## 🗃️ Modelo de Dados

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

## 🧪 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Compila TypeScript para JavaScript
- `npm start` - Inicia servidor de produção
- `npm run lint` - Executa linter
- `npm test` - Executa testes
- `npm run db:migrate` - Executa migrações do banco
- `npm run db:seed` - Executa seeds do banco

## 🔧 Próximos Passos

Esta é a estrutura inicial da API. Para completar o sistema, você pode:

1. **Implementar autenticação JWT**
   - Middleware de autenticação
   - Rotas de login/logout
   - Proteção de rotas

2. **Adicionar novos modelos**
   - Produto
   - Pedido
   - Categoria
   - Endereço

3. **Implementar relacionamentos**
   - Cliente → Pedidos
   - Pedido → Itens
   - Produto → Categoria

4. **Adicionar funcionalidades**
   - Upload de imagens
   - Notificações
   - Relatórios
   - Logs de auditoria

5. **Testes automatizados**
   - Testes unitários
   - Testes de integração
   - Testes E2E

6. **Deploy**
   - Dockerfile
   - Docker Compose
   - CI/CD

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