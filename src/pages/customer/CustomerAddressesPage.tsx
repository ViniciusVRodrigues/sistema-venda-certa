import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Modal, Input, LoadingSpinner } from '../../components/ui';
import { useAddresses } from '../../hooks/customer/useAddresses';
import type { Endereco } from '../../types';
import type { CreateAddressData, UpdateAddressData } from '../../services/customer/addressService';

interface AddressFormData {
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  favorito: boolean;
}

const initialFormData: AddressFormData = {
  rua: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
  favorito: false
};

export const CustomerAddressesPage: React.FC = () => {
  const {
    addresses,
    loading,
    error,
    createAddress,
    updateAddress,
    deleteAddress,
    clearError
  } = useAddresses();

  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Endereco | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleOpenModal = (address?: Endereco) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        rua: address.rua,
        numero: address.numero,
        complemento: address.complemento || '',
        bairro: address.bairro,
        cidade: address.cidade,
        estado: address.estado,
        cep: address.cep,
        favorito: address.favorito
      });
    } else {
      setEditingAddress(null);
      setFormData(initialFormData);
    }
    setFormErrors([]);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAddress(null);
    setFormData(initialFormData);
    setFormErrors([]);
  };

  const handleInputChange = (field: keyof AddressFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormErrors([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const errors: string[] = [];
    if (!formData.rua.trim()) errors.push('Rua é obrigatória');
    if (!formData.numero.trim()) errors.push('Número é obrigatório');
    if (!formData.bairro.trim()) errors.push('Bairro é obrigatório');
    if (!formData.cidade.trim()) errors.push('Cidade é obrigatória');
    if (!formData.estado.trim()) errors.push('Estado é obrigatório');
    if (!formData.cep.trim()) errors.push('CEP é obrigatório');

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSubmitting(true);
      
      if (editingAddress) {
        await updateAddress({
          id: editingAddress.id,
          ...formData,
          fk_usuario_id: editingAddress.fk_usuario_id
        } as UpdateAddressData);
      } else {
        await createAddress({
          ...formData,
          fk_usuario_id: 1 // Should come from authenticated user
        } as CreateAddressData);
      }
      
      handleCloseModal();
    } catch {
      // Error is handled by the hook
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (address: Endereco) => {
    if (window.confirm('Tem certeza que deseja excluir este endereço?')) {
      try {
        await deleteAddress(address.id);
      } catch {
        // Error is handled by the hook
      }
    }
  };

  const handleSetDefault = async (address: Endereco) => {
    // This functionality would need to be implemented in the service
    console.log('Set default address:', address.id);
  };

  const formatAddress = (address: Endereco) => {
    const complement = address.complemento ? `, ${address.complemento}` : '';
    return `${address.rua}, ${address.numero}${complement}, ${address.bairro}, ${address.cidade} - ${address.estado}, ${address.cep}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                to="/customer/menu"
                className="inline-flex items-center text-green-600 hover:text-green-700 mb-2"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Voltar ao Menu
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Meus Endereços</h1>
              <p className="text-gray-600">Gerencie seus endereços de entrega</p>
            </div>
            <Button
              onClick={() => handleOpenModal()}
              className="bg-green-600 hover:bg-green-700"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Adicionar Endereço
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-800">{error}</span>
              <button
                onClick={clearError}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Addresses List */}
        {!loading && (
          <div className="space-y-6">
            {addresses.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="text-6xl mb-4">📍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum endereço cadastrado
                </h3>
                <p className="text-gray-600 mb-4">
                  Adicione seu primeiro endereço para facilitar suas compras
                </p>
                <Button
                  onClick={() => handleOpenModal()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Adicionar Endereço
                </Button>
              </Card>
            ) : (
              addresses.map(address => (
                <Card key={address.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {address.favorito ? 'Endereço Favorito' : 'Endereço'}
                        </h3>
                        {address.favorito && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Favorito
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">
                        {formatAddress(address)}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      {!address.favorito && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(address)}
                          className="border-green-300 text-green-600 hover:bg-green-50"
                        >
                          Tornar Favorito
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenModal(address)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(address)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Address Form Modal */}
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title={editingAddress ? 'Editar Endereço' : 'Adicionar Endereço'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form Errors */}
            {formErrors.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <ul className="text-sm text-red-800 space-y-1">
                  {formErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Rua"
                  value={formData.rua}
                  onChange={(e) => handleInputChange('rua', e.target.value)}
                  required
                />
              </div>
              
              <Input
                label="Número"
                value={formData.numero}
                onChange={(e) => handleInputChange('numero', e.target.value)}
                required
              />
              
              <Input
                label="Complemento"
                value={formData.complemento}
                onChange={(e) => handleInputChange('complemento', e.target.value)}
                placeholder="Apto, bloco, etc."
              />
              
              <Input
                label="Bairro"
                value={formData.bairro}
                onChange={(e) => handleInputChange('bairro', e.target.value)}
                required
              />
              
              <Input
                label="Cidade"
                value={formData.cidade}
                onChange={(e) => handleInputChange('cidade', e.target.value)}
                required
              />
              
              <Input
                label="Estado"
                value={formData.estado}
                onChange={(e) => handleInputChange('estado', e.target.value)}
                maxLength={2}
                placeholder="SP"
                required
              />
              
              <Input
                label="CEP"
                value={formData.cep}
                onChange={(e) => handleInputChange('cep', e.target.value)}
                placeholder="12345-678"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="favorito"
                checked={formData.favorito}
                onChange={(e) => handleInputChange('favorito', e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="favorito" className="ml-2 block text-sm text-gray-900">
                Definir como endereço favorito
              </label>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {submitting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    {editingAddress ? 'Atualizando...' : 'Salvando...'}
                  </>
                ) : (
                  editingAddress ? 'Atualizar' : 'Salvar'
                )}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};