export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer extends User {
  role: 'customer';
  addresses: Address[];
  orders: Order[];
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

export interface Address {
  id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  variations?: ProductVariation[];
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariation {
  id: string;
  name: string;
  price: number;
  stock: number;
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
  deliveryMethod: DeliveryMethod;
  deliveryFee: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  variationId?: string;
  variation?: ProductVariation;
}

export interface DeliveryMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: number;
  isActive: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer' | 'cash';
  isActive: boolean;
}

export interface Notification {
  id: string;
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
}