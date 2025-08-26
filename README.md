# Sistema Venda Certa

Sistema completo de vendas com frontend React e backend API RESTful.

## 🏗️ Arquitetura

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript + Sequelize + MySQL

## 📁 Estrutura do Projeto

```
sistema-venda-certa/
├── src/                 # Frontend React
│   ├── components/      # Componentes React
│   ├── pages/           # Páginas da aplicação
│   ├── services/        # Serviços de API (mock)
│   ├── hooks/           # React Hooks customizados
│   ├── context/         # Context API
│   └── types/           # Tipos TypeScript
├── backend/             # Backend API
│   ├── src/
│   │   ├── controllers/ # Controladores da API
│   │   ├── models/      # Modelos Sequelize
│   │   ├── routes/      # Rotas da API
│   │   ├── config/      # Configurações
│   │   └── server.ts    # Servidor Express
│   └── README.md        # Documentação do backend
└── README.md           # Este arquivo
```

## 🚀 Como Executar

### Frontend (Development)
```bash
npm install
npm run dev
```
Acesse: http://localhost:5173

### Backend API
```bash
cd backend
npm install
cp .env.example .env
# Configure suas credenciais MySQL no .env
npm run dev
```
Acesse: http://localhost:3001/api/health

## 📚 Documentação

- **[Backend API](./backend/README.md)** - Documentação completa da API RESTful
- **Frontend**: React com TypeScript, roteamento e autenticação

## 🔧 Configuração Inicial do Backend

1. **Instale o MySQL** e crie o banco:
   ```sql
   CREATE DATABASE sistema_venda_certa;
   ```

2. **Configure o backend**:
   ```bash
   cd backend
   cp .env.example .env
   # Edite o .env com suas credenciais MySQL
   npm install
   npm run dev
   ```

3. **Teste a API**:
   ```bash
   curl http://localhost:3001/api/health
   curl http://localhost:3001/api/clientes
   ```

## ✨ Funcionalidades Implementadas

### Backend API
- ✅ Estrutura básica Express + TypeScript
- ✅ Configuração Sequelize + MySQL
- ✅ Modelo Cliente com validações
- ✅ CRUD completo de clientes (`/api/clientes`)
- ✅ Validação de dados com Joi
- ✅ Hash de senhas com bcryptjs
- ✅ Middleware de segurança (Helmet, CORS)
- ✅ Paginação e busca
- ✅ Health check endpoint

### Frontend
- ✅ Interface administrativa para clientes
- ✅ Sistema de autenticação
- ✅ Roteamento protegido
- ✅ Gerenciamento de produtos e pedidos (mock)
- ✅ Dashboard administrativo

## 🔄 Integração Frontend/Backend

Para conectar o frontend ao backend real:

1. **Atualize os serviços** em `src/services/` para usar a API real
2. **Configure a base URL** da API no frontend
3. **Implemente autenticação JWT** no backend
4. **Adicione interceptors** para tratamento de erros

Exemplo de integração:
```typescript
// src/services/api.ts
const API_BASE_URL = 'http://localhost:3001/api';

export const clientesAPI = {
  getAll: () => fetch(`${API_BASE_URL}/clientes`),
  create: (data) => fetch(`${API_BASE_URL}/clientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
};
```

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
