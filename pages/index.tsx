import Head from 'next/head'
import { apiEndPoint, Prismic } from '../config/prismic';
import styles from "../sass/Frontpage.module.scss";
import { BASE_URL, DESCRIPTION, TITLE, TWITTER_HANDLE, OG_IMG } from '../config/env';

export const getStaticProps = async ({req, locale}) => {
  let products:null | {} = null;
  let productList:null | {} = null;
  try { 
    const prismicApi = await Prismic.getApi(apiEndPoint, {req:req});
    products = await prismicApi.query(
      Prismic.Predicates.at('document.type', 'product')
    );
    productList = await prismicApi.getSingle('productlist');
  }
  catch (e) {
    console.log(e);
  }

  return {
    props:
    {
      products: products ? products : null
      , productList: productList ? productList : null
      , locale: locale
    },
    revalidate: 1
  };
}

const Frontpage = (props) => {

  const renderHead = () => {

    let title = `${TITLE} - Products`;
    let description = DESCRIPTION;
    //let fbAppId = process.env.FB_APP_ID;
    let ogUrl = `${BASE_URL}`;
    let ogImg = `${OG_IMG}`;
    let twitterHandle = `${TWITTER_HANDLE}`;

    return (
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:image" content={ogImg} />
        <meta property="og:image:width" content={"1200"} />
        <meta property="og:image:height" content={"630"} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={twitterHandle} />
        <meta name="twitter:creator" content={twitterHandle} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImg} />
      </Head>
    );
  }

  return (
    <div className={styles.container}>
      {renderHead()}
      <div className={"products"}>
        <h1 className={styles.mainTitle}>Products grid here</h1>        
      </div>
    </div>
  );
}
export default Frontpage;