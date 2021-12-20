import styles from "../../sass/Navi.module.scss";
export const HamburgerIcon = () => {
  return (
    <svg viewBox="0 0 33 25" className={styles.hamburgerIcon}>
      <path d="M0.5,9.5 L26.5,9.5"></path>
      <path d="M0.5,0.5 L26.5,0.5"></path>
      <path d="M0.5,18.5 L26.5,18.5"></path>
    </svg>
  );
};