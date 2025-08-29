// Mock data aligned with database schema structure
import type {
  Usuario, Endereco, Produto, Categoria, Pedido, MetodoEntrega,
  MetodoPagamento, ProdutoPedido, AtualizacaoPedido, AvaliacaoProduto
} from '../../types';

// Mock usuarios (database schema)
export const mockUsuarios: Usuario[] = [
  {
    id: 1,
    nome: 'João Silva',
    email: 'joao.silva@email.com',
    cargo: 'customer',
    numeroCelular: '11999991111',
    status: 1, // Active
    totalPedidos: 5,
    totalGasto: 1250.45,
    entregasFeitas: 0,
    nota: 4.5
  },
  {
    id: 2,
    nome: 'Maria Santos',
    email: 'maria.santos@email.com',
    cargo: 'customer',
    numeroCelular: '11999992222',
    status: 1, // Active
    totalPedidos: 12,
    totalGasto: 2890.75,
    entregasFeitas: 0,
    nota: 5.0
  },
  {
    id: 3,
    nome: 'Pedro Costa',
    email: 'pedro.costa@email.com',
    cargo: 'customer',
    numeroCelular: '11999993333',
    status: 1, // Active
    totalPedidos: 3,
    totalGasto: 567.20,
    entregasFeitas: 0,
    nota: 4.0
  },
  {
    id: 4,
    nome: 'Ana Oliveira',
    email: 'ana.oliveira@email.com',
    cargo: 'customer',
    numeroCelular: '11999994444',
    status: 0, // Blocked
    totalPedidos: 1,
    totalGasto: 125.00,
    entregasFeitas: 0,
    nota: 2.0
  },
  {
    id: 5,
    nome: 'Carlos Entregador',
    email: 'carlos.entregador@email.com',
    cargo: 'delivery',
    numeroCelular: '11999995555',
    status: 1, // Active
    totalPedidos: 0,
    totalGasto: 0,
    entregasFeitas: 150,
    nota: 4.8
  },
  {
    id: 7,
    nome: 'Bruno Moto',
    email: 'bruno.moto@email.com',
    cargo: 'delivery',
    numeroCelular: '11999997777',
    status: 1, // Active
    totalPedidos: 0,
    totalGasto: 0,
    entregasFeitas: 89,
    nota: 4.6
  },
  {
    id: 8,
    nome: 'Rafael Express',
    email: 'rafael.express@email.com',
    cargo: 'delivery',
    numeroCelular: '11999998888',
    status: 1, // Active
    totalPedidos: 0,
    totalGasto: 0,
    entregasFeitas: 203,
    nota: 4.9
  },
  {
    id: 6,
    nome: 'Admin Sistema',
    email: 'admin@email.com',
    cargo: 'admin',
    numeroCelular: '11999996666',
    status: 1, // Active
    totalPedidos: 0,
    totalGasto: 0,
    entregasFeitas: 0
  }
];

// Mock enderecos (database schema)
export const mockEnderecos: Endereco[] = [
  {
    id: 1,
    rua: 'Rua das Flores',
    numero: '123',
    complemento: 'Apto 45',
    bairro: 'Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234567',
    favorito: true,
    fk_usuario_id: 1
  },
  {
    id: 2,
    rua: 'Av. Paulista',
    numero: '1000',
    complemento: undefined,
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01310100',
    favorito: false,
    fk_usuario_id: 1
  },
  {
    id: 3,
    rua: 'Rua Augusta',
    numero: '456',
    complemento: undefined,
    bairro: 'Consolação',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01305000',
    favorito: true,
    fk_usuario_id: 2
  },
  {
    id: 4,
    rua: 'Rua Oscar Freire',
    numero: '789',
    complemento: undefined,
    bairro: 'Jardins',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01426001',
    favorito: true,
    fk_usuario_id: 3
  }
];

// Mock categorias (database schema)
export const mockCategorias: Categoria[] = [
  {
    id: 1,
    nome: 'Frutas',
    descricao: 'Frutas frescas e selecionadas',
    estaAtiva: true
  },
  {
    id: 2,
    nome: 'Verduras',
    descricao: 'Verduras e legumes frescos',
    estaAtiva: true
  },
  {
    id: 3,
    nome: 'Laticínios',
    descricao: 'Leite, queijos e derivados',
    estaAtiva: true
  },
  {
    id: 4,
    nome: 'Carnes',
    descricao: 'Carnes frescas e selecionadas',
    estaAtiva: true
  },
  {
    id: 5,
    nome: 'Bebidas',
    descricao: 'Bebidas variadas',
    estaAtiva: false
  }
];

// Mock produtos (database schema)
export const mockProdutos: Produto[] = [
  {
    id: 1,
    sku: 'FRT001',
    nome: 'Maçã Gala',
    descricao: 'Maçãs frescas e doces, ideais para lanches saudáveis.',
    descricaoResumida: 'Maçãs frescas e doces',
    preco: 8.99,
    medida: 'kg',
    estoque: 150,
    status: 1, // Active
    imagem: undefined,
    tags: 'fruta,saudável,doce',
    fk_categoria_id: 1
  },
  {
    id: 2,
    sku: 'FRT002',
    nome: 'Banana Nanica',
    descricao: 'Bananas maduras e saborosas, ricas em potássio.',
    descricaoResumida: 'Bananas maduras e saborosas',
    preco: 6.50,
    medida: 'kg',
    estoque: 200,
    status: 1, // Active
    imagem: undefined,
    tags: 'fruta,potássio,energia',
    fk_categoria_id: 1
  },
  {
    id: 3,
    sku: 'VRD001',
    nome: 'Alface Americana',
    descricao: 'Alface crocante e fresca, perfeita para saladas.',
    descricaoResumida: 'Alface crocante e fresca',
    preco: 3.99,
    medida: 'unidade',
    estoque: 80,
    status: 1, // Active
    imagem: undefined,
    tags: 'verdura,salada,folha',
    fk_categoria_id: 2
  },
  {
    id: 4,
    sku: 'LAT001',
    nome: 'Leite Integral',
    descricao: 'Leite integral pasteurizado, rico em nutrientes.',
    descricaoResumida: 'Leite integral pasteurizado',
    preco: 4.75,
    medida: 'litro',
    estoque: 0, // Out of stock
    status: 2, // Out of stock
    imagem: undefined,
    tags: 'leite,integral,nutrientes',
    fk_categoria_id: 3
  },
  {
    id: 5,
    sku: 'CAR001',
    nome: 'Filé de Frango',
    descricao: 'Filé de frango fresco, sem osso e sem pele.',
    descricaoResumida: 'Filé de frango fresco',
    preco: 18.99,
    medida: 'kg',
    estoque: 50,
    status: 1, // Active
    imagem: undefined,
    tags: 'carne,frango,proteína',
    fk_categoria_id: 4
  }
];

// Mock metodos de entrega (database schema)
export const mockMetodosEntrega: MetodoEntrega[] = [
  {
    id: 1,
    descricao: 'Entrega rápida em até 2 horas',
    tipo: 'express',
    estimativaEntrega: '2 horas',
    status: 1, // Active
    nome: 'Entrega Express',
    preco: 15.00
  },
  {
    id: 2,
    descricao: 'Entrega no próximo dia útil',
    tipo: 'standard',
    estimativaEntrega: '1 dia útil',
    status: 1, // Active
    nome: 'Entrega Padrão',
    preco: 8.00
  },
  {
    id: 3,
    descricao: 'Retire na loja sem custo',
    tipo: 'pickup',
    estimativaEntrega: 'Imediato',
    status: 1, // Active
    nome: 'Retirada na Loja',
    preco: 0.00
  }
];

// Mock metodos de pagamento (database schema)
export const mockMetodosPagamento: MetodoPagamento[] = [
  {
    id: 1,
    nome: 'PIX',
    tipo: 'pix',
    ativo: 1 // Active
  },
  {
    id: 2,
    nome: 'Cartão de Crédito',
    tipo: 'credit_card',
    ativo: 1 // Active
  },
  {
    id: 3,
    nome: 'Cartão de Débito',
    tipo: 'debit_card',
    ativo: 1 // Active
  },
  {
    id: 4,
    nome: 'Dinheiro',
    tipo: 'cash',
    ativo: 1 // Active
  },
  {
    id: 5,
    nome: 'Transferência Bancária',
    tipo: 'bank_transfer',
    ativo: 0 // Inactive
  }
];

// Mock pedidos (database schema)
export const mockPedidos: Pedido[] = [
  {
    id: 1,
    status: 4, // Delivered
    total: 48.48,
    subtotal: 40.48,
    taxaEntrega: 8.00,
    statusPagamento: 2, // Paid
    anotacoes: 'Entrega pela manhã, se possível',
    motivoCancelamento: undefined,
    estimativaEntrega: new Date('2024-01-21T10:00:00Z'),
    dataEntrega: new Date('2024-01-21T09:30:00Z'),
    fk_entregador_id: 5,
    fk_metodoPagamento_id: 1,
    fk_usuario_id: 1,
    fk_metodoEntrega_id: 2,
    fk_endereco_id: 1
  },
  {
    id: 2,
    status: 2, // Processing
    total: 73.97,
    subtotal: 58.97,
    taxaEntrega: 15.00,
    statusPagamento: 2, // Paid
    anotacoes: undefined,
    motivoCancelamento: undefined,
    estimativaEntrega: new Date('2024-01-25T16:00:00Z'),
    dataEntrega: undefined,
    fk_entregador_id: 5,
    fk_metodoPagamento_id: 2,
    fk_usuario_id: 2,
    fk_metodoEntrega_id: 1,
    fk_endereco_id: 3
  },
  {
    id: 3,
    status: 5, // Cancelled
    total: 25.49,
    subtotal: 25.49,
    taxaEntrega: 0.00,
    statusPagamento: 4, // Refunded
    anotacoes: undefined,
    motivoCancelamento: 'Cliente solicitou cancelamento',
    estimativaEntrega: new Date('2024-01-23T14:00:00Z'),
    dataEntrega: undefined,
    fk_entregador_id: undefined,
    fk_metodoPagamento_id: 1,
    fk_usuario_id: 3,
    fk_metodoEntrega_id: 3,
    fk_endereco_id: 4
  },
  // Additional delivery orders for Carlos Entregador (id: 5)
  {
    id: 4,
    status: 3, // Shipped - in route
    total: 89.75,
    subtotal: 74.75,
    taxaEntrega: 15.00,
    statusPagamento: 2, // Paid
    anotacoes: 'Apartamento no 4º andar, interfone 45',
    motivoCancelamento: undefined,
    estimativaEntrega: new Date('2024-01-25T18:00:00Z'),
    dataEntrega: undefined,
    fk_entregador_id: 5,
    fk_metodoPagamento_id: 1,
    fk_usuario_id: 1,
    fk_metodoEntrega_id: 1,
    fk_endereco_id: 1
  },
  {
    id: 5,
    status: 3, // Shipped - in route
    total: 34.49,
    subtotal: 26.49,
    taxaEntrega: 8.00,
    statusPagamento: 2, // Paid
    anotacoes: 'Entregar com o porteiro se não estiver em casa',
    motivoCancelamento: undefined,
    estimativaEntrega: new Date('2024-01-25T19:30:00Z'),
    dataEntrega: undefined,
    fk_entregador_id: 5,
    fk_metodoPagamento_id: 2,
    fk_usuario_id: 2,
    fk_metodoEntrega_id: 2,
    fk_endereco_id: 3
  },
  {
    id: 6,
    status: 2, // Processing - ready for pickup
    total: 56.90,
    subtotal: 48.90,
    taxaEntrega: 8.00,
    statusPagamento: 2, // Paid
    anotacoes: 'Cliente solicita produtos bem maduros',
    motivoCancelamento: undefined,
    estimativaEntrega: new Date('2024-01-25T20:00:00Z'),
    dataEntrega: undefined,
    fk_entregador_id: 5,
    fk_metodoPagamento_id: 3,
    fk_usuario_id: 3,
    fk_metodoEntrega_id: 2,
    fk_endereco_id: 4
  },
  // Orders for Bruno Moto (id: 7)
  {
    id: 7,
    status: 3, // Shipped - in route
    total: 127.25,
    subtotal: 112.25,
    taxaEntrega: 15.00,
    statusPagamento: 2, // Paid
    anotacoes: 'Casa com portão azul, cuidado com o cachorro',
    motivoCancelamento: undefined,
    estimativaEntrega: new Date('2024-01-25T17:45:00Z'),
    dataEntrega: undefined,
    fk_entregador_id: 7,
    fk_metodoPagamento_id: 1,
    fk_usuario_id: 1,
    fk_metodoEntrega_id: 1,
    fk_endereco_id: 2
  },
  {
    id: 8,
    status: 4, // Delivered today
    total: 68.40,
    subtotal: 60.40,
    taxaEntrega: 8.00,
    statusPagamento: 2, // Paid
    anotacoes: undefined,
    motivoCancelamento: undefined,
    estimativaEntrega: new Date('2024-01-25T15:00:00Z'),
    dataEntrega: new Date('2024-01-25T14:45:00Z'),
    fk_entregador_id: 7,
    fk_metodoPagamento_id: 4,
    fk_usuario_id: 2,
    fk_metodoEntrega_id: 2,
    fk_endereco_id: 3
  },
  {
    id: 9,
    status: 4, // Delivered today
    total: 43.50,
    subtotal: 35.50,
    taxaEntrega: 8.00,
    statusPagamento: 2, // Paid
    anotacoes: undefined,
    motivoCancelamento: undefined,
    estimativaEntrega: new Date('2024-01-25T12:30:00Z'),
    dataEntrega: new Date('2024-01-25T12:15:00Z'),
    fk_entregador_id: 7,
    fk_metodoPagamento_id: 1,
    fk_usuario_id: 3,
    fk_metodoEntrega_id: 2,
    fk_endereco_id: 4
  },
  // Orders for Rafael Express (id: 8)
  {
    id: 10,
    status: 2, // Processing - ready for pickup
    total: 95.30,
    subtotal: 80.30,
    taxaEntrega: 15.00,
    statusPagamento: 2, // Paid
    anotacoes: 'Pedido especial para festa de aniversário',
    motivoCancelamento: undefined,
    estimativaEntrega: new Date('2024-01-25T21:00:00Z'),
    dataEntrega: undefined,
    fk_entregador_id: 8,
    fk_metodoPagamento_id: 2,
    fk_usuario_id: 1,
    fk_metodoEntrega_id: 1,
    fk_endereco_id: 1
  },
  {
    id: 11,
    status: 4, // Delivered today
    total: 78.85,
    subtotal: 70.85,
    taxaEntrega: 8.00,
    statusPagamento: 2, // Paid
    anotacoes: undefined,
    motivoCancelamento: undefined,
    estimativaEntrega: new Date('2024-01-25T16:00:00Z'),
    dataEntrega: new Date('2024-01-25T15:50:00Z'),
    fk_entregador_id: 8,
    fk_metodoPagamento_id: 1,
    fk_usuario_id: 2,
    fk_metodoEntrega_id: 2,
    fk_endereco_id: 3
  },
  {
    id: 12,
    status: 4, // Delivered today
    total: 152.90,
    subtotal: 137.90,
    taxaEntrega: 15.00,
    statusPagamento: 2, // Paid
    anotacoes: undefined,
    motivoCancelamento: undefined,
    estimativaEntrega: new Date('2024-01-25T13:00:00Z'),
    dataEntrega: new Date('2024-01-25T12:55:00Z'),
    fk_entregador_id: 8,
    fk_metodoPagamento_id: 3,
    fk_usuario_id: 3,
    fk_metodoEntrega_id: 1,
    fk_endereco_id: 4
  }
];

// Mock produtos dos pedidos (database schema)
export const mockProdutosPedido: ProdutoPedido[] = [
  // Pedido 1 items
  {
    id: 1,
    quantidade: 2,
    preco: 8.99,
    fk_produto_id: 1,
    fk_pedido_id: 1
  },
  {
    id: 2,
    quantidade: 1,
    preco: 6.50,
    fk_produto_id: 2,
    fk_pedido_id: 1
  },
  {
    id: 3,
    quantidade: 6,
    preco: 3.99,
    fk_produto_id: 3,
    fk_pedido_id: 1
  },
  // Pedido 2 items
  {
    id: 4,
    quantidade: 3,
    preco: 8.99,
    fk_produto_id: 1,
    fk_pedido_id: 2
  },
  {
    id: 5,
    quantidade: 1,
    preco: 18.99,
    fk_produto_id: 5,
    fk_pedido_id: 2
  },
  {
    id: 6,
    quantidade: 2,
    preco: 6.50,
    fk_produto_id: 2,
    fk_pedido_id: 2
  },
  // Pedido 3 items
  {
    id: 7,
    quantidade: 1,
    preco: 18.99,
    fk_produto_id: 5,
    fk_pedido_id: 3
  },
  {
    id: 8,
    quantidade: 1,
    preco: 6.50,
    fk_produto_id: 2,
    fk_pedido_id: 3
  },
  // Pedido 4 items (Carlos - in route)
  {
    id: 9,
    quantidade: 4,
    preco: 8.99,
    fk_produto_id: 1,
    fk_pedido_id: 4
  },
  {
    id: 10,
    quantidade: 2,
    preco: 18.99,
    fk_produto_id: 5,
    fk_pedido_id: 4
  },
  // Pedido 5 items (Carlos - in route)
  {
    id: 11,
    quantidade: 3,
    preco: 6.50,
    fk_produto_id: 2,
    fk_pedido_id: 5
  },
  {
    id: 12,
    quantidade: 2,
    preco: 3.99,
    fk_produto_id: 3,
    fk_pedido_id: 5
  },
  // Pedido 6 items (Carlos - processing)
  {
    id: 13,
    quantidade: 5,
    preco: 8.99,
    fk_produto_id: 1,
    fk_pedido_id: 6
  },
  {
    id: 14,
    quantidade: 1,
    preco: 3.99,
    fk_produto_id: 3,
    fk_pedido_id: 6
  },
  // Pedido 7 items (Bruno - in route)
  {
    id: 15,
    quantidade: 6,
    preco: 8.99,
    fk_produto_id: 1,
    fk_pedido_id: 7
  },
  {
    id: 16,
    quantidade: 3,
    preco: 18.99,
    fk_produto_id: 5,
    fk_pedido_id: 7
  },
  // Pedido 8 items (Bruno - delivered today)
  {
    id: 17,
    quantidade: 4,
    preco: 8.99,
    fk_produto_id: 1,
    fk_pedido_id: 8
  },
  {
    id: 18,
    quantidade: 3,
    preco: 6.50,
    fk_produto_id: 2,
    fk_pedido_id: 8
  },
  // Pedido 9 items (Bruno - delivered today)
  {
    id: 19,
    quantidade: 2,
    preco: 8.99,
    fk_produto_id: 1,
    fk_pedido_id: 9
  },
  {
    id: 20,
    quantidade: 3,
    preco: 6.50,
    fk_produto_id: 2,
    fk_pedido_id: 9
  },
  // Pedido 10 items (Rafael - processing)
  {
    id: 21,
    quantidade: 4,
    preco: 8.99,
    fk_produto_id: 1,
    fk_pedido_id: 10
  },
  {
    id: 22,
    quantidade: 2,
    preco: 18.99,
    fk_produto_id: 5,
    fk_pedido_id: 10
  },
  {
    id: 23,
    quantidade: 5,
    preco: 6.50,
    fk_produto_id: 2,
    fk_pedido_id: 10
  },
  // Pedido 11 items (Rafael - delivered today)
  {
    id: 24,
    quantidade: 6,
    preco: 8.99,
    fk_produto_id: 1,
    fk_pedido_id: 11
  },
  {
    id: 25,
    quantidade: 3,
    preco: 6.50,
    fk_produto_id: 2,
    fk_pedido_id: 11
  },
  // Pedido 12 items (Rafael - delivered today)
  {
    id: 26,
    quantidade: 8,
    preco: 8.99,
    fk_produto_id: 1,
    fk_pedido_id: 12
  },
  {
    id: 27,
    quantidade: 3,
    preco: 18.99,
    fk_produto_id: 5,
    fk_pedido_id: 12
  }
];

// Mock atualizacoes de pedidos (database schema)
export const mockAtualizacoesPedido: AtualizacaoPedido[] = [
  // Pedido 1 timeline (completed)
  {
    id: 1,
    status: 1, // Received
    timestamp: new Date('2024-01-20T08:00:00Z'),
    descricao: 'Pedido recebido e confirmado',
    fk_usuario_id: 6,
    fk_pedido_id: 1
  },
  {
    id: 2,
    status: 2, // Processing
    timestamp: new Date('2024-01-20T09:00:00Z'),
    descricao: 'Pedido em preparação',
    fk_usuario_id: 6,
    fk_pedido_id: 1
  },
  {
    id: 3,
    status: 3, // Shipped
    timestamp: new Date('2024-01-21T08:00:00Z'),
    descricao: 'Pedido saiu para entrega',
    fk_usuario_id: 5,
    fk_pedido_id: 1
  },
  {
    id: 4,
    status: 4, // Delivered
    timestamp: new Date('2024-01-21T09:30:00Z'),
    descricao: 'Pedido entregue com sucesso',
    fk_usuario_id: 5,
    fk_pedido_id: 1
  },
  // Pedido 2 timeline (processing)
  {
    id: 5,
    status: 1, // Received
    timestamp: new Date('2024-01-24T14:00:00Z'),
    descricao: 'Pedido recebido e confirmado',
    fk_usuario_id: 6,
    fk_pedido_id: 2
  },
  {
    id: 6,
    status: 2, // Processing
    timestamp: new Date('2024-01-24T15:00:00Z'),
    descricao: 'Pedido em preparação',
    fk_usuario_id: 6,
    fk_pedido_id: 2
  },
  // Pedido 3 timeline (cancelled)
  {
    id: 7,
    status: 1, // Received
    timestamp: new Date('2024-01-22T10:00:00Z'),
    descricao: 'Pedido recebido',
    fk_usuario_id: 6,
    fk_pedido_id: 3
  },
  {
    id: 8,
    status: 5, // Cancelled
    timestamp: new Date('2024-01-22T11:00:00Z'),
    descricao: 'Pedido cancelado a pedido do cliente',
    fk_usuario_id: 6,
    fk_pedido_id: 3
  },
  // Pedido 4 timeline (Carlos - in route)
  {
    id: 9,
    status: 1, // Received
    timestamp: new Date('2024-01-25T10:00:00Z'),
    descricao: 'Pedido recebido e confirmado',
    fk_usuario_id: 6,
    fk_pedido_id: 4
  },
  {
    id: 10,
    status: 2, // Processing
    timestamp: new Date('2024-01-25T11:00:00Z'),
    descricao: 'Pedido em preparação',
    fk_usuario_id: 6,
    fk_pedido_id: 4
  },
  {
    id: 11,
    status: 3, // Shipped
    timestamp: new Date('2024-01-25T15:30:00Z'),
    descricao: 'Pedido saiu para entrega',
    fk_usuario_id: 5,
    fk_pedido_id: 4
  },
  // Pedido 5 timeline (Carlos - in route)
  {
    id: 12,
    status: 1, // Received
    timestamp: new Date('2024-01-25T11:30:00Z'),
    descricao: 'Pedido recebido e confirmado',
    fk_usuario_id: 6,
    fk_pedido_id: 5
  },
  {
    id: 13,
    status: 2, // Processing
    timestamp: new Date('2024-01-25T12:30:00Z'),
    descricao: 'Pedido em preparação',
    fk_usuario_id: 6,
    fk_pedido_id: 5
  },
  {
    id: 14,
    status: 3, // Shipped
    timestamp: new Date('2024-01-25T16:00:00Z'),
    descricao: 'Pedido saiu para entrega',
    fk_usuario_id: 5,
    fk_pedido_id: 5
  },
  // Pedido 6 timeline (Carlos - processing)
  {
    id: 15,
    status: 1, // Received
    timestamp: new Date('2024-01-25T13:00:00Z'),
    descricao: 'Pedido recebido e confirmado',
    fk_usuario_id: 6,
    fk_pedido_id: 6
  },
  {
    id: 16,
    status: 2, // Processing
    timestamp: new Date('2024-01-25T14:00:00Z'),
    descricao: 'Pedido em preparação',
    fk_usuario_id: 6,
    fk_pedido_id: 6
  },
  // Pedido 7 timeline (Bruno - in route)
  {
    id: 17,
    status: 1, // Received
    timestamp: new Date('2024-01-25T09:00:00Z'),
    descricao: 'Pedido recebido e confirmado',
    fk_usuario_id: 6,
    fk_pedido_id: 7
  },
  {
    id: 18,
    status: 2, // Processing
    timestamp: new Date('2024-01-25T10:30:00Z'),
    descricao: 'Pedido em preparação',
    fk_usuario_id: 6,
    fk_pedido_id: 7
  },
  {
    id: 19,
    status: 3, // Shipped
    timestamp: new Date('2024-01-25T14:30:00Z'),
    descricao: 'Pedido saiu para entrega',
    fk_usuario_id: 7,
    fk_pedido_id: 7
  },
  // Pedido 8 timeline (Bruno - delivered today)
  {
    id: 20,
    status: 1, // Received
    timestamp: new Date('2024-01-25T08:00:00Z'),
    descricao: 'Pedido recebido e confirmado',
    fk_usuario_id: 6,
    fk_pedido_id: 8
  },
  {
    id: 21,
    status: 2, // Processing
    timestamp: new Date('2024-01-25T09:00:00Z'),
    descricao: 'Pedido em preparação',
    fk_usuario_id: 6,
    fk_pedido_id: 8
  },
  {
    id: 22,
    status: 3, // Shipped
    timestamp: new Date('2024-01-25T13:00:00Z'),
    descricao: 'Pedido saiu para entrega',
    fk_usuario_id: 7,
    fk_pedido_id: 8
  },
  {
    id: 23,
    status: 4, // Delivered
    timestamp: new Date('2024-01-25T14:45:00Z'),
    descricao: 'Pedido entregue com sucesso',
    fk_usuario_id: 7,
    fk_pedido_id: 8
  },
  // Pedido 9 timeline (Bruno - delivered today)
  {
    id: 24,
    status: 1, // Received
    timestamp: new Date('2024-01-25T07:30:00Z'),
    descricao: 'Pedido recebido e confirmado',
    fk_usuario_id: 6,
    fk_pedido_id: 9
  },
  {
    id: 25,
    status: 2, // Processing
    timestamp: new Date('2024-01-25T08:30:00Z'),
    descricao: 'Pedido em preparação',
    fk_usuario_id: 6,
    fk_pedido_id: 9
  },
  {
    id: 26,
    status: 3, // Shipped
    timestamp: new Date('2024-01-25T11:00:00Z'),
    descricao: 'Pedido saiu para entrega',
    fk_usuario_id: 7,
    fk_pedido_id: 9
  },
  {
    id: 27,
    status: 4, // Delivered
    timestamp: new Date('2024-01-25T12:15:00Z'),
    descricao: 'Pedido entregue com sucesso',
    fk_usuario_id: 7,
    fk_pedido_id: 9
  },
  // Pedido 10 timeline (Rafael - processing)
  {
    id: 28,
    status: 1, // Received
    timestamp: new Date('2024-01-25T14:30:00Z'),
    descricao: 'Pedido recebido e confirmado',
    fk_usuario_id: 6,
    fk_pedido_id: 10
  },
  {
    id: 29,
    status: 2, // Processing
    timestamp: new Date('2024-01-25T15:30:00Z'),
    descricao: 'Pedido em preparação',
    fk_usuario_id: 6,
    fk_pedido_id: 10
  },
  // Pedido 11 timeline (Rafael - delivered today)
  {
    id: 30,
    status: 1, // Received
    timestamp: new Date('2024-01-25T08:30:00Z'),
    descricao: 'Pedido recebido e confirmado',
    fk_usuario_id: 6,
    fk_pedido_id: 11
  },
  {
    id: 31,
    status: 2, // Processing
    timestamp: new Date('2024-01-25T09:30:00Z'),
    descricao: 'Pedido em preparação',
    fk_usuario_id: 6,
    fk_pedido_id: 11
  },
  {
    id: 32,
    status: 3, // Shipped
    timestamp: new Date('2024-01-25T14:00:00Z'),
    descricao: 'Pedido saiu para entrega',
    fk_usuario_id: 8,
    fk_pedido_id: 11
  },
  {
    id: 33,
    status: 4, // Delivered
    timestamp: new Date('2024-01-25T15:50:00Z'),
    descricao: 'Pedido entregue com sucesso',
    fk_usuario_id: 8,
    fk_pedido_id: 11
  },
  // Pedido 12 timeline (Rafael - delivered today)
  {
    id: 34,
    status: 1, // Received
    timestamp: new Date('2024-01-25T07:00:00Z'),
    descricao: 'Pedido recebido e confirmado',
    fk_usuario_id: 6,
    fk_pedido_id: 12
  },
  {
    id: 35,
    status: 2, // Processing
    timestamp: new Date('2024-01-25T08:00:00Z'),
    descricao: 'Pedido em preparação',
    fk_usuario_id: 6,
    fk_pedido_id: 12
  },
  {
    id: 36,
    status: 3, // Shipped
    timestamp: new Date('2024-01-25T11:30:00Z'),
    descricao: 'Pedido saiu para entrega',
    fk_usuario_id: 8,
    fk_pedido_id: 12
  },
  {
    id: 37,
    status: 4, // Delivered
    timestamp: new Date('2024-01-25T12:55:00Z'),
    descricao: 'Pedido entregue com sucesso',
    fk_usuario_id: 8,
    fk_pedido_id: 12
  }
];

// Mock avaliacoes de produtos (database schema)
export const mockAvaliacoesProduto: AvaliacaoProduto[] = [
  {
    id: 1,
    avaliacao: 5, // 5 stars
    comentario: 'Maçãs muito doces e frescas!',
    fk_produto_id: 1,
    fk_usuario_id: 1
  },
  {
    id: 2,
    avaliacao: 4, // 4 stars
    comentario: 'Bananas no ponto certo',
    fk_produto_id: 2,
    fk_usuario_id: 1
  },
  {
    id: 3,
    avaliacao: 5, // 5 stars
    comentario: 'Alface muito fresca',
    fk_produto_id: 3,
    fk_usuario_id: 2
  },
  {
    id: 4,
    avaliacao: 3, // 3 stars
    comentario: 'Frango ok, poderia ser mais macio',
    fk_produto_id: 5,
    fk_usuario_id: 2
  }
];