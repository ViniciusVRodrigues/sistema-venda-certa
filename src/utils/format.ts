/**
 * Utility functions for formatting and normalizing data values
 * Ensures consistent handling of numeric fields from backend
 */

/**
 * Safely converts a value to a number
 * Handles both string and number inputs from backend
 * @param value - Value to convert (string, number, or undefined)
 * @param defaultValue - Default value if conversion fails (default: 0)
 * @returns Normalized number value
 */
export function toNumber(value: string | number | undefined | null, defaultValue: number = 0): number {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  
  if (typeof value === 'number') {
    return isNaN(value) ? defaultValue : value;
  }
  
  if (typeof value === 'string') {
    // Remove any non-numeric characters except dots and commas
    const cleanedValue = value.replace(/[^\d.,-]/g, '');
    // Replace comma with dot for parsing
    const normalized = cleanedValue.replace(',', '.');
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  
  return defaultValue;
}

/**
 * Formats a number as Brazilian currency (BRL)
 * @param value - Number to format (can be string or number)
 * @param options - Formatting options
 * @returns Formatted string in Brazilian currency format (R$ X.XXX,XX)
 */
export function formatCurrencyBR(
  value: string | number | undefined | null,
  options: { showSymbol?: boolean; decimals?: number } = {}
): string {
  const { showSymbol = true, decimals = 2 } = options;
  
  // Convert to number first
  const numValue = toNumber(value, 0);
  
  // Format using Brazilian locale
  const formatted = new Intl.NumberFormat('pt-BR', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'BRL',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(numValue);
  
  return formatted;
}

/**
 * Formats a number with Brazilian number format (X.XXX,XX)
 * @param value - Number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string
 */
export function formatNumberBR(value: string | number | undefined | null, decimals: number = 2): string {
  const numValue = toNumber(value, 0);
  
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(numValue);
}

/**
 * Normalizes a Produto object by converting numeric fields to numbers
 * @param produto - Product object from backend
 * @returns Normalized product object
 */
export function normalizeProduto<T extends Record<string, any>>(produto: T): T {
  if (!produto) return produto;
  
  return {
    ...produto,
    preco: toNumber(produto.preco),
    estoque: toNumber(produto.estoque),
    status: toNumber(produto.status),
    fk_categoria_id: toNumber(produto.fk_categoria_id)
  };
}

/**
 * Normalizes an array of Produto objects
 * @param produtos - Array of product objects from backend
 * @returns Normalized array
 */
export function normalizeProdutos<T extends Record<string, any>>(produtos: T[]): T[] {
  if (!Array.isArray(produtos)) return [];
  return produtos.map(normalizeProduto);
}

/**
 * Normalizes a Pedido object by converting numeric fields to numbers
 * @param pedido - Order object from backend
 * @returns Normalized order object
 */
export function normalizePedido<T extends Record<string, any>>(pedido: T): T {
  if (!pedido) return pedido;
  
  return {
    ...pedido,
    status: toNumber(pedido.status),
    total: toNumber(pedido.total),
    subtotal: toNumber(pedido.subtotal),
    taxaEntrega: toNumber(pedido.taxaEntrega),
    statusPagamento: toNumber(pedido.statusPagamento)
  };
}

/**
 * Normalizes an array of Pedido objects
 * @param pedidos - Array of order objects from backend
 * @returns Normalized array
 */
export function normalizePedidos<T extends Record<string, any>>(pedidos: T[]): T[] {
  if (!Array.isArray(pedidos)) return [];
  return pedidos.map(normalizePedido);
}
