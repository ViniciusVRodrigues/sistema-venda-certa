import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireRole?: string | string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/auth/login',
  requireRole,
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role requirements if specified
  if (requireRole) {
    const requiredRoles = Array.isArray(requireRole) ? requireRole : [requireRole];
    
    // Helper function to normalize cargo values for comparison
    const normalizeCargo = (cargo: string): string => {
      // Map Portuguese to English for consistent comparison
      const cargoMap: Record<string, string> = {
        'cliente': 'customer',
        'customer': 'customer',
        'entregador': 'delivery',
        'delivery': 'delivery',
        'administrador': 'admin',
        'admin': 'admin'
      };
      return cargoMap[cargo] || cargo;
    };
    
    const userCargoNormalized = normalizeCargo(user.cargo);
    
    const hasRequiredRole = requiredRoles.some(role => {
      const roleNormalized = normalizeCargo(role);
      return userCargoNormalized === roleNormalized;
    });

    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};
