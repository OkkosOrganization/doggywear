import { useState } from 'react';
import { CURRENCY } from '../config/env';
import styles from '../styles/ProductCard.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslation } from '../config/translations';

type ProductCardProps = {
  data: any;
  showMultipleImages: boolean;
};
export const ProductCard = (props: ProductCardProps): JSX.Element => {
  const price = props.data?.data?.shopify?.variants[0]?.price;
  const title = props.data?.data?.title[0]?.text;
  const primaryImage = props.data?.data?.primary_image;
  const secondaryImage = props.data?.data?.secondary_image;
  const hasImages =
    props.showMultipleImages && primaryImage?.url && secondaryImage?.url;
  const isPoster = props.data?.tags.includes('poster');
  const id = props?.data?.id;
  const uid = props?.data?.uid;
  const productUrl = `/product/${uid}`;

  const [image, setImage] = useState(primaryImage?.url);

  const flipImage = () => {
    if (primaryImage.url && secondaryImage.url) {
      if (image === secondaryImage.url) setImage(primaryImage.url);
      else setImage(secondaryImage.url);
    }
  };

  if (!id) {
    console.log(props.data);
    return null;
  }

  return (
    <div className={`${styles.product} gridItem`} id={props.data.id}>
      <div
        className={`
          ${styles.productImage}     
          ${isPoster ? styles.showShadow : ''}   
          ${hasImages ? styles.hasImages : styles.hideSecondaryImage}
        `}
        onMouseEnter={() => {
          if (props.showMultipleImages) flipImage();
        }}
        onMouseLeave={() => {
          if (props.showMultipleImages) flipImage();
        }}
      >
        {primaryImage.url && (
          <div
            className={`${
              image === primaryImage.url ? '' : styles.hiddenImage
            } `}
          >
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
      <div className={`${styles.pager} ${!hasImages ? styles.hide : ''} pager`}>
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
        <Link href={productUrl}>
          <a>
            <h2 className={styles.productTitle}>{title}</h2>
          </a>
        </Link>
        {props.data.data.shopify &&
          props.data.data.shopify.options[0].values.length > 1 && (
            <h3 className={styles.sizeOptions}>
              {props.data.data.shopify.options[0].values.map((o, oIndex) => {
                return (
                  <span
                    className={styles.sizeOption}
                    key={`sizeOption_${oIndex}`}
                  >
                    {o}
                  </span>
                );
              })}
            </h3>
          )}

        <h4 className={styles.productPrice}>
          {Number(price).toFixed(0) + CURRENCY}
        </h4>

        <Link href={productUrl} passHref>
          <button
            className={styles.shopNowBtn}
            role={'button'}
            aria-label={getTranslation('SHOP_NOW')}
          >
            {getTranslation('SHOP_NOW')}
          </button>
        </Link>
      </div>
    </div>
  );
};
