import React from 'react';
import { default as NextLink } from 'next/link';
import { useRouter } from 'next/router';
import styles from '../sass/Footer.module.scss';
import { getNaviItems } from '../config/navi';
import { TITLE } from '../config/env';

const Footer = (props) => {

  const router = useRouter();
  let navi = getNaviItems();

  return (
    <footer className={styles.footer}>

      <div className={''}>

        <nav className={styles.footerNavi}>
          <ul className={styles.pages}>
            {navi.map((i, index) => {
              let label = i.label;
              let resolvedLink = i.href;
              let isActive = resolvedLink === router.asPath;
              let external = i.external;

              return (

                <li key={"footer_navi_item_" + index} className={`${isActive ? styles.active : ""}`}>
                  {
                    external
                      ?
                      <a href={i.href} aria-label={label} target={"_blank"}>{label}</a>
                      :
                      <NextLink href={i.href} as={i.href} >
                        <a aria-label={label}>{label}</a>
                      </NextLink>
                  }
                </li>

              );
            })}
          </ul>
        </nav>

        <div className={styles.some + " hidden"}>
          <a href={process.env.INSTA_URL} target={"_blank"} rel={"noreferrer"} className={styles.someBtn + " " + styles.instaBtn} aria-label={"Link to Instagram"}>
            <span>Instagram</span>
          </a>
        </div>

        <p className={styles.copyright}>&copy;{`${TITLE} ${new Date().getFullYear()}`}</p>
      </div>
    </footer>
  );
};
export default Footer;