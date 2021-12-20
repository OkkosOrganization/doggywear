import React, { useEffect, useState } from 'react';
import CartIcon from './icons/CartIcon';
import MobileNaviIcon from './icons/MobileNaviIcon';
import { Logo } from './Logo';
import styles from "../sass/Navi.module.scss";
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
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

  let classes = `${styles.mainNavi}`;

  return (
    <>
      <nav className={classes}>
        <MobileNaviIcon toggleNavi={toggleNavi} naviOpen={naviOpen} />
        <CartIcon />
      </nav>
      <Logo highlight={scrolled || naviOpen} />
    </>
  );
}

export default Header;
