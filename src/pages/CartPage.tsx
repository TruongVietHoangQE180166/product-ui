// pages/CartPage.tsx
import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, ShoppingBag, CreditCard } from 'lucide-react';
import { useCart } from '../services/cart';
import { createOrderFromCart } from '../services/order';
import { isAuthenticated } from '../services/auth';
import toast from 'react-hot-toast';

interface CartPageProps {
  navigateTo: (page: string) => void;
}

interface CheckoutModalProps {
  show: boolean;
  items: any[];
  totalAmount: number;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const API_URL = "https://product-manage-1gs3.onrender.com";

// Checkout Confirmation Modal
function CheckoutModal({ show, items, totalAmount, onConfirm, onCancel, isLoading }: CheckoutModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
      <div className="bg-slate-800 rounded-xl shadow-2xl p-6 sm:p-8 max-w-lg w-full mx-4 transform transition-all duration-300 scale-100 border border-slate-700 hover:border-green-500/50">
        {/* Icon and Title */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
            <CreditCard size={24} className="text-green-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Confirm Order
          </h3>
        </div>

        {/* Order Summary */}
        <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-300 font-medium">Items:</span>
            <span className="text-white font-semibold">{items.length} products</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-300 font-medium">Total Amount:</span>
            <span className="text-green-400 font-bold text-xl">${totalAmount.toFixed(2)}</span>
          </div>
          <div className="border-t border-slate-600 pt-3 mt-3">
            <p className="text-gray-400 text-sm">
              💳 Your order will be processed and you'll receive a confirmation.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] font-medium disabled:cursor-not-allowed"
            aria-label="Confirm checkout"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <ShoppingBag size={18} />
                <span>Place Order</span>
              </>
            )}
          </button>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-slate-500 text-gray-300 hover:text-white px-4 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] font-medium disabled:opacity-50"
            aria-label="Cancel checkout"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CartPage({ navigateTo }: CartPageProps) {
  const { items, updateQuantity, removeItem, clearCart, totalAmount } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const handleCheckout = () => {
    if (!isAuthenticated()) {
      toast.error('Please login to checkout');
      navigateTo('login');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const invalidItems = items.filter(item => !item.product._id);
    if (invalidItems.length > 0) {
      toast.error('Some products are missing valid IDs. Please refresh and try again.');
      return;
    }

    setShowCheckoutModal(true);
  };

  const handleConfirmCheckout = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      await createOrderFromCart(items);
      clearCart();
      setShowCheckoutModal(false);

      toast.success('Order placed successfully! Redirecting...');

      setTimeout(() => {
        navigateTo('orders');
      }, 2000);
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error('Failed to create order: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getImageSrc = (product: any) => {
    if (product.image instanceof File) {
      return URL.createObjectURL(product.image);
    }
    if (typeof product.image === 'string' && product.image) {
      return `${API_URL}${product.image}`;
    }
    return 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <ShoppingCart size={64} className="mx-auto text-slate-400 mb-4" />
            <h2 className="text-2xl font-bold text-slate-300 mb-2">Your cart is empty</h2>
            <p className="text-slate-400 mb-6">Add some products to get started</p>
            <button
              onClick={() => navigateTo('home')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 flex items-center text-white">
          <ShoppingCart className="mr-3" />
          Shopping Cart ({items.length} items)
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.product._id} className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-6 flex items-center space-x-4 hover:border-slate-600 transition-all duration-200">
                <img
                  src={getImageSrc(item.product)}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-white">{item.product.name}</h3>
                  <p className="text-slate-400">${item.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-all duration-200"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 bg-slate-700 text-white rounded-lg min-w-[3rem] text-center font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-all duration-200"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg text-white">${(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="text-red-400 hover:text-red-300 mt-1 p-1 rounded transition-all duration-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-6 h-fit">
            <h3 className="text-xl font-bold mb-4 text-white">Order Summary</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-400">
                <span>Note:</span>
                <span>Final price calculated at checkout</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-slate-700 pt-3 text-white">
                <span>Estimated Total:</span>
                <span className="text-green-400">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isLoading || items.some(item => !item.product._id)}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] font-medium"
            >
              <ShoppingBag size={18} />
              <span>Checkout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        show={showCheckoutModal}
        items={items}
        totalAmount={totalAmount}
        onConfirm={handleConfirmCheckout}
        onCancel={() => setShowCheckoutModal(false)}
        isLoading={isLoading}
      />
    </div>
  );
}
