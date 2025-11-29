// File: src/src/context/CartContext.tsx

import React, { useEffect, useState, createContext, useContext } from 'react';
import { CartItem, Product } from '../types';
import { useAuth } from '../contexts/AuthContext';
import cartApi from '../api/cartApi';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<boolean>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { isAuthenticated } = useAuth(); // Lấy trạng thái đăng nhập

  // Hàm lấy giỏ hàng từ API
  const fetchCart = async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }

    try {
      const response = await cartApi.getCart();
      // API trả về: { id: 1, items: [...] }
      const backendItems = response.data.items || [];

      // Map dữ liệu Backend -> Frontend
      const mappedItems: CartItem[] = backendItems.map((item: any) => ({
        // Giữ lại ID của dòng giỏ hàng để dùng cho Update/Delete
        id: item.id.toString(), 
        quantity: item.quantity,
        product: {
          id: item.productId.toString(),
          name: item.productName,
          price: item.price,
          // Vì API Cart chưa trả về ảnh, ta dùng ảnh tạm hoặc logic lấy ảnh từ Product list nếu có
          images: ['https://via.placeholder.com/150'], 
          description: '',
          category: '',
          rating: 5,
          reviewCount: 0,
          soldCount: 0,
          stock: 100, // Giả lập stock
        }
      }));

      setItems(mappedItems);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  // Gọi API mỗi khi trạng thái đăng nhập thay đổi
  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (product: Product, quantity: number = 1): Promise<boolean> => {
    if (!isAuthenticated) return false;

    try {
      // Gọi API thêm mới
      await cartApi.addToCart(product.id, quantity);
      // Load lại giỏ hàng để đồng bộ
      await fetchCart();
      setIsCartOpen(true);
      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      return false;
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    if (!isAuthenticated) return;
    try {
      // cartItemId ở đây chính là 'itemId' (id của dòng trong giỏ)
      await cartApi.removeFromCart(cartItemId);
      await fetchCart();
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (!isAuthenticated) return;
    
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    try {
      // Gọi API update
      await cartApi.updateQuantity(cartItemId, quantity);
      await fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const clearCart = () => {
    setItems([]);
    // Nếu có API clear all thì gọi ở đây
  };

  const getCartTotal = () => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      isCartOpen,
      openCart,
      closeCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}