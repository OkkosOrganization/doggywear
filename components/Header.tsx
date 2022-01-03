import React, { useEffect, useState } from 'react';
import { CartIcon } from './icons/CartIcon';
import MobileNaviIcon from './icons/MobileNaviIcon';
import { Logo } from './Logo';
import styles from "../sass/Navi.module.scss";
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import { Navi } from './Navi';
gsap.registerPlugin(ScrollTrigger);

const Header = (props) => {

  const [naviOpen, setNaviOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    ScrollTrigger.create({
      trigger:'body',
      start:'0px',
      end:'99999px',
      markers:false,
      once:false,
      onUpdate:({progress, direction}) => {
        setScrolled(direction === 1 ? true : false);
      }
    });
  }, []);

  const toggleNavi = () => {
    setNaviOpen(!naviOpen);
  };

  const classes = `${styles.mainNavi} ${naviOpen ? styles.active : ""} ${scrolled && !naviOpen ? styles.showBg : ""} `;

  return (
    <>
      <nav className={classes}>
        <MobileNaviIcon toggleNavi={toggleNavi} naviOpen={naviOpen} />
        <div className={styles.naviItems}>
          <Navi navi={props.navi} lang={props.lang} naviOpen={naviOpen} toggleNavi={toggleNavi} />
        </div>        
        <CartIcon />
      </nav>
      <Logo highlight={scrolled || naviOpen} />
    </>
  );
}

export default Header;
