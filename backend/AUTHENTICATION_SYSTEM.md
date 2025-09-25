# Sistema de Autenticação - Sistema Venda Certa

## Resumo da Implementação

Foi implementado um sistema completo de autenticação JWT para o Sistema Venda Certa, seguindo o padrão **Template Method** já estabelecido no projeto.

## Componentes Criados

### 1. AuthController (`/src/controllers/AuthController.ts`)
**Herda de**: `AbstractController`

**Endpoints implementados**:
- `POST /api/auth/login` - Autenticação de usuário
- `POST /api/auth/register` - Registro de novo usuário
- `POST /api/auth/verify-token` - Verificação de token JWT
- `POST /api/auth/logout` - Logout (remove token no client-side)

**Funcionalidades**:
- Hash de senhas usando bcryptjs (salt 10)
- Geração de tokens JWT com expiração configurável
- Validação de usuário ativo (status = 1)
- Tratamento de erros específicos (email duplicado, credenciais inválidas)
- Logs automáticos via Singleton Logger

### 2. Middleware de Autenticação (`/src/middleware/auth.ts`)

**Middlewares disponíveis**:
- `authenticateToken` - Autenticação básica via JWT
- `requireAdmin` - Requer privilégios de administrador
- `requireDelivery` - Requer privilégios de entregador ou admin
- `requireOwnershipOrAdmin` - Acesso a dados próprios ou admin

**Funcionalidades**:
- Verificação automática de token no header `Authorization: Bearer <token>`
- Validação de usuário ativo
- Logs de tentativas de acesso
- Injeção de dados do usuário na requisição (`req.user`)

### 3. Rotas de Autenticação (`/src/routes/auth.ts`)
- Documentação Swagger completa
- Validação de entrada usando express-validator
- Integração com o roteador principal

### 4. Validações (`/src/middleware/authValidation.ts`)
**Validações disponíveis**:
- `validateLogin` - Email e senha obrigatórios
- `validateRegister` - Dados completos com validação de força da senha
- `validateChangePassword` - Mudança de senha com confirmação
- `validateForgotPassword` - Email para recuperação
- `validateResetPassword` - Redefinição com token

**Critérios de senha**:
- Mínimo 6 caracteres
- Pelo menos 1 letra minúscula
- Pelo menos 1 letra maiúscula  
- Pelo menos 1 número

### 5. Atualização do Modelo Usuario
**Novos campos**:
- `senha: string` - Senha hasheada (obrigatório)

**Cargos permitidos**:
- `cliente` - Usuário comum
- `admin` / `administrador` - Administrador
- `entregador` - Entregador

## Segurança Implementada

### 1. **Hash de Senhas**
- Uso do bcryptjs com salt 10
- Senhas nunca armazenadas em texto plano
- Hash automático no registro e alteração

### 2. **Tokens JWT**
- Secret configurável via ambiente (`JWT_SECRET`)
- Expiração configurável (`JWT_EXPIRES_IN` - padrão 24h)
- Payload mínimo (id, email, cargo)
- Verificação de usuário ativo a cada requisição

### 3. **Validação de Entrada**
- Sanitização de emails
- Validação de formato e força de senha
- Prevenção de SQL injection via Sequelize
- Validação de tipos de dados

### 4. **Logs de Segurança**
- Tentativas de login (sucesso/falha)
- Acessos negados
- Tokens inválidos
- Operações administrativas

## Configuração de Ambiente

```env
# JWT Configuration
JWT_SECRET=sua-chave-secreta-super-forte-aqui
JWT_EXPIRES_IN=24h

# Database (já existente)
DB_HOST=localhost
DB_NAME=sistema_venda_certa
DB_USER=root
DB_PASS=senha
```

## Exemplos de Uso

### 1. **Login**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "ana@email.com",
  "senha": "senha123"
}
```

**Resposta**:
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id": 4,
      "nome": "Ana Admin",
      "email": "ana@email.com",
      "cargo": "admin",
      "status": 1
    }
  }
}
```

### 2. **Registro**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "nome": "Novo Usuario",
  "email": "novo@email.com",
  "senha": "MinhaSenh@123",
  "cargo": "cliente",
  "numeroCelular": "(11) 99999-9999"
}
```

### 3. **Requisições Autenticadas**
```bash
GET /api/usuarios/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Integração com Controllers Existentes

Para proteger endpoints existentes, adicione os middlewares:

```typescript
// Exemplo no usuariosRoutes
import { authenticateToken, requireOwnershipOrAdmin } from '../middleware/auth';

// Proteger todas as rotas
router.use(authenticateToken);

// Proteger rota específica
router.get('/:id', requireOwnershipOrAdmin, UsuarioController.getById);
```

## Dados de Teste (Seed)

Usuários criados automaticamente (senha: `senha123`):

1. **João Silva** - `joao@email.com` - Cliente
2. **Maria Santos** - `maria@email.com` - Cliente  
3. **Pedro Entregador** - `pedro@email.com` - Entregador
4. **Ana Admin** - `ana@email.com` - Admin

## Próximos Passos Recomendados

### 1. **Funcionalidades Adicionais**
- Recuperação de senha via email
- Refresh tokens
- Rate limiting para login
- Blacklist de tokens
- Auditoria de sessões

### 2. **Melhorias de Segurança**
- Configuração de CORS específica
- Headers de segurança (helmet)
- Validação de origem da requisição
- Monitoramento de tentativas de ataque

### 3. **Integração Frontend**
- Interceptors para token
- Renovação automática
- Storage seguro do token
- Redirecionamento para login

### 4. **Testes**
- Testes unitários dos controllers
- Testes de integração das rotas
- Testes de segurança
- Testes de performance

## Compatibilidade

✅ **Totalmente compatível** com os padrões já implementados:
- Template Method Pattern
- Singleton Logger  
- Strategy Pattern (mantido no ProdutoController)
- Estrutura de rotas existente
- Validação com express-validator
- Documentação Swagger

O sistema está pronto para uso e pode ser estendido conforme necessário!
