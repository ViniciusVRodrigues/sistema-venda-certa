// Database schema aligned interfaces
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  cargo: string;
  numeroCelular?: string;
  status: number; // TINYINT
  senha: string;
  totalPedidos: number;
  totalGasto: number; // DECIMAL(10,2)
  entregasFeitas: number;
  nota?: number; // DECIMAL(2,1)
}

// Legacy compatibility interfaces - extend Usuario with different role types
export interface Customer extends Usuario {
  cargo: 'customer';
  addresses?: Endereco[];
  orders?: Pedido[];
  // Legacy properties mapped to database fields
  name: string; // Maps to nome
  phone?: string; // Maps to numeroCelular
  totalOrders: number; // Maps to totalPedidos
  totalSpent: number; // Maps to totalGasto
  isVip?: boolean; // Custom property not in database
  isBlocked?: boolean; // Custom property not in database
  lastOrderDate?: Date; // Calculated from orders
  createdAt?: Date; // Not in database schema
  updatedAt?: Date; // Not in database schema
}

export interface Admin extends Usuario {
  cargo: 'admin';
  permissions?: string[];
}

export interface Delivery extends Usuario {
  cargo: 'delivery';
  vehicle?: string;
  assignedOrders?: number[];
}

// Alias for backward compatibility - add role property for legacy code
export interface User extends Usuario {
  role: string; // Maps to cargo for compatibility
}
export interface Entregador extends Usuario {
  cargo: 'delivery';
}

export interface Endereco {
  id: number;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string; // Note: schema has typo "VACHAR(2)" but should be VARCHAR(2)
  cep: string;
  favorito: boolean;
  fk_usuario_id: number;
}

// Legacy compatibility alias
export interface Address {
  id: number;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  customerId: number;
}

export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
  estaAtiva: boolean;
}

// Legacy compatibility alias
export interface Category {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface Produto {
  id: number;
  sku?: string;
  nome: string;
  descricao?: string; // TEXT field
  descricaoResumida?: string;
  preco: number; // DECIMAL(10,2)
  medida: string;
  estoque: number;
  status: number; // TINYINT
  imagem?: Uint8Array; // MEDIUMBLOB - represented as Uint8Array for binary data
  tags?: string;
  fk_categoria_id: number;
}

// Legacy compatibility interface
export interface Product {
  id: number;
  name: string;
  description?: string;
  shortDescription?: string;
  category?: Category;
  categoryId: number;
  price: number;
  unit: string;
  variations?: ProductVariation[];
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  images: string[];
  tags: string[];
  sku?: string;
}

// ProductVariation is not in the database schema - keeping for compatibility but not aligned with DB
export interface ProductVariation {
  id: number;
  productId?: number;
  name: string;
  price: number;
  stock: number;
  sku?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface CartItem {
  productId: number;
  product: Product;
  quantity: number;
  variationId?: number;
  variation?: ProductVariation;
}

export interface Pedido {
  id: number;
  status: number; // TINYINT
  total: number; // DECIMAL(10,2)
  subtotal: number; // DECIMAL(10,2)
  taxaEntrega: number; // DECIMAL(10,2)
  statusPagamento: number; // TINYINT
  anotacoes?: string; // TEXT
  motivoCancelamento?: string; // TEXT
  estimativaEntrega?: Date; // DATETIME
  dataEntrega?: Date; // DATETIME
  fk_entregador_id?: number;
  fk_metodoPagamento_id: number;
  fk_usuario_id: number;
  fk_metodoEntrega_id: number;
  fk_endereco_id: number;
}

// Legacy compatibility alias
export interface Order {
  id: number;
  customerId: number;
  customer?: Customer;
  items?: OrderItem[];
  total: number;
  status: 'received' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  deliveryAddress?: Address;
  deliveryAddressId: number;
  deliveryMethod?: DeliveryMethod;
  deliveryMethodId: number;
  deliveryFee: number;
  paymentMethod?: PaymentMethod;
  paymentMethodId: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  notes?: string;
  cancelReason?: string;
  timeline?: OrderTimelineEvent[];
  deliveryDriverId?: number;
  deliveryDriver?: Delivery;
}

export interface ProdutoPedido {
  id: number;
  quantidade: number;
  preco: number; // DECIMAL(10,2)
  fk_produto_id: number;
  fk_pedido_id: number;
}

// Legacy compatibility alias
export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  product?: Product;
  quantity: number;
  price: number;
  variationId?: number;
  variation?: ProductVariation;
}

export interface AtualizacaoPedido {
  id: number;
  status: number; // TINYINT
  timestamp: Date; // DATETIME
  descricao?: string; // TEXT
  fk_usuario_id?: number;
  fk_pedido_id: number;
}

// Legacy compatibility alias
export interface OrderTimelineEvent {
  id: number;
  orderId: number;
  status: Order['status'];
  timestamp: Date;
  description?: string;
  userId?: number;
  userName?: string;
}

export interface AvaliacaoProduto {
  id: number;
  avaliacao: number; // TINYINT (1-5 rating)
  comentario?: string; // TEXT
  fk_produto_id: number;
  fk_usuario_id: number;
}

// Legacy compatibility alias
export interface Review {
  id: number;
  productId: number;
  customerId: number;
  customer?: Customer;
  rating: number;
  comment?: string;
}

export interface MetodoEntrega {
  id: number;
  descricao?: string;
  tipo: string;
  estimativaEntrega?: string;
  status: number; // TINYINT
  nome: string;
  preco: number; // DECIMAL(10,2)
}

// Legacy compatibility alias
export interface DeliveryMethod {
  id: number;
  name: string;
  description?: string;
  type: 'pickup' | 'delivery' | 'fixed_shipping';
  price: number;
  estimatedDays: number;
  isActive: boolean;
  regions?: DeliveryRegion[];
  schedule?: DeliverySchedule[];
}

export interface MetodoPagamento {
  id: number;
  nome: string;
  tipo: string;
  ativo: number; // TINYINT
}

// Legacy compatibility alias
export interface PaymentMethod {
  id: number;
  name: string;
  type: 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer' | 'cash';
  isActive: boolean;
  config?: PaymentMethodConfig;
}

// These interfaces are not part of the database schema but kept for application functionality
export interface DeliveryRegion {
  id: number;
  deliveryMethodId?: number;
  name: string;
  zipCodeStart: string;
  zipCodeEnd: string;
  neighborhoods: string[];
  fee: number;
  estimatedDays: number;
}

export interface DeliverySchedule {
  id: number;
  deliveryMethodId?: number;
  dayOfWeek: number; // 0-6, 0 = Sunday
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isActive: boolean;
}

export interface PaymentMethodConfig {
  pixKey?: string;
  instructions?: string;
  acceptOnDelivery?: boolean;
  confirmationDeadlineHours?: number;
}

export interface Notification {
  id: number;
  userId?: number;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// Admin-specific types - not part of database schema but needed for application functionality
export interface NotificationRecord {
  id: number;
  type: 'order_created' | 'status_updated' | 'payment_confirmed' | 'order_delivered';
  orderId?: number;
  customerId: number;
  customerName: string;
  title: string;
  message: string;
  sentAt: Date;
  deliveryStatus: 'pending' | 'sent' | 'failed';
  retryCount: number;
}

export interface ReportMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageTicket: number;
  activeCustomers: number;
  period: 'today' | '7days' | '30days' | 'custom';
  previousPeriodComparison?: {
    revenue: number;
    orders: number;
    averageTicket: number;
    customers: number;
  };
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  productId: number;
  productName: string;
  quantitySold: number;
  revenue: number;
}

export interface PaymentMethodStats {
  method: string;
  count: number;
  percentage: number;
}

export interface LowStockProduct {
  id: number;
  name: string;
  currentStock: number;
  minimumStock: number;
  category: string;
}

// Utility types for admin forms and tables
export interface FilterOptions {
  search?: string;
  category?: string;
  status?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface PaginationData {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

// Form DTOs for creating/updating entities - aligned with database schema
export interface UsuarioFormData {
  nome: string;
  email: string;
  cargo: string;
  numeroCelular?: string;
  status: number;
}

// Legacy compatibility aliases for forms
export interface CustomerFormData {
  nome: string;
  email: string;
  numeroCelular?: string;
  cargo: string;
  status: number;
  totalPedidos: number;
  totalGasto: number;
  entregasFeitas: number;
  nota?: number;
}

export interface ProdutoFormData {
  sku?: string;
  nome: string;
  descricao?: string;
  descricaoResumida?: string;
  preco: number;
  medida: string;
  estoque: number;
  status: number;
  tags?: string;
  fk_categoria_id: number;
}

// Legacy compatibility aliases
export interface ProductFormData {
  name: string;
  description?: string;
  shortDescription?: string;
  categoryId: number;
  price: number;
  unit: string;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  images: string[];
  tags: string[];
  sku?: string;
}

export interface CategoriaFormData {
  nome: string;
  descricao?: string;
  estaAtiva: boolean;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  isActive: boolean;
}

export interface EnderecoFormData {
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  favorito?: boolean;
  fk_usuario_id: number;
}

export interface AddressFormData {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}

export interface MetodoEntregaFormData {
  descricao?: string;
  tipo: string;
  estimativaEntrega?: string;
  status: number;
  nome: string;
  preco: number;
}

export interface DeliveryMethodFormData {
  name: string;
  description?: string;
  type: 'pickup' | 'delivery' | 'fixed_shipping';
  price: number;
  estimatedDays: number;
  isActive: boolean;
}

export interface MetodoPagamentoFormData {
  nome: string;
  tipo: string;
  ativo: number;
}

export interface PaymentMethodFormData {
  name: string;
  type: 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer' | 'cash';
  isActive: boolean;
  config?: PaymentMethodConfig;
}

// Database constraint types - updated to match actual database schema
export interface DatabaseConstraints {
  usuario: {
    maxNomeLength: 100; // VARCHAR(100)
    maxEmailLength: 150; // VARCHAR(150)
    maxCargoLength: 50; // VARCHAR(50)
    maxNumeroCelularLength: 20; // VARCHAR(20)
    maxTotalGasto: 99999999.99; // DECIMAL(10,2)
    maxNota: 9.9; // DECIMAL(2,1)
    minNota: 0.0;
  };
  endereco: {
    maxRuaLength: 100; // VARCHAR(100)
    maxNumeroLength: 10; // VARCHAR(10)
    maxComplementoLength: 50; // VARCHAR(50)
    maxBairroLength: 50; // VARCHAR(50)
    maxCidadeLength: 50; // VARCHAR(50)
    maxEstadoLength: 2; // VARCHAR(2) - Note: schema has typo "VACHAR"
    maxCepLength: 10; // VARCHAR(10)
  };
  produto: {
    maxSkuLength: 30; // VARCHAR(30)
    maxNomeLength: 100; // VARCHAR(100)
    maxDescricaoResumidaLength: 255; // VARCHAR(255)
    maxMedidaLength: 20; // VARCHAR(20)
    maxTagsLength: 255; // VARCHAR(255)
    maxPreco: 99999999.99; // DECIMAL(10,2)
    minPreco: 0.00;
  };
  categoria: {
    maxNomeLength: 50; // VARCHAR(50)
    maxDescricaoLength: 255; // VARCHAR(255)
  };
  pedido: {
    maxTotal: 99999999.99; // DECIMAL(10,2)
    maxSubtotal: 99999999.99; // DECIMAL(10,2)
    maxTaxaEntrega: 99999999.99; // DECIMAL(10,2)
  };
  metodoEntrega: {
    maxDescricaoLength: 255; // VARCHAR(255)
    maxTipoLength: 30; // VARCHAR(30)
    maxEstimativaEntregaLength: 50; // VARCHAR(50)
    maxNomeLength: 50; // VARCHAR(50)
    maxPreco: 99999999.99; // DECIMAL(10,2)
  };
  metodoPagamento: {
    maxNomeLength: 50; // VARCHAR(50)
    maxTipoLength: 20; // VARCHAR(20)
  };
  produtoPedido: {
    maxPreco: 99999999.99; // DECIMAL(10,2)
  };
}