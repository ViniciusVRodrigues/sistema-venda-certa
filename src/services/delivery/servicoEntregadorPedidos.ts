import type { 
  Usuario, Endereco, Produto, Categoria, Pedido, MetodoEntrega,
  MetodoPagamento, ProdutoPedido, AtualizacaoPedido
} from '../../types';
import { 
  mockUsuarios, mockEnderecos, mockProdutos, mockCategorias, 
  mockPedidos, mockMetodosEntrega, mockMetodosPagamento, 
  mockProdutosPedido, mockAtualizacoesPedido 
} from '../mock/databaseMockData';

interface EstatisticasEntregador {
  totalPedidosPendentes: number;
  totalPedidosRota: number;
  totalEntregasHoje: number;
  totalGanhosHoje: number;
}

interface RespostaPedidosEntregador {
  pedidos: PedidoCompleto[];
  paginacao: {
    pagina: number;
    tamanhoPagina: number;
    total: number;
    totalPaginas: number;
  };
}

interface PedidoCompleto extends Pedido {
  cliente?: Usuario;
  endereco?: Endereco;
  metodoPagamento?: MetodoPagamento;
  metodoEntrega?: MetodoEntrega;
  itens?: ProdutoPedidoCompleto[];
  historico?: AtualizacaoPedido[];
  entregador?: Usuario;
}

interface ProdutoPedidoCompleto extends ProdutoPedido {
  produto?: Produto;
  categoria?: Categoria;
}

class ServicoEntregadorPedidos {
  // Obter estatísticas do dashboard
  async obterEstatisticasDashboard(entregadorId: number): Promise<EstatisticasEntregador> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const pedidosEntregador = mockPedidos.filter(pedido => pedido.fk_entregador_id === entregadorId);
    
    const pedidosPendentes = pedidosEntregador.filter(pedido => 
      pedido.status === 2 // Processing
    ).length;
    
    const pedidosRota = pedidosEntregador.filter(pedido => 
      pedido.status === 3 // Shipped
    ).length;
    
    const entregasHoje = pedidosEntregador.filter(pedido => 
      pedido.status === 4 && // Delivered
      pedido.dataEntrega && 
      pedido.dataEntrega >= hoje
    ).length;
    
    const ganhosHoje = pedidosEntregador
      .filter(pedido => 
        pedido.status === 4 && // Delivered
        pedido.dataEntrega && 
        pedido.dataEntrega >= hoje
      )
      .reduce((total, pedido) => total + pedido.taxaEntrega, 0);
    
    return {
      totalPedidosPendentes: pedidosPendentes,
      totalPedidosRota: pedidosRota,
      totalEntregasHoje: entregasHoje,
      totalGanhosHoje: ganhosHoje
    };
  }

  // Obter pedidos atribuídos ao entregador
  async obterPedidos(
    entregadorId: number,
    filtros: { status?: string; busca?: string } = {},
    paginacao: { pagina: number; tamanhoPagina: number } = { pagina: 1, tamanhoPagina: 10 }
  ): Promise<RespostaPedidosEntregador> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let pedidosFiltrados = mockPedidos.filter(pedido => pedido.fk_entregador_id === entregadorId);
    
    // Aplicar filtro de status
    if (filtros.status && filtros.status !== 'all') {
      if (filtros.status === 'pending') {
        pedidosFiltrados = pedidosFiltrados.filter(pedido => 
          pedido.status === 2 // Processing
        );
      } else if (filtros.status === 'in_route') {
        pedidosFiltrados = pedidosFiltrados.filter(pedido => pedido.status === 3); // Shipped
      } else if (filtros.status === 'delivered') {
        pedidosFiltrados = pedidosFiltrados.filter(pedido => pedido.status === 4); // Delivered
      }
    }
    
    // Aplicar filtro de busca
    if (filtros.busca) {
      const buscaLower = filtros.busca.toLowerCase();
      pedidosFiltrados = pedidosFiltrados.filter(pedido => {
        const cliente = mockUsuarios.find(u => u.id === pedido.fk_usuario_id);
        const endereco = mockEnderecos.find(e => e.id === pedido.fk_endereco_id);
        
        return pedido.id.toString().includes(buscaLower) ||
               cliente?.nome.toLowerCase().includes(buscaLower) ||
               endereco?.rua.toLowerCase().includes(buscaLower);
      });
    }
    
    // Ordenar por data de criação (mais recentes primeiro)
    // Como não temos createdAt no schema, usamos o timestamp da primeira atualização
    pedidosFiltrados.sort((a, b) => {
      const timestampA = mockAtualizacoesPedido
        .filter(att => att.fk_pedido_id === a.id)
        .sort((x, y) => x.timestamp.getTime() - y.timestamp.getTime())[0]?.timestamp || new Date(0);
      const timestampB = mockAtualizacoesPedido
        .filter(att => att.fk_pedido_id === b.id)
        .sort((x, y) => x.timestamp.getTime() - y.timestamp.getTime())[0]?.timestamp || new Date(0);
      
      return timestampB.getTime() - timestampA.getTime();
    });
    
    // Aplicar paginação
    const indiceInicio = (paginacao.pagina - 1) * paginacao.tamanhoPagina;
    const indiceFim = indiceInicio + paginacao.tamanhoPagina;
    const pedidosPaginados = pedidosFiltrados.slice(indiceInicio, indiceFim);
    
    // Enriquecer dados dos pedidos
    const pedidosCompletos = pedidosPaginados.map(pedido => this.enriquecerPedido(pedido));
    
    return {
      pedidos: pedidosCompletos,
      paginacao: {
        pagina: paginacao.pagina,
        tamanhoPagina: paginacao.tamanhoPagina,
        total: pedidosFiltrados.length,
        totalPaginas: Math.ceil(pedidosFiltrados.length / paginacao.tamanhoPagina)
      }
    };
  }

  // Obter pedido específico por ID
  async obterPedidoPorId(pedidoId: number): Promise<PedidoCompleto | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const pedido = mockPedidos.find(p => p.id === pedidoId);
    if (!pedido) return null;
    
    return this.enriquecerPedido(pedido);
  }

  // Atualizar status do pedido (ações do entregador)
  async atualizarStatusPedido(
    pedidoId: number, 
    novoStatus: 3 | 4, // Shipped | Delivered
    observacoes?: string
  ): Promise<PedidoCompleto> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const indicePedido = mockPedidos.findIndex(pedido => pedido.id === pedidoId);
    if (indicePedido === -1) {
      throw new Error('Pedido não encontrado');
    }

    const pedido = mockPedidos[indicePedido];
    
    // Validar transição de status
    if (novoStatus === 3 && pedido.status !== 2) { // Shipped
      throw new Error('Pedido deve estar em preparação para ser marcado como em rota');
    }
    
    if (novoStatus === 4 && pedido.status !== 3) { // Delivered
      throw new Error('Pedido deve estar em rota para ser marcado como entregue');
    }
    
    // Atualizar pedido
    pedido.status = novoStatus;
    
    if (novoStatus === 4) { // Delivered
      pedido.dataEntrega = new Date();
    }
    
    // Adicionar evento na timeline
    const eventoTimeline: AtualizacaoPedido = {
      id: Date.now(),
      status: novoStatus,
      timestamp: new Date(),
      descricao: observacoes || (novoStatus === 3 ? 'Pedido em rota de entrega' : 'Pedido entregue'),
      fk_usuario_id: pedido.fk_entregador_id!,
      fk_pedido_id: pedidoId
    };
    
    mockAtualizacoesPedido.push(eventoTimeline);
    
    return this.enriquecerPedido(pedido);
  }

  // Obter histórico de entregas
  async obterHistoricoEntregas(
    entregadorId: number,
    paginacao: { pagina: number; tamanhoPagina: number } = { pagina: 1, tamanhoPagina: 10 }
  ): Promise<RespostaPedidosEntregador> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const pedidosEntregues = mockPedidos
      .filter(pedido => 
        pedido.fk_entregador_id === entregadorId && 
        pedido.status === 4 // Delivered
      )
      .sort((a, b) => {
        const dataA = a.dataEntrega || new Date(0);
        const dataB = b.dataEntrega || new Date(0);
        return dataB.getTime() - dataA.getTime();
      });
    
    // Aplicar paginação
    const indiceInicio = (paginacao.pagina - 1) * paginacao.tamanhoPagina;
    const indiceFim = indiceInicio + paginacao.tamanhoPagina;
    const pedidosPaginados = pedidosEntregues.slice(indiceInicio, indiceFim);
    
    // Enriquecer dados dos pedidos
    const pedidosCompletos = pedidosPaginados.map(pedido => this.enriquecerPedido(pedido));
    
    return {
      pedidos: pedidosCompletos,
      paginacao: {
        pagina: paginacao.pagina,
        tamanhoPagina: paginacao.tamanhoPagina,
        total: pedidosEntregues.length,
        totalPaginas: Math.ceil(pedidosEntregues.length / paginacao.tamanhoPagina)
      }
    };
  }

  // Método auxiliar para enriquecer dados do pedido
  private enriquecerPedido(pedido: Pedido): PedidoCompleto {
    const cliente = mockUsuarios.find(u => u.id === pedido.fk_usuario_id);
    const endereco = mockEnderecos.find(e => e.id === pedido.fk_endereco_id);
    const metodoPagamento = mockMetodosPagamento.find(mp => mp.id === pedido.fk_metodoPagamento_id);
    const metodoEntrega = mockMetodosEntrega.find(me => me.id === pedido.fk_metodoEntrega_id);
    const entregador = pedido.fk_entregador_id ? mockUsuarios.find(u => u.id === pedido.fk_entregador_id) : undefined;
    
    const itensPedido = mockProdutosPedido
      .filter(pp => pp.fk_pedido_id === pedido.id)
      .map(pp => {
        const produto = mockProdutos.find(p => p.id === pp.fk_produto_id);
        const categoria = produto ? mockCategorias.find(c => c.id === produto.fk_categoria_id) : undefined;
        
        return {
          ...pp,
          produto,
          categoria
        };
      });
    
    const historico = mockAtualizacoesPedido
      .filter(ap => ap.fk_pedido_id === pedido.id)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    return {
      ...pedido,
      cliente,
      endereco,
      metodoPagamento,
      metodoEntrega,
      itens: itensPedido,
      historico,
      entregador
    };
  }

  // Obter perfil do entregador
  async obterPerfilEntregador(entregadorId: number): Promise<Usuario | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const entregador = mockUsuarios.find(u => u.id === entregadorId && u.cargo === 'delivery');
    return entregador || null;
  }

  // Obter lista de todos os entregadores (para admin)
  async obterListaEntregadores(): Promise<Usuario[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return mockUsuarios.filter(u => u.cargo === 'delivery');
  }
}

export const servicoEntregadorPedidos = new ServicoEntregadorPedidos();