import Head from 'next/head';
import { RichText } from 'prismic-reactjs';
import { apiEndPoint, Prismic } from '../config/prismic';
import Masonry from 'react-masonry-css';
import styles from '../styles/FrontPage.module.scss';
import {
  BASE_URL,
  DESCRIPTION,
  TITLE,
  TWITTER_HANDLE,
  OG_IMG,
} from '../config/env';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ProductCard } from '../components/ProductCard';

export const getStaticProps = async ({ req, locale }) => {
  let products: unknown = null;
  let illustrations: unknown = null;
  let frontpage: unknown = null;
  try {
    const prismicApi = await Prismic.getApi(apiEndPoint, { req: req });
    products = await prismicApi.query(
      Prismic.Predicates.at('document.type', 'product')
    );
    illustrations = await prismicApi.query(
      Prismic.Predicates.at('document.type', 'illustration')
    );
    frontpage = await prismicApi.getSingle('front-page');
  } catch (e) {
    console.log(e);
  }

  return {
    props: {
      products: products ? products : null,
      illustrations: illustrations ? illustrations : null,
      frontpage: frontpage ? frontpage : null,
      locale: locale,
    },
    revalidate: 1,
  };
};

const Frontpage = ({ products, illustrations, frontpage, ww }) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const InstaFeed = dynamic(() => import('../components/InstaFeed'), {
    suspense: false,
  });

  useEffect(() => {
    const isTouchDevice = () => {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
      );
    };
    if (ww < 768 && isTouchDevice()) setIsMobile(true);
  }, [ww]);

  const renderHead = () => {
    const title = `${TITLE} - Products`;
    const description = DESCRIPTION;
    //let fbAppId = process.env.FB_APP_ID;
    const ogUrl = `${BASE_URL}`;
    const ogImg = `${OG_IMG}`;
    const twitterHandle = `${TWITTER_HANDLE}`;

    return (
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:image" content={ogImg} />
        <meta property="og:image:width" content={'1200'} />
        <meta property="og:image:height" content={'630'} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={twitterHandle} />
        <meta name="twitter:creator" content={twitterHandle} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImg} />
      </Head>
    );
  };

  const columns = {
    default: 4,
    1280: 3,
    768: 1,
  };

  const mouseEnterHandler = (id: string) => {
    if (!isMobile) {
      //BLUR ALL OTHERS BUT THIS ITEM
      const selector = `.gridItem:not(#${id})`;
      gsap.to(selector, { filter: 'blur(2px)', autoAlpha: 0.5, duration: 0.3 });
    }
  };

  const mouseLeaveHandler = () => {
    const items = document.querySelectorAll('.gridItem');
    gsap.to(items, { filter: 'blur(0px)', autoAlpha: 1, duration: 0.3 });
  };

  return (
    <div className={styles.container}>
      {renderHead()}
      <h1 className={'hidden'}>{frontpage.data?.title[0]?.text}</h1>

      <div className={styles.description}>
        <RichText render={frontpage.data?.description} />
      </div>

      <div className={styles.grid}>
        <Masonry
          breakpointCols={columns}
          className={styles.masonryGrid}
          columnClassName={styles.masonryGridColumn}
        >
          {frontpage.data.items.map((i, index) => {
            const item = i.item;
            const id = item.id;
            const type = item.type;

            if (type === 'product') {
              const data = products.results.filter((p) => p.id === id)[0];
              return (
                <ProductCard
                  key={'product_' + index}
                  data={data}
                  isMobile={isMobile}
                  mouseEnterHandler={mouseEnterHandler}
                  mouseLeaveHandler={mouseLeaveHandler}
                />
              );
            } else if (type === 'illustration') {
              const data = illustrations.results.filter((p) => p.id === id)[0];
              return (
                <IllustrationCard
                  key={'illustration_' + index}
                  data={data}
                  mouseEnterHandler={mouseEnterHandler}
                  mouseLeaveHandler={mouseLeaveHandler}
                />
              );
            } else return null;
          })}
        </Masonry>
      </div>
      <InstaFeed />
    </div>
  );
};
export default Frontpage;

type IllustrationCardProps = {
  data: any;
  mouseEnterHandler: (e) => void;
  mouseLeaveHandler: (e) => void;
};
const IllustrationCard = (props: IllustrationCardProps): JSX.Element => {
  return (
    <div
      className={`${styles.illustration} gridItem`}
      id={props.data.id}
      onMouseEnter={() => null} //props.mouseEnterHandler(props.data.id)}
      onMouseLeave={() => null} //props.mouseLeaveHandler(props.data.id)}
    >
      <Image
        src={props.data?.data?.image?.url}
        layout="responsive"
        width={props.data?.data?.image?.dimensions?.width}
        height={props.data?.data?.image?.dimensions?.height}
        alt={'Illustration image'}
      />
    </div>
  );
};
