import { useState, useEffect, useCallback } from 'react';
import { 
  productDetailsService
} from '../../services/customer/productDetailsService';
import type { 
  ProductDetailsResponse, 
  CreateReviewData 
} from '../../services/customer/productDetailsService';
import type { AvaliacaoProduto, Usuario } from '../../types';

export const useProductDetails = (productId: string | null) => {
  const [data, setData] = useState<ProductDetailsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProductDetails = useCallback(async () => {
    if (!productId) {
      setData(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Convert string ID to number for the service
      const numericId = parseInt(productId, 10);
      if (isNaN(numericId)) {
        setError('ID do produto inválido');
        return;
      }
      
      const response = await productDetailsService.getProductDetails(numericId);
      if (response) {
        setData(response);
      } else {
        setError('Produto não encontrado');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produto');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  return {
    product: data?.product || null,
    reviews: data?.reviews || [],
    reviewStats: data?.reviewStats || { averageRating: 0, totalReviews: 0, ratingDistribution: {} },
    relatedProducts: data?.relatedProducts || [],
    loading,
    error,
    refetch: fetchProductDetails
  };
};

export const useProductReviews = (productId: string, pageSize: number = 10) => {
  const [reviews, setReviews] = useState<(AvaliacaoProduto & { usuario: Usuario | undefined })[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchReviews = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      // Convert string ID to number
      const numericId = parseInt(productId, 10);
      if (isNaN(numericId)) {
        setError('ID do produto inválido');
        return;
      }
      
      const response = await productDetailsService.getProductReviews(numericId, page, pageSize);
      
      setReviews(response.reviews);
      setCurrentPage(response.pagination.page);
      setTotalPages(response.pagination.totalPages);
      setTotal(response.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar avaliações');
    } finally {
      setLoading(false);
    }
  }, [productId, pageSize]);

  useEffect(() => {
    if (productId) {
      fetchReviews(1);
    }
  }, [productId, fetchReviews]);

  const goToPage = useCallback((page: number) => {
    fetchReviews(page);
  }, [fetchReviews]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      fetchReviews(currentPage + 1);
    }
  }, [currentPage, totalPages, fetchReviews]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      fetchReviews(currentPage - 1);
    }
  }, [currentPage, fetchReviews]);

  return {
    reviews,
    loading,
    error,
    currentPage,
    totalPages,
    total,
    goToPage,
    nextPage,
    prevPage,
    refetch: () => fetchReviews(currentPage)
  };
};

export const useCreateReview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createReview = useCallback(async (reviewData: CreateReviewData, usuarioId: number): Promise<AvaliacaoProduto | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const review = await productDetailsService.createReview(reviewData, usuarioId);
      return review;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar avaliação';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    createReview,
    loading,
    error,
    clearError
  };
};

export const useProductSpecifications = (productId: string | null) => {
  const [specifications, setSpecifications] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setSpecifications({});
      return;
    }

    const fetchSpecifications = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Convert string ID to number
        const numericId = parseInt(productId, 10);
        if (isNaN(numericId)) {
          setError('ID do produto inválido');
          return;
        }
        
        const specs = await productDetailsService.getProductSpecifications(numericId);
        setSpecifications(specs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar especificações');
      } finally {
        setLoading(false);
      }
    };

    fetchSpecifications();
  }, [productId]);

  return {
    specifications,
    loading,
    error
  };
};