import { mockUsuarios } from '../services/mock/databaseMockData';
import { servicoEntregadorPedidos } from '../services/delivery/servicoEntregadorPedidos';

// Demo da funcionalidade de entregador com dados mock
async function demonstrarDadosEntregador() {
  console.log('=== DEMONSTRAÇÃO DOS DADOS DO ENTREGADOR ===\n');
  
  // 1. Mostrar entregadores disponíveis
  console.log('🚴 ENTREGADORES CADASTRADOS:');
  const entregadores = mockUsuarios.filter(u => u.cargo === 'delivery');
  entregadores.forEach(entregador => {
    console.log(`- ID: ${entregador.id} | Nome: ${entregador.nome} | Entregas: ${entregador.entregasFeitas} | Nota: ${entregador.nota}`);
  });
  
  console.log('\n📊 ESTATÍSTICAS DO CARLOS ENTREGADOR (ID: 5):');
  const carlosId = 5;
  const estatisticas = await servicoEntregadorPedidos.obterEstatisticasDashboard(carlosId);
  console.log(`- Pedidos Pendentes: ${estatisticas.totalPedidosPendentes}`);
  console.log(`- Pedidos em Rota: ${estatisticas.totalPedidosRota}`);
  console.log(`- Entregas Hoje: ${estatisticas.totalEntregasHoje}`);
  console.log(`- Ganhos Hoje: R$ ${estatisticas.totalGanhosHoje.toFixed(2)}`);
  
  console.log('\n📦 PEDIDOS ATRIBUÍDOS AO CARLOS:');
  const pedidosCarlos = await servicoEntregadorPedidos.obterPedidos(carlosId);
  pedidosCarlos.pedidos.forEach(pedido => {
    const statusTexto = {
      1: 'Recebido',
      2: 'Preparando',
      3: 'Em Rota',
      4: 'Entregue',
      5: 'Cancelado'
    }[pedido.status] || 'Desconhecido';
    
    console.log(`- Pedido #${pedido.id} | Status: ${statusTexto} | Total: R$ ${pedido.total.toFixed(2)} | Cliente: ${pedido.cliente?.nome}`);
    if (pedido.endereco) {
      console.log(`  📍 Endereço: ${pedido.endereco.rua}, ${pedido.endereco.numero} - ${pedido.endereco.bairro}, ${pedido.endereco.cidade}`);
    }
    if (pedido.anotacoes) {
      console.log(`  📝 Observações: ${pedido.anotacoes}`);
    }
    console.log('');
  });
  
  console.log('📊 ESTATÍSTICAS DO BRUNO MOTO (ID: 7):');
  const brunoId = 7;
  const estatisticasBruno = await servicoEntregadorPedidos.obterEstatisticasDashboard(brunoId);
  console.log(`- Pedidos Pendentes: ${estatisticasBruno.totalPedidosPendentes}`);
  console.log(`- Pedidos em Rota: ${estatisticasBruno.totalPedidosRota}`);
  console.log(`- Entregas Hoje: ${estatisticasBruno.totalEntregasHoje}`);
  console.log(`- Ganhos Hoje: R$ ${estatisticasBruno.totalGanhosHoje.toFixed(2)}`);
  
  console.log('\n🏆 HISTÓRICO DE ENTREGAS DO RAFAEL EXPRESS (ID: 8):');
  const rafaelId = 8;
  const historicoRafael = await servicoEntregadorPedidos.obterHistoricoEntregas(rafaelId);
  console.log(`Total de entregas concluídas: ${historicoRafael.pedidos.length}`);
  historicoRafael.pedidos.forEach(pedido => {
    console.log(`- Pedido #${pedido.id} | Entregue em: ${pedido.dataEntrega?.toLocaleString()} | Valor: R$ ${pedido.total.toFixed(2)}`);
  });
  
  console.log('\n✅ DEMONSTRAÇÃO CONCLUÍDA - Dados mock funcionando corretamente!');
}

// Exportar função para uso
export { demonstrarDadosEntregador };

// Se executado diretamente, rodar a demonstração
if (typeof window === 'undefined') {
  demonstrarDadosEntregador().catch(console.error);
}