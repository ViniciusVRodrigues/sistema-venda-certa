import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select, Textarea } from '../../../ui';
import { useCategories } from '../../../../hooks/useProducts';
import type { Produto, Categoria } from '../../../../types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: ProductFormData) => Promise<void>;
  product?: Produto | null;
  loading?: boolean;
}

export interface ProductFormData {
  nome: string;
  descricao: string;
  descricaoResumida: string;
  categoria: Categoria;
  preco: number;
  medida: string;
  estoque: number;
  status: number; // 0 = inactive, 1 = active
  sku: string;
  tags: string;
  imagem?: string; // MEDIUMBLOB in schema
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
    nome: '',
    descricao: '',
    descricaoResumida: '',
    categoria: categories[0] || { id: 0, nome: '', descricao: '', estaAtiva: true },
    preco: 0,
    medida: 'un',
    estoque: 0,
    status: 1,
    sku: '',
    tags: '',
    imagem: undefined
  });
  const [tagsInput, setTagsInput] = useState('');
  const [imagesInput, setImagesInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when product changes (edit mode)
  useEffect(() => {
    if (product) {
      setFormData({
        nome: product.nome,
        descricao: product.descricao || '',
        descricaoResumida: product.descricaoResumida || '',
        categoria: categories.find(cat => cat.id === product.fk_categoria_id) || categories[0],
        preco: product.preco,
        medida: product.medida,
        estoque: product.estoque,
        status: product.status,
        sku: product.sku || '',
        tags: product.tags || '',
        imagem: product.imagem ? btoa(String.fromCharCode(...product.imagem)) : undefined
      });
      // Handle tags - always treat as string from database
      setTagsInput(product.tags || '');
      setImagesInput('');
    } else {
      // Reset form for create mode
      setFormData({
        nome: '',
        descricao: '',
        descricaoResumida: '',
        categoria: categories[0] || { id: 0, nome: '', descricao: '', estaAtiva: true },
        preco: 0,
        medida: 'un',
        estoque: 0,
        status: 1,
        sku: '',
        tags: '',
        imagem: undefined
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
        categoria: categories[0]
      }));
    }
  }, [categories, product]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }

    if (formData.preco <= 0) {
      newErrors.preco = 'Preço deve ser maior que zero';
    }

    if (formData.estoque < 0) {
      newErrors.estoque = 'Estoque não pode ser negativo';
    }

    if (!formData.categoria.id) {
      newErrors.categoria = 'Categoria é obrigatória';
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
      // Process tags - convert back to string for database
      const finalData = {
        ...formData,
        tags: tagsInput.trim()
      };

      await onSubmit(finalData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  const handleInputChange = (field: keyof ProductFormData, value: string | number | Categoria) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    const selectedCategory = categories.find(cat => cat.id === Number(categoryId));
    if (selectedCategory) {
      handleInputChange('categoria', selectedCategory);
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
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              error={errors.nome}
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
            value={formData.descricaoResumida}
            onChange={(e) => handleInputChange('descricaoResumida', e.target.value)}
            error={errors.descricaoResumida}
            placeholder="Breve descrição do produto"
          />
        </div>

        <div>
          <Textarea
            label="Descrição *"
            value={formData.descricao}
            onChange={(e) => handleInputChange('descricao', e.target.value)}
            error={errors.descricao}
            placeholder="Descrição detalhada do produto"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Select
              label="Categoria *"
              value={formData.categoria.id.toString()}
              onChange={(e) => handleCategoryChange(e.target.value)}
              error={errors.categoria}
              options={categories.map(category => ({
                value: category.id.toString(),
                label: category.nome
              }))}
            />
          </div>
          <div>
            <Input
              label="Preço *"
              type="number"
              step="0.01"
              min="0"
              value={formData.preco}
              onChange={(e) => handleInputChange('preco', parseFloat(e.target.value) || 0)}
              error={errors.preco}
              placeholder="0,00"
            />
          </div>
          <div>
            <Input
              label="Unidade"
              value={formData.medida}
              onChange={(e) => handleInputChange('medida', e.target.value)}
              error={errors.medida}
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
              value={formData.estoque}
              onChange={(e) => handleInputChange('estoque', parseInt(e.target.value) || 0)}
              error={errors.estoque}
              placeholder="0"
            />
          </div>
          <div>
            <Select
              label="Status"
              value={formData.status.toString()}
              onChange={(e) => handleInputChange('status', parseInt(e.target.value))}
              options={[
                { value: '1', label: 'Ativo' },
                { value: '0', label: 'Inativo' }
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