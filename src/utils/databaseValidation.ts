import type { 
  CustomerFormData, 
  ProductFormData, 
  CategoryFormData, 
  AddressFormData,
  DeliveryMethodFormData,
  PaymentMethodFormData,
  DatabaseConstraints,
  UsuarioFormData,
  ProdutoFormData,
  CategoriaFormData,
  EnderecoFormData,
  MetodoEntregaFormData,
  MetodoPagamentoFormData
} from '../types';

// Database constraints based on the actual schema
export const DATABASE_CONSTRAINTS: DatabaseConstraints = {
  usuario: {
    maxNomeLength: 100, // VARCHAR(100)
    maxEmailLength: 150, // VARCHAR(150)
    maxCargoLength: 50, // VARCHAR(50)
    maxNumeroCelularLength: 20, // VARCHAR(20)
    maxTotalGasto: 99999999.99, // DECIMAL(10,2)
    maxNota: 9.9, // DECIMAL(2,1)
    minNota: 0.0,
  },
  endereco: {
    maxRuaLength: 100, // VARCHAR(100)
    maxNumeroLength: 10, // VARCHAR(10)
    maxComplementoLength: 50, // VARCHAR(50)
    maxBairroLength: 50, // VARCHAR(50)
    maxCidadeLength: 50, // VARCHAR(50)
    maxEstadoLength: 2, // VARCHAR(2) - Note: schema has typo "VACHAR"
    maxCepLength: 10, // VARCHAR(10)
  },
  produto: {
    maxSkuLength: 30, // VARCHAR(30)
    maxNomeLength: 100, // VARCHAR(100)
    maxDescricaoResumidaLength: 255, // VARCHAR(255)
    maxMedidaLength: 20, // VARCHAR(20)
    maxTagsLength: 255, // VARCHAR(255)
    maxPreco: 99999999.99, // DECIMAL(10,2)
    minPreco: 0.00,
  },
  categoria: {
    maxNomeLength: 50, // VARCHAR(50)
    maxDescricaoLength: 255, // VARCHAR(255)
  },
  pedido: {
    maxTotal: 99999999.99, // DECIMAL(10,2)
    maxSubtotal: 99999999.99, // DECIMAL(10,2)
    maxTaxaEntrega: 99999999.99, // DECIMAL(10,2)
  },
  metodoEntrega: {
    maxDescricaoLength: 255, // VARCHAR(255)
    maxTipoLength: 30, // VARCHAR(30)
    maxEstimativaEntregaLength: 50, // VARCHAR(50)
    maxNomeLength: 50, // VARCHAR(50)
    maxPreco: 99999999.99, // DECIMAL(10,2)
  },
  metodoPagamento: {
    maxNomeLength: 50, // VARCHAR(50)
    maxTipoLength: 20, // VARCHAR(20)
  },
  produtoPedido: {
    maxPreco: 99999999.99, // DECIMAL(10,2)
  },
};

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Usuario validation (database aligned)
export function validateUsuario(data: UsuarioFormData): ValidationResult {
  const errors: string[] = [];

  if (!data.nome || data.nome.trim() === '') {
    errors.push('Nome é obrigatório');
  } else if (data.nome.length > DATABASE_CONSTRAINTS.usuario.maxNomeLength) {
    errors.push(`Nome deve ter no máximo ${DATABASE_CONSTRAINTS.usuario.maxNomeLength} caracteres`);
  }

  if (!data.email || data.email.trim() === '') {
    errors.push('Email é obrigatório');
  } else if (data.email.length > DATABASE_CONSTRAINTS.usuario.maxEmailLength) {
    errors.push(`Email deve ter no máximo ${DATABASE_CONSTRAINTS.usuario.maxEmailLength} caracteres`);
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Email deve ter um formato válido');
  }

  if (!data.cargo || data.cargo.trim() === '') {
    errors.push('Cargo é obrigatório');
  } else if (data.cargo.length > DATABASE_CONSTRAINTS.usuario.maxCargoLength) {
    errors.push(`Cargo deve ter no máximo ${DATABASE_CONSTRAINTS.usuario.maxCargoLength} caracteres`);
  }

  if (data.numeroCelular && data.numeroCelular.length > DATABASE_CONSTRAINTS.usuario.maxNumeroCelularLength) {
    errors.push(`Número de celular deve ter no máximo ${DATABASE_CONSTRAINTS.usuario.maxNumeroCelularLength} caracteres`);
  }

  if (data.status === undefined || data.status === null) {
    errors.push('Status é obrigatório');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Customer validation (legacy compatibility)
export function validateCustomer(data: CustomerFormData): ValidationResult {
  const usuarioData: UsuarioFormData = {
    nome: data.nome,
    email: data.email,
    cargo: data.cargo || 'customer',
    numeroCelular: data.numeroCelular,
    status: 1 // Active by default
  };
  
  return validateUsuario(usuarioData);
}

// Produto validation (database aligned)
export function validateProduto(data: ProdutoFormData): ValidationResult {
  const errors: string[] = [];

  if (!data.nome || data.nome.trim() === '') {
    errors.push('Nome do produto é obrigatório');
  } else if (data.nome.length > DATABASE_CONSTRAINTS.produto.maxNomeLength) {
    errors.push(`Nome deve ter no máximo ${DATABASE_CONSTRAINTS.produto.maxNomeLength} caracteres`);
  }

  if (data.descricaoResumida && data.descricaoResumida.length > DATABASE_CONSTRAINTS.produto.maxDescricaoResumidaLength) {
    errors.push(`Descrição resumida deve ter no máximo ${DATABASE_CONSTRAINTS.produto.maxDescricaoResumidaLength} caracteres`);
  }

  if (!data.fk_categoria_id) {
    errors.push('Categoria é obrigatória');
  }

  if (data.preco === undefined || data.preco === null) {
    errors.push('Preço é obrigatório');
  } else if (data.preco < DATABASE_CONSTRAINTS.produto.minPreco) {
    errors.push(`Preço deve ser maior que ${DATABASE_CONSTRAINTS.produto.minPreco}`);
  } else if (data.preco > DATABASE_CONSTRAINTS.produto.maxPreco) {
    errors.push(`Preço deve ser menor que ${DATABASE_CONSTRAINTS.produto.maxPreco}`);
  }

  if (!data.medida || data.medida.trim() === '') {
    errors.push('Medida é obrigatória');
  } else if (data.medida.length > DATABASE_CONSTRAINTS.produto.maxMedidaLength) {
    errors.push(`Medida deve ter no máximo ${DATABASE_CONSTRAINTS.produto.maxMedidaLength} caracteres`);
  }

  if (data.estoque === undefined || data.estoque === null || data.estoque < 0) {
    errors.push('Estoque deve ser um número maior ou igual a zero');
  }

  if (data.sku && data.sku.length > DATABASE_CONSTRAINTS.produto.maxSkuLength) {
    errors.push(`SKU deve ter no máximo ${DATABASE_CONSTRAINTS.produto.maxSkuLength} caracteres`);
  }

  if (data.tags && data.tags.length > DATABASE_CONSTRAINTS.produto.maxTagsLength) {
    errors.push(`Tags devem ter no máximo ${DATABASE_CONSTRAINTS.produto.maxTagsLength} caracteres`);
  }

  if (data.status === undefined || data.status === null) {
    errors.push('Status é obrigatório');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Product validation (legacy compatibility)
export function validateProduct(data: ProductFormData): ValidationResult {
  const produtoData: ProdutoFormData = {
    nome: data.name,
    descricao: data.description,
    descricaoResumida: data.shortDescription,
    fk_categoria_id: data.categoryId,
    preco: data.price,
    medida: data.unit,
    estoque: data.stock,
    status: data.status === 'active' ? 1 : 0,
    tags: data.tags.join(','),
    sku: data.sku
  };
  
  return validateProduto(produtoData);
}

// Categoria validation (database aligned)
export function validateCategoria(data: CategoriaFormData): ValidationResult {
  const errors: string[] = [];

  if (!data.nome || data.nome.trim() === '') {
    errors.push('Nome da categoria é obrigatório');
  } else if (data.nome.length > DATABASE_CONSTRAINTS.categoria.maxNomeLength) {
    errors.push(`Nome deve ter no máximo ${DATABASE_CONSTRAINTS.categoria.maxNomeLength} caracteres`);
  }

  if (data.descricao && data.descricao.length > DATABASE_CONSTRAINTS.categoria.maxDescricaoLength) {
    errors.push(`Descrição deve ter no máximo ${DATABASE_CONSTRAINTS.categoria.maxDescricaoLength} caracteres`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Category validation (legacy compatibility)
export function validateCategory(data: CategoryFormData): ValidationResult {
  const categoriaData: CategoriaFormData = {
    nome: data.name,
    descricao: data.description,
    estaAtiva: data.isActive
  };
  
  return validateCategoria(categoriaData);
}

// Endereco validation (database aligned)
export function validateEndereco(data: EnderecoFormData): ValidationResult {
  const errors: string[] = [];

  if (!data.rua || data.rua.trim() === '') {
    errors.push('Rua é obrigatória');
  } else if (data.rua.length > DATABASE_CONSTRAINTS.endereco.maxRuaLength) {
    errors.push(`Rua deve ter no máximo ${DATABASE_CONSTRAINTS.endereco.maxRuaLength} caracteres`);
  }

  if (!data.numero || data.numero.trim() === '') {
    errors.push('Número é obrigatório');
  } else if (data.numero.length > DATABASE_CONSTRAINTS.endereco.maxNumeroLength) {
    errors.push(`Número deve ter no máximo ${DATABASE_CONSTRAINTS.endereco.maxNumeroLength} caracteres`);
  }

  if (data.complemento && data.complemento.length > DATABASE_CONSTRAINTS.endereco.maxComplementoLength) {
    errors.push(`Complemento deve ter no máximo ${DATABASE_CONSTRAINTS.endereco.maxComplementoLength} caracteres`);
  }

  if (!data.bairro || data.bairro.trim() === '') {
    errors.push('Bairro é obrigatório');
  } else if (data.bairro.length > DATABASE_CONSTRAINTS.endereco.maxBairroLength) {
    errors.push(`Bairro deve ter no máximo ${DATABASE_CONSTRAINTS.endereco.maxBairroLength} caracteres`);
  }

  if (!data.cidade || data.cidade.trim() === '') {
    errors.push('Cidade é obrigatória');
  } else if (data.cidade.length > DATABASE_CONSTRAINTS.endereco.maxCidadeLength) {
    errors.push(`Cidade deve ter no máximo ${DATABASE_CONSTRAINTS.endereco.maxCidadeLength} caracteres`);
  }

  if (!data.estado || data.estado.trim() === '') {
    errors.push('Estado é obrigatório');
  } else if (data.estado.length !== DATABASE_CONSTRAINTS.endereco.maxEstadoLength) {
    errors.push(`Estado deve ter exatamente ${DATABASE_CONSTRAINTS.endereco.maxEstadoLength} caracteres (ex: SP)`);
  }

  if (!data.cep || data.cep.trim() === '') {
    errors.push('CEP é obrigatório');
  } else if (data.cep.length > DATABASE_CONSTRAINTS.endereco.maxCepLength) {
    errors.push(`CEP deve ter no máximo ${DATABASE_CONSTRAINTS.endereco.maxCepLength} caracteres`);
  } else if (!/^\d{5}-?\d{3}$/.test(data.cep)) {
    errors.push('CEP deve ter o formato 12345-678 ou 12345678');
  }

  if (!data.fk_usuario_id) {
    errors.push('ID do usuário é obrigatório');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Address validation (legacy compatibility)
export function validateAddress(data: AddressFormData): ValidationResult {
  const enderecoData: EnderecoFormData = {
    rua: data.street,
    numero: data.number,
    complemento: data.complement,
    bairro: data.neighborhood,
    cidade: data.city,
    estado: data.state,
    cep: data.zipCode,
    favorito: data.isDefault || false,
    fk_usuario_id: 1 // Default value - should be set by application
  };
  
  return validateEndereco(enderecoData);
}

// MetodoEntrega validation (database aligned)
export function validateMetodoEntrega(data: MetodoEntregaFormData): ValidationResult {
  const errors: string[] = [];

  if (!data.nome || data.nome.trim() === '') {
    errors.push('Nome do método de entrega é obrigatório');
  } else if (data.nome.length > DATABASE_CONSTRAINTS.metodoEntrega.maxNomeLength) {
    errors.push(`Nome deve ter no máximo ${DATABASE_CONSTRAINTS.metodoEntrega.maxNomeLength} caracteres`);
  }

  if (data.descricao && data.descricao.length > DATABASE_CONSTRAINTS.metodoEntrega.maxDescricaoLength) {
    errors.push(`Descrição deve ter no máximo ${DATABASE_CONSTRAINTS.metodoEntrega.maxDescricaoLength} caracteres`);
  }

  if (!data.tipo || data.tipo.trim() === '') {
    errors.push('Tipo é obrigatório');
  } else if (data.tipo.length > DATABASE_CONSTRAINTS.metodoEntrega.maxTipoLength) {
    errors.push(`Tipo deve ter no máximo ${DATABASE_CONSTRAINTS.metodoEntrega.maxTipoLength} caracteres`);
  }

  if (data.estimativaEntrega && data.estimativaEntrega.length > DATABASE_CONSTRAINTS.metodoEntrega.maxEstimativaEntregaLength) {
    errors.push(`Estimativa de entrega deve ter no máximo ${DATABASE_CONSTRAINTS.metodoEntrega.maxEstimativaEntregaLength} caracteres`);
  }

  if (data.preco === undefined || data.preco === null || data.preco < 0) {
    errors.push('Preço deve ser um número maior ou igual a zero');
  } else if (data.preco > DATABASE_CONSTRAINTS.metodoEntrega.maxPreco) {
    errors.push(`Preço deve ser menor que ${DATABASE_CONSTRAINTS.metodoEntrega.maxPreco}`);
  }

  if (data.status === undefined || data.status === null) {
    errors.push('Status é obrigatório');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Delivery method validation (legacy compatibility)
export function validateDeliveryMethod(data: DeliveryMethodFormData): ValidationResult {
  const metodoEntregaData: MetodoEntregaFormData = {
    nome: data.name,
    descricao: data.description,
    tipo: data.type,
    estimativaEntrega: data.estimatedDays.toString() + ' dias',
    preco: data.price,
    status: data.isActive ? 1 : 0
  };
  
  return validateMetodoEntrega(metodoEntregaData);
}

// MetodoPagamento validation (database aligned)
export function validateMetodoPagamento(data: MetodoPagamentoFormData): ValidationResult {
  const errors: string[] = [];

  if (!data.nome || data.nome.trim() === '') {
    errors.push('Nome do método de pagamento é obrigatório');
  } else if (data.nome.length > DATABASE_CONSTRAINTS.metodoPagamento.maxNomeLength) {
    errors.push(`Nome deve ter no máximo ${DATABASE_CONSTRAINTS.metodoPagamento.maxNomeLength} caracteres`);
  }

  if (!data.tipo || data.tipo.trim() === '') {
    errors.push('Tipo é obrigatório');
  } else if (data.tipo.length > DATABASE_CONSTRAINTS.metodoPagamento.maxTipoLength) {
    errors.push(`Tipo deve ter no máximo ${DATABASE_CONSTRAINTS.metodoPagamento.maxTipoLength} caracteres`);
  }

  if (data.ativo === undefined || data.ativo === null) {
    errors.push('Status ativo é obrigatório');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Payment method validation (legacy compatibility)
export function validatePaymentMethod(data: PaymentMethodFormData): ValidationResult {
  const metodoPagamentoData: MetodoPagamentoFormData = {
    nome: data.name,
    tipo: data.type,
    ativo: data.isActive ? 1 : 0
  };
  
  return validateMetodoPagamento(metodoPagamentoData);
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