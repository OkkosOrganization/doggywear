import styles from "../../styles/Navi.module.scss";

const CloseIcon = () => {
    return(
            <svg viewBox="0 0 19 18" className={styles.closeIcon}>
                <path d="M-1.77635684e-15,0.370963652 L16.7553549,17.274073"></path>
                <path d="M0.0446440589,0.370963652 L16.799999,17.274073" transform="translate(8.444644, 8.799999) scale(-1, 1) translate(-8.444644, -8.799999)"></path>
            </svg>
    );
};
export default CloseIcon;