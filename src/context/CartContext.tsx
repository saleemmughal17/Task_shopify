"use client"; 

import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[]; 
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    // ✅ Load from localStorage only once
    if (typeof window !== "undefined") {
      try {
        const storedCart = localStorage.getItem("cart");
        console.log("🔄 Loaded cart from localStorage:", storedCart);
        return storedCart ? JSON.parse(storedCart) : [];
      } catch (error) {
        console.error("❌ Error loading cart:", error);
        return [];
      }
    }
    return [];
  });

  // ✅ Save cart to localStorage when cart updates
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("💾 Saving cart:", cart);
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product: CartItem) => {
    console.log("➕ Adding to cart:", product);
    setCart((prevItems) => {
      const existingProduct = prevItems.find((item) => item.id === product.id);
      const updatedCart = existingProduct
        ? prevItems.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        : [...prevItems, { ...product, quantity: 1 }];

      return updatedCart;
    });
  };

  const removeFromCart = (productId: string) => {
    console.log("❌ Removing from cart:", productId);
    setCart((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    console.log(`🔄 Updating quantity for ${productId} to ${quantity}`);
    setCart((prevItems) =>
      prevItems.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
