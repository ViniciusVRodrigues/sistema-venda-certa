import type { Address } from '../../types';

// Mock addresses data
const mockAddresses: Address[] = [
  {
    id: '1',
    street: 'Rua das Flores',
    number: '123',
    complement: 'Apto 45',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01310-100',
    isDefault: true
  },
  {
    id: '2',
    street: 'Av. Paulista',
    number: '1000',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01310-200',
    isDefault: false
  }
];

export interface CreateAddressData {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}

export interface UpdateAddressData extends Partial<CreateAddressData> {
  id: string;
}

export const addressService = {
  // Get customer addresses
  async getAddresses(): Promise<Address[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockAddresses];
  },

  // Get address by ID
  async getAddressById(id: string): Promise<Address | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockAddresses.find(address => address.id === id) || null;
  },

  // Create new address
  async createAddress(data: CreateAddressData): Promise<Address> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newAddress: Address = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      isDefault: data.isDefault || false
    };

    // If this is set as default, unset others
    if (newAddress.isDefault) {
      mockAddresses.forEach(address => {
        address.isDefault = false;
      });
    }

    mockAddresses.push(newAddress);
    return newAddress;
  },

  // Update existing address
  async updateAddress(data: UpdateAddressData): Promise<Address> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const index = mockAddresses.findIndex(address => address.id === data.id);
    if (index === -1) {
      throw new Error('Endereço não encontrado');
    }

    const { id, ...updateData } = data;
    const updatedAddress = { ...mockAddresses[index], ...updateData };

    // If this is set as default, unset others
    if (updatedAddress.isDefault) {
      mockAddresses.forEach(address => {
        if (address.id !== id) {
          address.isDefault = false;
        }
      });
    }

    mockAddresses[index] = updatedAddress;
    return updatedAddress;
  },

  // Delete address
  async deleteAddress(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockAddresses.findIndex(address => address.id === id);
    if (index === -1) {
      throw new Error('Endereço não encontrado');
    }

    const wasDefault = mockAddresses[index].isDefault;
    mockAddresses.splice(index, 1);

    // If deleted address was default, set first remaining as default
    if (wasDefault && mockAddresses.length > 0) {
      mockAddresses[0].isDefault = true;
    }
  },

  // Set address as default
  async setDefaultAddress(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const address = mockAddresses.find(addr => addr.id === id);
    if (!address) {
      throw new Error('Endereço não encontrado');
    }

    // Unset all as default
    mockAddresses.forEach(addr => {
      addr.isDefault = false;
    });

    // Set target as default
    address.isDefault = true;
  },

  // Validate address data
  validateAddress(data: Partial<CreateAddressData>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.street?.trim()) {
      errors.push('Rua é obrigatória');
    }

    if (!data.number?.trim()) {
      errors.push('Número é obrigatório');
    }

    if (!data.neighborhood?.trim()) {
      errors.push('Bairro é obrigatório');
    }

    if (!data.city?.trim()) {
      errors.push('Cidade é obrigatória');
    }

    if (!data.state?.trim()) {
      errors.push('Estado é obrigatório');
    }

    if (!data.zipCode?.trim()) {
      errors.push('CEP é obrigatório');
    } else if (!/^\d{5}-?\d{3}$/.test(data.zipCode.replace(/\D/g, ''))) {
      errors.push('CEP deve ter formato válido (12345-678)');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};