# Padrões de Projeto Implementados

Este documento descreve os 8 padrões de projeto implementados no sistema, focando no reuso de software.

## 1. Padrão Singleton (2 exemplos)

### 1.1 DatabaseConnection Singleton
**Localização:** `/backend/src/config/database.ts`

**Finalidade:** Garantir uma única instância de conexão com o banco de dados em toda a aplicação.

**Benefícios:**
- Evita múltiplas conexões desnecessárias
- Centraliza a configuração do banco
- Facilita o gerenciamento da conexão

**Uso:**
```typescript
const dbConnection = DatabaseConnection.getInstance();
await dbConnection.connect();
```

### 1.2 Logger Singleton
**Localização:** `/backend/src/utils/Logger.ts`

**Finalidade:** Gerenciar logs de forma centralizada com uma única instância.

**Benefícios:**
- Logs consistentes em toda a aplicação
- Gerenciamento centralizado de histórico
- Evita inconsistências entre instâncias

**Uso:**
```typescript
const logger = Logger.getInstance();
logger.info('Mensagem de log');
```

## 2. Padrão Template Method (3 exemplos)

### 2.1 AbstractController Template Method
**Localização:** `/backend/src/controllers/AbstractController.ts`

**Finalidade:** Define um algoritmo padrão para processamento de requisições HTTP.

**Algoritmo:**
1. Log da requisição
2. Validação de entrada
3. Processamento específico (implementado pelas subclasses)
4. Log do resultado
5. Formatação da resposta
6. Tratamento de erros

**Benefícios:**
- Padronização do fluxo de processamento
- Reutilização de código comum
- Flexibilidade para implementações específicas

### 2.2 DataProcessor Template Method
**Localização:** `/backend/src/utils/DataProcessor.ts`

**Finalidade:** Define um algoritmo padrão para processamento de dados.

**Algoritmo:**
1. Validação dos dados de entrada
2. Normalização dos dados
3. Processamento específico (implementado pelas subclasses)
4. Validação do resultado
5. Formatação do resultado final

**Implementações:**
- `ProdutoDataProcessor`: Para processamento de dados de produtos
- `UsuarioDataProcessor`: Para processamento de dados de usuários

### 2.3 ReportGenerator Template Method
**Localização:** `/backend/src/utils/ReportGenerator.ts`

**Finalidade:** Define um algoritmo padrão para geração de relatórios.

**Algoritmo:**
1. Validação dos parâmetros
2. Coleta de dados
3. Processamento dos dados
4. Formatação do relatório (implementado pelas subclasses)
5. Adição de cabeçalho e rodapé

**Implementações:**
- `ProdutoReportGenerator`: Relatórios de produtos
- `PedidoReportGenerator`: Relatórios de pedidos

## 3. Padrão Strategy (3 exemplos)

### 3.1 Payment Strategy
**Localização:** `/backend/src/utils/PaymentStrategy.ts`

**Finalidade:** Diferentes estratégias de processamento de pagamento.

**Estratégias Implementadas:**
- `CreditCardPaymentStrategy`: Pagamento com cartão de crédito
- `PixPaymentStrategy`: Pagamento via PIX
- `CashPaymentStrategy`: Pagamento em dinheiro

**Benefícios:**
- Facilita adição de novos métodos de pagamento
- Isolamento da lógica de cada método
- Testabilidade individual de cada estratégia

### 3.2 Delivery Strategy
**Localização:** `/backend/src/utils/DeliveryStrategy.ts`

**Finalidade:** Diferentes estratégias de cálculo de entrega.

**Estratégias Implementadas:**
- `MotorcycleDeliveryStrategy`: Entrega por moto
- `CarDeliveryStrategy`: Entrega por carro
- `PickupDeliveryStrategy`: Retirada no local

**Benefícios:**
- Flexibilidade para diferentes tipos de entrega
- Cálculos específicos por modalidade
- Facilita expansão para novos métodos

### 3.3 Search Strategy
**Localização:** `/backend/src/utils/SearchStrategy.ts`

**Finalidade:** Diferentes estratégias de busca de produtos.

**Estratégias Implementadas:**
- `SimpleNameSearchStrategy`: Busca simples por nome
- `AdvancedSearchStrategy`: Busca avançada em múltiplos campos
- `CategorySearchStrategy`: Busca por categoria

**Benefícios:**
- Otimização específica para cada tipo de busca
- Facilita A/B testing de algoritmos
- Performance otimizada por contexto

## 4. Exemplo de Uso Combinado

### EnhancedProdutoController
**Localização:** `/backend/src/controllers/EnhancedProdutoController.ts`

Este controller demonstra o uso combinado de todos os padrões implementados:

1. **Herda de AbstractController** (Template Method)
2. **Usa Logger e DatabaseConnection** (Singleton)
3. **Implementa múltiplas strategies** (Strategy Pattern)

**Endpoints disponíveis:**
- `/produtos/enhanced/search` - Busca com diferentes estratégias
- `/produtos/enhanced/process` - Processamento de dados
- `/produtos/enhanced/report` - Geração de relatórios
- `/produtos/enhanced/payment` - Processamento de pagamentos
- `/produtos/enhanced/delivery` - Cálculo de entrega

## Benefícios dos Padrões Implementados

### Reusabilidade
- Classes base podem ser estendidas para novas funcionalidades
- Strategies podem ser reutilizadas em diferentes contextos
- Singletons evitam duplicação de recursos

### Manutenibilidade
- Código organizado em padrões conhecidos
- Facilita mudanças futuras
- Separação clara de responsabilidades

### Extensibilidade
- Novos algoritmos podem ser adicionados facilmente
- Template methods permitem customização específica
- Strategies facilitam adição de novos comportamentos

### Testabilidade
- Cada padrão pode ser testado isoladamente
- Mock objects facilitados pelos padrões
- Testes unitários mais focados

## Como Usar

### 1. Instalar dependências
```bash
cd backend
npm install
```

### 2. Configurar ambiente
```bash
cp .env.example .env
# Configurar variáveis no arquivo .env
```

### 3. Executar o servidor
```bash
npm run dev
```

### 4. Testar os padrões implementados

#### 4.1. Endpoints de Demonstração
- **GET** `/api/demo/patterns` - Demonstração completa de todos os padrões
- **POST** `/api/demo/test-pattern` - Teste específico de um padrão
- **GET** `/api/health` - Status da aplicação com informações dos padrões

#### 4.2. Endpoints dos Padrões em Ação

**Padrão Strategy - Busca de Produtos:**
```bash
# Busca simples
GET /api/produtos/search?q=notebook&type=simple

# Busca avançada
GET /api/produtos/search?q=notebook gamer&type=advanced&limit=10

# Busca por categoria
GET /api/produtos/search?q=eletrônicos&type=category
```

**Padrão Strategy - Cálculo de Entrega:**
```bash
POST /api/pedidos/calculate-delivery
{
  "distance": 5,
  "weight": 2,
  "method": "motorcycle",
  "urgency": "normal"
}

# Resposta:
{
  "success": true,
  "data": {
    "deliveryMethod": "Entrega por Moto",
    "fee": 12.50,
    "estimatedTime": 45,
    "canDeliver": true
  }
}
```

**Padrão Strategy - Processamento de Pagamento:**
```bash
POST /api/pedidos/process-payment
{
  "amount": 100,
  "method": "pix",
  "paymentData": {
    "pixKey": "cliente@email.com"
  }
}

# Resposta:
{
  "success": true,
  "data": {
    "success": true,
    "transactionId": "PIX_1234567890",
    "message": "Pagamento PIX processado instantaneamente",
    "fees": 0,
    "paymentMethod": "PIX"
  }
}
```

**Padrão Template Method - Criação de Pedido:**
```bash
POST /api/pedidos
{
  "fk_usuario_id": 1,
  "produtos": [
    {
      "fk_produto_id": 1,
      "quantidade": 2
    }
  ],
  "endereco": {
    "id": 1
  },
  "pagamento": {
    "method": "credit_card",
    "metodoPagamentoId": 1,
    "data": {
      "cardNumber": "1234567890123456",
      "expiryDate": "12/25",
      "cvv": "123",
      "holderName": "João Silva"
    }
  },
  "entrega": {
    "method": "motorcycle",
    "metodoEntregaId": 1,
    "distance": 5,
    "weight": 2,
    "urgency": "normal"
  }
}
```

**Padrão Template Method - Geração de Relatório:**
```bash
GET /api/pedidos/report?startDate=2024-01-01&endDate=2024-12-31&status=5

# Resposta:
{
  "success": true,
  "data": {
    "report": "=== RELATÓRIO SISTEMA VENDA CERTA ===\nGerado em: 09/09/2025...",
    "generatedAt": "2025-09-09T...",
    "filters": {...}
  }
}
```

### 5. Exemplo de uso das strategies de pagamento
```typescript
import { PaymentProcessor, PaymentStrategyFactory } from './utils/PaymentStrategy';

const strategy = PaymentStrategyFactory.createStrategy('pix');
const processor = new PaymentProcessor(strategy);
const result = await processor.processPayment(100, { pixKey: 'chave@pix.com' });
```

### 6. Exemplo de uso do template method
```typescript
import { ProdutoDataProcessor } from './utils/DataProcessor';

const processor = new ProdutoDataProcessor();
const result = processor.processData({
  nome: 'Produto Teste',
  preco: '29.90',
  status: 'ativo'
});
```

### 7. Exemplo de uso dos singletons
```typescript
import { Logger } from './utils/Logger';
import { DatabaseConnection } from './config/database';

const logger = Logger.getInstance();
const db = DatabaseConnection.getInstance();

logger.info('Aplicação iniciada');
await db.connect();
```

### 8. Monitoramento e Logs
O padrão Singleton Logger centraliza todos os logs da aplicação:

```bash
# Visualizar logs via endpoint (desenvolvimento)
GET /api/demo/test-pattern
{
  "pattern": "singleton",
  "action": "logger"
}
```

### 9. Flexibilidade dos Padrões Strategy
Você pode facilmente trocar estratégias em tempo de execução:

```typescript
// Começar com uma estratégia
const searchEngine = new ProductSearchEngine(new SimpleNameSearchStrategy());

// Trocar para outra estratégia conforme necessário
searchEngine.setStrategy(new AdvancedSearchStrategy());

// Ou usar a factory para decidir dinamicamente
const strategy = SearchStrategyFactory.getBestSearchStrategy(userQuery);
searchEngine.setStrategy(strategy);
```

## Conclusão

Os padrões implementados proporcionam uma base sólida para o sistema de venda, facilitando futuras extensões e manutenções. Cada padrão foi escolhido para resolver problemas específicos e melhorar a qualidade do código através do reuso de software.
