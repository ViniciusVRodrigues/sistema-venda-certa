import type { Produto, AvaliacaoProduto, Usuario } from '../../types';
import { apiService } from '../api';

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
    try {
      const productResponse = await apiService.get<Produto>(`/produtos/${produtoId}`);
      // Backend returns { success: true, data: Produto }
      const product = (productResponse as any).data || productResponse;
      if (!product) return null;

      // Buscar avaliações desse produto
      const reviewsResponse = await apiService.get<AvaliacaoProduto[]>(`/produtos/${produtoId}/avaliacoes`);
      // Backend returns { success: true, data: AvaliacaoProduto[] }
      const productReviews = (reviewsResponse as any).data || reviewsResponse || [];
      
      // As avaliações já vêm com usuário incluído do backend
      const reviewsWithUser = Array.isArray(productReviews) ? productReviews.map((r: any) => ({
        ...r,
        usuario: r.usuario
      })) : [];

      // Calcular estatísticas das avaliações
      const totalReviews = reviewsWithUser.length;
      const averageRating = totalReviews > 0
        ? reviewsWithUser.reduce((sum: number, r: any) => sum + r.avaliacao, 0) / totalReviews
        : 0;
      const ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      reviewsWithUser.forEach((review: any) => {
        const rating = review.avaliacao as keyof typeof ratingDistribution;
        ratingDistribution[rating]++;
      });

      // Produtos relacionados: mesma categoria, exceto o atual
      const relatedResponse = await apiService.get<Produto[]>(`/produtos/categoria/${product.fk_categoria_id}`);
      const relatedData = (relatedResponse as any).data || relatedResponse || [];
      const relatedProducts = Array.isArray(relatedData) ? relatedData
        .filter((p: Produto) => p.id !== produtoId)
        .slice(0, 4) : [];

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
    } catch (error) {
      console.error(`Error fetching product details ${produtoId}:`, error);
      return null;
    }
  },

  // Criar nova avaliação
  async createReview(reviewData: CreateReviewData, usuarioId: number): Promise<AvaliacaoProduto> {
    try {
      // Note: The backend doesn't have an endpoint for creating reviews yet
      // This is a placeholder implementation
      const newReview: AvaliacaoProduto = {
        id: 0, // Backend will assign ID
        avaliacao: reviewData.avaliacao,
        comentario: reviewData.comentario,
        fk_produto_id: reviewData.produtoId,
        fk_usuario_id: usuarioId
      };
      
      // TODO: Implement backend endpoint for creating reviews
      // const response = await apiService.post<{ data: AvaliacaoProduto }>('/avaliacoes', newReview);
      // return response.data!;
      
      console.warn('Review creation endpoint not yet implemented in backend');
      return newReview;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
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
    try {
      const response = await apiService.get<AvaliacaoProduto[]>(`/produtos/${produtoId}/avaliacoes`);
      const reviewsData = (response as any).data || response || [];
      const productReviews = Array.isArray(reviewsData) ? reviewsData.sort((a: any, b: any) => (b.id - a.id)) : [];

      const total = productReviews.length;
      const totalPages = Math.ceil(total / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedReviews = productReviews.slice(startIndex, endIndex);

      return {
        reviews: paginatedReviews as any,
        pagination: {
          page,
          pageSize,
          total,
          totalPages
        }
      };
    } catch (error) {
      console.error(`Error fetching product reviews ${produtoId}:`, error);
      return {
        reviews: [],
        pagination: {
          page,
          pageSize,
          total: 0,
          totalPages: 0
        }
      };
    }
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