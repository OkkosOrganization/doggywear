import styles from "../../sass/Navi.module.scss";
import CloseIcon from "./CloseIcon";
import { HamburgerIcon } from "./HamburgerIcon";

const MobileNaviIcon = (props) => {
  let classes = `${styles.mobileNaviIcon} ${props.naviOpen ? styles.active : ""}`;
  return (
    <button
      role={"button"}
      className={classes}
      onClick={props.toggleNavi}
      aria-label="Navigation"
    >
      <HamburgerIcon />
      <CloseIcon />
    </button>
  );
};
export default MobileNaviIcon;