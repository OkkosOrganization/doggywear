import Header from './Header';
import dynamic from 'next/dynamic';

const Layout = (props) => {
  const Footer = dynamic(() => import('./Footer'), {suspense:false});

  return (
    <>
      <Header />
      <main id={"main"}>
        {props.children}
      </main>
      <Footer />
    </>
  );
};

export default Layout