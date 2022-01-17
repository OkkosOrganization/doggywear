import styles from '../styles/LoadingIndicator.module.scss';
type LoadingIndicatorProps = {
  showBg: boolean;
};
export const LoadingIndicator = ({ showBg }: LoadingIndicatorProps) => {
  return (
    <div
      className={`${styles.loaderContainer} ${
        showBg ? styles.showBg : styles.noBg
      }`}
    >
      <div className={styles.loader}>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
