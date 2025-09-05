# 🧪 Contas de Teste - Sistema Venda Certa

## 📋 Credenciais de Acesso

### 👨‍💼 **Admin**
- **Email:** `admin@email.com`
- **Senha:** Qualquer senha
- **Acesso:** Painel administrativo completo
- **Funcionalidades:** Gerenciar usuários, produtos, pedidos e relatórios

### 🚚 **Entregadores**
- **Carlos Entregador**
  - **Email:** `carlos.entregador@email.com`
  - **Senha:** Qualquer senha
  - **ID:** 5
  - **Pedidos ativos:** 3 pedidos (2 em rota, 1 processando)

- **Bruno Moto**
  - **Email:** `bruno.moto@email.com`
  - **Senha:** Qualquer senha
  - **ID:** 7
  - **Pedidos ativos:** 1 pedido em rota

- **Rafael Express**
  - **Email:** `rafael.express@email.com`
  - **Senha:** Qualquer senha
  - **ID:** 8
  - **Pedidos ativos:** 1 pedido processando

### 👤 **Clientes**
- **João Silva**
  - **Email:** `joao.silva@email.com`
  - **Senha:** Qualquer senha
  - **Status:** Ativo
  - **Histórico:** 5 pedidos realizados

- **Maria Santos**
  - **Email:** `maria.santos@email.com`
  - **Senha:** Qualquer senha
  - **Status:** Ativo
  - **Histórico:** 12 pedidos realizados

- **Pedro Costa**
  - **Email:** `pedro.costa@email.com`
  - **Senha:** Qualquer senha
  - **Status:** Ativo
  - **Histórico:** 3 pedidos realizados

## 🎯 Como Testar

### Para Testar o Sistema de Delivery:
1. **Login:** Use `carlos.entregador@email.com`
2. **Acesse:** A aba "Meus Pedidos"
3. **Verifique:** Pedidos ordenados por prioridade
4. **Teste:** Filtros de status
5. **Explore:** Detalhes completos dos pedidos (endereços, produtos, cliente)

### Para Testar o Painel Admin:
1. **Login:** Use `admin@email.com`
2. **Acesse:** Dashboard administrativo
3. **Explore:** Gestão de usuários, produtos e pedidos

### Para Testar a Experiência do Cliente:
1. **Login:** Use `joao.silva@email.com`
2. **Acesse:** Catálogo de produtos
3. **Explore:** Carrinho, checkout e histórico de pedidos

## 📊 Status dos Pedidos

- **0** - Recebido (novo)
- **1** - Processando 
- **2** - Preparando
- **3** - Em rota de entrega (prioridade alta)
- **4** - Entregue
- **5** - Cancelado

## 🎨 Melhorias Implementadas

✅ **Sistema de Delivery:**
- Pedidos ordenados por prioridade de status
- Filtros atualizados com novos status
- Exibição de nomes ao invés de IDs
- Informações completas de endereço e produtos
- Interface rica com detalhes do cliente

✅ **Dados Integrados:**
- Fonte única de dados (databaseMockData.ts)
- Relacionamentos automáticos entre tabelas
- Dados enriquecidos com joins

## 🚀 Acesso Rápido

- **Aplicação:** http://localhost:5174/
- **Qualquer senha funciona** - sistema de demonstração
- **Dados persistem** apenas durante a sessão
