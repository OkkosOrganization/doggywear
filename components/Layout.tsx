import Header from './Header';
import dynamic from 'next/dynamic';
import { CartProvider } from './CartContext';

const Cart = dynamic(() => import('./Cart'));
const Footer = dynamic(() => import('./Footer'));

type LayoutProps = {
  ww: number;
  children?: React.ReactNode;
};
const Layout = ({ ww, children }: LayoutProps) => {
  return (
    <>
      <CartProvider>
        <div id="app-container">
          <Header />
          <main id={'main'}>{children}</main>
          <Footer />
          <Cart ww={ww} />
        </div>
      </CartProvider>
    </>
  );
};

export default Layout;
