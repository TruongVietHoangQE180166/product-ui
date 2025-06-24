import { useState, useEffect } from 'react';
import { Package, Eye, Trash2, Calendar, DollarSign, CircleX } from 'lucide-react';
import { getOrders, getOrder, cancelOrder, deleteOrder, formatOrderAmount, getOrderStatusColor, canCancelOrder, canDeleteOrder } from '../services/order';
import type { Order } from '../services/order';
import toast from 'react-hot-toast';

interface OrdersPageProps {
  navigateTo: (string) => void;
}

interface ConfirmationModalProps {
  show: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
  confirmText?: string;
  confirmIcon?: React.ReactNode;
}

const API_URL = "https://product-manage-1gs3.onrender.com";

// Confirmation Modal for Cancel/Delete Actions
function ConfirmationModal({ show, title, message, onConfirm, onCancel, isLoading, confirmText = "Confirm", confirmIcon }: ConfirmationModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
      <div className="bg-slate-800 rounded-xl shadow-2xl p-6 sm:p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100 border border-slate-700 hover:border-red-500/50">
        {/* Icon and Title */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
            {confirmIcon || <Package size={24} className="text-red-400" />}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {title}
          </h3>
        </div>

        {/* Message */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {message}
          </p>
          <p className="text-red-300 text-sm mt-2 font-medium">
            ⚠️ This action cannot be undone.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] font-medium"
            aria-label={`Confirm ${title.toLowerCase()}`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{confirmText}</span>
              </>
            )}
          </button>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-slate-500 text-gray-300 hover:text-white px-4 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] font-medium"
            aria-label="Cancel action"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage({ navigateTo }: OrdersPageProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetail, setShowDetail] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<null | { type: 'cancel' | 'delete'; orderId: string }>(null);

  const loadOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data);
    } catch (error: any) {
      if (error.message.includes('Authentication required')) {
        toast.error('Please login to view orders');
        navigateTo('login');
        return;
      }
      toast.error('Failed to load orders: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const viewOrderDetail = async (orderId: string) => {
    try {
      const order = await getOrder(orderId);
      setSelectedOrder(order.data);
      setShowDetail(true);
    } catch (error: any) {
      toast.error('Failed to load order details: ' + error.message);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    setActionLoading(true);
    try {
      await cancelOrder(orderId);
      await loadOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: 'cancelled' });
      }
      toast.success('Order cancelled successfully');
    } catch (error: any) {
      toast.error('Failed to cancel order: ' + error.message);
    } finally {
      setActionLoading(false);
      setShowConfirmModal(false);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    setActionLoading(true);
    try {
      await deleteOrder(orderId);
      await loadOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setShowDetail(false);
        setSelectedOrder(null);
      }
      toast.success('Order deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete order: ' + error.message);
    } finally {
      setActionLoading(false);
      setShowConfirmModal(false);
    }
  };

  const openConfirmModal = (type: 'cancel' | 'delete', orderId: string) => {
    setConfirmAction({ type, orderId });
    setShowConfirmModal(true);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      completed: 'bg-green-500/20 text-green-400 border-green-500/50',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/50'
    };
    return colors[status as keyof typeof colors] || 'bg-slate-700 text-slate-300 border-slate-600';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-slate-300">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 flex items-center text-white">
          <Package className="mr-3" />
          My Orders ({orders.length})
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package size={64} className="mx-auto text-slate-400 mb-4" />
            <h2 className="text-2xl font-bold text-slate-300 mb-2">No orders yet</h2>
            <p className="text-slate-400 mb-6">Start shopping to see your orders here</p>
            <button
              onClick={() => navigateTo('home')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-6 hover:border-slate-600 transition-all duration-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-white">Order #{order._id.slice(-8)}</h3>
                    <p className="text-slate-400 flex items-center mt-1">
                      <Calendar size={16} className="mr-1" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 mt-4 md:mt-0">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="font-bold text-lg text-white flex items-center">
                      {formatOrderAmount(order.totalAmount)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-slate-400">
                    {order.items.length} item{order.items.length > 1 ? 's' : ''}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => viewOrderDetail(order._id)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center space-x-1 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                      aria-label="View order details"
                    >
                      <Eye size={16} />
                      <span>View</span>
                    </button>
                    {canCancelOrder(order) && (
                      <button
                        onClick={() => openConfirmModal('cancel', order._id)}
                        disabled={actionLoading}
                        className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 disabled:opacity-50 flex items-center space-x-1 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                        aria-label="Cancel order"
                      >
                        <CircleX size={16} />
                        <span>Cancel</span>
                      </button>
                    )}
                    {canDeleteOrder(order) && (
                      <button
                        onClick={() => openConfirmModal('delete', order._id)}
                        disabled={actionLoading}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center space-x-1 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                        aria-label="Delete order"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Detail Modal */}
        {showDetail && selectedOrder && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
            <div className="bg-slate-800 rounded-xl shadow-2xl p-6 sm:p-8 max-w-2xl w-full mx-4 transform transition-all duration-300 scale-100 border border-slate-700 hover:border-indigo-500/50">
              {/* Icon and Title */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center">
                  <Package size={24} className="text-indigo-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Order Details
                </h3>
              </div>

              {/* Order Information */}
              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4 mb-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300">Order ID</label>
                    <p className="text-white">#{selectedOrder._id.slice(-8)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300">Status</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(selectedOrder.status)}`}>
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300">Order Date</label>
                    <p className="text-white">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300">Total Amount</label>
                    <p className="text-white font-bold">{formatOrderAmount(selectedOrder.totalAmount)}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Order Items</label>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg border border-slate-600">
                        <div className="flex items-center space-x-3">
                          <img
                            src={getImageSrc(item.product)}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium text-white">{item.product.name}</p>
                            <p className="text-sm text-slate-400">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-medium text-white">{formatOrderAmount(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {canCancelOrder(selectedOrder) && (
                  <button
                    onClick={() => openConfirmModal('cancel', selectedOrder._id)}
                    disabled={actionLoading}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] font-medium"
                    aria-label="Cancel order"
                  >
                    <CircleX size={16} />
                    <span>Cancel Order</span>
                  </button>
                )}
                {canDeleteOrder(selectedOrder) && (
                  <button
                    onClick={() => openConfirmModal('delete', selectedOrder._id)}
                    disabled={actionLoading}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] font-medium"
                    aria-label="Delete order"
                  >
                    <Trash2 size={16} />
                    <span>Delete Order</span>
                  </button>
                )}
                <button
                  onClick={() => setShowDetail(false)}
                  disabled={actionLoading}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-slate-500 text-gray-300 hover:text-white px-4 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] font-medium"
                  aria-label="Close order details"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal for Cancel/Delete */}
        <ConfirmationModal
          show={showConfirmModal}
          title={confirmAction?.type === 'cancel' ? 'Confirm Cancel Order' : 'Confirm Delete Order'}
          message={
            confirmAction?.type === 'cancel'
              ? 'Are you sure you want to cancel this order?'
              : 'Are you sure you want to delete this order? This action cannot be undone.'
          }
          onConfirm={() => {
            if (confirmAction?.type === 'cancel') {
              handleCancelOrder(confirmAction.orderId);
            } else if (confirmAction?.type === 'delete') {
              handleDeleteOrder(confirmAction.orderId);
            }
          }}
          onCancel={() => setShowConfirmModal(false)}
          isLoading={actionLoading}
          confirmText={confirmAction?.type === 'cancel' ? 'Cancel Order' : 'Delete Order'}
          confirmIcon={confirmAction?.type === 'cancel' ? <CircleX size={24} className="text-red-400" /> : <Trash2 size={24} className="text-red-400" />}
        />
      </div>
    </div>
  );
}