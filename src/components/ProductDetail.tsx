import { ArrowLeft, Edit3, Trash2 } from 'lucide-react';
import type { Product } from '../types/product';

const API_URL = 'https://product-manage-1gs3.onrender.com';

interface ProductDetailProps {
  product: Product;
  navigateTo: (page: string, product?: Product) => void;
  confirmDelete: (product: Product) => void;
}

export default function ProductDetail({ product, navigateTo, confirmDelete }: ProductDetailProps) {

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
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button
        onClick={() => navigateTo('home')}
        className="group flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8 transition-all duration-200 ease-in-out"
        aria-label="Back to products"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Products</span>
      </button>

      {/* Product Detail Container */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-5xl mx-auto">
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/2">
            <img
              src={getImageSrc() || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'}
              alt={product.name}
              className="w-full h-80 sm:h-96 lg:h-[28rem] object-cover rounded-t-xl md:rounded-t-none md:rounded-l-xl"
            />
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 p-6 sm:p-8">
            <div className="flex justify-between items-start mb-5">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                {product.name}
              </h1>
              <span
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                } shadow-sm`}
              >
                {product.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-gray-600 mb-6 text-base sm:text-lg leading-relaxed">
              {product.description}
            </p>
            <div className="space-y-5 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Price:</span>
                <span className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Category:</span>
                <span className="font-semibold text-gray-800">{product.category}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Stock:</span>
                <span className="font-semibold text-gray-800">{product.stock} units</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Product ID:</span>
                <span className="font-semibold text-gray-800">#{product.id}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <button
                onClick={() => navigateTo('form', product)}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg"
                aria-label="Edit product"
              >
                <Edit3 size={20} />
                <span>Edit Product</span>
              </button>
              <button
                onClick={() => confirmDelete(product)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg"
                aria-label="Delete product"
              >
                <Trash2 size={20} />
                <span>Delete Product</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}