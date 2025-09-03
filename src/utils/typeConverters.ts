// Type conversion utilities to maintain backward compatibility
// while supporting the new database schema structure

import type {
  Usuario, Produto, ProdutoPedido
} from '../types';

// Status mappings for better readability
export const StatusPedido = {
  RECEBIDO: 1,
  PREPARANDO: 2,
  ENVIADO: 3,
  ENTREGUE: 4,
  CANCELADO: 5
} as const;

export const StatusPagamento = {
  PENDENTE: 1,
  PAGO: 2,
  FALHOU: 3,
  REEMBOLSADO: 4
} as const;

export const StatusUsuario = {
  INATIVO: 0,
  ATIVO: 1
} as const;

export const StatusProduto = {
  INATIVO: 0,
  ATIVO: 1,
  SEM_ESTOQUE: 2
} as const;

// Helper functions to convert database status codes to readable strings
export function getStatusPedidoText(status: number): string {
  switch (status) {
    case StatusPedido.RECEBIDO: return 'Recebido';
    case StatusPedido.PREPARANDO: return 'Preparando';
    case StatusPedido.ENVIADO: return 'Enviado';
    case StatusPedido.ENTREGUE: return 'Entregue';
    case StatusPedido.CANCELADO: return 'Cancelado';
    default: return 'Desconhecido';
  }
}

export function getStatusPagamentoText(status: number): string {
  switch (status) {
    case StatusPagamento.PENDENTE: return 'Pendente';
    case StatusPagamento.PAGO: return 'Pago';
    case StatusPagamento.FALHOU: return 'Falhou';
    case StatusPagamento.REEMBOLSADO: return 'Reembolsado';
    default: return 'Desconhecido';
  }
}

export function getStatusProdutoText(status: number): string {
  switch (status) {
    case StatusProduto.INATIVO: return 'Inativo';
    case StatusProduto.ATIVO: return 'Ativo';
    case StatusProduto.SEM_ESTOQUE: return 'Sem Estoque';
    default: return 'Desconhecido';
  }
}

// Utility functions to safely convert between string and number types
export function safeStringToNumber(value: string | number | undefined): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseInt(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

export function safeNumberToString(value: number | string | undefined): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  return '';
}

// Format currency values
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

// Format dates for display
export function formatDate(date: Date | string | undefined): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(dateObj);
}

export function formatDateTime(date: Date | string | undefined): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
}

// Validation helpers
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidCEP(cep: string): boolean {
  const cepRegex = /^\d{5}-?\d{3}$/;
  return cepRegex.test(cep);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\(\d{2}\)\s?\d{4,5}-?\d{4}$|^\d{10,11}$/;
  return phoneRegex.test(phone);
}

// Calculate totals and aggregations
export function calculateOrderTotal(items: ProdutoPedido[]): number {
  return items.reduce((total, item) => total + (item.preco * item.quantidade), 0);
}

export function calculateOrderSubtotal(items: ProdutoPedido[]): number {
  // In this case, subtotal is the same as total since we don't have discounts in the schema
  return calculateOrderTotal(items);
}

// Get user role display name
export function getUserRoleText(cargo: string): string {
  switch (cargo.toLowerCase()) {
    case 'customer': return 'Cliente';
    case 'admin': return 'Administrador';
    case 'delivery': return 'Entregador';
    default: return cargo;
  }
}

// Check if user is VIP (based on nota >= 4.5)
export function isUserVip(usuario: Usuario): boolean {
  return usuario.nota !== undefined && usuario.nota >= 4.5;
}

// Check if user is blocked (status = 0)
export function isUserBlocked(usuario: Usuario): boolean {
  return usuario.status === 0;
}

// Get product availability status
export function getProductAvailability(produto: Produto): 'available' | 'low_stock' | 'out_of_stock' | 'inactive' {
  if (produto.status !== 1) return 'inactive';
  if (produto.estoque === 0) return 'out_of_stock';
  if (produto.estoque <= 10) return 'low_stock';
  return 'available';
}

// Clean and format CEP
export function formatCEP(cep: string): string {
  const cleanCEP = cep.replace(/\D/g, '');
  if (cleanCEP.length === 8) {
    return `${cleanCEP.slice(0, 5)}-${cleanCEP.slice(5)}`;
  }
  return cep;
}

// Clean and format phone number
export function formatPhone(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length === 11) {
    return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7)}`;
  } else if (cleanPhone.length === 10) {
    return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 6)}-${cleanPhone.slice(6)}`;
  }
  return phone;
}