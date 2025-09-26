import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Usuario } from '../types';
import { authService } from '../services/auth';

interface AuthState {
  user: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: Usuario }
  | { type: 'LOGOUT' };

interface AuthContextType extends AuthState {
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: Partial<Usuario>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const login = async (email: string, password: string, remember: boolean = false) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const loginResponse = await authService.login(email, password, remember);
      dispatch({ type: 'LOGIN_SUCCESS', payload: loginResponse.usuario });
      
      // Store user data in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(loginResponse.usuario));
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const logout = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      await authService.logout();
    } catch (error) {
      console.warn('Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
      localStorage.removeItem('user');
    }
  };

  const register = async (userData: Partial<Usuario>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const registerData = {
        nome: userData.nome || '',
        email: userData.email || '',
        senha: (userData as any).senha || '', // Password should be passed from the registration form
        cargo: (userData.cargo as 'cliente' | 'admin' | 'entregador' | 'administrador') || 'cliente',
        numeroCelular: userData.numeroCelular,
      };
      
      const registerResponse = await authService.register(registerData);
      dispatch({ type: 'LOGIN_SUCCESS', payload: registerResponse.usuario });
      
      // Store user data in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(registerResponse.usuario));
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  // Check for stored user and verify token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser && authService.isAuthenticated()) {
        try {
          // Verify token with backend
          const verification = await authService.verifyToken();
          
          if (verification && verification.valid) {
            dispatch({ type: 'LOGIN_SUCCESS', payload: verification.usuario });
            // Update stored user data
            localStorage.setItem('user', JSON.stringify(verification.usuario));
          } else {
            // Token is invalid, clean up
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.warn('Token verification failed:', error);
          localStorage.removeItem('user');
        }
      }
    };

    initializeAuth();

    // Listen for token expiration events
    const handleTokenExpired = () => {
      dispatch({ type: 'LOGOUT' });
      localStorage.removeItem('user');
    };

    window.addEventListener('auth:token-expired', handleTokenExpired);
    
    return () => {
      window.removeEventListener('auth:token-expired', handleTokenExpired);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};