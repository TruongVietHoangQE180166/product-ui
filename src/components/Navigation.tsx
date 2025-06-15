import { useState } from 'react';
import { Home, PackagePlus, LogIn, UserPlus, LogOut, User } from 'lucide-react';
import { isAuthenticated, getCurrentUser, logout } from '../services/auth';
import LogoutModal from './LogoutModal'; // Import LogoutModal

interface NavigationProps {
  currentPage: string;
  navigateTo: (page: string) => void;
  isLoggedIn: boolean; 
  onAuthChange?: () => void;
}

export default function Navigation({ 
  currentPage, 
  navigateTo, 
  isLoggedIn, 
  onAuthChange 
}: NavigationProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const currentUser = getCurrentUser();

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    if (onAuthChange) {
      onAuthChange();
    }
    navigateTo('home');
    setShowLogoutModal(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 px-4 sm:px-6 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            SDN_Assignment_TruongVietHoang
          </h1>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex space-x-2 sm:space-x-4">
              <button
                onClick={() => navigateTo('home')}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === 'home'
                    ? 'bg-white/20 shadow-md text-white font-medium'
                    : 'hover:bg-white/10 text-white/90 hover:text-white'
                }`}
                aria-label="Go to home page"
              >
                <Home size={18} />
                <span className="hidden sm:inline">Home</span>
              </button>

              {isLoggedIn && ( 
                <button
                  onClick={() => navigateTo('form')}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentPage === 'form'
                      ? 'bg-white/20 shadow-md text-white font-medium'
                      : 'hover:bg-white/10 text-white/90 hover:text-white'
                  }`}
                  aria-label="Add new product"
                >
                  <PackagePlus size={18} />
                  <span className="hidden sm:inline">Add Product</span>
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2 border-l border-white/20 pl-2 sm:pl-4 ml-2 sm:ml-4">
              {isLoggedIn ? ( 
                <div className="flex items-center space-x-2">
                  <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-lg">
                    <User size={16} />
                    <span className="text-sm font-medium">{currentUser?.email}</span>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded capitalize">
                      {currentUser?.role}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleLogoutClick}
                    className="flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 transition-all duration-200 text-white"
                    aria-label="Logout"
                  >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigateTo('login')}
                    className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 ${
                      currentPage === 'login'
                        ? 'bg-white/20 shadow-md text-white font-medium'
                        : 'hover:bg-white/10 text-white/90 hover:text-white'
                    }`}
                    aria-label="Login"
                  >
                    <LogIn size={18} />
                    <span className="hidden sm:inline">Login</span>
                  </button>
                  
                  <button
                    onClick={() => navigateTo('register')}
                    className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 ${
                      currentPage === 'register'
                        ? 'bg-white/20 shadow-md text-white font-medium'
                        : 'hover:bg-white/10 text-white/90 hover:text-white'
                    }`}
                    aria-label="Register"
                  >
                    <UserPlus size={18} />
                    <span className="hidden sm:inline">Register</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      <LogoutModal 
        show={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </>
  );
}