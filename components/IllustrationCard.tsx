import { PrismicNextImage } from '@prismicio/next';
import { useEffect, useRef, useState } from 'react';
import styles from '../styles/IllustrationCard.module.css';
import { IllustrationDocument } from '../prismicio-types';
import { FilledLinkToMediaField } from '@prismicio/client';

type IllustrationCardProps = {
  data: IllustrationDocument;
  loadImagesEager: boolean;
  sizes: string;
};
export const IllustrationCard = (props: IllustrationCardProps) => {
  const [primaryImageLoaded, setPrimaryImageLoaded] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const root = cardRef.current;
    if (!root) return;

    const image = root.querySelector<HTMLImageElement>('img');
    if (image?.complete) {
      setPrimaryImageLoaded(true);
    }
  }, [props.data?.id, props.data?.data?.image?.url]);

  return (
    <div
      className={`${styles.illustration} gridItem`}
      id={props.data.id}
      ref={cardRef}
    >
      {props.data?.data?.image?.url &&
        (!props.data.data.image.url.includes('.gif') ? (
          <PrismicNextImage
            field={props.data?.data?.image}
            style={{ width: '100%', height: 'auto' }}
            fallbackAlt="Illustration image"
            priority={props.loadImagesEager}
            className={primaryImageLoaded ? styles.loaded : styles.loading}
            onLoad={() => setPrimaryImageLoaded(true)}
            onError={() => setPrimaryImageLoaded(true)}
            sizes={props.sizes}
          />
        ) : (
          <img
            src={props.data?.data?.image?.url}
            alt={'Illustration gif'}
            style={{ width: '100%', height: 'auto' }}
            className={primaryImageLoaded ? styles.loaded : styles.loading}
            onLoad={() => setPrimaryImageLoaded(true)}
            onError={() => setPrimaryImageLoaded(true)}
          />
        ))}

      {(props.data?.data?.video as FilledLinkToMediaField).url && (
        <div
          className={styles.video}
          onMouseEnter={playVideo}
          onMouseLeave={pauseVideo}
        >
          <video
            ref={video}
            src={(props.data.data.video as FilledLinkToMediaField).url}
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
