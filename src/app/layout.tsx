 // Ensure the root layout is client-side

import '@/styles/global.css';
import type { Metadata } from 'next';
import React, { Suspense } from 'react';

import Header from '@/components/Header/Header';
import Footer from '@/shared/Footer/Footer';
import { CartProvider } from '@/context/CartContext'; // Import the CartProvider

import Loading from './loading';

export const metadata: Metadata = {
  title: 'LuxLoom Ecommerce Template',
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon.png',
    },
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        {/* Wrap the whole layout with CartProvider */}
        <CartProvider>
          <Header />
          {/* Suspense with fallback to handle loading states */}
          <Suspense fallback={<Loading />}>{children}</Suspense>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
