import Image from 'next/image';
import { useState } from 'react';
import styles from '../styles/IllustrationCard.module.scss';

type IllustrationCardProps = {
  data: any;
  loadImagesEager: boolean;
};
export const IllustrationCard = (props: IllustrationCardProps): JSX.Element => {
  const [primaryImageLoaded, setPrimaryImageLoaded] = useState<boolean>(false);

  return (
    <div className={`${styles.illustration} gridItem`} id={props.data.id}>
      <Image
        src={props.data?.data?.image?.url}
        layout="responsive"
        width={props.data?.data?.image?.dimensions?.width}
        height={props.data?.data?.image?.dimensions?.height}
        alt={'Illustration image'}
        priority={props.loadImagesEager}
        className={primaryImageLoaded ? styles.loaded : styles.loading}
        onLoadingComplete={() => setPrimaryImageLoaded(true)}
        lazyBoundary={'300px'}
      />
    </div>
  );
};
