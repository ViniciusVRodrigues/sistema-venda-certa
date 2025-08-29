import { useState, useEffect, useCallback } from 'react';
import { servicoEntregadorPedidos } from '../../services/delivery/servicoEntregadorPedidos';
import type { Usuario } from '../../types';

interface EstatisticasEntregador {
  totalPedidosPendentes: number;
  totalPedidosRota: number;
  totalEntregasHoje: number;
  totalGanhosHoje: number;
}

interface PedidoCompleto {
  id: number;
  status: number;
  total: number;
  subtotal: number;
  taxaEntrega: number;
  statusPagamento: number;
  anotacoes?: string;
  motivoCancelamento?: string;
  estimativaEntrega?: Date;
  dataEntrega?: Date;
  fk_entregador_id?: number;
  fk_metodoPagamento_id: number;
  fk_usuario_id: number;
  fk_metodoEntrega_id: number;
  fk_endereco_id: number;
  cliente?: Usuario;
  endereco?: any;
  metodoPagamento?: any;
  metodoEntrega?: any;
  itens?: any[];
  historico?: any[];
  entregador?: Usuario;
}

interface UseEntregadorPedidosResult {
  pedidos: PedidoCompleto[];
  estatisticas: EstatisticasEntregador | null;
  carregando: boolean;
  erro: string | null;
  paginacao: {
    pagina: number;
    tamanhoPagina: number;
    total: number;
    totalPaginas: number;
  };
  filtros: {
    status: string;
    busca: string;
  };
  atualizarFiltros: (novosFiltros: Partial<{ status: string; busca: string }>) => void;
  mudarPagina: (pagina: number) => void;
  atualizarPedidos: () => Promise<void>;
  atualizarStatusPedido: (pedidoId: number, status: 3 | 4, observacoes?: string) => Promise<void>;
  obterHistoricoEntregas: () => Promise<void>;
  modoHistorico: boolean;
  alternarModoHistorico: () => void;
}

interface UseEntregadorPedidosOptions {
  entregadorId?: number;
  carregarAutomaticamente?: boolean;
  intervaloAtualizacao?: number;
}

export const useEntregadorPedidos = (
  options: UseEntregadorPedidosOptions = {}
): UseEntregadorPedidosResult => {
  const { 
    entregadorId, 
    carregarAutomaticamente = true, 
    intervaloAtualizacao = 30000 // 30 segundos
  } = options;

  const [pedidos, setPedidos] = useState<PedidoCompleto[]>([]);
  const [estatisticas, setEstatisticas] = useState<EstatisticasEntregador | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [modoHistorico, setModoHistorico] = useState(false);
  
  const [paginacao, setPaginacao] = useState({
    pagina: 1,
    tamanhoPagina: 10,
    total: 0,
    totalPaginas: 0
  });
  
  const [filtros, setFiltros] = useState({
    status: 'all',
    busca: ''
  });

  // Carregar estatísticas do dashboard
  const carregarEstatisticas = useCallback(async () => {
    if (!entregadorId) return;
    
    try {
      const stats = await servicoEntregadorPedidos.obterEstatisticasDashboard(entregadorId);
      setEstatisticas(stats);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
      setErro('Erro ao carregar estatísticas do dashboard');
    }
  }, [entregadorId]);

  // Carregar pedidos
  const carregarPedidos = useCallback(async () => {
    if (!entregadorId) return;
    
    try {
      setCarregando(true);
      setErro(null);
      
      const resposta = modoHistorico 
        ? await servicoEntregadorPedidos.obterHistoricoEntregas(entregadorId, {
            pagina: paginacao.pagina,
            tamanhoPagina: paginacao.tamanhoPagina
          })
        : await servicoEntregadorPedidos.obterPedidos(entregadorId, filtros, {
            pagina: paginacao.pagina,
            tamanhoPagina: paginacao.tamanhoPagina
          });
      
      setPedidos(resposta.pedidos);
      setPaginacao(prev => ({
        ...prev,
        total: resposta.paginacao.total,
        totalPaginas: resposta.paginacao.totalPaginas
      }));
      
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
      setErro('Erro ao carregar pedidos');
    } finally {
      setCarregando(false);
    }
  }, [entregadorId, filtros, paginacao.pagina, paginacao.tamanhoPagina, modoHistorico]);

  // Atualizar filtros
  const atualizarFiltros = useCallback((novosFiltros: Partial<{ status: string; busca: string }>) => {
    setFiltros(prev => ({ ...prev, ...novosFiltros }));
    setPaginacao(prev => ({ ...prev, pagina: 1 })); // Reset para primeira página
  }, []);

  // Mudar página
  const mudarPagina = useCallback((pagina: number) => {
    setPaginacao(prev => ({ ...prev, pagina }));
  }, []);

  // Atualizar pedidos manualmente
  const atualizarPedidos = useCallback(async () => {
    await Promise.all([carregarPedidos(), carregarEstatisticas()]);
  }, [carregarPedidos, carregarEstatisticas]);

  // Atualizar status do pedido
  const atualizarStatusPedido = useCallback(async (
    pedidoId: number, 
    status: 3 | 4, 
    observacoes?: string
  ) => {
    try {
      setCarregando(true);
      await servicoEntregadorPedidos.atualizarStatusPedido(pedidoId, status, observacoes);
      
      // Recarregar dados após atualização
      await atualizarPedidos();
      
    } catch (err) {
      console.error('Erro ao atualizar status do pedido:', err);
      setErro(err instanceof Error ? err.message : 'Erro ao atualizar status do pedido');
      throw err;
    } finally {
      setCarregando(false);
    }
  }, [atualizarPedidos]);

  // Obter histórico de entregas
  const obterHistoricoEntregas = useCallback(async () => {
    setModoHistorico(true);
    setPaginacao(prev => ({ ...prev, pagina: 1 }));
  }, []);

  // Alternar modo histórico
  const alternarModoHistorico = useCallback(() => {
    setModoHistorico(prev => !prev);
    setPaginacao(prev => ({ ...prev, pagina: 1 }));
  }, []);

  // Carregar dados iniciais
  useEffect(() => {
    if (carregarAutomaticamente && entregadorId) {
      atualizarPedidos();
    }
  }, [carregarAutomaticamente, entregadorId, atualizarPedidos]);

  // Recarregar quando filtros ou paginação mudarem
  useEffect(() => {
    if (entregadorId) {
      carregarPedidos();
    }
  }, [carregarPedidos]);

  // Recarregar estatísticas quando modo histórico mudar
  useEffect(() => {
    if (entregadorId && !modoHistorico) {
      carregarEstatisticas();
    }
  }, [entregadorId, modoHistorico, carregarEstatisticas]);

  // Atualização automática (apenas para pedidos ativos, não histórico)
  useEffect(() => {
    if (!entregadorId || modoHistorico || !intervaloAtualizacao) return;
    
    const interval = setInterval(() => {
      atualizarPedidos();
    }, intervaloAtualizacao);
    
    return () => clearInterval(interval);
  }, [entregadorId, modoHistorico, intervaloAtualizacao, atualizarPedidos]);

  return {
    pedidos,
    estatisticas,
    carregando,
    erro,
    paginacao,
    filtros,
    atualizarFiltros,
    mudarPagina,
    atualizarPedidos,
    atualizarStatusPedido,
    obterHistoricoEntregas,
    modoHistorico,
    alternarModoHistorico
  };
};