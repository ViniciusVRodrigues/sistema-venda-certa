import { useState, useEffect, useCallback } from 'react';
import { addressService, type CreateAddressData, type UpdateAddressData } from '../../services/customer/addressService';
import type { Address } from '../../types';

export const useAddresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load addresses
  const loadAddresses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await addressService.getAddresses();
      setAddresses(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar endereços';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create address
  const createAddress = useCallback(async (data: CreateAddressData): Promise<Address> => {
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
  const updateAddress = useCallback(async (data: UpdateAddressData): Promise<Address> => {
    try {
      setLoading(true);
      setError(null);
      const updatedAddress = await addressService.updateAddress(data);
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
  const deleteAddress = useCallback(async (id: string): Promise<void> => {
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

  // Set default address
  const setDefaultAddress = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await addressService.setDefaultAddress(id);
      await loadAddresses(); // Reload list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao definir endereço padrão';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadAddresses]);

  // Get default address
  const defaultAddress = addresses.find(address => address.isDefault);

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
    defaultAddress,
    loading,
    error,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    loadAddresses,
    clearError,
    // Validation helper
    validateAddress: addressService.validateAddress
  };
};