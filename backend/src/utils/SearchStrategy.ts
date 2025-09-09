import { Op } from 'sequelize';

// Padrão Strategy - Search Algorithms
export interface SearchStrategy {
  search(query: string, options?: SearchOptions): Promise<SearchResult>;
  getSearchType(): string;
  getSupportedFilters(): string[];
}

export interface SearchOptions {
  limit?: number;
  offset?: number;
  filters?: { [key: string]: any };
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface SearchResult {
  data: any[];
  total: number;
  searchType: string;
  executionTime: number;
}

// Implementação concreta para busca simples por nome
export class SimpleNameSearchStrategy implements SearchStrategy {
  async search(query: string, options: SearchOptions = {}): Promise<SearchResult> {
    const startTime = Date.now();
    const { Produto, Categoria } = await import('../models');
    
    const whereClause: any = {
      nome: {
        [Op.like]: `%${query}%`
      }
    };

    // Aplicar filtros adicionais
    if (options.filters) {
      Object.assign(whereClause, options.filters);
    }

    const produtos = await Produto.findAndCountAll({
      where: whereClause,
      include: [{ model: Categoria, as: 'categoria' }],
      limit: options.limit || 20,
      offset: options.offset || 0,
      order: options.sortBy ? [[options.sortBy, options.sortOrder || 'ASC']] : [['nome', 'ASC']]
    });

    const executionTime = Date.now() - startTime;

    return {
      data: produtos.rows.map(p => p.toJSON()),
      total: produtos.count,
      searchType: this.getSearchType(),
      executionTime
    };
  }

  getSearchType(): string {
    return 'Busca Simples por Nome';
  }

  getSupportedFilters(): string[] {
    return ['fk_categoria_id', 'status', 'preco'];
  }
}

// Implementação concreta para busca avançada (múltiplos campos)
export class AdvancedSearchStrategy implements SearchStrategy {
  async search(query: string, options: SearchOptions = {}): Promise<SearchResult> {
    const startTime = Date.now();
    const { Produto, Categoria } = await import('../models');
    
    const searchTerms = query.split(' ').filter(term => term.length > 2);
    
    const whereClause: any = {
      [Op.or]: [
        { nome: { [Op.like]: `%${query}%` } },
        { descricao: { [Op.like]: `%${query}%` } },
        { descricaoResumida: { [Op.like]: `%${query}%` } },
        { tags: { [Op.like]: `%${query}%` } },
        { sku: { [Op.like]: `%${query}%` } }
      ]
    };

    // Busca por termos individuais se houver múltiplas palavras
    if (searchTerms.length > 1) {
      const termClauses = searchTerms.map(term => ({
        [Op.or]: [
          { nome: { [Op.like]: `%${term}%` } },
          { descricao: { [Op.like]: `%${term}%` } },
          { tags: { [Op.like]: `%${term}%` } }
        ]
      }));
      
      whereClause[Op.or].push({ [Op.and]: termClauses });
    }

    // Aplicar filtros adicionais
    if (options.filters) {
      Object.assign(whereClause, options.filters);
    }

    const produtos = await Produto.findAndCountAll({
      where: whereClause,
      include: [{ model: Categoria, as: 'categoria' }],
      limit: options.limit || 20,
      offset: options.offset || 0,
      order: options.sortBy ? [[options.sortBy, options.sortOrder || 'ASC']] : [['nome', 'ASC']]
    });

    const executionTime = Date.now() - startTime;

    return {
      data: produtos.rows.map(p => p.toJSON()),
      total: produtos.count,
      searchType: this.getSearchType(),
      executionTime
    };
  }

  getSearchType(): string {
    return 'Busca Avançada Multi-Campo';
  }

  getSupportedFilters(): string[] {
    return ['fk_categoria_id', 'status', 'preco', 'estoque'];
  }
}

// Implementação concreta para busca por categoria
export class CategorySearchStrategy implements SearchStrategy {
  async search(query: string, options: SearchOptions = {}): Promise<SearchResult> {
    const startTime = Date.now();
    const { Produto, Categoria } = await import('../models');
    
    // Primeiro, buscar categorias que correspondam à query
    const categorias = await Categoria.findAll({
      where: {
        [Op.or]: [
          { nome: { [Op.like]: `%${query}%` } },
          { descricao: { [Op.like]: `%${query}%` } }
        ]
      }
    });

    const categoriaIds = categorias.map(cat => cat.id);
    
    if (categoriaIds.length === 0) {
      return {
        data: [],
        total: 0,
        searchType: this.getSearchType(),
        executionTime: Date.now() - startTime
      };
    }

    const whereClause: any = {
      fk_categoria_id: {
        [Op.in]: categoriaIds
      }
    };

    // Aplicar filtros adicionais
    if (options.filters) {
      Object.assign(whereClause, options.filters);
    }

    const produtos = await Produto.findAndCountAll({
      where: whereClause,
      include: [{ model: Categoria, as: 'categoria' }],
      limit: options.limit || 20,
      offset: options.offset || 0,
      order: options.sortBy ? [[options.sortBy, options.sortOrder || 'ASC']] : [['categoria', 'nome', 'ASC'], ['nome', 'ASC']]
    });

    const executionTime = Date.now() - startTime;

    return {
      data: produtos.rows.map(p => p.toJSON()),
      total: produtos.count,
      searchType: this.getSearchType(),
      executionTime
    };
  }

  getSearchType(): string {
    return 'Busca por Categoria';
  }

  getSupportedFilters(): string[] {
    return ['status', 'preco', 'estoque'];
  }
}

// Context que utiliza as strategies
export class ProductSearchEngine {
  private strategy: SearchStrategy;

  constructor(strategy: SearchStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: SearchStrategy): void {
    this.strategy = strategy;
  }

  async search(query: string, options?: SearchOptions): Promise<SearchResult> {
    if (!query || query.trim().length < 2) {
      return {
        data: [],
        total: 0,
        searchType: this.strategy.getSearchType(),
        executionTime: 0
      };
    }

    console.log(`Executando ${this.strategy.getSearchType()} para: "${query}"`);
    return await this.strategy.search(query, options);
  }

  getSearchType(): string {
    return this.strategy.getSearchType();
  }

  getSupportedFilters(): string[] {
    return this.strategy.getSupportedFilters();
  }
}

// Factory para criar strategies de busca
export class SearchStrategyFactory {
  static createStrategy(searchType: string): SearchStrategy {
    switch (searchType.toLowerCase()) {
      case 'simple':
      case 'simples':
        return new SimpleNameSearchStrategy();
      case 'advanced':
      case 'avancada':
        return new AdvancedSearchStrategy();
      case 'category':
      case 'categoria':
        return new CategorySearchStrategy();
      default:
        throw new Error(`Tipo de busca não suportado: ${searchType}`);
    }
  }

  static getAvailableSearchTypes(): string[] {
    return ['simple', 'advanced', 'category'];
  }

  static getBestSearchStrategy(query: string): SearchStrategy {
    // Lógica para escolher a melhor estratégia baseada na query
    if (query.includes('categoria:') || query.includes('cat:')) {
      return new CategorySearchStrategy();
    } else if (query.split(' ').length > 2 || query.includes('*') || query.includes('"')) {
      return new AdvancedSearchStrategy();
    } else {
      return new SimpleNameSearchStrategy();
    }
  }
}

// Classe para combinar múltiplas estratégias
export class HybridSearchEngine {
  private strategies: SearchStrategy[];

  constructor() {
    this.strategies = [
      new SimpleNameSearchStrategy(),
      new AdvancedSearchStrategy(),
      new CategorySearchStrategy()
    ];
  }

  async searchAll(query: string, options?: SearchOptions): Promise<SearchResult[]> {
    const promises = this.strategies.map(strategy => 
      new ProductSearchEngine(strategy).search(query, options)
    );

    return await Promise.all(promises);
  }

  async getBestResults(query: string, options?: SearchOptions): Promise<SearchResult> {
    const allResults = await this.searchAll(query, options);
    
    // Escolher o resultado com mais itens encontrados
    return allResults.reduce((best, current) => 
      current.total > best.total ? current : best
    );
  }
}
