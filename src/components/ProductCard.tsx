import { Eye, Edit3, Trash2 } from 'lucide-react';
import type { Product } from '../types/product';

const API_URL = 'https://product-manage-1gs3.onrender.com';

interface ProductCardProps {
  product: Product;
  navigateTo: (page: string, product?: Product) => void;
  confirmDelete: (product: Product) => void;
  isLoggedIn: boolean;
}

export default function ProductCard({ product, navigateTo, confirmDelete, isLoggedIn }: ProductCardProps) {
  
  const getImageSrc = () => {
    if (product.image instanceof File) {
      return URL.createObjectURL(product.image);
    }
    if (typeof product.image === 'string' && product.image) {
      return `${API_URL}${product.image}`;
    }
    return null;
  };
  
  return (
  <div className="bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-slate-700 hover:border-indigo-500">
    {/* Image Section */}
    <div className="relative overflow-hidden">
      <img
        src={getImageSrc() || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'}
        alt={product.name}
        className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute top-3 right-3">
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium shadow-lg ${
            product.isActive
               ? 'bg-green-400 text-green-800 border border-green-500'
               : 'bg-red-400 text-red-800 border border-red-500'
          }`}
        >
          {product.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
    </div>
                
    {/* Content Section */}
    <div className="p-5 sm:p-6">
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 line-clamp-1">
        {product.name}
      </h3>
      <p className="text-gray-300 text-sm sm:text-base mb-3 line-clamp-2 leading-relaxed">
        {product.description}
      </p>
      <div className="flex justify-between items-center mb-4">
        <span className="text-xl sm:text-2xl font-bold text-white">
          ${product.price.toFixed(2)}
        </span>
        <span className="text-sm text-gray-400 font-medium">Stock: {product.stock}</span>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
        <button
          onClick={() => navigateTo('detail', product)}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02]"
          aria-label="View product details"
        >
          <Eye size={18} />
          <span>View</span>
        </button>
        
        {isLoggedIn && (
          <div className="flex space-x-3">
            <button
              onClick={() => navigateTo('form', product)}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02]"
              aria-label="Edit product"
            >
              <Edit3 size={18} />
            </button>
            <button
              onClick={() => confirmDelete(product)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02]"
              aria-label="Delete product"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);}