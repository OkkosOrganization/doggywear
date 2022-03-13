import Head from 'next/head';
import { RichText } from 'prismic-reactjs';
import { apiEndPoint, Prismic } from '../config/prismic';
import Masonry from 'react-masonry-css';
import styles from '../styles/FrontPage.module.scss';
import { BASE_URL, TITLE, TWITTER_HANDLE } from '../config/env';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { ProductCard } from '../components/ProductCard';
import { IllustrationCard } from '../components/IllustrationCard';
import gsap from 'gsap';
import { PrintsSection } from '../components/PrintsSection';

export const getStaticProps = async ({ req, locale }) => {
  let products: unknown = null;
  let illustrations: unknown = null;
  let frontpage: unknown = null;
  try {
    const prismicApi = await Prismic.getApi(apiEndPoint, { req: req });
    products = await prismicApi.query(
      Prismic.Predicates.at('document.type', 'product'),
      {
        pageSize: 999,
      }
    );
    illustrations = await prismicApi.query(
      Prismic.Predicates.at('document.type', 'illustration'),
      {
        pageSize: 999,
      }
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

type InstaJson = {
  data?: any[];
};

const Frontpage = ({ products, illustrations, frontpage, ww }) => {
  const [feed, setFeed] = useState<InstaJson | null>(null);
  const [revealed, setRevealed] = useState<boolean>(false);
  const grid = useRef(null);
  const isMobile = ww <= 768;

  const InstaFeed = dynamic(() => import('../components/InstaFeed'), {
    suspense: false,
  });

  useEffect(() => {
    //FETCH INSTA FEED
    const getFeed = async () => {
      try {
        const res = await fetch('/api/insta/feed');
        const json = (await res.json()) as InstaJson;
        setFeed(json);
      } catch (e) {
        console.log(e);
      }
    };
    getFeed();

    //REVEAL GRID
    gsap.to(grid.current, {
      autoAlpha: 1,
      duration: 0.2,
      onComplete: () => {
        setRevealed(true);
      },
    });
  }, []);

  const renderHead = (data: any) => {
    const title = `${TITLE} - Home`;
    const description = data?.description[0]?.text;
    //let fbAppId = process.env.FB_APP_ID;
    const ogUrl = `${BASE_URL}`;
    const ogImg = `${data.share_image.url}`;
    const twitterHandle = TWITTER_HANDLE;

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

        {twitterHandle && (
          <>
            <meta name="twitter:site" content={twitterHandle} />
            <meta name="twitter:creator" content={twitterHandle} />
          </>
        )}
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

  return (
    <div className={styles.container}>
      {renderHead(frontpage.data)}
      <h1 className={'hidden'}>{frontpage.data?.title[0]?.text}</h1>

      <div className={styles.description}>
        <RichText render={frontpage.data?.description} />
      </div>

      <div className={styles.grid} ref={grid}>
        <Masonry
          breakpointCols={columns}
          className={styles.masonryGrid}
          columnClassName={styles.masonryGridColumn}
        >
          {frontpage.data.items.map((i, index) => {
            const item = i.item;
            const id = item.id;
            const type = item.type;
            const loadImagesEager = index < (isMobile ? 1 : 4);

            if (type === 'product') {
              const data = products.results.filter((p) => p.id === id)[0];
              return (
                <ProductCard
                  key={'product_' + index}
                  data={data}
                  showMultipleImages
                  loadImagesEager={loadImagesEager}
                />
              );
            } else if (type === 'illustration') {
              const data = illustrations.results.filter((p) => p.id === id)[0];
              return (
                <IllustrationCard
                  key={'illustration_' + index}
                  data={data}
                  loadImagesEager={loadImagesEager}
                />
              );
            } else return null;
          })}
        </Masonry>
      </div>

      <PrintsSection
        title={frontpage.data.secondary_title[0]?.text}
        description={frontpage.data.secondary_description}
        scrollerLimit={8}
        items={frontpage.data.secondary_items.map((i) => {
          const data = products.results.filter((p) => p.id === i.item.id)[0];
          return data;
        })}
      />

      <InstaFeed
        title={frontpage?.data?.instagram_title[0]?.text}
        feed={feed}
      />
    </div>
  );
};
export default Frontpage;
