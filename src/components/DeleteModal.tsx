import type { Product } from '../types/product';

interface DeleteModalProps {
  show: boolean;
  product: Product | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({ show, product, onConfirm, onCancel }: DeleteModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 tracking-tight">
          Delete Product
        </h3>
        <p className="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed">
          Are you sure you want to delete <span className="font-medium text-gray-800">&quot;{product?.name}&quot;</span>? This action cannot be undone.
        </p>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md"
            aria-label="Confirm delete product"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow-md"
            aria-label="Cancel delete"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}