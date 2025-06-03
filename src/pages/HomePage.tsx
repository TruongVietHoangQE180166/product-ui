import { useEffect, useState } from 'react';
import { Package, Plus } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types/product';
import { getProducts } from '../services/api';

interface HomePageProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
  navigateTo: (page: string, product?: Product) => void;
  confirmDelete: (product: Product) => void;
}

export default function HomePage({ products, setProducts, navigateTo, confirmDelete }: HomePageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [setProducts]);

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Products</h2>
          <p className="mt-2 text-lg text-gray-500">Manage your product inventory with ease</p>
        </div>
        <button
          onClick={() => navigateTo('form')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center space-x-2 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg"
        >
          <Plus size={20} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg text-center">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && (
        <div>
          {products.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-xl shadow-sm">
              <Package size={80} className="mx-auto text-gray-300 mb-6" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">No Products Found</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Get started by adding your first product to the inventory.
              </p>
              <button
                onClick={() => navigateTo('form')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto transition-all duration-200 ease-in-out shadow-md hover:shadow-lg"
              >
                <Plus size={20} />
                <span>Add Product</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <ProductCard
                    product={product}
                    navigateTo={navigateTo}
                    confirmDelete={confirmDelete}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}