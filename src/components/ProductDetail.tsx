import { ArrowLeft, Edit3, Trash2 } from "lucide-react";
import type { Product } from "../types/product";

const API_URL = "https://product-manage-1gs3.onrender.com";

interface ProductDetailProps {
  product: Product;
  navigateTo: (page: string, product?: Product) => void;
  confirmDelete: (product: Product) => void;
  isLoggedIn: boolean;
}

export default function ProductDetail({
  product,
  navigateTo,
  confirmDelete,
  isLoggedIn,
}: ProductDetailProps) {
  const getImageSrc = () => {
    if (product.image instanceof File) {
      return URL.createObjectURL(product.image);
    }
    if (typeof product.image === "string" && product.image) {
      return `${API_URL}${product.image}`;
    }
    return null;
  };

  return (
  <div className="bg-slate-900 min-h-screen text-white">
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button
        onClick={() => navigateTo("home")}
        className="group flex items-center space-x-2 text-gray-300 hover:text-indigo-400 mb-8 transition-all duration-300"
        aria-label="Back to product list"
      >
        <ArrowLeft
          size={24}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span className="font-medium text-lg">Back to Products</span>
      </button>

      {/* Product Detail Container */}
      <div className="bg-slate-800 rounded-xl shadow-2xl overflow-hidden max-w-6xl mx-auto border border-slate-700 hover:border-indigo-500/50 transition-all duration-300">
        <div className="lg:flex">
          {/* Product Image */}
          <div className="lg:w-1/2 relative overflow-hidden">
            <img
              src={
                getImageSrc() ||
                "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
              }
              alt={product.name}
              className="w-full h-80 sm:h-96 lg:h-[32rem] object-cover hover:scale-105 transition-transform duration-500"
            />
            {/* Overlay gradient for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2 p-6 sm:p-8 lg:p-10">
            {/* Header with title and status */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 space-y-3 sm:space-y-0">
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                {product.name}
              </h1>
              <span
                className={`self-start px-3 py-1.5 rounded-full text-sm font-medium shadow-lg ${
                  product.isActive
                    ? "bg-green-400 text-green-800 border border-green-500"
                    : "bg-red-400 text-red-800 border border-red-500"
                }`}
              >
                {product.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-300 mb-8 text-base sm:text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Product Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                <span className="text-gray-400 text-sm font-medium block mb-1">Price</span>
                <span className="text-2xl sm:text-3xl font-bold text-indigo-400">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              
              <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                <span className="text-gray-400 text-sm font-medium block mb-1">Stock</span>
                <span className="text-xl font-bold text-white">
                  {product.stock} units
                </span>
              </div>
              
              <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                <span className="text-gray-400 text-sm font-medium block mb-1">Category</span>
                <span className="text-lg font-semibold text-white">
                  {product.category}
                </span>
              </div>
              
              <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                <span className="text-gray-400 text-sm font-medium block mb-1">Product ID</span>
                <span className="text-lg font-semibold text-white font-mono">
                  #{product.id}
                </span>
              </div>
            </div>

            {/* Action Buttons hoặc Login Message */}
            {isLoggedIn ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigateTo("form", product)}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3.5 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] font-medium"
                  aria-label="Edit product"
                >
                  <Edit3 size={20} />
                  <span>Edit Product</span>
                </button>
                <button
                  onClick={() => confirmDelete(product)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3.5 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] font-medium"
                  aria-label="Delete product"
                >
                  <Trash2 size={20} />
                  <span>Delete Product</span>
                </button>
              </div>
            ) : (
              <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 text-center">
                <p className="text-gray-300 text-sm sm:text-base">
                  <button
                    onClick={() => navigateTo("login")}
                    className="text-indigo-400 font-medium hover:text-indigo-300 hover:underline transition-colors duration-200"
                  >
                    Login
                  </button>
                  {" "}to manage this product
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);}