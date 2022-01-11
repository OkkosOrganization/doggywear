import styles from "../styles/PackagingInfo.module.scss";
import Image from "next/image";

export const ProductPackagingInfo = () => {
  return (
    <div className={styles.packageInfo}>
      <h2>Packaging</h2>
      <p>All clothing items are wrapped in protective paper, carefully packed in hand-printed cardboard boxes and then shipped out to our customers.</p>
      <div className={styles.packageImages}>
        <div className={styles.packageImage}>
          <Image
            src={'/box4.jpg'}
            width={600}
            height={732}
            layout='responsive'
            alt='Packaging image 1'
          />
        </div>
        <div className={styles.packageImage}>
          <Image
            src={'/box2.jpg'}
            width={600}
            height={732}
            layout='responsive'
            alt='Packaging image 2'
          />
        </div>
        <div className={styles.packageImage}>
          <Image
            src={'/box1.jpg'}
            width={600}
            height={732}
            layout='responsive'
            alt='Packaging image 3'
          />
        </div>
      </div>
    </div>
  )
};