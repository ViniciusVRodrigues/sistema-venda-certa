import type { Endereco } from '../../types';
import { mockEnderecos } from '../mock/databaseMockData';

// Use database schema data
const mockAddresses: Endereco[] = [...mockEnderecos];

export interface CreateAddressData {
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  favorito?: boolean;
  fk_usuario_id: number;
}

export interface UpdateAddressData extends Partial<CreateAddressData> {
  id: number;
}

export const addressService = {
  // Get customer addresses
  async getAddresses(customerId?: number): Promise<Endereco[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (customerId) {
      return mockAddresses.filter(address => address.fk_usuario_id === customerId);
    }
    
    return [...mockAddresses];
  },

  // Get single address by ID
  async getAddressById(id: number): Promise<Endereco | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockAddresses.find(address => address.id === id) || null;
  },

  // Create new address
  async createAddress(data: CreateAddressData): Promise<Endereco> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const newAddress: Endereco = {
      id: Math.max(...mockAddresses.map(a => a.id)) + 1,
      rua: data.rua,
      numero: data.numero,
      complemento: data.complemento,
      bairro: data.bairro,
      cidade: data.cidade,
      estado: data.estado,
      cep: data.cep,
      favorito: data.favorito || false,
      fk_usuario_id: data.fk_usuario_id
    };

    // If this is set as favorite, remove favorite from other addresses of the same user
    if (newAddress.favorito) {
      mockAddresses.forEach(address => {
        if (address.fk_usuario_id === data.fk_usuario_id) {
          address.favorito = false;
        }
      });
    }

    mockAddresses.push(newAddress);
    return newAddress;
  },

  // Update address
  async updateAddress(data: UpdateAddressData): Promise<Endereco | null> {
    await new Promise(resolve => setTimeout(resolve, 600));

    const index = mockAddresses.findIndex(address => address.id === data.id);
    if (index === -1) {
      throw new Error('Endereço não encontrado');
    }

    const currentAddress = mockAddresses[index];
    const updatedAddress: Endereco = {
      ...currentAddress,
      ...data,
      id: currentAddress.id, // Prevent ID changes
      fk_usuario_id: currentAddress.fk_usuario_id // Prevent user ID changes
    };

    // If this is set as favorite, remove favorite from other addresses of the same user
    if (updatedAddress.favorito) {
      mockAddresses.forEach(address => {
        if (address.fk_usuario_id === updatedAddress.fk_usuario_id && address.id !== updatedAddress.id) {
          address.favorito = false;
        }
      });
    }

    mockAddresses[index] = updatedAddress;
    return updatedAddress;
  },

  // Delete address
  async deleteAddress(id: number): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const index = mockAddresses.findIndex(address => address.id === id);
    if (index === -1) {
      return false;
    }

    const wasDefault = mockAddresses[index].favorito;
    const userId = mockAddresses[index].fk_usuario_id;
    mockAddresses.splice(index, 1);

    // If we deleted the favorite address, make the first remaining address favorite
    if (wasDefault) {
      const userAddresses = mockAddresses.filter(addr => addr.fk_usuario_id === userId);
      if (userAddresses.length > 0) {
        userAddresses[0].favorito = true;
      }
    }

    return true;
  },

  // Set address as favorite
  async setAsFavorite(id: number): Promise<Endereco | null> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const address = mockAddresses.find(addr => addr.id === id);
    if (!address) {
      return null;
    }

    // Remove favorite from all other addresses of the same user
    mockAddresses.forEach(addr => {
      if (addr.fk_usuario_id === address.fk_usuario_id) {
        addr.favorito = false;
      }
    });

    // Set this address as favorite
    address.favorito = true;

    return address;
  },

  // Validate address data
  validateAddressData(data: Partial<CreateAddressData>): string[] {
    const errors: string[] = [];

    if (!data.rua?.trim()) {
      errors.push('Rua é obrigatória');
    }

    if (!data.numero?.trim()) {
      errors.push('Número é obrigatório');
    }

    if (!data.bairro?.trim()) {
      errors.push('Bairro é obrigatório');
    }

    if (!data.cidade?.trim()) {
      errors.push('Cidade é obrigatória');
    }

    if (!data.estado?.trim()) {
      errors.push('Estado é obrigatório');
    }

    if (!data.cep?.trim()) {
      errors.push('CEP é obrigatório');
    } else if (!/^\d{5}-?\d{3}$/.test(data.cep)) {
      errors.push('CEP deve ter formato 00000-000');
    }

    if (data.estado && data.estado.length !== 2) {
      errors.push('Estado deve ter 2 caracteres');
    }

    return errors;
  },

  // Validate ZIP code format
  async validateZipCode(zipCode: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Basic validation - in real app would call API like ViaCEP
    const cleanZip = zipCode.replace(/\D/g, '');
    return cleanZip.length === 8;
  },

  // Get address by ZIP code (mock implementation)
  async getAddressByZipCode(zipCode: string): Promise<Partial<Endereco> | null> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data - in real app would call ViaCEP API
    const mockZipData: Record<string, Partial<Endereco>> = {
      '01310100': {
        rua: 'Av. Paulista',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        estado: 'SP'
      },
      '01234567': {
        rua: 'Rua das Flores',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP'
      }
    };

    const cleanZip = zipCode.replace(/\D/g, '');
    return mockZipData[cleanZip] || null;
  }
};
