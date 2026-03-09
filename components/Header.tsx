import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import MobileNaviIcon from './icons/MobileNaviIcon';
import { Logo } from './Logo';
import styles from '../styles/Navi.module.css';
import { Navi } from './Navi';

const CartIcon = dynamic(() => import('./icons/CartIcon'));

const Header = (props) => {
  const [naviOpen, setNaviOpen] = useState<boolean>(false);
  const [hideNavi, setHideNavi] = useState<boolean>(false);
  const [showNaviBg, setShowNaviBg] = useState<boolean>(false);
  const lastScrollY = useRef<number>(0);
  const hideNaviRef = useRef<boolean>(false);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;

      if (naviOpen) {
        setHideNavi(false);
        hideNaviRef.current = false;
        setShowNaviBg(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      if (currentScrollY <= 8) {
        setHideNavi(false);
        hideNaviRef.current = false;
        setShowNaviBg(false);
        lastScrollY.current = currentScrollY;
        return;
      }

      let nextHideNavi = hideNaviRef.current;
      if (currentScrollY > lastScrollY.current) {
        nextHideNavi = true;
      } else if (currentScrollY < lastScrollY.current) {
        nextHideNavi = false;
      }

      hideNaviRef.current = nextHideNavi;
      setHideNavi(nextHideNavi);
      setShowNaviBg(currentScrollY > 8 && !nextHideNavi);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [naviOpen]);

  const toggleNavi = () => {
    setNaviOpen(!naviOpen);
    const appContainer = document.querySelector('#app-container');
    if (appContainer) {
      if (!naviOpen) appContainer.classList.add('naviOpen');
      else appContainer.classList.remove('naviOpen');
    }
  };

  const classes = `${styles.mainNavi} ${naviOpen ? styles.active : ''} ${
    hideNavi && !naviOpen ? styles.hidden : ''
  } ${showNaviBg || naviOpen ? styles.showBg : ''}`;

  return (
    <header>
      <nav className={classes}>
        <MobileNaviIcon toggleNavi={toggleNavi} naviOpen={naviOpen} />
        <div className={styles.naviItems}>
          <Navi
            navi={props.navi}
            lang={props.lang}
            naviOpen={naviOpen}
            toggleNavi={toggleNavi}
          />
        </div>
        <CartIcon />
      </nav>
      <Logo
        highlight={showNaviBg || naviOpen}
        toggleNavi={toggleNavi}
        naviOpen={naviOpen}
      />
    </header>
  );
};

export default Header;
