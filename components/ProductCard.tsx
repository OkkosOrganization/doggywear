import { useState } from 'react';
import { CURRENCY } from '../config/env';
import styles from '../styles/ProductCard.module.scss';
import Image from 'next/image';
import Link from 'next/link';

type ProductCardProps = {
  data: any;
  isMobile: boolean;
  mouseEnterHandler: (e) => void;
  mouseLeaveHandler: (e) => void;
};
export const ProductCard = (props: ProductCardProps): JSX.Element => {
  const price = props.data?.data?.shopify?.variants[0]?.price;
  const title = props.data?.data?.title[0]?.text;
  const primaryImage = props.data?.data?.primary_image;
  const secondaryImage = props.data?.data?.secondary_image;
  const hasImages = primaryImage.url && secondaryImage.url;

  const [image, setImage] = useState(primaryImage.url);

  const flipImage = () => {
    if (primaryImage.url && secondaryImage.url) {
      if (image === secondaryImage.url) setImage(primaryImage.url);
      else setImage(secondaryImage.url);
    }
  };

  return (
    <div className={`${styles.product} gridItem`} id={props.data.id}>
      <div
        className={`
          ${styles.productImage}        
          ${hasImages ? styles.hasImages : ''}
        `}
        onClick={flipImage}
        onMouseEnter={() => {
          props.mouseEnterHandler(props.data.id);
        }}
        onMouseLeave={() => {
          props.mouseLeaveHandler(props.data.id);
        }}
      >
        {primaryImage.url && (
          <div className={image === primaryImage.url ? '' : styles.hiddenImage}>
            <Image
              src={primaryImage.url}
              width={primaryImage.dimensions?.width}
              height={primaryImage.dimensions?.height}
              layout="responsive"
              alt="Primary product image"
            />
          </div>
        )}

        {secondaryImage.url && (
          <div
            className={image === secondaryImage.url ? '' : styles.hiddenImage}
          >
            <Image
              src={secondaryImage.url}
              width={secondaryImage.dimensions?.width}
              height={secondaryImage.dimensions?.height}
              layout="responsive"
              alt="Secondary product image"
            />
          </div>
        )}
      </div>
      <div className={`${styles.pager} ${!hasImages ? 'hidden' : ''} pager`}>
        <span
          className={`${styles.pagerItem} ${
            image === primaryImage.url ? styles.active : ''
          }`}
        ></span>
        <span
          className={`${styles.pagerItem} ${
            image === secondaryImage.url ? styles.active : ''
          }`}
        ></span>
      </div>
      <div>
        <h2 className={styles.productTitle}>{title}</h2>
        <h4 className={styles.sizeOptions}>
          {props.data.data.shopify.options[0].values.map((o, oIndex) => {
            return (
              <span className={styles.sizeOption} key={`sizeOption_${oIndex}`}>
                {o}
              </span>
            );
          })}
        </h4>
        <h3 className={styles.productPrice}>
          {Number(price).toFixed(0) + CURRENCY}
        </h3>
        <Link href={`/product/${props.data.uid}`} passHref>
          <button>{`Shop now`}</button>
        </Link>
      </div>
    </div>
  );
};
