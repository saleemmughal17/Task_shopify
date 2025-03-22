"use client";

import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { MdClose } from "react-icons/md";
import { ShoppingCart } from "lucide-react"; // 🛒 Import Cart Icon

import { useCart } from "@/context/CartContext";
import ButtonCircle3 from "@/shared/Button/ButtonCircle3";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import InputNumber from "@/shared/InputNumber/InputNumber";
import LikeButton from "./LikeButton";

interface CartItem {
  variantId: string;
  title: string;
  price: number | string;
  image: string;
  slug: string;
  quantity: number;
}

const CartSideBar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartCount(cart.length);
  }, [cart]);

  const handleOpenMenu = () => setIsVisible(true);
  const handleCloseMenu = () => setIsVisible(false);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const cartUrl = `https://${shopifyDomain}/cart/`;
    window.location.href = cartUrl;
  };

  const renderProduct = (item: CartItem) => (
    <div key={item.variantId} className="flex py-5 last:pb-0">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
        <Image fill src={item.image} alt={item.title} className="h-full w-full object-cover object-top" />
        <Link onClick={handleCloseMenu} className="absolute inset-0" href={`/products/${item.slug}`} />
      </div>
      <div className="ml-4 flex flex-1 flex-col justify-between">
        <div className="flex justify-between">
          <h3 className="font-medium">
            <Link onClick={handleCloseMenu} href={`/products/${item.slug}`}>{item.title}</Link>
          </h3>
          <span className="font-medium">${Number(item.price || 0).toFixed(2)}</span>
        </div>
        <div className="flex w-full items-end justify-between text-sm">
          <div className="flex items-center gap-3">
            <LikeButton />
            <button onClick={() => removeFromCart(item.variantId)}>
              <AiOutlineDelete className="text-2xl text-red-500 hover:text-red-700 cursor-pointer" />
            </button>
          </div>
          <div>
            <InputNumber defaultValue={item.quantity} onChange={(value) => updateQuantity(item.variantId, value)} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button type="button" onClick={handleOpenMenu} className="focus:outline-none flex items-center gap-2">
        <ShoppingCart className="w-6 h-6 text-gray-700" />
        <span>({cartCount})</span>
      </button>
      <Transition appear show={isVisible} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={handleCloseMenu}>
          <div className="z-max fixed inset-y-0 right-0 w-full max-w-md outline-none focus:outline-none md:max-w-md">
            <Transition.Child as={Fragment} enter="transition duration-100 transform" enterFrom="opacity-0 translate-x-full" enterTo="opacity-100 translate-x-0" leave="transition duration-150 transform" leaveFrom="opacity-100 translate-x-0" leaveTo="opacity-0 translate-x-full">
              <div className="relative z-20">
                <div className="overflow-hidden shadow-lg ring-1 ring-black/5">
                  <div className="relative h-screen bg-white flex flex-col">
                    <div className="p-5 flex items-center justify-between border-b">
                      <h3 className="text-xl font-semibold">Shopping Cart ({cartCount})</h3>
                      <ButtonCircle3 onClick={handleCloseMenu}>
                        <MdClose className="text-2xl" />
                      </ButtonCircle3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-5 divide-y divide-neutral-300">
                      {cart.length > 0 ? cart.map((item) => renderProduct(item)) : <p className="text-gray-500">Your cart is empty.</p>}
                    </div>
                    <div className="sticky bottom-0 left-0 w-full bg-neutral-50 p-5 border-t shadow-md">
                      <p className="flex justify-between">
                        <span>
                          <span className="font-medium">Subtotal</span>
                          <span className="block text-sm text-neutral-500">Shipping and taxes calculated at checkout.</span>
                        </span>
                        <span className="text-xl font-medium">
                          ${cart.reduce((total, item) => total + Number(item.price || 0) * item.quantity, 0).toFixed(2)}
                        </span>
                      </p>
                      <div className="mt-5 flex items-center gap-5">
                        <ButtonPrimary onClick={handleCheckout} className="w-full flex-1">Checkout</ButtonPrimary>
                        <ButtonSecondary onClick={handleCloseMenu} href="/cart" className="w-full flex-1 border-2 border-primary text-primary">View cart</ButtonSecondary>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default CartSideBar;
