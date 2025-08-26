import { apiService, type ApiError } from './api';
import type { User } from '../types';

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ProfileUpdateData {
  nome?: string;
  email?: string;
  telefone?: string;
  senhaAtual?: string;
  novaSenha?: string;
}

class AuthService {
  private currentUser: User | null = null;

  constructor() {
    // Try to load user from localStorage on initialization
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null && apiService.getToken() !== null;
  }

  hasRole(role: User['role']): boolean {
    return this.currentUser?.role === role;
  }

  private setUser(user: User | null) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/login', credentials);
      
      // Set token and user data
      apiService.setToken(response.token);
      this.setUser(response.user);
      
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erro ao fazer login');
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/register', data);
      
      // Set token and user data
      apiService.setToken(response.token);
      this.setUser(response.user);
      
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erro ao criar conta');
    }
  }

  async logout(): Promise<void> {
    try {
      // Call logout endpoint to invalidate token on server
      await apiService.post('/auth/logout');
    } catch (error) {
      // Even if server logout fails, we should clear local data
      console.warn('Erro ao fazer logout no servidor:', error);
    } finally {
      // Clear local authentication data
      apiService.setToken(null);
      this.setUser(null);
    }
  }

  async getProfile(): Promise<User> {
    try {
      const user = await apiService.get<User>('/auth/profile');
      this.setUser(user);
      return user;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erro ao buscar perfil');
    }
  }

  async updateProfile(data: ProfileUpdateData): Promise<User> {
    try {
      const user = await apiService.put<User>('/auth/profile', data);
      this.setUser(user);
      return user;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erro ao atualizar perfil');
    }
  }

  async changePassword(senhaAtual: string, novaSenha: string): Promise<void> {
    try {
      await apiService.post('/auth/change-password', {
        senhaAtual,
        novaSenha,
      });
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erro ao alterar senha');
    }
  }

  async refreshProfile(): Promise<User | null> {
    if (!this.isAuthenticated()) {
      return null;
    }

    try {
      return await this.getProfile();
    } catch (error) {
      // If profile refresh fails, user might need to login again
      this.logout();
      return null;
    }
  }
}

// Create and export a singleton instance
export const authService = new AuthService();
export default authService;