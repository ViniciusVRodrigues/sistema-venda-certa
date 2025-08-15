import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  
  const isAdminArea = location.pathname.startsWith('/admin');
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={isAdminArea ? '/admin' : '/'} className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary-600">
                  Venda Certa
                </h1>
              </div>
            </Link>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {!isAdminArea && (
              <>
                <Link
                  to="/"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Produtos
                </Link>
                <Link
                  to="/categories"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Categorias
                </Link>
                <Link
                  to="/about"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sobre
                </Link>
              </>
            )}
            
            {isAdminArea && (
              <>
                <Link
                  to="/admin"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/products"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Produtos
                </Link>
                <Link
                  to="/admin/orders"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Pedidos
                </Link>
                <Link
                  to="/admin/customers"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Clientes
                </Link>
              </>
            )}
          </nav>
          
          {/* Right side */}
          <div className="flex items-center space-x-4">
            {!isAdminArea && isAuthenticated && (
              <Link
                to="/cart"
                className="relative p-2 text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6H19" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700">
                  Olá, {user?.name}
                </span>
                {user?.role === 'admin' && !isAdminArea && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm">
                      Admin
                    </Button>
                  </Link>
                )}
                {user?.role === 'customer' && isAdminArea && (
                  <Link to="/">
                    <Button variant="outline" size="sm">
                      Loja
                    </Button>
                  </Link>
                )}
                <Button variant="outline" size="sm" onClick={logout}>
                  Sair
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth/login">
                  <Button variant="ghost" size="sm">
                    Entrar
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button variant="primary" size="sm">
                    Cadastrar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};