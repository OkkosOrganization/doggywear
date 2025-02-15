import Script from 'next/script';
import Layout from '../components/Layout';
import '../styles/style.scss';
import { useEffect, useState } from 'react';
import { debounce } from 'ts-debounce';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { useRouter } from 'next/router';
import { Analytics } from '@vercel/analytics/react';

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
      <>
        {false && (
          <Script strategy="afterInteractive" id="matomo">
            {`          
          var _paq = window._paq = window._paq || [];
          _paq.push(['trackPageView']);
          _paq.push(['enableLinkTracking']);
          (function() {
            var u="https://doggywearshop.matomo.cloud/";
            _paq.push(['setTrackerUrl', u+'matomo.php']);
            _paq.push(['setSiteId', '1']);
            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
            g.async=true; g.src='https://cdn.matomo.cloud/doggywearshop.matomo.cloud/matomo.js'; s.parentNode.insertBefore(g,s);
          })();
          `}
          </Script>
        )}
        <Analytics />
      </>
      <Layout ww={ww}>
        <Component {...pageProps} ww={ww} isTouchDevice={isTouchDevice} />
        {loading && <LoadingIndicator showBg fixed />}
      </Layout>
    </>
  );
}
