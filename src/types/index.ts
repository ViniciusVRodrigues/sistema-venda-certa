export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer' | 'delivery';
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer extends User {
  role: 'customer';
  addresses: Address[];
  orders: Order[];
  isVip: boolean;
  isBlocked: boolean;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: Date;
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

export interface Delivery extends User {
  role: 'delivery';
  isActive: boolean;
  vehicle?: string;
  assignedOrders: string[];
  completedDeliveries: number;
  rating?: number;
}

export interface Address {
  id: string;
  customerId?: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  category: Category;
  categoryId?: string;
  price: number;
  unit: string;
  variations?: ProductVariation[];
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  images: string[];
  tags: string[];
  sku?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariation {
  id: string;
  productId?: string;
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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  variationId?: string;
  variation?: ProductVariation;
}

export interface Order {
  id: string;
  customerId: string;
  customer: Customer;
  items: OrderItem[];
  total: number;
  status: 'received' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  deliveryAddress: Address;
  deliveryAddressId?: string;
  deliveryMethod: DeliveryMethod;
  deliveryMethodId?: string;
  deliveryFee: number;
  paymentMethod: PaymentMethod;
  paymentMethodId?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  notes?: string;
  cancelReason?: string;
  timeline: OrderTimelineEvent[];
  deliveryDriverId?: string;
  deliveryDriver?: Delivery;
}

export interface OrderItem {
  id: string;
  orderId?: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  variationId?: string;
  variation?: ProductVariation;
  createdAt?: Date;
}

export interface DeliveryMethod {
  id: string;
  name: string;
  description: string;
  type: 'pickup' | 'delivery' | 'fixed_shipping';
  price: number;
  estimatedDays: number;
  isActive: boolean;
  regions?: DeliveryRegion[];
  schedule?: DeliverySchedule[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DeliveryRegion {
  id: string;
  deliveryMethodId?: string;
  name: string;
  zipCodeStart: string;
  zipCodeEnd: string;
  neighborhoods: string[];
  fee: number;
  estimatedDays: number;
}

export interface DeliverySchedule {
  id: string;
  deliveryMethodId?: string;
  dayOfWeek: number; // 0-6, 0 = Sunday
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isActive: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer' | 'cash';
  isActive: boolean;
  config?: PaymentMethodConfig;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaymentMethodConfig {
  pixKey?: string;
  instructions?: string;
  acceptOnDelivery?: boolean;
  confirmationDeadlineHours?: number;
}

export interface Notification {
  id: string;
  userId?: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface Review {
  id: string;
  productId: string;
  customerId: string;
  customer: Customer;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// New admin-specific types
export interface OrderTimelineEvent {
  id: string;
  orderId?: string;
  status: Order['status'];
  timestamp: Date;
  description: string;
  userId?: string;
  userName?: string;
}

export interface NotificationRecord {
  id: string;
  type: 'order_created' | 'status_updated' | 'payment_confirmed' | 'order_delivered';
  orderId?: string;
  customerId: string;
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
  productId: string;
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
  id: string;
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

// Form DTOs for creating/updating entities
export interface CustomerFormData {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  isVip?: boolean;
  isBlocked?: boolean;
}

export interface ProductFormData {
  name: string;
  description: string;
  shortDescription?: string;
  categoryId: string;
  price: number;
  unit: string;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  images: string[];
  tags: string[];
  sku?: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  isActive: boolean;
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

export interface DeliveryMethodFormData {
  name: string;
  description: string;
  type: 'pickup' | 'delivery' | 'fixed_shipping';
  price: number;
  estimatedDays: number;
  isActive: boolean;
}

export interface PaymentMethodFormData {
  name: string;
  type: 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer' | 'cash';
  isActive: boolean;
  config?: PaymentMethodConfig;
}

// Database constraint types
export interface DatabaseConstraints {
  users: {
    maxNameLength: 255;
    maxEmailLength: 255;
    maxPhoneLength: 20;
    maxAvatarLength: 500;
  };
  products: {
    maxNameLength: 255;
    maxShortDescriptionLength: 500;
    maxUnitLength: 10;
    maxSkuLength: 100;
    maxPrice: number;
    minPrice: number;
  };
  categories: {
    maxNameLength: 100;
  };
  addresses: {
    maxStreetLength: 255;
    maxNumberLength: 20;
    maxComplementLength: 255;
    maxNeighborhoodLength: 100;
    maxCityLength: 100;
    maxStateLength: 2;
    maxZipCodeLength: 10;
  };
}