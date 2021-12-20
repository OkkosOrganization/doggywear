import Script from 'next/script'
import Layout from '../components/Layout';
import "../sass/style.scss";
import { GOOGLE_ANALYTICS } from '../config/env';

export default function DoggyApp({ Component, pageProps }) {

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS}`}
        id='analytics'
        strategy='afterInteractive'
      />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}