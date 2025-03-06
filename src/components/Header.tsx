
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, userType, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed w-full bg-black/90 backdrop-blur-md z-50 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-semibold text-white hover:text-[#ef5747] transition-colors">
            forge studio
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                {userType === 'brand' && (
                  <Link to="/brands" className="text-white hover:text-[#ef5747] transition-colors">
                    Dashboard
                  </Link>
                )}
                
                {userType === 'manufacturer' && (
                  <Link to="/manufacturers" className="text-white hover:text-[#ef5747] transition-colors">
                    Dashboard
                  </Link>
                )}
                
                <Link to="/inventory" className="text-white hover:text-[#ef5747] transition-colors">
                  Inventory
                </Link>
                
                <Link to="/pod" className="text-white hover:text-[#ef5747] transition-colors">
                  POD
                </Link>
                
                <Button 
                  variant="outline" 
                  className="border-white text-[#ef5747] hover:bg-white/10 hover:text-white font-medium"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/brands" className="text-white hover:text-[#ef5747] transition-colors">
                  For Brands
                </Link>
                <Link to="/manufacturers" className="text-white hover:text-[#ef5747] transition-colors">
                  For Manufacturers
                </Link>
                <Link to="/pod" className="text-white hover:text-[#ef5747] transition-colors">
                  Print On Demand
                </Link>
                <Link 
                  to="/login"
                  className="text-white hover:text-[#ef5747] transition-colors"
                >
                  Login
                </Link>
                <Button 
                  className="bg-[#ef5747] hover:bg-[#ef5747]/90 text-white border-none" 
                  asChild
                >
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-white hover:text-[#ef5747]"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <nav className="py-4 space-y-4 animate-fade-in">
              {isAuthenticated ? (
                <>
                  {userType === 'brand' && (
                    <Link 
                      to="/brands" 
                      className="block px-4 py-2 text-white hover:text-[#ef5747] hover:bg-white/5 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  
                  {userType === 'manufacturer' && (
                    <Link 
                      to="/manufacturers" 
                      className="block px-4 py-2 text-white hover:text-[#ef5747] hover:bg-white/5 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  
                  <Link 
                    to="/inventory" 
                    className="block px-4 py-2 text-white hover:text-[#ef5747] hover:bg-white/5 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Inventory
                  </Link>
                  
                  <Link 
                    to="/pod" 
                    className="block px-4 py-2 text-white hover:text-[#ef5747] hover:bg-white/5 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    POD
                  </Link>
                  
                  <div className="px-4 py-2">
                    <Button 
                      variant="outline" 
                      className="w-full border-white text-[#ef5747] hover:bg-white/10 hover:text-white font-medium"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/brands" 
                    className="block px-4 py-2 text-white hover:text-[#ef5747] hover:bg-white/5 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    For Brands
                  </Link>
                  <Link 
                    to="/manufacturers" 
                    className="block px-4 py-2 text-white hover:text-[#ef5747] hover:bg-white/5 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    For Manufacturers
                  </Link>
                  <Link 
                    to="/pod" 
                    className="block px-4 py-2 text-white hover:text-[#ef5747] hover:bg-white/5 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Print On Demand
                  </Link>
                  <Link 
                    to="/login" 
                    className="block px-4 py-2 text-white hover:text-[#ef5747] hover:bg-white/5 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <div className="px-4 py-2">
                    <Button 
                      className="w-full bg-[#ef5747] hover:bg-[#ef5747]/90 text-white" 
                      asChild
                    >
                      <Link to="/signup">Sign Up</Link>
                    </Button>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
