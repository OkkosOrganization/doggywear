import styles from '../styles/RelatedProducts.module.scss';
import { ProductCard } from './ProductCard';

type RelatedProductsProps = {
  products: any[];
  exclude?: string;
  filterByTag?: string;
  isMobile: boolean;
};
export const RelatedProducts = ({
  products,
  exclude,
  filterByTag,
}: RelatedProductsProps): JSX.Element => {
  if (!products) return null;

  return (
    <div className={styles.relatedProducts}>
      <h3 className={styles.title}>You might also like</h3>
      <div className={styles.scroller}>
        {products
          .filter((p) => {
            return p.uid !== exclude;
          })
          .filter((p) => {
            return p.tags.includes(filterByTag);
          })
          .map((p, pindex) => {
            return (
              <div
                className={styles.scrollerItem}
                key={'RelatedProduct_' + p.uid}
              >
                <div className={styles.scrollerItemInner}>
                  <ProductCard data={p} showMultipleImages={false} />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
