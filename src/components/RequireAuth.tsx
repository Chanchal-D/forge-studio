
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Header } from './Header';

interface RequireAuthProps {
  children: ReactNode;
  userType?: 'brand' | 'manufacturer';
}

const RequireAuth = ({ children, userType }: RequireAuthProps) => {
  const { isAuthenticated, userType: currentUserType } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="container mx-auto pt-28 pb-12 px-4 text-center">
          <h1 className="text-3xl font-bold text-white mb-6">Login Required</h1>
          <p className="text-white text-lg mb-8">Please log in to access this page</p>
          <Navigate to="/login" replace />
        </div>
      </div>
    );
  }

  // If userType is specified, check if user has that type
  if (userType && currentUserType !== userType) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="container mx-auto pt-28 pb-12 px-4 text-center">
          <h1 className="text-3xl font-bold text-white mb-6">Access Denied</h1>
          <p className="text-white text-lg mb-8">You don't have permission to access this page</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireAuth;
