'use client';

import Header from '../components/Header';
import { CartProvider } from '../components/CartContext';
import dynamic from 'next/dynamic';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const Cart = dynamic(() => import('../components/Cart'), { ssr: false });
  const Footer = dynamic(() => import('../components/Footer'), { ssr: false });

  return (
    <CartProvider>
      <div id="app-container">
        <Header />
        <main id={'main'}>{children}</main>
        <Footer />
        <Cart />
      </div>
    </CartProvider>
  );
}
