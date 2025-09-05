import type { Produto, Categoria, FilterOptions, PaginationData, SortOption } from '../../types';
import { mockProdutos, mockCategorias } from '../mock/databaseMockData';

// Use the database schema data directly
const mockProducts: Produto[] = [...mockProdutos];
const mockCategories: Categoria[] = [...mockCategorias];

interface ProductsResponse {
  products: Produto[];
  pagination: PaginationData;
}

export const productsService = {
  // Get all products with filters, pagination and sorting
  async getProducts(
    filters: FilterOptions & { categoryId?: number; status?: number; inStock?: boolean } = {},
    pagination: { page: number; pageSize: number } = { page: 1, pageSize: 10 },
    sort: SortOption = { field: 'nome', direction: 'asc' }
  ): Promise<ProductsResponse> {
    await new Promise(resolve => setTimeout(resolve, 300));

    let filteredProducts = [...mockProducts];

    // Apply search filter (nome, sku, tags)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.nome.toLowerCase().includes(searchLower) ||
        product.sku?.toLowerCase().includes(searchLower) ||
        product.tags?.toLowerCase().includes(searchLower) ||
        product.descricao?.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (filters.categoryId || filters.category) {
      const categoryId = filters.categoryId || parseInt(filters.category || '0');
      if (categoryId > 0) {
        filteredProducts = filteredProducts.filter(product => product.fk_categoria_id === categoryId);
      }
    }

    // Apply status filter
    if (filters.status !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.status === filters.status);
    }

    // Apply stock filter
    if (filters.inStock !== undefined) {
      if (filters.inStock) {
        filteredProducts = filteredProducts.filter(product => product.estoque > 0);
      } else {
        filteredProducts = filteredProducts.filter(product => product.estoque === 0);
      }
    }

    // Apply sorting
    filteredProducts.sort((a, b) => {
      const { field, direction } = sort;
      let aValue: string | number, bValue: string | number;

      switch (field) {
        case 'nome':
        case 'name':
          aValue = a.nome;
          bValue = b.nome;
          break;
        case 'sku':
          aValue = a.sku || '';
          bValue = b.sku || '';
          break;
        case 'preco':
        case 'price':
          aValue = a.preco;
          bValue = b.preco;
          break;
        case 'estoque':
        case 'stock':
          aValue = a.estoque;
          bValue = b.estoque;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a.nome;
          bValue = b.nome;
      }

      if (direction === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    // Apply pagination
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      pagination: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        total: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / pagination.pageSize)
      }
    };
  },

  // Get single product by ID
  async getProduct(id: number): Promise<Produto | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const product = mockProducts.find(p => p.id === id);
    return product || null;
  },

  // Create new product
  async createProduct(productData: Partial<Produto>): Promise<Produto> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const newProduct: Produto = {
      id: Math.max(...mockProducts.map(p => p.id)) + 1,
      sku: productData.sku,
      nome: productData.nome || '',
      descricao: productData.descricao,
      descricaoResumida: productData.descricaoResumida,
      preco: productData.preco || 0,
      medida: productData.medida || 'unidade',
      estoque: productData.estoque || 0,
      status: productData.status !== undefined ? productData.status : 1,
      imagem: productData.imagem,
      tags: productData.tags,
      fk_categoria_id: productData.fk_categoria_id || 1
    };

    mockProducts.push(newProduct);
    return newProduct;
  },

  // Update product
  async updateProduct(id: number, updates: Partial<Produto>): Promise<Produto | null> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const productIndex = mockProducts.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return null;
    }

    const product = mockProducts[productIndex];
    const updatedProduct: Produto = {
      ...product,
      ...updates,
      id: product.id // Prevent ID changes
    };

    mockProducts[productIndex] = updatedProduct;
    return updatedProduct;
  },

  // Delete product
  async deleteProduct(id: number): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const productIndex = mockProducts.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return false;
    }

    mockProducts.splice(productIndex, 1);
    return true;
  },

  // Get all categories
  async getCategories(): Promise<Categoria[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockCategories];
  },

  // Get single category by ID
  async getCategory(id: number): Promise<Categoria | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const category = mockCategories.find(c => c.id === id);
    return category || null;
  },

  // Create new category
  async createCategory(categoryData: Partial<Categoria>): Promise<Categoria> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const newCategory: Categoria = {
      id: Math.max(...mockCategories.map(c => c.id)) + 1,
      nome: categoryData.nome || '',
      descricao: categoryData.descricao,
      estaAtiva: categoryData.estaAtiva !== undefined ? categoryData.estaAtiva : true
    };

    mockCategories.push(newCategory);
    return newCategory;
  },

  // Update category
  async updateCategory(id: number, updates: Partial<Categoria>): Promise<Categoria | null> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const categoryIndex = mockCategories.findIndex(c => c.id === id);

    if (categoryIndex === -1) {
      return null;
    }

    const category = mockCategories[categoryIndex];
    const updatedCategory: Categoria = {
      ...category,
      ...updates,
      id: category.id // Prevent ID changes
    };

    mockCategories[categoryIndex] = updatedCategory;
    return updatedCategory;
  },

  // Delete category
  async deleteCategory(id: number): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const categoryIndex = mockCategories.findIndex(c => c.id === id);

    if (categoryIndex === -1) {
      return false;
    }

    // Check if any products use this category
    const productsInCategory = mockProducts.filter(p => p.fk_categoria_id === id);
    if (productsInCategory.length > 0) {
      return false; // Cannot delete category with products
    }

    mockCategories.splice(categoryIndex, 1);
    return true;
  },

  // Toggle category active status
  async toggleCategoryStatus(id: number): Promise<Categoria | null> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const category = await this.getCategory(id);
    if (!category) {
      return null;
    }

    return this.updateCategory(id, { estaAtiva: !category.estaAtiva });
  },

  // Get product statistics
  async getProductStats(): Promise<{
    total: number;
    active: number;
    outOfStock: number;
    lowStock: number;
    totalValue: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const stats = mockProducts.reduce(
      (acc, product) => {
        acc.total++;
        if (product.status === 1) acc.active++;
        if (product.estoque === 0) acc.outOfStock++;
        if (product.estoque > 0 && product.estoque <= 10) acc.lowStock++;
        acc.totalValue += product.preco * product.estoque;
        return acc;
      },
      {
        total: 0,
        active: 0,
        outOfStock: 0,
        lowStock: 0,
        totalValue: 0
      }
    );

    return stats;
  },

  // Get low stock products
  async getLowStockProducts(threshold: number = 10): Promise<Produto[]> {
    await new Promise(resolve => setTimeout(resolve, 200));

    return mockProducts.filter(product => 
      product.estoque > 0 && product.estoque <= threshold && product.status === 1
    );
  }
};