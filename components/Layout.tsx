import Header from './Header';
import dynamic from 'next/dynamic';
import { CartProvider } from './CartContext';
import SimpleReactLightbox from 'simple-react-lightbox'

type LayoutProps = {
  ww: number;
  children?: React.ReactNode;
};
const Layout = ({ ww, children }: LayoutProps) => {
  const Cart = dynamic(() => import('./Cart'), { suspense: false });
  const Footer = dynamic(() => import('./Footer'), { suspense: false });

  return (
    <SimpleReactLightbox>
      <CartProvider>
        <Header />
        <main id={"main"}>
          {children}
        </main>
        <Footer />
        <Cart ww={ww} />
      </CartProvider>
    </SimpleReactLightbox>
  );
};

export default Layout