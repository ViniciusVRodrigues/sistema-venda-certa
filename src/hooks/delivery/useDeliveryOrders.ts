import { useState, useEffect, useCallback } from 'react';
import { deliveryOrderService } from '../../services/delivery/deliveryOrderService';
import type { Pedido } from '../../types';

interface EstatisticasEntrega {
  totalPedidosPendentes: number;
  totalPedidosRota: number;
  totalEntregasHoje: number;
  totalGanhosHoje: number;
}

interface UseDeliveryOrdersResult {
  pedidos: Pedido[];
  estatisticas: EstatisticasEntrega | null;
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
  atualizarStatusPedido: (pedidoId: number, status: 3 | 4, anotacoes?: string) => Promise<void>;
  obterPedidoPorId: (pedidoId: number) => Promise<Pedido | null>;
}

export const useDeliveryOrders = (entregadorId: number): UseDeliveryOrdersResult => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [estatisticas, setEstatisticas] = useState<EstatisticasEntrega | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
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

  // Carregar pedidos
  const carregarPedidos = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);
      
      const response = await deliveryOrderService.obterPedidos(
        entregadorId,
        filtros,
        { pagina: paginacao.pagina, tamanhoPagina: paginacao.tamanhoPagina }
      );
      
      setPedidos(response.pedidos);
      setPaginacao(response.paginacao);
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
      setErro('Erro ao carregar pedidos');
    } finally {
      setCarregando(false);
    }
  }, [entregadorId, filtros, paginacao.pagina, paginacao.tamanhoPagina]);

  // Carregar estatísticas
  const carregarEstatisticas = useCallback(async () => {
    try {
      const dadosEstatisticas = await deliveryOrderService.obterEstatisticasDashboard(entregadorId);
      setEstatisticas(dadosEstatisticas);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    }
  }, [entregadorId]);

  // Atualizar filtros
  const atualizarFiltros = useCallback((novosFiltros: Partial<{ status: string; busca: string }>) => {
    setFiltros(prev => ({ ...prev, ...novosFiltros }));
    setPaginacao(prev => ({ ...prev, pagina: 1 })); // Reset para primeira página
  }, []);

  // Mudar página
  const mudarPagina = useCallback((pagina: number) => {
    setPaginacao(prev => ({ ...prev, pagina }));
  }, []);

  // Atualizar pedidos
  const atualizarPedidos = useCallback(async () => {
    await Promise.all([carregarPedidos(), carregarEstatisticas()]);
  }, [carregarPedidos, carregarEstatisticas]);

  // Atualizar status do pedido
  const atualizarStatusPedido = useCallback(async (
    pedidoId: number, 
    status: 3 | 4, 
    anotacoes?: string
  ) => {
    try {
      await deliveryOrderService.atualizarStatusPedido(pedidoId, status, anotacoes);
      await atualizarPedidos(); // Recarregar dados
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      throw err;
    }
  }, [atualizarPedidos]);

  // Obter pedido por ID
  const obterPedidoPorId = useCallback(async (pedidoId: number) => {
    try {
      return await deliveryOrderService.obterPedidoPorId(pedidoId);
    } catch (err) {
      console.error('Erro ao buscar pedido:', err);
      throw err;
    }
  }, []);

  // Carregar dados ao montar e quando dependências mudam
  useEffect(() => {
    if (entregadorId) {
      carregarPedidos();
    }
  }, [carregarPedidos, entregadorId]);

  useEffect(() => {
    if (entregadorId) {
      carregarEstatisticas();
    }
  }, [carregarEstatisticas, entregadorId]);

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
    obterPedidoPorId
  };
};