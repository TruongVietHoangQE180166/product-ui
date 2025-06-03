import type { Product } from "../types/product";
import { Trash2 } from "lucide-react";
interface DeleteModalProps {
  show: boolean;
  product: Product | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({
  show,
  product,
  onConfirm,
  onCancel,
}: DeleteModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
      <div className="bg-slate-800 rounded-xl shadow-2xl p-6 sm:p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100 border border-slate-700 hover:border-red-500/50">
        {/* Icon and Title */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
            <Trash2 size={24} className="text-red-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Delete Product
          </h3>
        </div>

        {/* Warning Message */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-red-400">
              "{product?.name}"
            </span>
            ?
          </p>
          <p className="text-red-300 text-sm mt-2 font-medium">
            ⚠️ This action cannot be undone.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] font-medium"
            aria-label="Confirm delete product"
          >
            <Trash2 size={18} />
            <span>Delete</span>
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-slate-500 text-gray-300 hover:text-white px-4 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] font-medium"
            aria-label="Cancel delete"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
