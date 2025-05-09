
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If role restriction is specified and user's role is not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect admin to admin dashboard and employees to employee dashboard
    const redirectPath = user.role === 'admin' ? '/admin' : '/employee';
    return <Navigate to={redirectPath} replace />;
  }

  // User is authenticated and authorized
  return <>{children}</>;
};

export default ProtectedRoute;
