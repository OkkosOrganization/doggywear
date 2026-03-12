import styles from '../styles/LoadingIndicator.module.css';
type LoadingIndicatorProps = {
  showBg: boolean;
  fixed?: boolean;
};
export const LoadingIndicator = ({ showBg, fixed }: LoadingIndicatorProps) => {
  return (
    <div
      className={`${styles.loaderContainer} ${
        showBg ? styles.showBg : styles.noBg
      }
      ${fixed ? styles.fixed : ''}`}
    >
      <div className={styles.loader}>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
