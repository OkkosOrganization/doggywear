import { useEffect, useState } from 'react';
import styles from '../styles/RelatedProducts.module.css';
import scrollerStyles from './SharedScroller.module.css';
import { ProductCard } from './ProductCard';

type RelatedProductsProps = {
  products: any[];
  filterByTag?: string;
  isMobile: boolean;
  randomOrder?: boolean;
};
export const RelatedProducts = ({
  products,
  filterByTag,
  randomOrder,
}: RelatedProductsProps) => {
  const [randomized, setRandomized] = useState<any[]>(products);

  useEffect(() => {
    if (randomOrder)
      setRandomized(products.sort((a, b) => 0.5 - Math.random()));
  }, [randomOrder, products]);

  if (!products) return null;
  const items = randomized.map((p, pindex) => {
    return (
      <div
        className={scrollerStyles.scrollerItem}
        key={'RelatedProduct_' + p.uid}
      >
        <div className={scrollerStyles.scrollerItemInner}>
          <ProductCard
            data={p}
            showMultipleImages={false}
            loadImagesEager={false}
            sizes={'(max-width: 768px) 100vw, 25vw'}
          />
        </div>
      </div>
    );
  });

  return (
    <div className={styles.relatedProducts}>
      {items.length ? (
        <>
          <h3 className={styles.title}>You might also like</h3>
          <div className={scrollerStyles.scroller}>{items}</div>
        </>
      ) : null}
    </div>
  );
};
