import { useEffect, useState } from 'react';
import { INSTAGRAM_URL, INSTAGRAM_USER_NAME } from '../config/env';
import styles from '../styles/Insta.module.scss';

type InstaJson = {
  data?: any[];
};

const InstaFeed = (): JSX.Element => {
  const [feed, setFeed] = useState<InstaJson | null>(null);
  useEffect(() => {
    const getFeed = async () => {
      try {
        const res = await fetch('/api/insta/feed');
        const json = (await res.json()) as InstaJson;
        setFeed(json);
      } catch (e) {
        console.log(e);
      }
    };
    getFeed();
  }, []);

  if (!feed) return null;

  return (
    <div className={styles.instaContainer}>
      <h3 className={styles.title}>Follow Doggy Wear on Instagram</h3>
      <h4 className={styles.link}>
        <a href={INSTAGRAM_URL} target={'_blank'} rel="nofollow noreferrer">
          @{INSTAGRAM_USER_NAME}
        </a>
      </h4>
      {feed?.data.length ? (
        feed?.data.map((p, pindex) => {
          <div key={`${'post'} + pindex`}>{JSON.stringify(p)}</div>;
        })
      ) : (
        <div>No posts</div>
      )}
    </div>
  );
};

export default InstaFeed;
