import Image from 'next/image';
import { useRef, useState } from 'react';
import styles from '../styles/IllustrationCard.module.scss';

type IllustrationCardProps = {
  data: any;
  loadImagesEager: boolean;
};
export const IllustrationCard = (props: IllustrationCardProps): JSX.Element => {
  const [primaryImageLoaded, setPrimaryImageLoaded] = useState<boolean>(false);
  const video = useRef(null);

  const playVideo = () => {
    if (video.current) {
      video.current.play();
    }
  };
  const pauseVideo = () => {
    if (video.current) {
      video.current.pause();
    }
  };

  return (
    <div className={`${styles.illustration} gridItem`} id={props.data.id}>
      {props.data?.data?.image?.url && (
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
      )}

      {props.data?.data?.video?.url && (
        <div
          className={styles.video}
          onMouseEnter={playVideo}
          onMouseLeave={pauseVideo}
        >
          <video
            ref={video}
            src={props.data.data.video.url}
            loop
            autoPlay
            muted
            className="video"
          />
        </div>
      )}
    </div>
  );
};
