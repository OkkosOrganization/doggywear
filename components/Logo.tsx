import styles from '../styles/Navi.module.css';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

type LogoProps = {
  highlight: boolean;
  toggleNavi: () => void;
  naviOpen: boolean;
};
export const Logo = (props: LogoProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const clickHandler = () => {
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.setTimeout(() => {
        (document.activeElement as HTMLElement)?.blur?.();
      }, 300);
    } else {
      router.push('/');
      if (props.naviOpen) props.toggleNavi();
    }
  };
  return (
    <div className={`${styles.logo}`} onClick={clickHandler}>
      <Image
        src={'/logoAnim.gif'}
        alt={'Logo'}
        fill
        priority
        unoptimized={true}
      />
    </div>
  );
};
