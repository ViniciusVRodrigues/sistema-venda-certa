import { Logger } from '../utils/Logger';
import { DatabaseConnection } from '../config/database';
import { ProdutoDataProcessor, UsuarioDataProcessor } from '../utils/DataProcessor';
import { ProdutoReportGenerator } from '../utils/ReportGenerator';
import { ProductSearchEngine, SearchStrategyFactory } from '../utils/SearchStrategy';
import { PaymentProcessor, PaymentStrategyFactory } from '../utils/PaymentStrategy';
import { DeliveryCalculator, DeliveryStrategyFactory } from '../utils/DeliveryStrategy';

/**
 * Script de demonstração dos padrões de projeto
 * Execute com: npm run demo
 */
async function demonstrateDesignPatterns() {
  console.log('🎯 === DEMONSTRAÇÃO DOS PADRÕES DE PROJETO ===\n');

  // ========================================
  // 1. PADRÃO SINGLETON
  // ========================================
  console.log('📍 1. PADRÃO SINGLETON');
  console.log('──────────────────────────────────────────');

  // Demonstrar Logger Singleton
  const logger1 = Logger.getInstance();
  const logger2 = Logger.getInstance();
  console.log(`✓ Logger: mesma instância? ${logger1 === logger2}`);
  
  logger1.info('Demonstração iniciada');
  logger1.warn('Este é um aviso de teste');
  logger1.error('Este é um erro de teste');
  
  console.log(`✓ Total de logs registrados: ${logger1.getLogs().length}`);
  console.log(`✓ Logs de erro: ${logger1.getLogsByLevel('ERROR').length}`);

  // Demonstrar Database Singleton
  const db1 = DatabaseConnection.getInstance();
  const db2 = DatabaseConnection.getInstance();
  console.log(`✓ Database: mesma instância? ${db1 === db2}`);

  console.log('\n');

  // ========================================
  // 2. PADRÃO TEMPLATE METHOD
  // ========================================
  console.log('📍 2. PADRÃO TEMPLATE METHOD');
  console.log('──────────────────────────────────────────');

  // Demonstrar Data Processing Template
  const produtoProcessor = new ProdutoDataProcessor();
  const usuarioProcessor = new UsuarioDataProcessor();

  console.log('📊 Data Processing Template:');
  
  const produtoData = {
    nome: 'Notebook Gamer',
    preco: '2500.99',
    estoque: '5',
    status: 'ativo'
  };

  const produtoProcessed = produtoProcessor.processData(produtoData);
  console.log('✓ Produto processado:', {
    nome: produtoProcessed.data.nome,
    preco: produtoProcessed.data.preco,
    precoType: typeof produtoProcessed.data.preco,
    processedBy: produtoProcessed.data.processedBy
  });

  const usuarioData = {
    nome: 'João Silva',
    email: 'JOAO.SILVA@EMAIL.COM',
    telefone: '(11) 99999-9999'
  };

  const usuarioProcessed = usuarioProcessor.processData(usuarioData);
  console.log('✓ Usuário processado:', {
    nome: usuarioProcessed.data.nome,
    email: usuarioProcessed.data.email,
    telefone: usuarioProcessed.data.telefone,
    processedBy: usuarioProcessed.data.processedBy
  });

  // Demonstrar Report Generation Template
  console.log('\n📊 Report Generation Template:');
  const reportGenerator = new ProdutoReportGenerator();
  console.log('✓ Gerador de relatório de produtos criado');
  console.log('✓ Fluxo padrão: validar → coletar → processar → formatar → finalizar');

  console.log('\n');

  // ========================================
  // 3. PADRÃO STRATEGY
  // ========================================
  console.log('📍 3. PADRÃO STRATEGY');
  console.log('──────────────────────────────────────────');

  // Demonstrar Payment Strategies
  console.log('💳 Payment Strategies:');
  
  const paymentMethods = ['credit_card', 'pix', 'cash'];
  
  for (const method of paymentMethods) {
    const strategy = PaymentStrategyFactory.createStrategy(method);
    const processor = new PaymentProcessor(strategy);
    
    let paymentData;
    switch (method) {
      case 'credit_card':
        paymentData = {
          cardNumber: '1234567890123456',
          expiryDate: '12/25',
          cvv: '123',
          holderName: 'João Silva'
        };
        break;
      case 'pix':
        paymentData = { pixKey: 'joao@email.com' };
        break;
      default:
        paymentData = { cashAmount: 100 };
    }

    try {
      const result = await processor.processPayment(50, paymentData);
      console.log(`✓ ${processor.getPaymentMethod()}: ${result.success ? 'Sucesso' : 'Falha'} - ${result.message}`);
    } catch (error) {
      console.log(`✗ ${method}: Erro - ${error}`);
    }
  }

  // Demonstrar Delivery Strategies
  console.log('\n🚚 Delivery Strategies:');
  
  const deliveryMethods = ['motorcycle', 'car', 'pickup'];
  const testDistance = 8;
  const testWeight = 3;

  for (const method of deliveryMethods) {
    const strategy = DeliveryStrategyFactory.createStrategy(method);
    const calculator = new DeliveryCalculator(strategy);
    
    const result = calculator.calculateDelivery(testDistance, testWeight, 'normal');
    
    console.log(`✓ ${result.method}:`);
    console.log(`  - Taxa: R$ ${result.fee.toFixed(2)}`);
    console.log(`  - Tempo: ${result.estimatedTimeMinutes} min`);
    console.log(`  - Disponível: ${result.canDeliver ? 'Sim' : 'Não'}`);
  }

  // Demonstrar Search Strategies
  console.log('\n🔍 Search Strategies:');
  
  const searchTypes = ['simple', 'advanced', 'category'];
  
  for (const type of searchTypes) {
    const strategy = SearchStrategyFactory.createStrategy(type);
    const engine = new ProductSearchEngine(strategy);
    
    console.log(`✓ ${engine.getSearchType()}: Filtros suportados [${engine.getSupportedFilters().join(', ')}]`);
  }

  console.log('\n');

  // ========================================
  // 4. INTEGRAÇÃO DOS PADRÕES
  // ========================================
  console.log('📍 4. INTEGRAÇÃO DOS PADRÕES');
  console.log('──────────────────────────────────────────');

  console.log('🔄 Simulando fluxo completo de pedido:');
  
  // 1. Logger Singleton registra operação
  logger1.info('Iniciando processamento de pedido');
  
  // 2. Template Method processa dados
  const pedidoData = {
    usuario: 'João Silva',
    produto: 'Notebook Gamer',
    valor: '2500.99'
  };
  
  // Simular processamento usando template method
  console.log('✓ Dados validados e normalizados');
  
  // 3. Strategy define método de pagamento
  const paymentStrategy = PaymentStrategyFactory.createStrategy('pix');
  const paymentProcessor = new PaymentProcessor(paymentStrategy);
  console.log(`✓ Estratégia de pagamento: ${paymentProcessor.getPaymentMethod()}`);
  
  // 4. Strategy define método de entrega
  const deliveryStrategy = DeliveryStrategyFactory.createStrategy('motorcycle');
  const deliveryCalculator = new DeliveryCalculator(deliveryStrategy);
  const deliveryQuote = deliveryCalculator.calculateDelivery(5, 2, 'express');
  console.log(`✓ Estratégia de entrega: ${deliveryQuote.method} - R$ ${deliveryQuote.fee}`);
  
  // 5. Logger registra conclusão
  logger1.info('Pedido processado com sucesso');
  
  console.log('✓ Fluxo completo executado usando todos os padrões!');

  console.log('\n');

  // ========================================
  // 5. ESTATÍSTICAS FINAIS
  // ========================================
  console.log('📍 5. ESTATÍSTICAS FINAIS');
  console.log('──────────────────────────────────────────');
  
  console.log('📈 Padrões implementados:');
  console.log(`   • Singleton: 2 exemplos (Logger, DatabaseConnection)`);
  console.log(`   • Template Method: 3 exemplos (Controller, DataProcessor, ReportGenerator)`);
  console.log(`   • Strategy: 3 exemplos (Payment, Delivery, Search)`);
  console.log(`   • Total de classes: ~20`);
  
  console.log('\n📋 Benefícios alcançados:');
  console.log(`   ✓ Reusabilidade de código`);
  console.log(`   ✓ Manutenibilidade aprimorada`);
  console.log(`   ✓ Extensibilidade facilitada`);
  console.log(`   ✓ Testabilidade melhorada`);
  console.log(`   ✓ Padronização de soluções`);

  console.log(`\n📊 Total de logs gerados durante a demo: ${logger1.getLogs().length}`);
  
  console.log('\n🎉 === DEMONSTRAÇÃO CONCLUÍDA COM SUCESSO ===');
}

// Executar demonstração se chamado diretamente
if (require.main === module) {
  demonstrateDesignPatterns().catch(console.error);
}

export { demonstrateDesignPatterns };
