import { RichText, RichTextBlock } from 'prismic-reactjs';
import { useRef, useState } from 'react';
import { getTranslation } from '../config/translations';
import styles from '../styles/PrintsSection.module.scss';
import { ProductCard } from './ProductCard';
import gsap from 'gsap';
import ScrollToPlugin from 'gsap/dist/ScrollToPlugin';
gsap.registerPlugin(ScrollToPlugin);

type PrintsProduct = {
  uid: string;
};

type PrintsSectionProps = {
  title: string;
  description: RichTextBlock[];
  items: PrintsProduct[];
  scrollerLimit: number;
};

type DisplayMode = 'scroller' | 'grid';

export const PrintsSection = ({
  title,
  description,
  items,
  scrollerLimit = 8,
}: PrintsSectionProps): JSX.Element => {
  const [mode, setMode] = useState<DisplayMode>('scroller');
  const prints = useRef(null);
  const toggleMode = () => {
    //const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    setMode(mode === 'scroller' ? 'grid' : 'scroller');
    gsap.to(window, {
      scrollTo: { y: prints.current, offsetY: 0 },
      duration: 0.1,
    });
  };

  return (
    <div className={styles.container} ref={prints}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.description}>
        <RichText render={description} />
      </div>
      <div className={mode === 'scroller' ? styles.scroller : styles.grid}>
        {items
          .slice(0, mode === 'scroller' ? scrollerLimit : items.length)
          .map((i, index) => {
            return (
              <div
                className={
                  mode === 'scroller' ? styles.scrollerItem : styles.gridItem
                }
                key={'PrintProductContainer_' + i?.uid}
              >
                <div
                  className={
                    mode === 'scroller'
                      ? styles.scrollerItemInner
                      : styles.gridItemInner
                  }
                >
                  <ProductCard
                    key={`printProductItem_${index}`}
                    data={i}
                    showMultipleImages={false}
                  />
                </div>
              </div>
            );
          })}
      </div>
      <button onClick={toggleMode} role={'button'}>
        {getTranslation(mode === 'scroller' ? 'SHOW_ALL' : 'SHOW_LESS')}
      </button>
    </div>
  );
};
