"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-100 dark:bg-gray-900">
      {/* ⬅ Simple Arrow Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center text-black-500 hover:underline"
      >
        ⬅ Back
      </button>

      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
        🛒 Your Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400 mt-10">
          <p className="text-lg md:text-xl">Your cart is empty.</p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-md">
          <ul className="space-y-4">
            {cart.map((item) => (
              <li 
                key={item.id} 
                className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700"
              >
                <div className="flex items-center space-x-4">
                  <img src={item.image} alt={item.title} className="w-16 h-16 rounded-md object-cover" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Price: <strong>${item.price}</strong></p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {item.quantity}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md">➖</button>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 bg-green-500 text-white rounded-md">➕</button>
                  <button onClick={() => removeFromCart(item.id)} className="px-2 bg-red-500 text-white rounded-md">❌</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CartPage;
