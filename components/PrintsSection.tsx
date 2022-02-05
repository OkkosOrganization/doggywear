import { RichText, RichTextBlock } from 'prismic-reactjs';
import styles from '../styles/PrintsSection.module.scss';
import { ProductCard } from './ProductCard';

type PrintsProduct = {
  uid: string;
};

type PrintsSectionProps = {
  title: string;
  description: RichTextBlock[];
  items: PrintsProduct[];
};

export const PrintsSection = (props: PrintsSectionProps): JSX.Element => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{props.title}</h2>
      <div className={styles.description}>
        <RichText render={props.description} />
      </div>
      <div className={styles.scroller}>
        {props.items.map((i, index) => {
          return (
            <div
              className={styles.scrollerItem}
              key={'RelatedProduct_' + i.uid}
            >
              <div className={styles.scrollerItemInner}>
                <ProductCard
                  key={`printItem_${index}`}
                  data={i}
                  mouseEnterHandler={() => null}
                  mouseLeaveHandler={() => null}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
