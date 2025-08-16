import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Product, Category } from '../../types';
import { Card, Button, Badge, Input } from '../../components/ui';
import { useCart } from '../../context/CartContext';

// Mock categories
const mockCategories: Category[] = [
  { id: '1', name: 'Verduras', description: 'Vegetais frescos', isActive: true },
  { id: '2', name: 'Frutas', description: 'Frutas frescas', isActive: true },
];

// Mock data for demonstration
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Tomate Orgânico',
    description: 'Tomates frescos cultivados sem agrotóxicos',
    category: mockCategories[0],
    price: 8.50,
    unit: 'kg',
    stock: 50,
    status: 'active',
    images: ['https://via.placeholder.com/300x200?text=Tomate'],
    tags: ['orgânico', 'tomate'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Alface Crespa',
    description: 'Alface fresca e crocante',
    category: mockCategories[0],
    price: 3.00,
    unit: 'unidade',
    stock: 30,
    status: 'active',
    images: ['https://via.placeholder.com/300x200?text=Alface'],
    tags: ['alface', 'verdura'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Banana Prata',
    description: 'Bananas doces e maduras',
    category: mockCategories[1],
    price: 5.90,
    unit: 'kg',
    stock: 25,
    status: 'active',
    images: ['https://via.placeholder.com/300x200?text=Banana'],
    tags: ['banana', 'fruta'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Cenoura',
    description: 'Cenouras frescas e nutritivas',
    category: mockCategories[0],
    price: 4.50,
    unit: 'kg',
    stock: 0,
    status: 'out_of_stock',
    images: ['https://via.placeholder.com/300x200?text=Cenoura'],
    tags: ['cenoura', 'verdura'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const { addItem } = useCart();
  
  useEffect(() => {
    // Simulate API call
    const loadProducts = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setIsLoading(false);
    };
    
    loadProducts();
  }, []);
  
  useEffect(() => {
    let filtered = products;
    
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category.id === selectedCategory);
    }
    
    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);
  
  const categories = Array.from(
    new Map(products.map(p => [p.category.id, p.category])).values()
  );
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Disponível</Badge>;
      case 'out_of_stock':
        return <Badge variant="danger">Sem estoque</Badge>;
      case 'inactive':
        return <Badge variant="default">Inativo</Badge>;
      default:
        return null;
    }
  };
  
  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Produtos Frescos Direto do Produtor
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Descubra a qualidade e frescor dos nossos produtos orgânicos e naturais
            </p>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Todas as categorias</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} padding="none" className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-w-16 aspect-h-12">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {product.name}
                  </h3>
                  {getStatusBadge(product.status)}
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="text-lg font-bold text-primary-600">
                    R$ {product.price.toFixed(2)}
                    <span className="text-sm text-gray-500 font-normal">
                      /{product.unit}
                    </span>
                  </div>
                  {product.stock > 0 && (
                    <span className="text-sm text-gray-500">
                      {product.stock} disponível
                    </span>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Link to={`/product/${product.id}`} className="flex-1">
                    <Button variant="outline" className="w-full" size="sm">
                      Ver detalhes
                    </Button>
                  </Link>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.status !== 'active' || product.stock === 0}
                    className="flex-1"
                  >
                    Adicionar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Nenhum produto encontrado com os filtros selecionados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};