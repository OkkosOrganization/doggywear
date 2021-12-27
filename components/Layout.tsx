import Header from './Header';
import dynamic from 'next/dynamic';
import { CartProvider } from './CartContext';
import { Cart } from './Cart';
import { ReactChildren } from 'react';

type LayoutProps = {
  ww:number;
  children?:ReactChildren
};
const Layout = ({ww, children}:LayoutProps) => {
  const Footer = dynamic(() => import('./Footer'), {suspense:false});

  return (
    <CartProvider>
      <Header />
      <main id={"main"}>
        {children}
      </main>      
      <Footer />
      <Cart ww={ww} />
    </CartProvider>
  );
};

export default Layout