import styles from '../styles/ClothingPackagingInfo.module.scss';
import Image from 'next/image';

export const ClothingPackagingInfo = () => {
  return (
    <div className={styles.packageInfo}>
      <h2 className={styles.title}>Packaging</h2>
      <p>
        All clothing items are carefully packed in hand-printed cardboard boxes
        and then shipped out to our customers.
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
