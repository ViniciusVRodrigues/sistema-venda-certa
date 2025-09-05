import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { Usuario } from '../types';
import { mockUsuarios } from '../services/mock/databaseMockData';

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
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
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

  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in mockUsuarios by email
      const foundUser = mockUsuarios.find(user => user.email === email);
      
      if (!foundUser) {
        throw new Error('Usuário não encontrado');
      }
      
      // In a real app, you would validate the password here
      // For now, we'll just check if password is not empty
      if (!password) {
        throw new Error('Senha é obrigatória');
      }
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: foundUser });
      localStorage.setItem('user', JSON.stringify(foundUser));
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('user');
  };

  const register = async (userData: Partial<Usuario>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: Usuario = {
        id: Date.now(),
        nome: userData.nome || '',
        email: userData.email || '',
        cargo: 'customer',
        numeroCelular: userData.numeroCelular,
        status: 1, // Active
        totalPedidos: 0,
        totalGasto: 0,
        entregasFeitas: 0,
        nota: 0
      };
      
      // Add to mock data (in real app would save to database)
      mockUsuarios.push(newUser);
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: newUser });
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw new Error('Registration failed');
    }
  };

  // Check for stored user on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch {
        localStorage.removeItem('user');
      }
    }
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