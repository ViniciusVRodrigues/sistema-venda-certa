import type { 
  CustomerFormData, 
  ProductFormData, 
  CategoryFormData, 
  AddressFormData,
  DeliveryMethodFormData,
  PaymentMethodFormData,
  DatabaseConstraints
} from '../types';

// Database constraints based on the schema
export const DATABASE_CONSTRAINTS: DatabaseConstraints = {
  users: {
    maxNameLength: 255,
    maxEmailLength: 255,
    maxPhoneLength: 20,
    maxAvatarLength: 500,
  },
  products: {
    maxNameLength: 255,
    maxShortDescriptionLength: 500,
    maxUnitLength: 10,
    maxSkuLength: 100,
    maxPrice: 999999.99,
    minPrice: 0.01,
  },
  categories: {
    maxNameLength: 100,
  },
  addresses: {
    maxStreetLength: 255,
    maxNumberLength: 20,
    maxComplementLength: 255,
    maxNeighborhoodLength: 100,
    maxCityLength: 100,
    maxStateLength: 2,
    maxZipCodeLength: 10,
  },
};

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Customer validation
export function validateCustomer(data: CustomerFormData): ValidationResult {
  const errors: string[] = [];

  if (!data.name || data.name.trim() === '') {
    errors.push('Nome é obrigatório');
  } else if (data.name.length > DATABASE_CONSTRAINTS.users.maxNameLength) {
    errors.push(`Nome deve ter no máximo ${DATABASE_CONSTRAINTS.users.maxNameLength} caracteres`);
  }

  if (!data.email || data.email.trim() === '') {
    errors.push('Email é obrigatório');
  } else if (data.email.length > DATABASE_CONSTRAINTS.users.maxEmailLength) {
    errors.push(`Email deve ter no máximo ${DATABASE_CONSTRAINTS.users.maxEmailLength} caracteres`);
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Email deve ter um formato válido');
  }

  if (data.phone && data.phone.length > DATABASE_CONSTRAINTS.users.maxPhoneLength) {
    errors.push(`Telefone deve ter no máximo ${DATABASE_CONSTRAINTS.users.maxPhoneLength} caracteres`);
  }

  if (data.avatar && data.avatar.length > DATABASE_CONSTRAINTS.users.maxAvatarLength) {
    errors.push(`URL do avatar deve ter no máximo ${DATABASE_CONSTRAINTS.users.maxAvatarLength} caracteres`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Product validation
export function validateProduct(data: ProductFormData): ValidationResult {
  const errors: string[] = [];

  if (!data.name || data.name.trim() === '') {
    errors.push('Nome do produto é obrigatório');
  } else if (data.name.length > DATABASE_CONSTRAINTS.products.maxNameLength) {
    errors.push(`Nome deve ter no máximo ${DATABASE_CONSTRAINTS.products.maxNameLength} caracteres`);
  }

  if (!data.description || data.description.trim() === '') {
    errors.push('Descrição é obrigatória');
  }

  if (data.shortDescription && data.shortDescription.length > DATABASE_CONSTRAINTS.products.maxShortDescriptionLength) {
    errors.push(`Descrição curta deve ter no máximo ${DATABASE_CONSTRAINTS.products.maxShortDescriptionLength} caracteres`);
  }

  if (!data.categoryId || data.categoryId.trim() === '') {
    errors.push('Categoria é obrigatória');
  }

  if (data.price === undefined || data.price === null) {
    errors.push('Preço é obrigatório');
  } else if (data.price < DATABASE_CONSTRAINTS.products.minPrice) {
    errors.push(`Preço deve ser maior que ${DATABASE_CONSTRAINTS.products.minPrice}`);
  } else if (data.price > DATABASE_CONSTRAINTS.products.maxPrice) {
    errors.push(`Preço deve ser menor que ${DATABASE_CONSTRAINTS.products.maxPrice}`);
  }

  if (!data.unit || data.unit.trim() === '') {
    errors.push('Unidade é obrigatória');
  } else if (data.unit.length > DATABASE_CONSTRAINTS.products.maxUnitLength) {
    errors.push(`Unidade deve ter no máximo ${DATABASE_CONSTRAINTS.products.maxUnitLength} caracteres`);
  }

  if (data.stock === undefined || data.stock === null || data.stock < 0) {
    errors.push('Estoque deve ser um número maior ou igual a zero');
  }

  if (data.sku && data.sku.length > DATABASE_CONSTRAINTS.products.maxSkuLength) {
    errors.push(`SKU deve ter no máximo ${DATABASE_CONSTRAINTS.products.maxSkuLength} caracteres`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Category validation
export function validateCategory(data: CategoryFormData): ValidationResult {
  const errors: string[] = [];

  if (!data.name || data.name.trim() === '') {
    errors.push('Nome da categoria é obrigatório');
  } else if (data.name.length > DATABASE_CONSTRAINTS.categories.maxNameLength) {
    errors.push(`Nome deve ter no máximo ${DATABASE_CONSTRAINTS.categories.maxNameLength} caracteres`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Address validation
export function validateAddress(data: AddressFormData): ValidationResult {
  const errors: string[] = [];

  if (!data.street || data.street.trim() === '') {
    errors.push('Rua é obrigatória');
  } else if (data.street.length > DATABASE_CONSTRAINTS.addresses.maxStreetLength) {
    errors.push(`Rua deve ter no máximo ${DATABASE_CONSTRAINTS.addresses.maxStreetLength} caracteres`);
  }

  if (!data.number || data.number.trim() === '') {
    errors.push('Número é obrigatório');
  } else if (data.number.length > DATABASE_CONSTRAINTS.addresses.maxNumberLength) {
    errors.push(`Número deve ter no máximo ${DATABASE_CONSTRAINTS.addresses.maxNumberLength} caracteres`);
  }

  if (data.complement && data.complement.length > DATABASE_CONSTRAINTS.addresses.maxComplementLength) {
    errors.push(`Complemento deve ter no máximo ${DATABASE_CONSTRAINTS.addresses.maxComplementLength} caracteres`);
  }

  if (!data.neighborhood || data.neighborhood.trim() === '') {
    errors.push('Bairro é obrigatório');
  } else if (data.neighborhood.length > DATABASE_CONSTRAINTS.addresses.maxNeighborhoodLength) {
    errors.push(`Bairro deve ter no máximo ${DATABASE_CONSTRAINTS.addresses.maxNeighborhoodLength} caracteres`);
  }

  if (!data.city || data.city.trim() === '') {
    errors.push('Cidade é obrigatória');
  } else if (data.city.length > DATABASE_CONSTRAINTS.addresses.maxCityLength) {
    errors.push(`Cidade deve ter no máximo ${DATABASE_CONSTRAINTS.addresses.maxCityLength} caracteres`);
  }

  if (!data.state || data.state.trim() === '') {
    errors.push('Estado é obrigatório');
  } else if (data.state.length !== DATABASE_CONSTRAINTS.addresses.maxStateLength) {
    errors.push(`Estado deve ter exatamente ${DATABASE_CONSTRAINTS.addresses.maxStateLength} caracteres (ex: SP)`);
  }

  if (!data.zipCode || data.zipCode.trim() === '') {
    errors.push('CEP é obrigatório');
  } else if (data.zipCode.length > DATABASE_CONSTRAINTS.addresses.maxZipCodeLength) {
    errors.push(`CEP deve ter no máximo ${DATABASE_CONSTRAINTS.addresses.maxZipCodeLength} caracteres`);
  } else if (!/^\d{5}-?\d{3}$/.test(data.zipCode)) {
    errors.push('CEP deve ter o formato 12345-678 ou 12345678');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Delivery method validation
export function validateDeliveryMethod(data: DeliveryMethodFormData): ValidationResult {
  const errors: string[] = [];

  if (!data.name || data.name.trim() === '') {
    errors.push('Nome do método de entrega é obrigatório');
  } else if (data.name.length > 100) {
    errors.push('Nome deve ter no máximo 100 caracteres');
  }

  if (!data.description || data.description.trim() === '') {
    errors.push('Descrição é obrigatória');
  }

  if (data.price === undefined || data.price === null || data.price < 0) {
    errors.push('Preço deve ser um número maior ou igual a zero');
  }

  if (data.estimatedDays === undefined || data.estimatedDays === null || data.estimatedDays < 0) {
    errors.push('Dias estimados deve ser um número maior ou igual a zero');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Payment method validation
export function validatePaymentMethod(data: PaymentMethodFormData): ValidationResult {
  const errors: string[] = [];

  if (!data.name || data.name.trim() === '') {
    errors.push('Nome do método de pagamento é obrigatório');
  } else if (data.name.length > 100) {
    errors.push('Nome deve ter no máximo 100 caracteres');
  }

  const validTypes = ['credit_card', 'debit_card', 'pix', 'bank_transfer', 'cash'];
  if (!validTypes.includes(data.type)) {
    errors.push('Tipo de pagamento inválido');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Utility function to format currency for database storage
export function formatCurrencyForDatabase(value: number): number {
  return Math.round(value * 100) / 100; // Round to 2 decimal places
}

// Utility function to validate decimal precision for money fields
export function validateDecimalPrecision(value: number, maxDecimals: number = 2): boolean {
  const decimals = (value.toString().split('.')[1] || '').length;
  return decimals <= maxDecimals;
}