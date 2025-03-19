"use client";

import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { MdClose } from "react-icons/md";

import { useCart } from "@/context/CartContext";
import ButtonCircle3 from "@/shared/Button/ButtonCircle3";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import InputNumber from "@/shared/InputNumber/InputNumber";
import LikeButton from "./LikeButton";

const CartSideBar = () => {
  const [isVisable, setIsVisable] = useState(false);
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [cartCount, setCartCount] = useState(0);

  // ✅ Fix Hydration Error by ensuring cart count updates after mount
  useEffect(() => {
    setCartCount(cart.length);
  }, [cart]);

  const handleOpenMenu = () => setIsVisable(true);
  const handleCloseMenu = () => setIsVisable(false);

  // ✅ Shopify Checkout Function
  const handleCheckout = () => {
    const shopifyStoreUrl = "https://ms-collection-store12.myshopify.com/password"; // Replace with your Shopify store URL

    // 🛒 Convert cart items into Shopify checkout format
    const cartItems = cart.map((item) => `${item.id}:${item.quantity}`).join(",");

    // 🛍️ Generate Shopify checkout URL
    const checkoutUrl = `${shopifyStoreUrl}/${cartItems}`;

    // Redirect to Shopify checkout
    window.location.href = checkoutUrl;
  };

  const renderProduct = (item) => {
    const { id, title, image, price, quantity } = item;

    return (
      <div key={id} className="flex py-5 last:pb-0">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
          <Image fill src={image} alt={title} className="h-full w-full object-cover object-top" />
          <Link onClick={handleCloseMenu} className="absolute inset-0" href={`/products/${id}`} />
        </div>

        <div className="ml-4 flex flex-1 flex-col justify-between">
          <div>
            <div className="flex justify-between">
              <h3 className="font-medium">
                <Link onClick={handleCloseMenu} href={`/products/${id}`}>
                  {title}
                </Link>
              </h3>
              <span className="font-medium">${price}.00</span>
            </div>
          </div>

          <div className="flex w-full items-end justify-between text-sm">
            <div className="flex items-center gap-3">
              <LikeButton />
              <button onClick={() => removeFromCart(id)}>
                <AiOutlineDelete className="text-2xl text-red-500 hover:text-red-700 cursor-pointer" />
              </button>
            </div>
            <div>
              <InputNumber value={quantity} onChange={(value) => updateQuantity(id, value)} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => (
    <Transition appear show={isVisable} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={handleCloseMenu}>
        <div className="z-max fixed inset-y-0 right-0 w-full max-w-md outline-none focus:outline-none md:max-w-md">
          <Transition.Child
            as={Fragment}
            enter="transition duration-100 transform"
            enterFrom="opacity-0 translate-x-full"
            enterTo="opacity-100 translate-x-0"
            leave="transition duration-150 transform"
            leaveFrom="opacity-100 translate-x-0"
            leaveTo="opacity-0 translate-x-full"
          >
            <div className="relative z-20">
              <div className="overflow-hidden shadow-lg ring-1 ring-black/5">
                <div className="relative h-screen bg-white">
                  <div className="hiddenScrollbar h-screen overflow-y-auto p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">Shopping Cart ({cartCount})</h3>
                      <ButtonCircle3 onClick={handleCloseMenu}>
                        <MdClose className="text-2xl" />
                      </ButtonCircle3>
                    </div>

                    <div className="divide-y divide-neutral-300">
                      {cart.length > 0 ? cart.map(renderProduct) : <p className="text-gray-500">Your cart is empty.</p>}
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full bg-neutral-50 p-5">
                    <p className="flex justify-between">
                      <span>
                        <span className="font-medium">Subtotal</span>
                        <span className="block text-sm text-neutral-500">
                          Shipping and taxes calculated at checkout.
                        </span>
                      </span>
                      <span className="text-xl font-medium">
                        ${cart.reduce((total, item) => total + item.price * item.quantity, 0)}
                      </span>
                    </p>

                    <div className="mt-5 flex items-center gap-5">
                      {/* ✅ Shopify Checkout Button */}
                      <ButtonPrimary onClick={handleCheckout} className="w-full flex-1">
                        Checkout
                      </ButtonPrimary>
                      <ButtonSecondary onClick={handleCloseMenu} href="/cart" className="w-full flex-1 border-2 border-primary text-primary">
                        View cart
                      </ButtonSecondary>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter=" duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-neutral-900/60" />
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );

  return (
    <>
      <button type="button" onClick={handleOpenMenu} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
        Checkout ({cartCount})
      </button>

      {renderContent()}
    </>
  );
};

export default CartSideBar;
