import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import MobileNaviIcon from './icons/MobileNaviIcon';
import { Logo } from './Logo';
import styles from "../styles/Navi.module.scss";
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import { Navi } from './Navi';
gsap.registerPlugin(ScrollTrigger);

const CartIcon = dynamic(() => import('./icons/CartIcon'), {suspense:false});

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
