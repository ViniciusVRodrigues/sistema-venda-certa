import sequelize from '../config/database';
import {
  Usuario,
  Categoria,
  Produto,
  MetodoEntrega,
  MetodoPagamento,
  Endereco,
} from '../models';

const seedData = async () => {
  try {
    console.log('🌱 Iniciando inserção de dados de exemplo...');

    // Clear existing data (be careful in production!)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ force: true });
      console.log('🗑️ Dados existentes removidos');
    }

    // Create categories
    const categorias = await Categoria.bulkCreate([
      {
        nome: 'Eletrônicos',
        descricao: 'Produtos eletrônicos em geral',
        estaAtiva: true,
      },
      {
        nome: 'Roupas',
        descricao: 'Vestuário e acessórios',
        estaAtiva: true,
      },
      {
        nome: 'Casa e Jardim',
        descricao: 'Itens para casa e jardim',
        estaAtiva: true,
      },
    ]);
    console.log('✅ Categorias criadas');

    // Create users
    const usuarios = await Usuario.bulkCreate([
      {
        nome: 'João Silva',
        email: 'joao@email.com',
        cargo: 'customer',
        numeroCelular: '11999999999',
        status: 1,
        totalPedidos: 0,
        totalGasto: 0.00,
        entregasFeitas: 0,
        nota: 5.0,
      },
      {
        nome: 'Maria Santos',
        email: 'maria@email.com',
        cargo: 'customer',
        numeroCelular: '11888888888',
        status: 1,
        totalPedidos: 0,
        totalGasto: 0.00,
        entregasFeitas: 0,
        nota: 4.8,
      },
      {
        nome: 'Pedro Entregador',
        email: 'pedro@email.com',
        cargo: 'delivery',
        numeroCelular: '11777777777',
        status: 1,
        totalPedidos: 0,
        totalGasto: 0.00,
        entregasFeitas: 50,
        nota: 4.9,
      },
      {
        nome: 'Ana Admin',
        email: 'ana@email.com',
        cargo: 'admin',
        numeroCelular: '11666666666',
        status: 1,
        totalPedidos: 0,
        totalGasto: 0.00,
        entregasFeitas: 0,
        nota: 5.0,
      },
    ]);
    console.log('✅ Usuários criados');

    // Create addresses
    await Endereco.bulkCreate([
      {
        rua: 'Rua das Flores, 123',
        numero: '123',
        complemento: 'Apto 45',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567',
        favorito: true,
        fk_usuario_id: usuarios[0].id,
      },
      {
        rua: 'Av. Principal, 456',
        numero: '456',
        bairro: 'Jardins',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-890',
        favorito: true,
        fk_usuario_id: usuarios[1].id,
      },
    ]);
    console.log('✅ Endereços criados');

    // Create products
    await Produto.bulkCreate([
      {
        sku: 'PHONE001',
        nome: 'Smartphone XYZ',
        descricao: 'Smartphone com 128GB de armazenamento e câmera de 48MP',
        descricaoResumida: 'Smartphone 128GB 48MP',
        preco: 899.99,
        medida: 'unidade',
        estoque: 50,
        status: 1,
        tags: 'smartphone,telefone,celular',
        fk_categoria_id: categorias[0].id,
      },
      {
        sku: 'SHIRT001',
        nome: 'Camiseta Polo',
        descricao: 'Camiseta polo masculina de algodão',
        descricaoResumida: 'Polo masculina algodão',
        preco: 79.90,
        medida: 'unidade',
        estoque: 100,
        status: 1,
        tags: 'camiseta,polo,masculino',
        fk_categoria_id: categorias[1].id,
      },
      {
        sku: 'VASE001',
        nome: 'Vaso Decorativo',
        descricao: 'Vaso decorativo de cerâmica para plantas',
        descricaoResumida: 'Vaso cerâmica decorativo',
        preco: 45.50,
        medida: 'unidade',
        estoque: 25,
        status: 1,
        tags: 'vaso,decoração,casa',
        fk_categoria_id: categorias[2].id,
      },
    ]);
    console.log('✅ Produtos criados');

    // Create delivery methods
    await MetodoEntrega.bulkCreate([
      {
        descricao: 'Entrega rápida em até 24 horas',
        tipo: 'expressa',
        estimativaEntrega: '1 dia útil',
        status: 1,
        nome: 'Entrega Expressa',
        preco: 15.90,
      },
      {
        descricao: 'Entrega padrão em até 5 dias úteis',
        tipo: 'padrao',
        estimativaEntrega: '3-5 dias úteis',
        status: 1,
        nome: 'Entrega Padrão',
        preco: 8.50,
      },
      {
        descricao: 'Retirada na loja sem custo',
        tipo: 'retirada',
        estimativaEntrega: 'Imediato',
        status: 1,
        nome: 'Retirada na Loja',
        preco: 0.00,
      },
    ]);
    console.log('✅ Métodos de entrega criados');

    // Create payment methods
    await MetodoPagamento.bulkCreate([
      {
        nome: 'Cartão de Crédito',
        tipo: 'credit_card',
        ativo: 1,
      },
      {
        nome: 'Cartão de Débito',
        tipo: 'debit_card',
        ativo: 1,
      },
      {
        nome: 'PIX',
        tipo: 'pix',
        ativo: 1,
      },
      {
        nome: 'Dinheiro',
        tipo: 'cash',
        ativo: 1,
      },
    ]);
    console.log('✅ Métodos de pagamento criados');

    console.log('🎉 Dados de exemplo inseridos com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inserir dados de exemplo:', error);
    throw error;
  }
};

export default seedData;