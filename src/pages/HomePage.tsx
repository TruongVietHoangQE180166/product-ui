import { useEffect, useState } from "react";
import {
  Package,
  PackagePlus,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  BrushCleaning,
  SearchX
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import DeleteModal from "../components/DeleteModal";
import type { Product } from "../types/product";
import { getProducts, deleteProduct } from "../services/api";


interface HomePageProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
  navigateTo: (page: string, product?: Product) => void;
  isLoggedIn: boolean; 
}

export default function HomePage({
  products,
  setProducts,
  navigateTo,
  isLoggedIn 
}: HomePageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(4);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts(page, limit, search);
      setProducts(response.data);
      setTotal(response.total);
      setIsSearching(search.trim() !== "");
    } catch (err: any) {
      setError(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, limit, search]);

  const openDeleteModal = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete.id);
      setShowDeleteModal(false);

      if (products.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchProducts();
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete product");
      setShowDeleteModal(false);
    } finally {
      setProductToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const totalPages = Math.ceil(total / limit);
  const maxVisiblePages = 5;

  const getVisiblePages = (): number[] => {
    const pages: number[] = [];
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="bg-[#0f172a] min-h-screen text-white">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight">
              Product Management
            </h1>
            <p className="text-lg text-gray-300">
              Efficient inventory control system
            </p>
          </div>
          {isLoggedIn && ( 
            <button
              onClick={() => navigateTo("form")}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] shadow-lg"
            >
              <PackagePlus size={24} />
              <span className="text-lg font-semibold">New Product</span>
            </button>
          )}
        </div>

        <div className="mb-8 relative">
          <Search className="absolute left-4 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-96 pl-12 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-14 w-14 animate-spin text-white/80" />
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 p-6 rounded-xl text-center shadow-sm text-red-900">
            <p className="font-semibold text-lg">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-8">
            {products.length === 0 ? (
              <div className="text-center py-24 bg-slate-800 rounded-2xl shadow-lg border border-slate-700">
                {isSearching ? (
                  <>
                    <div className="mx-auto w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                      <SearchX size={64} className="text-red-400" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4 text-red-400">
                      No Results Found
                    </h3>
                    <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
                      We couldn't find any products matching "
                      <span className="text-red-300 font-medium">{search}</span>
                      "
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <button
                        onClick={() => setSearch("")}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <BrushCleaning size={20} />
                        Clear Filters
                      </button>
                      {isLoggedIn && (
                        <button
                          onClick={() => navigateTo("form")}
                          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-xl text-gray-300 hover:text-white font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                          <PackagePlus size={20} />
                          Add New Product
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mx-auto w-24 h-24 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6">
                      <Package size={64} className="text-indigo-400" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4 text-indigo-300">
                      Inventory Empty
                    </h3>
                    <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
                      Your product catalog is currently empty. Start by adding
                      your first item
                    </p>
                    {isLoggedIn && (
                      <button
                        onClick={() => navigateTo("form")}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-medium flex items-center justify-center gap-2 mx-auto transition-colors"
                      >
                        <PackagePlus size={20} />
                        Add First Product
                      </button>
                    )}
                  </>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="group relative transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-200 rounded-2xl overflow-hidden bg-white"
                    >
                      <ProductCard
                        product={product}
                        navigateTo={navigateTo}
                        confirmDelete={openDeleteModal}
                        isLoggedIn={isLoggedIn} 
                      />
                      <div className="absolute inset-0 border border-transparent group-hover:border-indigo-500 rounded-2xl pointer-events-none" />
                    </div>
                  ))}
                </div>

                {totalPages > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 px-4 py-3 bg-slate-800 rounded-xl border border-slate-700">
                    <div className="text-sm text-gray-300">
                      Showing{" "}
                      <span className="font-medium">
                        {(page - 1) * limit + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(page * limit, total)}
                      </span>{" "}
                      of <span className="font-medium">{total}</span> products
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setPage(1)}
                        disabled={page === 1}
                        className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 transition-all"
                        aria-label="First page"
                      >
                        <ChevronsLeft size={18} />
                      </button>

                      <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 transition-all"
                        aria-label="Previous page"
                      >
                        <ChevronLeft size={18} />
                      </button>

                      <div className="flex gap-1 mx-1">
                        {visiblePages.map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                              page === pageNum
                                ? "bg-indigo-600 text-white font-medium"
                                : "bg-slate-700 hover:bg-slate-600"
                            } transition-all`}
                          >
                            {pageNum}
                          </button>
                        ))}

                        {visiblePages.length > 0 &&
                          visiblePages[visiblePages.length - 1] <
                            totalPages && (
                            <span className="w-10 h-10 flex items-center justify-center text-gray-400">
                              ...
                            </span>
                          )}
                      </div>

                      <button
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                        className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 transition-all"
                        aria-label="Next page"
                      >
                        <ChevronRight size={18} />
                      </button>

                      <button
                        onClick={() => setPage(totalPages)}
                        disabled={page === totalPages}
                        className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 transition-all"
                        aria-label="Last page"
                      >
                        <ChevronsRight size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <DeleteModal
        show={showDeleteModal}
        product={productToDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}