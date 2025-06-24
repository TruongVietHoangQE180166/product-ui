import axios from 'axios';
import { getAuthHeaders, getCurrentUser } from './auth';

const API_URL = 'https://product-manage-1gs3.onrender.com/orders';

const createAuthenticatedRequest = () => {
  return axios.create({
    headers: getAuthHeaders(),
  });
};

// Types for Order - Updated to match backend
export interface OrderItem {
  product: string;
  quantity: number;
  // Removed price - backend will get it from database
}

export interface CreateOrderDto {
  user: string;
  items: OrderItem[];
  // Removed totalAmount - backend will calculate automatically
}

export interface Order {
  _id: string;
  user: {
    _id: string;
    email: string;
  };
  items: {
    product: {
      _id: string;
      name: string;
      price: number;
      image?: string;
    };
    quantity: number;
    price: number; 
    subtotal: number; 
  }[];
  totalAmount: number; // Calculated by backend
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Get user's orders with pagination
export const getOrders = async (page: number = 1, limit: number = 10) => {
  try {
    const authenticatedAxios = createAuthenticatedRequest();
    const response = await authenticatedAxios.get(`${API_URL}/list`, {
      params: { page, limit },
    });
    return {
      data: response.data.data.data,
      total: response.data.data.total
    };
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please login first.');
    }
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch orders');
  }
};

// Get order details by ID
export const getOrder = async (id: string) => {
  try {
    const authenticatedAxios = createAuthenticatedRequest();
    const response = await authenticatedAxios.get(`${API_URL}/detail/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please login first.');
    }
    if (error.response?.status === 403) {
      throw new Error('You can only access your own orders.');
    }
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch order');
  }
};

// Create new order - Simplified, no need to calculate totalAmount
export const createOrder = async (orderData: CreateOrderDto) => {
  try {
    const authenticatedAxios = createAuthenticatedRequest();
    const response = await authenticatedAxios.post(`${API_URL}/create`, orderData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please login first.');
    }
    throw new Error(error.response?.data?.error?.message || 'Failed to create order');
  }
};

// Cancel order
export const cancelOrder = async (id: string) => {
  try {
    const authenticatedAxios = createAuthenticatedRequest();
    const response = await authenticatedAxios.put(`${API_URL}/cancel/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please login first.');
    }
    if (error.response?.status === 403) {
      throw new Error('You can only cancel your own orders.');
    }
    throw new Error(error.response?.data?.error?.message || 'Failed to cancel order');
  }
};

// Delete order (only cancelled orders)
export const deleteOrder = async (id: string) => {
  try {
    const authenticatedAxios = createAuthenticatedRequest();
    const response = await authenticatedAxios.delete(`${API_URL}/delete/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please login first.');
    }
    if (error.response?.status === 403) {
      throw new Error('You can only delete your own orders.');
    }
    throw new Error(error.response?.data?.error?.message || 'Failed to delete order');
  }
};

// Helper function to create order from cart items - Simplified
export const createOrderFromCart = async (cartItems: any[], shippingInfo?: any) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('User not logged in');
    }

    // Convert cart items to order items - Only need product ID and quantity
    const orderItems: OrderItem[] = cartItems.map(item => ({
      product: item.product._id || item.product,
      quantity: item.quantity,
      // Removed price - backend will get current price from database
    }));

    const orderData: CreateOrderDto = {
      user: user._id,
      items: orderItems,
      // Removed totalAmount - backend will calculate automatically
    };

    return await createOrder(orderData);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create order from cart');
  }
};

// Helper function to create order from single product
export const createOrderFromProduct = async (productId: string, quantity: number) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('User not logged in');
    }

    const orderData: CreateOrderDto = {
      user: user._id,
      items: [
        {
          product: productId,
          quantity: quantity,
        }
      ],
    };

    return await createOrder(orderData);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create order');
  }
};

// Check if user can perform order actions
export const canPerformOrderActions = (): boolean => {
  try {
    const user = getCurrentUser();
    return !!user; // Any logged-in user can perform order actions
  } catch {
    return false;
  }
};

// Check if user is logged in
export const isUserLoggedIn = (): boolean => {
  const headers = getAuthHeaders();
  return Object.keys(headers).length > 0;
};

// Handle authentication errors
export const handleAuthError = (error: any) => {
  if (error.response?.status === 401) {
    window.location.href = '/login';
  }
};

// Get order status badge color (for UI)
export const getOrderStatusColor = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'yellow';
    case 'completed':
      return 'green';
    case 'cancelled':
      return 'red';
    default:
      return 'gray';
  }
};

// Format order total amount
export const formatOrderAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Format individual item subtotal
export const formatItemSubtotal = (subtotal: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(subtotal);
};

// Check if order can be cancelled
export const canCancelOrder = (order: Order): boolean => {
  return order.status === 'pending';
};

// Check if order can be deleted
export const canDeleteOrder = (order: Order): boolean => {
  return order.status === 'cancelled';
};

// Calculate estimated total for cart preview (before creating order)
// Note: This is just for display purposes, actual total will be calculated by backend
export const calculateEstimatedTotal = (cartItems: any[]): number => {
  return cartItems.reduce((total, item) => {
    const price = item.price || item.product?.price || 0;
    return total + (price * item.quantity);
  }, 0);
};

// Validate order items before sending to backend
export const validateOrderItems = (items: OrderItem[]): string[] => {
  const errors: string[] = [];
  
  if (!items || items.length === 0) {
    errors.push('Order must contain at least one item');
  }
  
  items.forEach((item, index) => {
    if (!item.product) {
      errors.push(`Item ${index + 1}: Product ID is required`);
    }
    if (!item.quantity || item.quantity < 1) {
      errors.push(`Item ${index + 1}: Quantity must be at least 1`);
    }
  });
  
  return errors;
};

// Get order summary for display
export const getOrderSummary = (order: Order) => {
  const itemCount = order.items.reduce((total, item) => total + item.quantity, 0);
  const uniqueProducts = order.items.length;
  
  return {
    itemCount,
    uniqueProducts,
    totalAmount: order.totalAmount,
    status: order.status,
    createdAt: order.createdAt,
  };
};