import Head from 'next/head';
import {RichText} from 'prismic-reactjs';
import { apiEndPoint, Prismic } from '../config/prismic';
import Masonry from 'react-masonry-css'
import styles from "../sass/Frontpage.module.scss";
import { BASE_URL, DESCRIPTION, TITLE, TWITTER_HANDLE, OG_IMG, CURRENCY } from '../config/env';
import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {gsap} from 'gsap';

export const getStaticProps = async ({req, locale}) => {
  let products:null | {} = null;
  let illustrations:null | {} = null;
  let frontpage:null | {} = null;
  try { 
    const prismicApi = await Prismic.getApi(apiEndPoint, {req:req});
    products = await prismicApi.query(
      Prismic.Predicates.at('document.type', 'product')
    );
    illustrations = await prismicApi.query(
      Prismic.Predicates.at('document.type', 'illustration')
    ); 
    frontpage = await prismicApi.getSingle('front-page');        
  }
  catch (e) {
    console.log(e);
  }

  return {
    props:
    {
      products: products ? products : null
      , illustrations: illustrations ? illustrations : null
      , frontpage: frontpage ? frontpage : null
      , locale: locale
    },
    revalidate: 1
  };
}

const Frontpage = ({products, illustrations, frontpage}) => {

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

  useEffect(() => {

  }, []);

  console.log(products,illustrations,frontpage);

  const columns = {
    default: 4,
    1280: 3,
    768: 2,
    320: 1
  };

  const mouseEnterHandler = (id:string) => {
    let selector = `.gridItem:not(#${id})`; 
    gsap.to(selector, {blur:10, autoAlpha:.5, duration:.3});    
  };
  const mouseLeaveHandler = (id:string) => {
    let items = document.querySelectorAll('.gridItem');
    gsap.to(items, {blur:0, autoAlpha:1, duration:.3});
  };

  return (
    <div className={styles.container}>
      {renderHead()}
      <div className={styles.grid}>
        
        <h1 className={"hidden"}>{frontpage.data?.title[0]?.text}</h1>    

        <Masonry
          breakpointCols={columns}
          className={styles.masonryGrid}
          columnClassName={styles.masonryGridColumn}
        >
        {
          frontpage.data.items.map((i, index) => {
            const item = i.item;
            const id = item.id;
            const type = item.type;
            
            if(type === 'product')
            {
              let data = products.results.filter((p) => p.id === id)[0];
              return <ProductCard 
                key={'product_' + index}
                data={data} 
                mouseEnterHandler={mouseEnterHandler}
                mouseLeaveHandler={mouseLeaveHandler}
              />
            }
            else if(type === 'illustration')
            {
              let data = illustrations.results.filter((p) => p.id === id)[0];
              return <IllustrationCard 
                  key={'illustration_' + index}
                  data={data}                
                  mouseEnterHandler={mouseEnterHandler}
                  mouseLeaveHandler={mouseLeaveHandler}
                />
            }
            else
              return null;
          })
        }           
        </Masonry>

        <div className={styles.description}>
          <RichText render={frontpage.data?.description} />
        </div>
 
      </div>
    </div>
  );
}
export default Frontpage;

type IllustrationCardProps = {
  data:any;
  mouseEnterHandler:(e) => void;
  mouseLeaveHandler:(e) => void;
};
const IllustrationCard = (props:IllustrationCardProps):JSX.Element => {
  console.log(props.data.id);
  return (
    <div 
      className={`${styles.illustration} gridItem`}
      id={props.data.id}
      onMouseEnter={() => props.mouseEnterHandler(props.data.id)} 
      onMouseLeave={() => props.mouseLeaveHandler(props.data.id)} 
    >
      <Image 
        src={props.data?.data?.image?.url}
        layout='responsive'
        width={props.data?.data?.image?.dimensions?.width}
        height={props.data?.data?.image?.dimensions?.height}
      />
    </div>
  );
};

type ProductCardProps = {
  data:any;
  mouseEnterHandler:(e) => void;
  mouseLeaveHandler:(e) => void;
};
const ProductCard = (props:ProductCardProps):JSX.Element => {
  const price = props.data?.data?.shopify?.variants[0]?.price;
  const title = props.data?.data?.title[0]?.text;
  
  return (
    <div 
      className={`${styles.product} gridItem`} 
      id={props.data.id}
      onMouseEnter={() => props.mouseEnterHandler(props.data.id)} 
      onMouseLeave={() => props.mouseLeaveHandler(props.data.id)} 
    >
      <div className={styles.productImage}>
        <Image 
          src={props.data?.data?.primary_image?.url}
          width={props.data?.data?.primary_image?.dimensions?.width}
          height={props.data?.data?.primary_image?.dimensions?.height}
          layout='responsive'
        />
      </div>
      <div>
        <h2 className={styles.productTitle}>{title}</h2>
        <h3 className={styles.productPrice}>{Number(price).toFixed(0)}{CURRENCY}</h3>
        <Link href={`/product/${props.data.data.uid}`}>
          <button>
            {'Shop now'}
          </button>
        </Link>
      </div>
    </div>
  );
};