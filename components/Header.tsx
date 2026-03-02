import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import MobileNaviIcon from './icons/MobileNaviIcon';
import { Logo } from './Logo';
import styles from '../styles/Navi.module.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navi } from './Navi';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const CartIcon = dynamic(() => import('./icons/CartIcon'));

const Header = (props) => {
  const [naviOpen, setNaviOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: 'body',
      start: '0px',
      end: '99999px',
      markers: false,
      once: false,
      onUpdate: ({ progress, direction }) => {
        setScrolled(direction === 1 ? true : false);
      },
    });
    return () => {
      trigger.kill();
    };
  }, []);

  const toggleNavi = () => {
    setNaviOpen(!naviOpen);
    const appContainer = document.querySelector('#app-container');
    if (appContainer) {
      if (!naviOpen) appContainer.classList.add('naviOpen');
      else appContainer.classList.remove('naviOpen');
    }
  };

  const classes = `${styles.mainNavi} ${naviOpen ? styles.active : ''} ${
    scrolled && !naviOpen ? styles.showBg : ''
  } `;

  return (
    <>
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
        highlight={scrolled || naviOpen}
        toggleNavi={toggleNavi}
        naviOpen={naviOpen}
      />
    </>
  );
};

export default Header;
