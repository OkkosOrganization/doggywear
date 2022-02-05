import styles from '../styles/RelatedProducts.module.scss';
import { ProductCard } from './ProductCard';
import { blurOthers, unBlur } from '../config/utils';

type RelatedProductsProps = {
  products: any;
  exclude?: string;
  filterByTag?: string;
  isMobile: boolean;
};
export const RelatedProducts = ({
  products,
  exclude,
  isMobile,
  filterByTag,
}: RelatedProductsProps): JSX.Element => {
  const mouseEnterHandler = (id: string) => {
    if (!isMobile) {
      const selector = `.gridItem:not(#${id})`;
      blurOthers(selector);
    }
  };

  const mouseLeaveHandler = () => {
    unBlur('.gridItem');
  };

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
                  <ProductCard
                    data={p}
                    mouseEnterHandler={mouseEnterHandler}
                    mouseLeaveHandler={mouseLeaveHandler}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
