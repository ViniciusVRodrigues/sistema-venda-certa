// Type conversion utilities to maintain backward compatibility
// while supporting the new database schema structure

import type {
  Usuario, Customer, Product, Produto, Categoria, Category,
  Endereco, Address, Pedido, Order, MetodoEntrega, DeliveryMethod,
  MetodoPagamento, PaymentMethod
} from '../types';

// Convert database Usuario to legacy Customer
export function usuarioToCustomer(usuario: Usuario, addresses: Endereco[] = [], orders: Pedido[] = []): Customer {
  return {
    ...usuario,
    cargo: 'customer' as const,
    // Map database fields to legacy fields for compatibility
    name: usuario.nome,
    phone: usuario.numeroCelular,
    totalOrders: usuario.totalPedidos,
    totalSpent: usuario.totalGasto,
    // Legacy fields that don't exist in database
    createdAt: new Date(),
    updatedAt: new Date(),
    addresses: addresses,
    orders: orders,
    isVip: usuario.nota ? usuario.nota >= 4.5 : false,
    isBlocked: usuario.status === 0,
    lastOrderDate: orders.length > 0 ? orders[orders.length - 1].dataEntrega || new Date() : undefined
  };
}

// Convert legacy Customer to database Usuario
export function customerToUsuario(customer: Customer): Usuario {
  return {
    id: typeof customer.id === 'string' ? parseInt(customer.id) : customer.id,
    nome: (customer as any).name || customer.nome || '',
    email: customer.email,
    cargo: 'customer',
    numeroCelular: (customer as any).phone || customer.numeroCelular,
    status: (customer as any).isBlocked ? 0 : 1,
    totalPedidos: (customer as any).totalOrders || customer.totalPedidos || 0,
    totalGasto: (customer as any).totalSpent || customer.totalGasto || 0,
    entregasFeitas: 0, // Default value
    nota: (customer as any).isVip ? 5.0 : undefined
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
    customerId: endereco.fk_usuario_id
  };
}

// Convert legacy Address to database Endereco
export function addressToEndereco(address: Address, fk_usuario_id: number): Endereco {
  return {
    id: typeof address.id === 'string' ? parseInt(address.id) : address.id,
    rua: (address as any).street || address.rua || '',
    numero: (address as any).number || address.numero || '',
    complemento: (address as any).complement || address.complemento,
    bairro: (address as any).neighborhood || address.bairro || '',
    cidade: (address as any).city || address.cidade || '',
    estado: (address as any).state || address.estado || '',
    cep: (address as any).zipCode || address.cep || '',
    favorito: (address as any).isDefault || address.favorito || false,
    fk_usuario_id: (address as any).customerId || fk_usuario_id || 1
  };
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