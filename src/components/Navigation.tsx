import { Home, PackagePlus } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  navigateTo: (page: string) => void;
}

export default function Navigation({ currentPage, navigateTo }: NavigationProps) {
  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 px-4 sm:px-6 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          SDN_Assignment_TruongVietHoang
        </h1>

        {/* Navigation Buttons */}
        <div className="flex space-x-4 sm:space-x-6">
          <button
            onClick={() => navigateTo('home')}
            className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-lg transition-all duration-200 ${
              currentPage === 'home'
                ? 'bg-white/20 shadow-md text-white font-medium'
                : 'hover:bg-white/10 text-white/90 hover:text-white'
            }`}
            aria-label="Go to home page"
          >
            <Home size={20} />
            <span className="hidden sm:inline">Home</span>
          </button>
          <button
            onClick={() => navigateTo('form')}
            className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-lg transition-all duration-200 ${
              currentPage === 'form'
                ? 'bg-white/20 shadow-md text-white font-medium'
                : 'hover:bg-white/10 text-white/90 hover:text-white'
            }`}
            aria-label="Add new product"
          >
            <PackagePlus size={20} />
            <span className="hidden sm:inline">Add Product</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
