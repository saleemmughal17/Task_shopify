"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

interface CartItem {
  variantId: string; // ✅ Corrected from `id` to `variantId`
  title: string;
  price: number;
  image: string;
  slug: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
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
    if (typeof window !== "undefined") {
      try {
        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        return storedCart.filter((item: CartItem) => item.variantId); // ✅ Ensure valid variantId
      } catch (error) {
        console.error("❌ Error loading cart:", error);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("cart", JSON.stringify(cart));
      } catch (error) {
        console.error("❌ Error saving cart:", error);
      }
    }
  }, [cart]);

  const addToCart = (product: CartItem) => {
    if (!product.variantId) {
      console.error("❌ Missing variantId for product:", product);
      return;
    }

    setCart((prevItems) => {
      const existingProduct = prevItems.find((item) => item.variantId === product.variantId);
      if (existingProduct) {
        return prevItems.map((item) =>
          item.variantId === product.variantId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (variantId: string) => {
    setCart((prevItems) => prevItems.filter((item) => item.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prevItems) =>
      prevItems.map((item) => (item.variantId === variantId ? { ...item, quantity } : item))
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
