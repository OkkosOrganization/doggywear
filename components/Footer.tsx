import { default as NextLink } from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../styles/Footer.module.css';
import { getNaviItems } from '../config/navi';
import { TITLE } from '../config/env';

const Footer = () => {
  const pathname = usePathname();
  const navi = getNaviItems();

  return (
    <footer className={styles.footer}>
      <div className={''}>
        <nav className={styles.footerNavi}>
          <ul className={styles.pages}>
            {navi.map((i, index) => {
              const label = i.label;
              const resolvedLink = i.href;
              const isActive = resolvedLink === pathname;
              const external = i.external;

              return (
                <li
                  key={'footer_navi_item_' + index}
                  className={`${isActive ? styles.active : ''}`}
                >
                  {external ? (
                    <a
                      href={i.href}
                      aria-label={label}
                      target={'_blank'}
                      rel={'nofollow noreferrer'}
                    >
                      {label}
                    </a>
                  ) : (
                    <NextLink href={i.href} aria-label={label}>
                      {label}
                    </NextLink>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <p className={styles.copyright}>
          &copy;{`${TITLE} ${new Date().getFullYear()}`}
        </p>
      </div>
    </footer>
  );
};
export default Footer;
