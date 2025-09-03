import { useState, useEffect, useCallback } from 'react';
import { addressService, type CreateAddressData, type UpdateAddressData } from '../../services/customer/addressService';
import type { Endereco } from '../../types';

export const useAddresses = (customerId?: number) => {
  const [addresses, setAddresses] = useState<Endereco[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load addresses
  const loadAddresses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await addressService.getAddresses(customerId);
      setAddresses(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar endereços';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  // Create address
  const createAddress = useCallback(async (data: CreateAddressData): Promise<Endereco> => {
    try {
      setLoading(true);
      setError(null);
      const newAddress = await addressService.createAddress(data);
      await loadAddresses(); // Reload list
      return newAddress;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar endereço';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadAddresses]);

  // Update address
  const updateAddress = useCallback(async (data: UpdateAddressData): Promise<Endereco> => {
    try {
      setLoading(true);
      setError(null);
      const updatedAddress = await addressService.updateAddress(data);
      if (!updatedAddress) {
        throw new Error('Endereço não encontrado');
      }
      await loadAddresses(); // Reload list
      return updatedAddress;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar endereço';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadAddresses]);

  // Delete address
  const deleteAddress = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await addressService.deleteAddress(id);
      await loadAddresses(); // Reload list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir endereço';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadAddresses]);

  // Get favorite address
  const favoriteAddress = addresses.find(address => address.favorito);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load addresses on mount
  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  return {
    addresses,
    favoriteAddress,
    loading,
    error,
    createAddress,
    updateAddress,
    deleteAddress,
    loadAddresses,
    clearError,
    validateAddressData: addressService.validateAddressData
  };
};
