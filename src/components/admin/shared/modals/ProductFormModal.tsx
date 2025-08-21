import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select, Textarea } from '../../../ui';
import { useCategories } from '../../../../hooks/useProducts';
import type { Product, Category } from '../../../../types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: ProductFormData) => Promise<void>;
  product?: Product | null;
  loading?: boolean;
}

export interface ProductFormData {
  name: string;
  description: string;
  shortDescription: string;
  category: Category;
  price: number;
  unit: string;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  sku: string;
  tags: string[];
  images: string[];
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  product,
  loading = false
}) => {
  const { categories } = useCategories();
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    shortDescription: '',
    category: categories[0] || { id: '', name: '', isActive: true },
    price: 0,
    unit: 'un',
    stock: 0,
    status: 'active',
    sku: '',
    tags: [],
    images: []
  });
  const [tagsInput, setTagsInput] = useState('');
  const [imagesInput, setImagesInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when product changes (edit mode)
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription || '',
        category: product.category,
        price: product.price,
        unit: product.unit,
        stock: product.stock,
        status: product.status,
        sku: product.sku || '',
        tags: product.tags,
        images: product.images
      });
      setTagsInput(product.tags.join(', '));
      setImagesInput(product.images.join(', '));
    } else {
      // Reset form for create mode
      setFormData({
        name: '',
        description: '',
        shortDescription: '',
        category: categories[0] || { id: '', name: '', isActive: true },
        price: 0,
        unit: 'un',
        stock: 0,
        status: 'active',
        sku: '',
        tags: [],
        images: []
      });
      setTagsInput('');
      setImagesInput('');
    }
    setErrors({});
  }, [product, categories, isOpen]);

  // Update category when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !product) {
      setFormData(prev => ({
        ...prev,
        category: categories[0]
      }));
    }
  }, [categories, product]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Preço deve ser maior que zero';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'Estoque não pode ser negativo';
    }

    if (!formData.category.id) {
      newErrors.category = 'Categoria é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Process tags and images
      const finalData = {
        ...formData,
        tags: tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        images: imagesInput.split(',').map(img => img.trim()).filter(img => img.length > 0)
      };

      await onSubmit(finalData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    const selectedCategory = categories.find(cat => cat.id === categoryId);
    if (selectedCategory) {
      handleInputChange('category', selectedCategory);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Editar Produto' : 'Novo Produto'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Nome *"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={errors.name}
              placeholder="Nome do produto"
            />
          </div>
          <div>
            <Input
              label="SKU"
              value={formData.sku}
              onChange={(e) => handleInputChange('sku', e.target.value)}
              error={errors.sku}
              placeholder="Código do produto"
            />
          </div>
        </div>

        <div>
          <Input
            label="Descrição curta"
            value={formData.shortDescription}
            onChange={(e) => handleInputChange('shortDescription', e.target.value)}
            error={errors.shortDescription}
            placeholder="Breve descrição do produto"
          />
        </div>

        <div>
          <Textarea
            label="Descrição *"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            error={errors.description}
            placeholder="Descrição detalhada do produto"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Select
              label="Categoria *"
              value={formData.category.id}
              onChange={(e) => handleCategoryChange(e.target.value)}
              error={errors.category}
              options={categories.map(category => ({
                value: category.id,
                label: category.name
              }))}
            />
          </div>
          <div>
            <Input
              label="Preço *"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
              error={errors.price}
              placeholder="0,00"
            />
          </div>
          <div>
            <Input
              label="Unidade"
              value={formData.unit}
              onChange={(e) => handleInputChange('unit', e.target.value)}
              error={errors.unit}
              placeholder="un, kg, m, etc."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Estoque *"
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
              error={errors.stock}
              placeholder="0"
            />
          </div>
          <div>
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value as Product['status'])}
              options={[
                { value: 'active', label: 'Ativo' },
                { value: 'inactive', label: 'Inativo' },
                { value: 'out_of_stock', label: 'Sem estoque' }
              ]}
            />
          </div>
        </div>

        <div>
          <Input
            label="Tags"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="tag1, tag2, tag3"
            helpText="Separe as tags por vírgula"
          />
        </div>

        <div>
          <Input
            label="Imagens"
            value={imagesInput}
            onChange={(e) => setImagesInput(e.target.value)}
            placeholder="/images/produto1.jpg, /images/produto2.jpg"
            helpText="URLs das imagens separadas por vírgula"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Salvando...' : (product ? 'Atualizar' : 'Criar')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};