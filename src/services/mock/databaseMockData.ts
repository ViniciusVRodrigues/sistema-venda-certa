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
  }
];

// Mock produtos dos pedidos (database schema)
export const mockProdutosPedido: ProdutoPedido[] = [
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
  }
];

// Mock atualizacoes de pedidos (database schema)
export const mockAtualizacoesPedido: AtualizacaoPedido[] = [
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