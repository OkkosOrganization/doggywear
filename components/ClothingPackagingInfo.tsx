import { isFilled } from '@prismicio/client';
import {
  ShippingAndPackagingInfoDocumentData,
  Simplify,
} from '../prismicio-types';
import styles from '../styles/ClothingPackagingInfo.module.css';
import { PrismicNextImage } from '@prismicio/next';
import { PrismicRichText } from '@prismicio/react';

type ClothingPackagingInfoProps = {
  data: Simplify<ShippingAndPackagingInfoDocumentData>;
};
export const ClothingPackagingInfo = ({ data }: ClothingPackagingInfoProps) => {
  return (
    <div className={styles.packageInfo}>
      {isFilled.keyText(data.title) && (
        <h2 className={styles.title}>{data.title}</h2>
      )}

      {isFilled.richText(data.content) && (
        <div>
          <PrismicRichText field={data.content} />
        </div>
      )}

      {isFilled.group(data.images) && (
        <div className={styles.packageImages}>
          {data.images.map(
            (image, index) =>
              isFilled.image(image.image) && (
                <div key={index} className={styles.packageImage}>
                  <PrismicNextImage
                    field={image.image}
                    style={{ width: '100%', height: 'auto' }}
                    fallbackAlt={`Packaging image ${index + 1}`}
                  />
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};
