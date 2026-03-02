import { useState } from 'react';
import { CURRENCY } from '../config/env';
import styles from '../styles/ProductCard.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslation } from '../config/translations';

type ProductCardProps = {
  data: any;
  showMultipleImages: boolean;
  loadImagesEager?: boolean;
  sizes: string;
};
export const ProductCard = (props: ProductCardProps) => {
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
  const [primaryImageLoaded, setPrimaryImageLoaded] = useState<boolean>(false);
  const [secondaryImageLoaded, setSecondaryImageLoaded] =
    useState<boolean>(false);

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
      <Link
        href={productUrl}
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
              style={{ width: '100%', height: 'auto' }}
              alt="Primary product image"
              priority={props.loadImagesEager}
              className={primaryImageLoaded ? styles.loaded : styles.loading}
              onLoad={() => setPrimaryImageLoaded(true)}
              sizes={props.sizes}
              quality={90}
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
              style={{ width: '100%', height: 'auto' }}
              alt="Secondary product image"
              priority={props.loadImagesEager}
              className={secondaryImageLoaded ? styles.loaded : styles.loading}
              onLoad={() => setSecondaryImageLoaded(true)}
              sizes={props.sizes}
            />
          </div>
        )}
      </Link>
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
        <Link href={productUrl} legacyBehavior={false}>
          <h2 className={styles.productTitle} style={{ cursor: 'pointer' }}>
            {title}
          </h2>
        </Link>
        {props.data.data.shopify &&
          props.data.data.shopify.options?.[0]?.values?.length > 1 && (
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
          {price && Number(price).toFixed(0) + CURRENCY}
        </h4>

        <Link href={productUrl} legacyBehavior={false}>
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
