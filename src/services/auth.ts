/**
 * Authentication service for Sistema Venda Certa
 * Integrates with backend JWT authentication API
 */

import { apiService } from './api';
import type { Usuario } from '../types';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: any;
}

interface LoginRequest {
  email: string;
  senha: string;
}

interface LoginResponse {
  token: string;
  usuario: Usuario;
}

interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
  cargo: 'cliente' | 'admin' | 'entregador' | 'administrador';
  numeroCelular?: string;
}

interface TokenVerificationResponse {
  valid: boolean;
  usuario: Usuario;
}

class AuthService {
  /**
   * Authenticate user with email and password
   */
  async login(email: string, password: string, remember: boolean = false): Promise<LoginResponse> {
    const loginData: LoginRequest = {
      email,
      senha: password,
    };

    const response = await apiService.post<LoginResponse>('/auth/login', loginData);
    
    if (response.success && response.data) {
      // Store token using ApiService
      apiService.setToken(response.data.token, remember);
      return response.data;
    }

    throw new Error(response.error || 'Login failed');
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>('/auth/register', userData);
    
    if (response.success && response.data) {
      // Store token automatically after registration
      apiService.setToken(response.data.token, false);
      return response.data;
    }

    throw new Error(response.error || 'Registration failed');
  }

  /**
   * Verify current token and get user data
   */
  async verifyToken(): Promise<TokenVerificationResponse | null> {
    try {
      const response = await apiService.post<TokenVerificationResponse>('/auth/verify-token', {});
      
      if (response.success && response.data) {
        return response.data;
      }
    } catch (error) {
      // Token is invalid or expired
      this.logout();
      return null;
    }

    return null;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call backend logout endpoint
      await apiService.post('/auth/logout', {});
    } catch (error) {
      // Even if backend call fails, we still want to clean local storage
      console.warn('Backend logout failed:', error);
    } finally {
      // Always remove token from local storage
      apiService.removeToken();
    }
  }

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return !!token;
  }

  /**
   * Get current user data from token verification
   * Returns null if not authenticated or token is invalid
   */
  async getCurrentUser(): Promise<Usuario | null> {
    if (!this.isAuthenticated()) {
      return null;
    }

    const verification = await this.verifyToken();
    return verification?.usuario || null;
  }

  /**
   * Check if current user has specific role
   */
  async hasRole(role: string): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.cargo === role;
  }

  /**
   * Check if current user is admin
   */
  async isAdmin(): Promise<boolean> {
    return await this.hasRole('admin') || await this.hasRole('administrador');
  }
}

export const authService = new AuthService();
export type { LoginRequest, LoginResponse, RegisterRequest, TokenVerificationResponse };