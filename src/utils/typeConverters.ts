// Type conversion utilities to maintain backward compatibility
// while supporting the new database schema structure

import type {
  Usuario, Customer, Product, Produto, Categoria, Category,
  Endereco, Address, Pedido, Order, MetodoEntrega, DeliveryMethod,
  MetodoPagamento, PaymentMethod, ProdutoPedido, OrderItem,
  AtualizacaoPedido, OrderTimelineEvent, AvaliacaoProduto, Review
} from '../types';

// Convert database Usuario to legacy Customer
export function usuarioToCustomer(usuario: Usuario, addresses: Endereco[] = [], orders: Pedido[] = []): Customer {
  return {
    ...usuario,
    // Map database fields to legacy fields
    name: usuario.nome,
    role: 'customer' as const,
    phone: usuario.numeroCelular,
    // Legacy fields that don't exist in database
    avatar: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    addresses: addresses.map(enderecoToAddress),
    orders: orders.map(pedidoToOrder),
    isVip: usuario.nota ? usuario.nota >= 4.5 : false,
    isBlocked: usuario.status === 0,
    totalOrders: usuario.totalPedidos,
    totalSpent: usuario.totalGasto,
    lastOrderDate: undefined // Would need to be calculated from orders
  };
}

// Convert legacy Customer to database Usuario
export function customerToUsuario(customer: Customer): Usuario {
  return {
    id: typeof customer.id === 'string' ? parseInt(customer.id) : customer.id,
    nome: customer.name || customer.nome || '',
    email: customer.email,
    cargo: 'customer',
    numeroCelular: customer.phone || customer.numeroCelular,
    status: customer.isBlocked ? 0 : 1,
    totalPedidos: customer.totalOrders || customer.totalPedidos || 0,
    totalGasto: customer.totalSpent || customer.totalGasto || 0,
    entregasFeitas: 0, // Default value
    nota: customer.isVip ? 5.0 : undefined
  };
}

// Convert database Endereco to legacy Address
export function enderecoToAddress(endereco: Endereco): Address {
  return {
    ...endereco,
    // Map database fields to legacy fields
    street: endereco.rua,
    number: endereco.numero,
    complement: endereco.complemento,
    neighborhood: endereco.bairro,
    city: endereco.cidade,
    state: endereco.estado,
    zipCode: endereco.cep,
    isDefault: endereco.favorito,
    customerId: endereco.fk_usuario_id,
    // Legacy fields that don't exist in database
    createdAt: undefined,
    updatedAt: undefined
  };
}

// Convert legacy Address to database Endereco
export function addressToEndereco(address: Address, fk_usuario_id: number): Endereco {
  return {
    id: typeof address.id === 'string' ? parseInt(address.id) : address.id,
    rua: address.street || address.rua || '',
    numero: address.number || address.numero || '',
    complemento: address.complement || address.complemento,
    bairro: address.neighborhood || address.bairro || '',
    cidade: address.city || address.cidade || '',
    estado: address.state || address.estado || '',
    cep: address.zipCode || address.cep || '',
    favorito: address.isDefault || address.favorito || false,
    fk_usuario_id: address.customerId || fk_usuario_id || 1
  };
}

// Convert database Produto to legacy Product
export function produtoToProduct(produto: Produto, categoria?: Categoria): Product {
  return {
    id: produto.id,
    name: produto.nome,
    description: produto.descricao || '',
    shortDescription: produto.descricaoResumida,
    category: categoria ? categoriaToCategory(categoria) : undefined,
    categoryId: produto.fk_categoria_id,
    price: produto.preco,
    unit: produto.medida,
    stock: produto.estoque,
    status: produto.status === 1 ? 'active' : produto.status === 0 ? 'inactive' : 'out_of_stock',
    images: [], // Would need separate table in real implementation
    tags: produto.tags ? produto.tags.split(',') : [],
    sku: produto.sku,
    variations: [] // Not in database schema
  };
}

// Convert legacy Product to database Produto
export function productToProduto(product: Product): Produto {
  return {
    id: typeof product.id === 'string' ? parseInt(product.id) : product.id,
    sku: product.sku,
    nome: product.name,
    descricao: product.description,
    descricaoResumida: product.shortDescription,
    preco: product.price,
    medida: product.unit,
    estoque: product.stock,
    status: product.status === 'active' ? 1 : product.status === 'inactive' ? 0 : 2,
    imagem: undefined, // Binary data would need special handling
    tags: product.tags.join(','),
    fk_categoria_id: typeof product.categoryId === 'string' ? parseInt(product.categoryId) : product.categoryId
  };
}

// Convert database Categoria to legacy Category
export function categoriaToCategory(categoria: Categoria): Category {
  return {
    ...categoria,
    name: categoria.nome,
    description: categoria.descricao,
    isActive: categoria.estaAtiva
  };
}

// Convert legacy Category to database Categoria
export function categoryToCategoria(category: Category): Categoria {
  return {
    id: typeof category.id === 'string' ? parseInt(category.id) : category.id,
    nome: category.name || category.nome || '',
    descricao: category.description || category.descricao,
    estaAtiva: category.isActive !== undefined ? category.isActive : category.estaAtiva !== undefined ? category.estaAtiva : true
  };
}

// Convert database Pedido to legacy Order
export function pedidoToOrder(pedido: Pedido, customer?: Customer, items?: OrderItem[]): Order {
  return {
    id: pedido.id,
    customerId: pedido.fk_usuario_id,
    customer,
    items,
    total: pedido.total,
    status: mapDatabaseStatusToLegacy(pedido.status),
    deliveryAddress: undefined, // Would need to be fetched
    deliveryAddressId: pedido.fk_endereco_id,
    deliveryMethod: undefined, // Would need to be fetched
    deliveryMethodId: pedido.fk_metodoEntrega_id,
    deliveryFee: pedido.taxaEntrega,
    paymentMethod: undefined, // Would need to be fetched
    paymentMethodId: pedido.fk_metodoPagamento_id,
    paymentStatus: mapDatabasePaymentStatusToLegacy(pedido.statusPagamento),
    estimatedDelivery: pedido.estimativaEntrega,
    deliveredAt: pedido.dataEntrega,
    notes: pedido.anotacoes,
    cancelReason: pedido.motivoCancelamento,
    timeline: [], // Would need to be fetched from AtualizacaoPedido
    deliveryDriverId: pedido.fk_entregador_id,
    deliveryDriver: undefined // Would need to be fetched
  };
}

// Helper function to map database status to legacy status
function mapDatabaseStatusToLegacy(status: number): 'received' | 'processing' | 'shipped' | 'delivered' | 'cancelled' {
  switch (status) {
    case 1: return 'received';
    case 2: return 'processing';
    case 3: return 'shipped';
    case 4: return 'delivered';
    case 5: return 'cancelled';
    default: return 'received';
  }
}

// Helper function to map database payment status to legacy payment status
function mapDatabasePaymentStatusToLegacy(status: number): 'pending' | 'paid' | 'failed' | 'refunded' {
  switch (status) {
    case 1: return 'pending';
    case 2: return 'paid';
    case 3: return 'failed';
    case 4: return 'refunded';
    default: return 'pending';
  }
}

// Convert database MetodoEntrega to legacy DeliveryMethod
export function metodoEntregaToDeliveryMethod(metodoEntrega: MetodoEntrega): DeliveryMethod {
  return {
    id: metodoEntrega.id,
    name: metodoEntrega.nome,
    description: metodoEntrega.descricao || '',
    type: mapDeliveryTypeToLegacy(metodoEntrega.tipo),
    price: metodoEntrega.preco,
    estimatedDays: parseEstimatedDays(metodoEntrega.estimativaEntrega),
    isActive: metodoEntrega.status === 1,
    regions: [], // Not in database schema
    schedule: [] // Not in database schema
  };
}

// Helper function to map delivery type
function mapDeliveryTypeToLegacy(tipo: string): 'pickup' | 'delivery' | 'fixed_shipping' {
  if (tipo.toLowerCase().includes('pickup') || tipo.toLowerCase().includes('retirada')) return 'pickup';
  if (tipo.toLowerCase().includes('delivery') || tipo.toLowerCase().includes('entrega')) return 'delivery';
  return 'fixed_shipping';
}

// Helper function to parse estimated days from string
function parseEstimatedDays(estimativa?: string): number {
  if (!estimativa) return 1;
  const match = estimativa.match(/\d+/);
  return match ? parseInt(match[0]) : 1;
}

// Convert database MetodoPagamento to legacy PaymentMethod
export function metodoPagamentoToPaymentMethod(metodoPagamento: MetodoPagamento): PaymentMethod {
  return {
    id: metodoPagamento.id,
    name: metodoPagamento.nome,
    type: mapPaymentTypeToLegacy(metodoPagamento.tipo),
    isActive: metodoPagamento.ativo === 1,
    config: undefined // Not in database schema
  };
}

// Helper function to map payment type
function mapPaymentTypeToLegacy(tipo: string): 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer' | 'cash' {
  const tipoLower = tipo.toLowerCase();
  if (tipoLower.includes('credit') || tipoLower.includes('credito')) return 'credit_card';
  if (tipoLower.includes('debit') || tipoLower.includes('debito')) return 'debit_card';
  if (tipoLower.includes('pix')) return 'pix';
  if (tipoLower.includes('transfer') || tipoLower.includes('transferencia')) return 'bank_transfer';
  if (tipoLower.includes('cash') || tipoLower.includes('dinheiro')) return 'cash';
  return 'cash';
}

// String to number conversion utilities
export function safeStringToNumber(value: string | number): number {
  if (typeof value === 'number') return value;
  const parsed = parseInt(value);
  return isNaN(parsed) ? 0 : parsed;
}

export function safeNumberToString(value: number | string): string {
  if (typeof value === 'string') return value;
  return value.toString();
}