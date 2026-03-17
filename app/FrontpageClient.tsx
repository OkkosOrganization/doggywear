'use client';

import Masonry from 'react-masonry-css';
import styles from '../styles/FrontPage.module.css';
import { useRef, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { IllustrationCard } from '../components/IllustrationCard';
import { PrismicRichText } from '@prismicio/react';
import { useWindowSize } from '../hooks/useWindowSize';
import {
  FrontpageDocument,
  IllustrationDocument,
  ProductDocument,
} from '../prismicio-types';
import { Query } from '@prismicio/client';

export default function FrontpageClient({
  products,
  illustrations,
  frontpage,
}: {
  products: Query<ProductDocument>;
  illustrations: Query<IllustrationDocument>;
  frontpage: FrontpageDocument<string>;
}) {
  const [, setRevealed] = useState<boolean>(false);
  const grid = useRef(null);
  const { width } = useWindowSize();
  const isMobile = width <= 640;
  const columns = {
    default: 4,
    1280: 3,
    960: 2,
    640: 1,
  };

  return (
    <div className={styles.container}>
      <h1 className={'hidden'}>{}</h1>

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
            const data =
              i.product.id !== undefined ? i.product : i.illustration;
            const { id, type } = data;
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
                    '(max-width: 40rem) 90vw, (max-width: 1280px) 30vw, 20vw'
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
                    '(max-width: 40rem) 90vw, (max-width: 1280px) 30vw, 20vw'
                  }
                />
              );
            } else return null;
          })}
        </Masonry>
      </div>
    </div>
  );
}
