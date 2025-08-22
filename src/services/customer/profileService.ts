import type { Customer } from '../../types';

// Mock customer data
const mockCustomer: Customer = {
  id: '1',
  name: 'João Silva',
  email: 'joao.silva@email.com',
  role: 'customer',
  phone: '(11) 99999-1111',
  avatar: '/images/avatars/joao.jpg',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-20'),
  addresses: [],
  orders: [],
  isVip: false,
  isBlocked: false,
  totalOrders: 3,
  totalSpent: 450.75,
  lastOrderDate: new Date('2024-01-20')
};

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const profileService = {
  // Get customer profile
  async getProfile(): Promise<Customer> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...mockCustomer };
  },

  // Update customer profile
  async updateProfile(data: UpdateProfileData): Promise<Customer> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const updatedProfile = {
      ...mockCustomer,
      ...data,
      updatedAt: new Date()
    };

    // Update mock data
    Object.assign(mockCustomer, updatedProfile);
    
    return updatedProfile;
  },

  // Change password
  async changePassword(data: ChangePasswordData): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate password validation
    if (data.currentPassword !== 'currentpass') {
      throw new Error('Senha atual incorreta');
    }

    if (data.newPassword !== data.confirmPassword) {
      throw new Error('Confirmação de senha não confere');
    }

    if (data.newPassword.length < 6) {
      throw new Error('Nova senha deve ter pelo menos 6 caracteres');
    }

    // Password changed successfully (in real implementation, this would call API)
  },

  // Upload avatar
  async uploadAvatar(file: File): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate file upload
    const avatarUrl = `/images/avatars/${file.name}`;
    mockCustomer.avatar = avatarUrl;
    mockCustomer.updatedAt = new Date();
    
    return avatarUrl;
  },

  // Validate profile data
  validateProfile(data: Partial<UpdateProfileData>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.name !== undefined) {
      if (!data.name.trim()) {
        errors.push('Nome é obrigatório');
      } else if (data.name.trim().length < 2) {
        errors.push('Nome deve ter pelo menos 2 caracteres');
      }
    }

    if (data.email !== undefined) {
      if (!data.email.trim()) {
        errors.push('E-mail é obrigatório');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push('E-mail deve ter formato válido');
      }
    }

    if (data.phone !== undefined && data.phone.trim()) {
      // Remove formatting and check if it's a valid Brazilian phone
      const cleanPhone = data.phone.replace(/\D/g, '');
      if (cleanPhone.length < 10 || cleanPhone.length > 11) {
        errors.push('Telefone deve ter formato válido');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Validate password change data
  validatePasswordChange(data: Partial<ChangePasswordData>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.currentPassword) {
      errors.push('Senha atual é obrigatória');
    }

    if (!data.newPassword) {
      errors.push('Nova senha é obrigatória');
    } else if (data.newPassword.length < 6) {
      errors.push('Nova senha deve ter pelo menos 6 caracteres');
    }

    if (!data.confirmPassword) {
      errors.push('Confirmação de senha é obrigatória');
    } else if (data.newPassword !== data.confirmPassword) {
      errors.push('Confirmação de senha não confere');
    }

    if (data.currentPassword && data.newPassword && data.currentPassword === data.newPassword) {
      errors.push('Nova senha deve ser diferente da senha atual');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Format phone number for display
  formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    
    return phone;
  },

  // Get account statistics
  async getAccountStats(): Promise<{
    memberSince: Date;
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    isVip: boolean;
    lastOrderDate?: Date;
  }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const customer = mockCustomer;
    const averageOrderValue = customer.totalOrders > 0 
      ? customer.totalSpent / customer.totalOrders 
      : 0;

    return {
      memberSince: customer.createdAt,
      totalOrders: customer.totalOrders,
      totalSpent: customer.totalSpent,
      averageOrderValue,
      isVip: customer.isVip,
      lastOrderDate: customer.lastOrderDate
    };
  }
};