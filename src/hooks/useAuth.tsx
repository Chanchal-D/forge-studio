
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UserType = 'brand' | 'manufacturer' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  userType: UserType;
  login: (type: UserType) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userType, setUserType] = useState<UserType>(null);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedIsAuth = localStorage.getItem('isAuthenticated');
    const storedType = localStorage.getItem('userType') as UserType;
    
    if (storedIsAuth === 'true' && storedType) {
      setIsAuthenticated(true);
      setUserType(storedType);
    }
  }, []);

  const login = (type: UserType) => {
    setIsAuthenticated(true);
    setUserType(type);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userType', type || '');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, login, logout }}>
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
