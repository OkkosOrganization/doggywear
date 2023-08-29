import styles from '../styles/ClothingPackagingInfo.module.scss';
import Image from 'next/image';

export const ClothingPackagingInfo = () => {
  return (
    <div className={styles.packageInfo}>
      <h2 className={styles.title}>Packaging & shipping</h2>
      <p>
        All our clothing items are carefully packed in hand-printed cardboard
        boxes and then shipped out to our customers.
      </p>
      <p>
        Please allow up to two weeks processing time before shipping as we do
        not have a big stock and sometimes we need to reprint items.
      </p>
      <p>We ship orders on Fridays.</p>
      <p>
        Orders can also be picked up from{' '}
        <a href={'http://www.kalasatamanseripaja.com/fi/info/'} target="_blank">
          Kalasataman Seripaja
        </a>
        , Vanha talvitie 9, 00580 Helsinki. Pickups on Fridays 10-17.
      </p>
      <div className={styles.packageImages}>
        <div className={styles.packageImage}>
          <Image
            src={'/box7.jpg'}
            width={600}
            height={800}
            layout="responsive"
            alt="Packaging image 1"
          />
        </div>
        <div className={styles.packageImage}>
          <Image
            src={'/box5.jpg'}
            width={600}
            height={800}
            layout="responsive"
            alt="Packaging image 2"
          />
        </div>
        <div className={styles.packageImage}>
          <Image
            src={'/box6.jpg'}
            width={600}
            height={800}
            layout="responsive"
            alt="Packaging image 3"
          />
        </div>
      </div>
    </div>
  );
};
