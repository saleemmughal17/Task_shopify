"use client"; // Add this at the top to mark this file as a client-side component

import React, { createContext, useState, useContext } from 'react';
import { ProductType } from '@/data/types'; // Assuming you have a ProductType defined

// Define the context type
type CartContextType = {
  cartItems: ProductType[];
  addToCart: (product: ProductType) => void;
};

// Create the context with an initial undefined value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom hook to use the Cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Correctly type the CartProvider's children prop
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<ProductType[]>([]);

  const addToCart = (product: ProductType) => {
    setCartItems((prevItems) => [...prevItems, product]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};
