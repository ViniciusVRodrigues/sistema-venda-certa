import { Product, Review, Customer } from '../../types';

// Mock reviews data
const mockReviews: Review[] = [
  {
    id: '1',
    productId: '1',
    customerId: 'customer1',
    customer: {
      id: 'customer1',
      name: 'Maria Silva',
      email: 'maria@email.com',
      role: 'customer',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      addresses: [],
      orders: [],
      isVip: false,
      isBlocked: false,
      totalOrders: 5,
      totalSpent: 150.75
    } as Customer,
    rating: 5,
    comment: 'Tomates de excelente qualidade, muito frescos e saborosos!',
    createdAt: new Date('2024-01-20')
  },
  {
    id: '2',
    productId: '1',
    customerId: 'customer2',
    customer: {
      id: 'customer2',
      name: 'João Santos',
      email: 'joao@email.com',
      role: 'customer',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-05'),
      addresses: [],
      orders: [],
      isVip: true,
      isBlocked: false,
      totalOrders: 12,
      totalSpent: 420.30
    } as Customer,
    rating: 4,
    comment: 'Bom produto, chegou bem embalado.',
    createdAt: new Date('2024-01-18')
  }
];

// Mock related products
const mockRelatedProducts: Product[] = [
  {
    id: '2',
    name: 'Alface Crespa',
    description: 'Alface crespa fresca, perfeita para saladas nutritivas.',
    shortDescription: 'Alface crespa orgânica',
    category: { id: '1', name: 'Vegetais', description: 'Vegetais frescos', isActive: true },
    price: 3.50,
    unit: 'pé',
    stock: 40,
    status: 'active' as const,
    images: ['https://images.unsplash.com/photo-1556801711-7d5c8b933fa5?w=400'],
    tags: ['orgânico', 'folhas', 'salada'],
    sku: 'VEG002',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18')
  }
];

export interface ProductDetailsResponse {
  product: Product;
  reviews: Review[];
  reviewStats: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: number]: number };
  };
  relatedProducts: Product[];
}

export interface CreateReviewData {
  productId: string;
  rating: number;
  comment?: string;
  wouldRecommend?: boolean;
}

export const productDetailsService = {
  // Get product details with reviews and related products
  async getProductDetails(productId: string): Promise<ProductDetailsResponse | null> {
    await new Promise(resolve => setTimeout(resolve, 400));

    // For now, use mock data from catalogService
    const mockProducts = [
      {
        id: '1',
        name: 'Tomate Orgânico',
        description: 'Tomates frescos cultivados sem agrotóxicos, ideais para saladas e cozinha. Ricos em licopeno e vitaminas, nossos tomates são cultivados com técnicas sustentáveis e colhidos no ponto ideal de maturação.',
        shortDescription: 'Tomates orgânicos frescos',
        category: { id: '1', name: 'Vegetais', description: 'Vegetais frescos', isActive: true },
        price: 8.50,
        unit: 'kg',
        stock: 25,
        status: 'active' as const,
        images: [
          'https://images.unsplash.com/photo-1546470427-e26264be0b37?w=600',
          'https://images.unsplash.com/photo-1589927986089-35812388d922?w=600',
          'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=600'
        ],
        tags: ['orgânico', 'fresco', 'vegetal', 'licopeno'],
        sku: 'VEG001',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20'),
        variations: [
          { id: '1-1', name: '500g', price: 4.25, stock: 30, sku: 'VEG001-500' },
          { id: '1-2', name: '1kg', price: 8.50, stock: 25, sku: 'VEG001-1KG' },
          { id: '1-3', name: '2kg', price: 16.00, stock: 15, sku: 'VEG001-2KG' }
        ]
      }
    ];

    const product = mockProducts.find(p => p.id === productId);
    if (!product) return null;

    // Get reviews for this product
    const productReviews = mockReviews.filter(r => r.productId === productId);

    // Calculate review stats
    const totalReviews = productReviews.length;
    const averageRating = totalReviews > 0 
      ? productReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
      : 0;
    
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    productReviews.forEach(review => {
      ratingDistribution[review.rating]++;
    });

    // Get related products (same category, excluding current product)
    const relatedProducts = mockRelatedProducts.filter(p => 
      p.category.id === product.category.id && p.id !== productId
    ).slice(0, 4);

    return {
      product,
      reviews: productReviews,
      reviewStats: {
        averageRating,
        totalReviews,
        ratingDistribution
      },
      relatedProducts
    };
  },

  // Create a new review
  async createReview(reviewData: CreateReviewData): Promise<Review> {
    await new Promise(resolve => setTimeout(resolve, 500));

    // In a real app, this would be the authenticated user
    const mockCurrentUser: Customer = {
      id: 'current-user',
      name: 'Usuário Atual',
      email: 'usuario@email.com',
      role: 'customer',
      createdAt: new Date(),
      updatedAt: new Date(),
      addresses: [],
      orders: [],
      isVip: false,
      isBlocked: false,
      totalOrders: 3,
      totalSpent: 85.20
    };

    const newReview: Review = {
      id: `review-${Date.now()}`,
      productId: reviewData.productId,
      customerId: mockCurrentUser.id,
      customer: mockCurrentUser,
      rating: reviewData.rating,
      comment: reviewData.comment,
      createdAt: new Date()
    };

    // Add to mock data (in real app, would save to database)
    mockReviews.push(newReview);

    return newReview;
  },

  // Get reviews for a product with pagination
  async getProductReviews(
    productId: string, 
    page: number = 1, 
    pageSize: number = 10
  ): Promise<{
    reviews: Review[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  }> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const productReviews = mockReviews
      .filter(r => r.productId === productId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = productReviews.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedReviews = productReviews.slice(startIndex, endIndex);

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

  // Get product specifications (mock)
  async getProductSpecifications(productId: string): Promise<{ [key: string]: string }> {
    await new Promise(resolve => setTimeout(resolve, 150));

    // Mock specifications based on product
    const specifications: { [productId: string]: { [key: string]: string } } = {
      '1': {
        'Origem': 'Agricultura orgânica local',
        'Cultivo': 'Sem agrotóxicos',
        'Safra': 'Janeiro 2024',
        'Conservação': 'Geladeira por até 7 dias',
        'Características': 'Rico em licopeno e vitamina C',
        'Certificação': 'Orgânico certificado'
      }
    };

    return specifications[productId] || {};
  }
};