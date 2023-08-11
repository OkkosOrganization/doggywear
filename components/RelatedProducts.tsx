import { useEffect, useState } from 'react';
import styles from '../styles/RelatedProducts.module.scss';
import { ProductCard } from './ProductCard';

type RelatedProductsProps = {
  products: any[];
  exclude?: string;
  filterByTag?: string;
  isMobile: boolean;
  randomOrder?: boolean;
};
export const RelatedProducts = ({
  products,
  exclude,
  filterByTag,
  randomOrder,
}: RelatedProductsProps): JSX.Element => {
  const [randomized, setRandomized] = useState<any[]>(products);

  useEffect(() => {
    if (randomOrder)
      setRandomized(products.sort((a, b) => 0.5 - Math.random()));
  }, [randomOrder, products]);

  if (!products) return null;
  const items = randomized
    .filter((p) => {
      return p.uid !== exclude;
    })
    .filter((p) => {
      return p.tags.includes(filterByTag);
    })
    .map((p, pindex) => {
      return (
        <div className={styles.scrollerItem} key={'RelatedProduct_' + p.uid}>
          <div className={styles.scrollerItemInner}>
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
          <div className={styles.scroller}>{items}</div>
        </>
      ) : null}
    </div>
  );
};
