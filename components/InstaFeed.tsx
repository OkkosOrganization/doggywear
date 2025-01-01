import { memo } from 'react';
import { INSTAGRAM_URL, INSTAGRAM_USER_NAME } from '../config/env';
import styles from '../styles/Insta.module.scss';

type InstaProps = {
  title: string;
  feed?: {
    data?: any[];
  };
};
const compareProps = (prevProps, nextProps) => {
  return prevProps.feed.data.length === nextProps.feed.data.length;
};
const InstaFeed = memo((props: InstaProps): JSX.Element => {
  return (
    <div className={styles.instaContainer}>
      <h3 className={styles.title}>{props.title}</h3>
      <h4 className={styles.link}>
        <a href={INSTAGRAM_URL} target={'_blank'} rel="nofollow noreferrer">
          @{INSTAGRAM_USER_NAME}
        </a>
      </h4>
      <div className={styles.instaGrid}>
        {props?.feed?.data?.length
          ? props?.feed?.data
              //.filter((p) => p.media_type === 'IMAGE')
              .map((p, pindex) => {
                return (
                  <a
                    href={p?.permalink}
                    target={'_blank'}
                    rel={'nofollow noreferrer'}
                    className={styles.instaPost}
                    key={`${'post_'}${pindex}`}
                    title={p?.caption ? p.caption : 'instaPost_' + pindex}
                  >
                    <img
                      src={p?.media_url}
                      alt={p?.caption ? p.caption : 'instaPost_' + pindex}
                      loading="lazy"
                      className={styles.instaPostImage}
                      onError={(e) => {
                        const img = e?.target as HTMLImageElement;
                        const p = img.parentNode as HTMLAnchorElement;
                        p.style.display = "none";
                      }}
                    />
                  </a>
                );
              })
          : null}
      </div>
    </div>
  );
}, compareProps);
InstaFeed.displayName = 'InstaFeed';
export default InstaFeed;
