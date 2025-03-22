"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { FiTrash2, FiMinusCircle, FiPlusCircle } from "react-icons/fi";
import { ShoppingCart } from "lucide-react";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 flex flex-col items-center">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
        <ShoppingCart className="w-8 h-8 text-blue-600 dark:text-blue-400" /> Your Shopping Cart
      </h1>

      {/* Empty Cart Message */}
      {cart.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400 mt-10">
          <p className="text-lg">Your cart is empty.</p>
        </div>
      ) : (
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          {/* Scrollable Cart Items */}
          <div className="max-h-[500px] overflow-y-auto">
            <ul className="divide-y divide-gray-300 dark:divide-gray-700">
              {cart.map((item) => (
                <li
                  key={item.variantId}
                  className="flex flex-col sm:flex-row items-center justify-between py-4 space-y-4 sm:space-y-0"
                >
                  {/* Product Image & Info */}
                  <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 rounded-md object-cover shadow-md"
                    />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Price: <strong>${item.price}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Quantity & Remove Buttons */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-200"
                    >
                      <FiMinusCircle className="w-6 h-6" />
                    </button>
                    <span className="text-lg font-medium text-gray-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
                    >
                      <FiPlusCircle className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.variantId)}
                      className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                    >
                      <FiTrash2 className="w-6 h-6" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
