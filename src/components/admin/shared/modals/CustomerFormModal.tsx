import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select } from '../../../ui';
import type { Customer, Address } from '../../../../types';

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customerData: CustomerFormData) => Promise<void>;
  customer?: Customer | null;
  loading?: boolean;
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  role: 'customer';
  isVip: boolean;
  isBlocked: boolean;
  addresses: Address[];
}

export const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  customer,
  loading = false
}) => {
  const [formData, setFormData] = useState<CustomerFormData>({
    name: '',
    email: '',
    phone: '',
    role: 'customer',
    isVip: false,
    isBlocked: false,
    addresses: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Address form for the first (default) address
  const [addressData, setAddressData] = useState<Omit<Address, 'id'>>({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: true
  });

  // Update form data when customer changes (edit mode)
  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
        role: customer.role,
        isVip: customer.isVip,
        isBlocked: customer.isBlocked,
        addresses: customer.addresses
      });
      
      // Set the first address if available
      if (customer.addresses.length > 0) {
        const address = customer.addresses[0];
        setAddressData({
          street: address.street,
          number: address.number,
          complement: address.complement || '',
          neighborhood: address.neighborhood,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          isDefault: address.isDefault
        });
      }
    } else {
      // Reset form for create mode
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'customer',
        isVip: false,
        isBlocked: false,
        addresses: []
      });
      setAddressData({
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        isDefault: true
      });
    }
    setErrors({});
  }, [customer, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Address validation (optional but if provided, must be complete)
    const hasAnyAddressField = Object.values(addressData).some(value => 
      typeof value === 'string' && value.trim() !== ''
    );
    
    if (hasAnyAddressField) {
      if (!addressData.street.trim()) {
        newErrors.street = 'Rua é obrigatória';
      }
      if (!addressData.number.trim()) {
        newErrors.number = 'Número é obrigatório';
      }
      if (!addressData.neighborhood.trim()) {
        newErrors.neighborhood = 'Bairro é obrigatório';
      }
      if (!addressData.city.trim()) {
        newErrors.city = 'Cidade é obrigatória';
      }
      if (!addressData.state.trim()) {
        newErrors.state = 'Estado é obrigatório';
      }
      if (!addressData.zipCode.trim()) {
        newErrors.zipCode = 'CEP é obrigatório';
      }
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
      // Prepare addresses array
      const addresses: Address[] = [];
      
      // Add address if any field is filled
      const hasAnyAddressField = Object.values(addressData).some(value => 
        typeof value === 'string' && value.trim() !== ''
      );
      
      if (hasAnyAddressField) {
        addresses.push({
          id: customer?.addresses[0]?.id || Date.now().toString(),
          ...addressData
        });
      }

      const finalData = {
        ...formData,
        addresses
      };

      await onSubmit(finalData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    }
  };

  const handleInputChange = (field: keyof CustomerFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddressChange = (field: keyof typeof addressData, value: string) => {
    setAddressData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const brazilianStates = [
    { value: 'AC', label: 'Acre' },
    { value: 'AL', label: 'Alagoas' },
    { value: 'AP', label: 'Amapá' },
    { value: 'AM', label: 'Amazonas' },
    { value: 'BA', label: 'Bahia' },
    { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' },
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' },
    { value: 'PR', label: 'Paraná' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'SE', label: 'Sergipe' },
    { value: 'TO', label: 'Tocantins' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={customer ? 'Editar Cliente' : 'Novo Cliente'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Informações Pessoais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Nome *"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={errors.name}
                placeholder="Nome completo"
              />
            </div>
            <div>
              <Input
                label="Email *"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                placeholder="email@exemplo.com"
              />
            </div>
          </div>
          <div className="mt-4">
            <Input
              label="Telefone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              error={errors.phone}
              placeholder="(11) 99999-9999"
            />
          </div>
        </div>

        {/* Address Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Endereço (opcional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Rua"
                value={addressData.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                error={errors.street}
                placeholder="Nome da rua"
              />
            </div>
            <div>
              <Input
                label="Número"
                value={addressData.number}
                onChange={(e) => handleAddressChange('number', e.target.value)}
                error={errors.number}
                placeholder="123"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Input
                label="Complemento"
                value={addressData.complement}
                onChange={(e) => handleAddressChange('complement', e.target.value)}
                placeholder="Apto, bloco, etc."
              />
            </div>
            <div>
              <Input
                label="Bairro"
                value={addressData.neighborhood}
                onChange={(e) => handleAddressChange('neighborhood', e.target.value)}
                error={errors.neighborhood}
                placeholder="Nome do bairro"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <Input
                label="Cidade"
                value={addressData.city}
                onChange={(e) => handleAddressChange('city', e.target.value)}
                error={errors.city}
                placeholder="Nome da cidade"
              />
            </div>
            <div>
              <Select
                label="Estado"
                value={addressData.state}
                onChange={(e) => handleAddressChange('state', e.target.value)}
                error={errors.state}
                options={[
                  { value: '', label: 'Selecione o estado' },
                  ...brazilianStates
                ]}
              />
            </div>
            <div>
              <Input
                label="CEP"
                value={addressData.zipCode}
                onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                error={errors.zipCode}
                placeholder="00000-000"
              />
            </div>
          </div>
        </div>

        {/* Status Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select
                label="Status VIP"
                value={formData.isVip ? 'true' : 'false'}
                onChange={(e) => handleInputChange('isVip', e.target.value === 'true')}
                options={[
                  { value: 'false', label: 'Cliente comum' },
                  { value: 'true', label: 'Cliente VIP' }
                ]}
              />
            </div>
            <div>
              <Select
                label="Status de acesso"
                value={formData.isBlocked ? 'true' : 'false'}
                onChange={(e) => handleInputChange('isBlocked', e.target.value === 'true')}
                options={[
                  { value: 'false', label: 'Ativo' },
                  { value: 'true', label: 'Bloqueado' }
                ]}
              />
            </div>
          </div>
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
            {loading ? 'Salvando...' : (customer ? 'Atualizar' : 'Criar')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};