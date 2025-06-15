import { LogOut } from "lucide-react";

interface LogoutModalProps {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function LogoutModal({
  show,
  onConfirm,
  onCancel,
}: LogoutModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
      <div className="bg-slate-800 rounded-xl shadow-2xl p-6 sm:p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100 border border-slate-700 hover:border-orange-500/50">
        {/* Icon and Title */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
            <LogOut size={24} className="text-orange-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Confirm Logout
          </h3>
        </div>

        {/* Warning Message */}
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mb-6">
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Are you sure you want to{" "}
            <span className="font-semibold text-orange-400">
              log out
            </span>{" "}
            of your account?
          </p>
          <p className="text-orange-300 text-sm mt-2 font-medium">
            💡 You'll need to sign in again to access your account.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] font-medium"
            aria-label="Confirm logout"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-slate-500 text-gray-300 hover:text-white px-4 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] font-medium"
            aria-label="Cancel logout"
          >
            Stay Signed In
          </button>
        </div>
      </div>
    </div>
  );
}