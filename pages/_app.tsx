import Script from 'next/script';
import Layout from '../components/Layout';
import '../styles/style.scss';
import { GOOGLE_ANALYTICS } from '../config/env';
import { useEffect, useState } from 'react';
import { debounce } from 'ts-debounce';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { useRouter } from 'next/router';

export default function DoggyApp({ Component, pageProps }) {
  const router = useRouter();
  const [ww, setWw] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  const detectTouch = () => {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  };

  useEffect(() => {
    //RESIZING
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

    //SUBSCRIBE TO ROUTER EVENTS
    const onRouteChangeDone = () => {
      setLoading(false);
    };
    const onRouteChangeStart = () => {
      setLoading(true);
    };
    router.events.on('routeChangeStart', onRouteChangeStart);
    router.events.on('routeChangeComplete', onRouteChangeDone);
    router.events.on('routeChangeError', onRouteChangeDone);

    return () => {
      window.removeEventListener('resize', handleResize);
      router.events.off('routeChangeStart', onRouteChangeStart);
      router.events.off('routeChangeComplete', onRouteChangeDone);
      router.events.off('routeChangeError', onRouteChangeDone);
    };
  }, [ww, isTouchDevice, router.events]);

  return (
    <>
      {GOOGLE_ANALYTICS && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS}`}
            id="analytics"
            strategy="afterInteractive"
          />
          <Script
            strategy="afterInteractive"
            id="analyticsInit"
            dangerouslySetInnerHTML={{
              __html: `          
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GOOGLE_ANALYTICS}');
            `,
            }}
          />
        </>
      )}
      <Layout ww={ww}>
        <Component {...pageProps} ww={ww} isTouchDevice={isTouchDevice} />
        {loading && <LoadingIndicator showBg fixed />}
      </Layout>
    </>
  );
}
