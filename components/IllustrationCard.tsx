import Image from 'next/image';
import { useRef, useState } from 'react';
import styles from '../styles/IllustrationCard.module.css';

type IllustrationCardProps = {
  data: any;
  loadImagesEager: boolean;
  sizes: string;
};
export const IllustrationCard = (props: IllustrationCardProps) => {
  const [primaryImageLoaded, setPrimaryImageLoaded] = useState<boolean>(false);
  const video = useRef<HTMLVideoElement>(null);

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
          width={props.data?.data?.image?.dimensions?.width}
          height={props.data?.data?.image?.dimensions?.height}
          style={{ width: '100%', height: 'auto' }}
          alt={'Illustration image'}
          priority={props.loadImagesEager}
          className={primaryImageLoaded ? styles.loaded : styles.loading}
          onLoad={() => setPrimaryImageLoaded(true)}
          sizes={props.sizes}
          unoptimized={
            props.data?.data?.image?.url?.includes('.gif') ? true : false
          }
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
