import { useEffect, useRef, useState } from 'react';
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
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const cardRef = useRef<HTMLDivElement>(null);

  const markImageLoaded = (src?: string) => {
    if (!src) return;
    setLoadedImages((prev) => (prev[src] ? prev : { ...prev, [src]: true }));
  };

  useEffect(() => {
    const root = cardRef.current;
    if (!root) return;

    const candidates = [primaryImage?.url, secondaryImage?.url].filter(
      (url): url is string => Boolean(url)
    );

    const images = root.querySelectorAll<HTMLImageElement>('img');
    images.forEach((img) => {
      if (!img.complete) return;

      const src = img.currentSrc || img.src || '';
      candidates.forEach((origin) => {
        const encodedOrigin = encodeURIComponent(origin);
        if (src.includes(origin) || src.includes(encodedOrigin)) {
          markImageLoaded(origin);
        }
      });
    });
  }, [image, primaryImage?.url, secondaryImage?.url]);

  if (!id) {
    console.log(props.data);
    return null;
  }

  return (
    <div
      className={`${styles.product} gridItem ${
        loadedImages[primaryImage.url] ? styles.loaded : ''
      }`}
      id={props.data.id}
      ref={cardRef}
    >
      <Link
        href={productUrl}
        className={`
            ${styles.productImage}     
            ${isPoster ? styles.showShadow : ''}   
            ${hasImages ? styles.hasImages : styles.hideSecondaryImage}
          `}
        title={title}
      >
        {primaryImage?.url && (
          <div className={`${styles.imageLayer} ${styles.primaryLayer}`}>
            <Image
              src={primaryImage.url}
              width={primaryImage.dimensions?.width}
              height={primaryImage.dimensions?.height}
              style={{ width: '100%', height: 'auto' }}
              alt="Primary product image"
              priority={props.loadImagesEager}
              className={
                loadedImages[primaryImage.url] ? styles.loaded : styles.loading
              }
              data-origin={primaryImage.url}
              onLoad={() => markImageLoaded(primaryImage.url)}
              onError={() => markImageLoaded(primaryImage.url)}
              sizes={props.sizes}
              quality={70}
            />
          </div>
        )}

        {secondaryImage?.url && (
          <div
            className={`${styles.imageLayer} ${
              image === secondaryImage.url
                ? styles.visibleImage
                : styles.hiddenImage
            }`}
          >
            <Image
              src={secondaryImage.url}
              width={secondaryImage.dimensions?.width}
              height={secondaryImage.dimensions?.height}
              style={{ width: '100%', height: 'auto' }}
              alt="Secondary product image"
              priority={props.loadImagesEager}
              className={
                loadedImages[secondaryImage.url]
                  ? styles.loaded
                  : styles.loading
              }
              data-origin={secondaryImage.url}
              onLoad={() => markImageLoaded(secondaryImage.url)}
              onError={() => markImageLoaded(secondaryImage.url)}
              sizes={props.sizes}
              quality={70}
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
        <Link href={productUrl} title={title}>
          <h2 className={styles.productTitle} style={{ cursor: 'pointer' }}>
            {title}
          </h2>
        </Link>
        {props.data.data.shopify &&
          props.data.data.shopify.options?.[0]?.values?.length > 1 && (
            <h3 className={styles.sizeOptions}>
              {props.data.data.shopify.options[0].values.map(
                (o: string, oIndex: number) => {
                  return (
                    <span
                      className={styles.sizeOption}
                      key={`sizeOption_${oIndex}`}
                    >
                      {o}
                    </span>
                  );
                }
              )}
            </h3>
          )}

        <h4 className={styles.productPrice}>
          {price && Number(price).toFixed(0) + CURRENCY}
        </h4>

        <Link href={productUrl} title={title}>
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
