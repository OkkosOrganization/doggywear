import Script from 'next/script'
import Layout from '../components/Layout';
import "../sass/style.scss";
import { GOOGLE_ANALYTICS } from '../config/env';
import { useEffect, useState } from 'react';

export default function DoggyApp({ Component, pageProps }) {

  const [ww,setWw]  = useState<number>(0);
  
  const handleResize = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);  
    setWw(vw);
  };

  useEffect(() => {    
    window.addEventListener('resize', handleResize);
    handleResize();
    return(() => {
      window.removeEventListener('resize', handleResize);
    })
  },[]);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS}`}
        id='analytics'
        strategy='afterInteractive'
      />
      <Layout ww={ww}>
        <Component {...pageProps} ww={ww} />
      </Layout>
    </>
  );
}