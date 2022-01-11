import styles from '../styles/LoadingIndicator.module.scss';
export const LoadingIndicator = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader}>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};