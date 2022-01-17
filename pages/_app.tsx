import Script from 'next/script';
import Layout from '../components/Layout';
import '../styles/style.scss';
import { GOOGLE_ANALYTICS } from '../config/env';
import { useEffect, useState } from 'react';
import { debounce } from 'ts-debounce';

export default function DoggyApp({ Component, pageProps }) {
  const [ww, setWw] = useState<number>(0);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  const detectTouch = () => {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  };

  useEffect(() => {
    const handleResize = async () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      const vw = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      );
      return vw;
    };

    const debounced = debounce(handleResize, 250);
    const getWw = async () => {
      const ww = await debounced();
      setWw(ww);
      if (!isTouchDevice) if (ww < 768 && detectTouch()) setIsTouchDevice(true);
    };
    window.addEventListener('resize', getWw);
    getWw();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ww, isTouchDevice]);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS}`}
        id="analytics"
        strategy="afterInteractive"
      />
      <Layout ww={ww}>
        <Component {...pageProps} ww={ww} isTouchDevice={isTouchDevice} />
      </Layout>
    </>
  );
}
