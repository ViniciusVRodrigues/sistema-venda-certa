# Dados Mock do Entregador - Sistema Venda Certa

## 📋 Visão Geral

Este documento descreve os dados mock criados para a funcionalidade de entregador, seguindo fielmente a estrutura do banco de dados PostgreSQL definida em `database_schema.sql`.

## 🚴 Entregadores Cadastrados

### Carlos Entregador (ID: 5)
- **Email:** carlos.entregador@email.com
- **Telefone:** 11999995555
- **Status:** Ativo
- **Entregas Realizadas:** 150
- **Nota:** 4.8/5.0
- **Pedidos Atribuídos:** 3 pedidos (2 em rota, 1 aguardando)

### Bruno Moto (ID: 7)
- **Email:** bruno.moto@email.com
- **Telefone:** 11999997777
- **Status:** Ativo
- **Entregas Realizadas:** 89
- **Nota:** 4.6/5.0
- **Pedidos Atribuídos:** 3 pedidos (1 em rota, 2 entregues hoje)

### Rafael Express (ID: 8)
- **Email:** rafael.express@email.com
- **Telefone:** 11999998888
- **Status:** Ativo
- **Entregas Realizadas:** 203
- **Nota:** 4.9/5.0
- **Pedidos Atribuídos:** 3 pedidos (1 aguardando, 2 entregues hoje)

## 📦 Estrutura dos Pedidos

### Status dos Pedidos (Campo `status`)
- **1:** Recebido
- **2:** Em Preparação
- **3:** Em Rota (Saiu para Entrega)
- **4:** Entregue
- **5:** Cancelado

### Status de Pagamento (Campo `statusPagamento`)
- **1:** Pendente
- **2:** Pago
- **3:** Falhou
- **4:** Reembolsado

## 🗂️ Dados Disponíveis

### Pedidos por Entregador

#### Carlos Entregador (ID: 5)
1. **Pedido #4** - Em Rota (Status 3)
   - Cliente: João Silva
   - Total: R$ 89,75
   - Endereço: Rua das Flores, 123 - Centro, São Paulo
   - Observações: "Apartamento no 4º andar, interfone 45"

2. **Pedido #5** - Em Rota (Status 3)
   - Cliente: Maria Santos
   - Total: R$ 34,49
   - Endereço: Rua Augusta, 456 - Consolação, São Paulo
   - Observações: "Entregar com o porteiro se não estiver em casa"

3. **Pedido #6** - Em Preparação (Status 2)
   - Cliente: Pedro Costa
   - Total: R$ 56,90
   - Endereço: Rua Oscar Freire, 789 - Jardins, São Paulo
   - Observações: "Cliente solicita produtos bem maduros"

#### Bruno Moto (ID: 7)
1. **Pedido #7** - Em Rota (Status 3)
   - Cliente: João Silva
   - Total: R$ 127,25
   - Observações: "Casa com portão azul, cuidado com o cachorro"

2. **Pedido #8** - Entregue Hoje (Status 4)
   - Cliente: Maria Santos
   - Total: R$ 68,40
   - Entregue às: 14:45 hoje

3. **Pedido #9** - Entregue Hoje (Status 4)
   - Cliente: Pedro Costa
   - Total: R$ 43,50
   - Entregue às: 12:15 hoje

#### Rafael Express (ID: 8)
1. **Pedido #10** - Em Preparação (Status 2)
   - Cliente: João Silva
   - Total: R$ 95,30
   - Observações: "Pedido especial para festa de aniversário"

2. **Pedido #11** - Entregue Hoje (Status 4)
   - Cliente: Maria Santos
   - Total: R$ 78,85
   - Entregue às: 15:50 hoje

3. **Pedido #12** - Entregue Hoje (Status 4)
   - Cliente: Pedro Costa
   - Total: R$ 152,90
   - Entregue às: 12:55 hoje

## 🔧 Como Usar os Dados Mock

### 1. Serviço Principal
```typescript
import { servicoEntregadorPedidos } from '../services/delivery/servicoEntregadorPedidos';

// Obter estatísticas do entregador
const stats = await servicoEntregadorPedidos.obterEstatisticasDashboard(5);

// Obter pedidos do entregador
const pedidos = await servicoEntregadorPedidos.obterPedidos(5);

// Obter histórico de entregas
const historico = await servicoEntregadorPedidos.obterHistoricoEntregas(5);
```

### 2. Hook React
```typescript
import { useEntregadorPedidos } from '../hooks/delivery/useEntregadorPedidos';

const {
  pedidos,
  estatisticas,
  carregando,
  erro,
  atualizarStatusPedido
} = useEntregadorPedidos({
  entregadorId: 5,
  carregarAutomaticamente: true
});
```

### 3. Componente de Dashboard
```typescript
import { DeliveryDashboard } from '../components/delivery/DeliveryDashboard';

// O componente já está configurado para usar o novo serviço
<DeliveryDashboard />
```

## 📊 Estatísticas Disponíveis

### Carlos Entregador (ID: 5)
- **Pedidos Pendentes:** 1
- **Pedidos em Rota:** 2
- **Entregas Hoje:** 0
- **Ganhos Hoje:** R$ 0,00

### Bruno Moto (ID: 7)
- **Pedidos Pendentes:** 0
- **Pedidos em Rota:** 1
- **Entregas Hoje:** 2
- **Ganhos Hoje:** R$ 16,00

### Rafael Express (ID: 8)
- **Pedidos Pendentes:** 1
- **Pedidos em Rota:** 0
- **Entregas Hoje:** 2
- **Ganhos Hoje:** R$ 23,00

## 🎯 Funcionalidades Implementadas

### ✅ Completas
- [x] Dashboard com estatísticas em tempo real
- [x] Lista de pedidos atribuídos ao entregador
- [x] Histórico de entregas realizadas
- [x] Atualização de status dos pedidos
- [x] Filtros por status e busca
- [x] Paginação dos resultados
- [x] Timeline completa dos pedidos
- [x] Informações detalhadas do cliente e endereço
- [x] Produtos do pedido com preços
- [x] Validação de transições de status

### 🔄 Funcionalidades do Entregador
- **Marcar como "Em Rota"**: Pedidos em preparação podem ser marcados como saindo para entrega
- **Marcar como "Entregue"**: Pedidos em rota podem ser marcados como entregues
- **Adicionar Observações**: Entregador pode adicionar notas sobre a entrega
- **Visualizar Detalhes**: Acesso completo aos dados do pedido, cliente e produtos

## 🗃️ Estrutura de Arquivos

```
src/
├── services/
│   ├── mock/
│   │   └── databaseMockData.ts          # Dados mock alinhados com DB
│   └── delivery/
│       ├── servicoEntregadorPedidos.ts  # Serviço principal (português)
│       └── deliveryOrderService.ts      # Serviço legado (inglês)
├── hooks/
│   └── delivery/
│       ├── useEntregadorPedidos.ts      # Hook novo (português)
│       └── useDeliveryOrders.ts         # Hook legado (inglês)
├── components/
│   └── delivery/
│       ├── DeliveryDashboard.tsx        # Atualizado para usar novo serviço
│       ├── DeliveryOrdersList.tsx       # Para atualizar
│       └── DeliveryHistory.tsx          # Para atualizar
└── demo/
    └── demonstracaoEntregador.ts        # Demo dos dados mock
```

## 🚀 Próximos Passos

1. **Atualizar Componentes Restantes**: `DeliveryOrdersList` e `DeliveryHistory`
2. **Testar Interface Completa**: Verificar funcionamento em navegador
3. **Integração com Backend**: Substituir mock por API real quando disponível
4. **Validações Adicionais**: Implementar validações de negócio específicas

## 📝 Notas Importantes

- **Compatibilidade**: Os dados seguem exatamente a estrutura do `database_schema.sql`
- **Interfaces**: Utilizamos as interfaces em português alinhadas com o banco
- **Timestamps**: Todos os horários são configurados para demonstrar cenários realistas
- **Relacionamentos**: Todos os FKs estão corretamente mapeados
- **Validações**: Status e transições seguem regras de negócio apropriadas

## 🔍 Para Testar

Execute a demonstração:
```bash
# No console do navegador ou em ambiente Node
import { demonstrarDadosEntregador } from './src/demo/demonstracaoEntregador';
demonstrarDadosEntregador();
```

Os dados estão prontos para uso e fornecem uma base sólida para o desenvolvimento e teste da funcionalidade de entregador!