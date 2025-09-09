import { Logger } from './Logger';

// Padrão Template Method - Report Generation
export abstract class ReportGenerator {
  protected logger = Logger.getInstance();

  // Template method que define o algoritmo de geração de relatório
  public async generateReport(params: any): Promise<string> {
    this.logger.info('Iniciando geração de relatório');

    // 1. Validar parâmetros
    this.validateParameters(params);

    // 2. Coletar dados
    const rawData = await this.collectData(params);

    // 3. Processar dados
    const processedData = this.processData(rawData);

    // 4. Formatar relatório (implementado pelas subclasses)
    const formattedReport = this.formatReport(processedData);

    // 5. Aplicar cabeçalho e rodapé
    const finalReport = this.addHeaderAndFooter(formattedReport);

    this.logger.info('Relatório gerado com sucesso');
    return finalReport;
  }

  // Hooks implementados na classe base (podem ser sobrescritos)
  protected validateParameters(params: any): void {
    if (!params) {
      throw new Error('Parâmetros são obrigatórios');
    }
  }

  protected async collectData(params: any): Promise<any[]> {
    // Implementação padrão retorna array vazio
    // Subclasses devem sobrescrever este método
    return [];
  }

  protected processData(data: any[]): any[] {
    // Processamento padrão - filtrar dados nulos
    return data.filter(item => item !== null && item !== undefined);
  }

  protected addHeaderAndFooter(report: string): string {
    const header = this.generateHeader();
    const footer = this.generateFooter();
    return `${header}\n\n${report}\n\n${footer}`;
  }

  protected generateHeader(): string {
    return `=== RELATÓRIO SISTEMA VENDA CERTA ===\nGerado em: ${new Date().toLocaleString('pt-BR')}`;
  }

  protected generateFooter(): string {
    return `=== FIM DO RELATÓRIO ===`;
  }

  // Método abstrato que deve ser implementado pelas subclasses
  protected abstract formatReport(data: any[]): string;
}

// Implementação concreta para relatório de produtos
export class ProdutoReportGenerator extends ReportGenerator {
  protected async collectData(params: any): Promise<any[]> {
    // Simulação de coleta de dados de produtos
    // Em uma implementação real, faria consulta ao banco
    const { Produto, Categoria } = await import('../models');
    
    const produtos = await Produto.findAll({
      include: [{ model: Categoria, as: 'categoria' }],
      where: params.filtros || {}
    });

    return produtos.map(p => p.toJSON());
  }

  protected formatReport(data: any[]): string {
    let report = 'RELATÓRIO DE PRODUTOS\n';
    report += '=' .repeat(50) + '\n\n';
    
    data.forEach((produto, index) => {
      report += `${index + 1}. ${produto.nome}\n`;
      report += `   SKU: ${produto.sku || 'N/A'}\n`;
      report += `   Preço: R$ ${produto.preco?.toFixed(2) || '0.00'}\n`;
      report += `   Estoque: ${produto.estoque || 0}\n`;
      report += `   Categoria: ${produto.categoria?.nome || 'N/A'}\n`;
      report += `   Status: ${produto.status === 1 ? 'Ativo' : 'Inativo'}\n\n`;
    });

    report += `Total de produtos: ${data.length}`;
    return report;
  }

  protected generateHeader(): string {
    return super.generateHeader() + '\nTipo: Relatório de Produtos';
  }
}

// Implementação concreta para relatório de pedidos
export class PedidoReportGenerator extends ReportGenerator {
  protected async collectData(params: any): Promise<any[]> {
    // Simulação de coleta de dados de pedidos
    const { Pedido, Usuario } = await import('../models');
    
    const pedidos = await Pedido.findAll({
      include: [{ model: Usuario, as: 'usuario' }],
      where: params.filtros || {}
    });

    return pedidos.map(p => p.toJSON());
  }

  protected formatReport(data: any[]): string {
    let report = 'RELATÓRIO DE PEDIDOS\n';
    report += '=' .repeat(50) + '\n\n';
    
    let totalVendas = 0;
    
    data.forEach((pedido, index) => {
      report += `${index + 1}. Pedido #${pedido.id}\n`;
      report += `   Cliente: ${pedido.usuario?.nome || 'N/A'}\n`;
      report += `   Data: ${new Date(pedido.dataPedido).toLocaleDateString('pt-BR')}\n`;
      report += `   Total: R$ ${pedido.total?.toFixed(2) || '0.00'}\n`;
      report += `   Status: ${this.getStatusDescription(pedido.statusPedido)}\n\n`;
      
      totalVendas += parseFloat(pedido.total) || 0;
    });

    report += `Total de pedidos: ${data.length}\n`;
    report += `Valor total de vendas: R$ ${totalVendas.toFixed(2)}`;
    return report;
  }

  private getStatusDescription(status: number): string {
    const statusMap: { [key: number]: string } = {
      1: 'Pendente',
      2: 'Confirmado',
      3: 'Em Preparo',
      4: 'Saiu para Entrega',
      5: 'Entregue',
      6: 'Cancelado'
    };
    return statusMap[status] || 'Desconhecido';
  }

  protected generateHeader(): string {
    return super.generateHeader() + '\nTipo: Relatório de Pedidos';
  }
}
