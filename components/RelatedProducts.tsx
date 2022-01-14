import { useEffect } from 'react';
import styles from '../styles/RelatedProducts.module.scss';
import productStyles from '../styles/FrontPage.module.scss';
import { ProductCard } from './ProductCard';
import { gsap } from 'gsap';

type RelatedProductsProps = {
  products: any;
  exclude?: string;
  isMobile: boolean;
};
export const RelatedProducts = ({
  products,
  exclude,
  isMobile,
}: RelatedProductsProps): JSX.Element => {
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

  if (!products) return null;

  return (
    <div className={styles.relatedProducts}>
      <h3 className={styles.title}>You might also like</h3>
      <div className={styles.scroller}>
        {products
          .filter((p) => {
            return p.uid !== exclude;
          })
          .map((p, pindex) => {
            return (
              <ProductCard
                key={'RelatedProduct_' + pindex}
                data={p}
                mouseEnterHandler={mouseEnterHandler}
                mouseLeaveHandler={mouseLeaveHandler}
                isMobile={isMobile}
              />
            );
          })}
      </div>
    </div>
  );
};
