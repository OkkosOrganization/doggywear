import styles from '../styles/PrintPackagingInfo.module.css';

export const PrintPackagingInfo = () => {
  return (
    <div className={styles.packageInfo}>
      <h2 className={styles.title}>Packaging</h2>
      <p>
        All poster items are carefully rolled into cardboard tubes and then
        shipped out to our customers.
      </p>
    </div>
  );
};
