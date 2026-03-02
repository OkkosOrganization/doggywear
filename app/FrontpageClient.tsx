'use client';

import Masonry from 'react-masonry-css';
import styles from '../styles/FrontPage.module.css';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { ProductCard } from '../components/ProductCard';
import { IllustrationCard } from '../components/IllustrationCard';
import gsap from 'gsap';
import { PrismicRichText } from '@prismicio/react';
import { useWindowSize } from '../hooks/useWindowSize';

type InstaJson = {
  data?: any[];
};

export default function FrontpageClient({
  products,
  illustrations,
  frontpage,
}) {
  const [feed, setFeed] = useState<InstaJson | null>(null);
  const [, setRevealed] = useState<boolean>(false);
  const grid = useRef(null);
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  const InstaFeed = dynamic(() => import('../components/InstaFeed'), {});

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
    //getFeed();

    //REVEAL GRID
    gsap.to(grid.current, {
      autoAlpha: 1,
      duration: 0.2,
      onComplete: () => {
        setRevealed(true);
      },
    });
  }, []);

  const columns = {
    default: 4,
    1280: 3,
    960: 2,
    640: 1,
  };

  return (
    <div className={styles.container}>
      <h1 className={'hidden'}>{frontpage.data?.title[0]?.text}</h1>

      <div className={styles.description}>
        <PrismicRichText field={frontpage.data?.description} />
      </div>

      <div className={styles.grid} ref={grid}>
        <Masonry
          breakpointCols={columns}
          className={styles.masonryGrid}
          columnClassName={styles.masonryGridColumn}
        >
          {frontpage.data.items.map((i: any, index: number) => {
            const item = i.item; // @prismicio/client v7 typings might handle this differently, but keeping logic
            const id = item.id;
            const type = item.type;
            const loadImagesEager = index < (isMobile ? 1 : 4);

            if (type === 'product') {
              const data = products.results.filter((p: any) => p.id === id)[0];
              if (!data) return null;
              return (
                <ProductCard
                  key={'product_' + index}
                  data={data}
                  showMultipleImages
                  loadImagesEager={loadImagesEager}
                  sizes={
                    '(max-width: 40rem) 100vw, (max-width: 1280px) 33vw, 25vw'
                  }
                />
              );
            } else if (type === 'illustration') {
              const data = illustrations.results.filter(
                (p: any) => p.id === id
              )[0];
              if (!data) return null;
              return (
                <IllustrationCard
                  key={'illustration_' + index}
                  data={data}
                  loadImagesEager={loadImagesEager}
                  sizes={
                    '(max-width: 40rem) 100vw, (max-width: 1280px) 33vw, 25vw'
                  }
                />
              );
            } else return null;
          })}
        </Masonry>
      </div>

      {false && (
        <InstaFeed
          title={frontpage?.data?.instagram_title[0]?.text}
          feed={feed || undefined}
        />
      )}
    </div>
  );
}
