// services/cart.ts
import { useState, useEffect } from 'react';

export interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image?: string;
  };
  quantity: number;
  price: number;
}

class CartService {
  private items: CartItem[] = [];
  private listeners: Array<() => void> = [];

  addItem(product: any, quantity: number = 1) {
    const existingIndex = this.items.findIndex(item => item.product._id === product._id);
    
    if (existingIndex >= 0) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        product: {
          _id: product._id,
          name: product.name,
          price: Number(product.price),
          image: product.image
        },
        quantity,
        price: Number(product.price)
      });
    }
    
    // GỌI NOTIFY SAU KHI CẬP NHẬT GIỎ HÀNG
    this.notifyListeners();
  }

  removeItem(productId: string) {
    this.items = this.items.filter(item => item.product._id !== productId);
    // GỌI NOTIFY SAU KHI XÓA
    this.notifyListeners();
  }

  updateQuantity(productId: string, quantity: number) {
    const item = this.items.find(item => item.product._id === productId);
    if (item) {
      item.quantity = quantity;
      if (quantity <= 0) {
        this.removeItem(productId); // removeItem sẽ gọi notifyListeners
        return;
      }
    }
    // GỌI NOTIFY SAU KHI CẬP NHẬT SỐ LƯỢNG
    this.notifyListeners();
  }

  clearCart() {
    this.items = [];
    // GỌI NOTIFY SAU KHI XÓA TOÀN BỘ
    this.notifyListeners();
  }

  getItems(): CartItem[] {
    return this.items;
  }

  getTotalAmount(): number {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getItemCount(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  subscribe(callback: () => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // THAY ĐỔI: LUÔN GỌI NOTIFY KHI CÓ THAY ĐỔI
  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }
}

export const cartService = new CartService();

export const useCart = () => {
  const [cartState, setCartState] = useState({
    items: cartService.getItems(),
    itemCount: cartService.getItemCount(),
    totalAmount: cartService.getTotalAmount(),
  });
  
  useEffect(() => {
    // Cập nhật state khi có thay đổi
    const updateCartState = () => {
      setCartState({
        items: cartService.getItems(),
        itemCount: cartService.getItemCount(),
        totalAmount: cartService.getTotalAmount(),
      });
    };
    
    // Đăng ký lắng nghe thay đổi
    const unsubscribe = cartService.subscribe(updateCartState);
    
    // Cập nhật lần đầu
    updateCartState();
    
    return unsubscribe;
  }, []);

  return {
    items: cartState.items,
    addItem: cartService.addItem.bind(cartService),
    removeItem: cartService.removeItem.bind(cartService),
    updateQuantity: cartService.updateQuantity.bind(cartService),
    clearCart: cartService.clearCart.bind(cartService),
    totalAmount: cartState.totalAmount,
    itemCount: cartState.itemCount,
  };
};