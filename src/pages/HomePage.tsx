import { useEffect, useState } from 'react';
import { Package, PackagePlus, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types/product';
import { getProducts } from '../services/api';

interface HomePageProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
  navigateTo: (page: string, product?: Product) => void;
  confirmDelete: (product: Product) => void;
}

export default function HomePage({
  products,
  setProducts,
  navigateTo,
  confirmDelete,
}: HomePageProps) {
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
    <div className="bg-[#0f172a] min-h-screen text-white">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight">Product Management</h1>
            <p className="text-lg text-gray-300">Efficient inventory control system</p>
          </div>
          <button
            onClick={() => navigateTo('form')}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] shadow-lg"
          >
            <PackagePlus size={24} />
            <span className="text-lg font-semibold">New Product</span>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-14 w-14 animate-spin text-white/80" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 p-6 rounded-xl text-center shadow-sm text-red-900">
            <p className="font-semibold text-lg">{error}</p>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && (
          <div className="space-y-8">
            {products.length === 0 ? (
              <div className="text-center py-24 bg-slate-800 rounded-2xl shadow-lg border border-slate-700">
                <Package size={96} className="mx-auto text-slate-500 mb-6" />
                <h3 className="text-3xl font-bold mb-4">Inventory Empty</h3>
                <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
                  Start building your product catalog by adding new items
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="group relative transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-200 rounded-2xl overflow-hidden bg-white"
                  >
                    <ProductCard
                      product={product}
                      navigateTo={navigateTo}
                      confirmDelete={confirmDelete}
                    />
                    <div className="absolute inset-0 border border-transparent group-hover:border-indigo-500 rounded-2xl pointer-events-none" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
