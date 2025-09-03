import type { Produto, AvaliacaoProduto, Usuario } from '../../types';
import {
  mockProdutos,
  mockAvaliacoesProduto,
  mockUsuarios
} from '../mock/databaseMockData';

export interface ProductDetailsResponse {
  product: Produto;
  reviews: (AvaliacaoProduto & { usuario: Usuario | undefined })[];
  reviewStats: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: number]: number };
  };
  relatedProducts: Produto[];
}

export interface CreateReviewData {
  produtoId: number;
  avaliacao: number;
  comentario?: string;
}

export const productDetailsService = {
  // Buscar detalhes do produto com avaliações e produtos relacionados
  async getProductDetails(produtoId: number): Promise<ProductDetailsResponse | null> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const product = mockProdutos.find(p => p.id === produtoId);
    if (!product) return null;

    // Buscar avaliações desse produto
    const productReviews = mockAvaliacoesProduto.filter(r => r.fk_produto_id === produtoId);
    // Enriquecer avaliações com usuário
    const reviewsWithUser = productReviews.map(r => ({
      ...r,
      usuario: mockUsuarios.find(u => u.id === r.fk_usuario_id)
    }));

    // Calcular estatísticas das avaliações
    const totalReviews = productReviews.length;
    const averageRating = totalReviews > 0
      ? productReviews.reduce((sum, r) => sum + r.avaliacao, 0) / totalReviews
      : 0;
    const ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    productReviews.forEach(review => {
      const rating = review.avaliacao as keyof typeof ratingDistribution;
      ratingDistribution[rating]++;
    });

    // Produtos relacionados: mesma categoria, exceto o atual
    const relatedProducts = mockProdutos.filter(
      p => p.fk_categoria_id === product.fk_categoria_id && p.id !== produtoId
    ).slice(0, 4);

    return {
      product,
      reviews: reviewsWithUser,
      reviewStats: {
        averageRating,
        totalReviews,
        ratingDistribution
      },
      relatedProducts
    };
  },

  // Criar nova avaliação
  async createReview(reviewData: CreateReviewData, usuarioId: number): Promise<AvaliacaoProduto> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const newReview: AvaliacaoProduto = {
      id: mockAvaliacoesProduto.length + 1,
      avaliacao: reviewData.avaliacao,
      comentario: reviewData.comentario,
      fk_produto_id: reviewData.produtoId,
      fk_usuario_id: usuarioId
    };
    mockAvaliacoesProduto.push(newReview);
    return newReview;
  },

  // Buscar avaliações do produto com paginação
  async getProductReviews(
    produtoId: number,
    page: number = 1,
    pageSize: number = 10
  ): Promise<{
    reviews: (AvaliacaoProduto & { usuario: Usuario | undefined })[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  }> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const productReviews = mockAvaliacoesProduto
      .filter(r => r.fk_produto_id === produtoId)
      .sort((a, b) => (b.id - a.id));

    const total = productReviews.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedReviews = productReviews.slice(startIndex, endIndex)
      .map(r => ({ ...r, usuario: mockUsuarios.find(u => u.id === r.fk_usuario_id) }));

    return {
      reviews: paginatedReviews,
      pagination: {
        page,
        pageSize,
        total,
        totalPages
      }
    };
  },

  // Especificações do produto (mock)
  async getProductSpecifications(produtoId: number): Promise<{ [key: string]: string }> {
    await new Promise(resolve => setTimeout(resolve, 150));
    // Exemplo de especificações por produto
    const specifications: { [produtoId: number]: { [key: string]: string } } = {
      1: {
        'Origem': 'Agricultura orgânica local',
        'Cultivo': 'Sem agrotóxicos',
        'Safra': 'Janeiro 2024',
        'Conservação': 'Geladeira por até 7 dias',
        'Características': 'Rico em licopeno e vitamina C',
        'Certificação': 'Orgânico certificado'
      }
    };
    return specifications[produtoId] || {};
  }
};