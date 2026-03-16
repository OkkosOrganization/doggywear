import { useEffect, useState } from 'react';
import { ProductCard } from './ProductCard';
import styles from '../styles/RelatedProducts.module.css';
import scrollerStyles from '../styles/SharedScroller.module.css';
import { ProductDocument } from '../prismicio-types';

type RelatedProductsProps = {
  products: ProductDocument<string>[];
  filterByTag?: string;
  randomOrder?: boolean;
};
export const RelatedProducts = ({
  products,
  filterByTag,
  randomOrder,
}: RelatedProductsProps) => {
  const [randomized, setRandomized] =
    useState<ProductDocument<string>[]>(products);

  useEffect(() => {
    if (randomOrder)
      setRandomized(products.sort((a, b) => 0.5 - Math.random()));
  }, [randomOrder, products]);

  if (!products || products.length === 0) return null;

  return (
    <div className={styles.relatedProducts}>
      <h3 className={styles.title}>You might also like</h3>
      <div className={scrollerStyles.scroller}>
        {randomized.map((p) => {
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
        })}
      </div>
    </div>
  );
};
