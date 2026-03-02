import { PrismicRichText } from '@prismicio/react';
import { useRef, useState } from 'react';
import { getTranslation } from '../config/translations';
import styles from '../styles/PrintsSection.module.css';
import scrollerStyles from './SharedScroller.module.css';
import { ProductCard } from './ProductCard';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Masonry from 'react-masonry-css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollToPlugin);
}

type PrintsProduct = {
  uid: string;
};

type PrintsSectionProps = {
  title: string;
  description: any;
  items: PrintsProduct[];
  scrollerLimit?: number;
};

type DisplayMode = 'scroller' | 'grid' | 'masonry';

export const PrintsSection = ({
  title,
  description,
  items,
  scrollerLimit = 8,
}: PrintsSectionProps) => {
  const [mode, setMode] = useState<DisplayMode>('masonry');
  const prints = useRef(null);

  const columns = {
    default: 4,
    1280: 3,
    768: 1,
  };

  return (
    <div
      className={`${styles.container} ${
        mode == 'scroller' ? '' : styles.gridContainer
      }`}
      ref={prints}
    >
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.description}>
        <PrismicRichText field={description} />
      </div>

      {mode === 'masonry' ? (
        <Masonry
          breakpointCols={columns}
          className={styles.masonryGrid}
          columnClassName={styles.masonryGridColumn}
        >
          {items.map((i, index) => {
            return (
              <ProductCard
                key={`printProductItem_${index}`}
                data={i}
                showMultipleImages={false}
                sizes={
                  '(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw'
                }
              />
            );
          })}
        </Masonry>
      ) : (
        <div
          className={
            mode === 'scroller' ? scrollerStyles.scroller : styles.grid
          }
        >
          {items
            .slice(0, mode === 'scroller' ? scrollerLimit : items.length)
            .map((i, index) => {
              return (
                <div
                  className={
                    mode === 'scroller'
                      ? scrollerStyles.scrollerItem
                      : styles.gridItem
                  }
                  key={'PrintProductContainer_' + i?.uid}
                >
                  <div
                    className={
                      mode === 'scroller'
                        ? scrollerStyles.scrollerItemInner
                        : styles.gridItemInner
                    }
                  >
                    <ProductCard
                      key={`printProductItem_${index}`}
                      data={i}
                      showMultipleImages={false}
                      sizes={
                        '(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw'
                      }
                    />
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};
