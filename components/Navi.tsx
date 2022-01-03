import { default as NextLink } from 'next/link';
import { useRouter } from 'next/router';
import styles from "../styles/Navi.module.scss";
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { getNaviItems } from '../config/navi';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const Navi = (props) => {
	
	const [darkMode, setDarkmode] = useLocalStorage('darkMode', false);
	const router = useRouter();
	const pages = useRef(null);
	const navi = getNaviItems();

	useEffect(() => {
		const lis = pages.current.querySelectorAll('li');

		//console.log(props.naviOpen);

		if (props.naviOpen) {
			gsap.to(lis, { duration: .2, autoAlpha: 1, y: "0%", delay: .22, stagger: 0.1 });
		}
		else {
			lis.forEach((element) => {
				gsap.set(element, { autoAlpha: 0, y: "-10%" });
			});
		}

	}, [props.naviOpen]);

	useEffect(() => {
		if (darkMode)
			document.querySelector('#__next').classList.add('dark');
		else
			document.querySelector('#__next').classList.remove('dark');
	}, [darkMode]);

	const toggleDarkMode = () => {
		setDarkmode(!darkMode);
	};

	return (
		<>
			<ul className={styles.pages} ref={pages}>
				{navi.map((i, index) => {
					const label = i.label.toLowerCase();
					const href = i.href;
					const isActive = (href === router.asPath);
					const external = i.external;

					return (
						<li key={"naviItem_" + index} className={`${isActive ? styles.active : ""} `}>

							{
								external
									?
									<a
										href={i.href}
										aria-label={label}
										target={"_blank"}
										rel={"noreferrer nofollow"}>
										{label}
									</a>
									:
									<NextLink href={href}>
										<a
											aria-label={label}
										>
											{label}
										</a>
									</NextLink>
							}

						</li>
					);
				})}
			</ul>

			<button onClick={toggleDarkMode} className={styles.modeSwitch}>
				{
					darkMode
						?
						<svg viewBox="0 0 24 24" className={styles.sun}><path d="M7 12c0 2.8 2.2 5 5 5s5-2.2 5-5-2.2-5-5-5S7 9.2 7 12zM12 9c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3S10.3 9 12 9zM13 5V3c0-.6-.4-1-1-1s-1 .4-1 1v2c0 .6.4 1 1 1S13 5.6 13 5zM19.1 4.9c-.4-.4-1-.4-1.4 0l-1.4 1.4c-.4.4-.4 1 0 1.4.2.2.5.3.7.3s.5-.1.7-.3l1.4-1.4C19.5 6 19.5 5.3 19.1 4.9zM21 11h-2c-.6 0-1 .4-1 1s.4 1 1 1h2c.6 0 1-.4 1-1S21.6 11 21 11zM17.7 16.2c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l1.4 1.4c.2.2.5.3.7.3s.5-.1.7-.3c.4-.4.4-1 0-1.4L17.7 16.2zM11 19v2c0 .6.4 1 1 1s1-.4 1-1v-2c0-.6-.4-1-1-1S11 18.4 11 19zM4.9 19.1c.2.2.5.3.7.3s.5-.1.7-.3l1.4-1.4c.4-.4.4-1 0-1.4s-1-.4-1.4 0l-1.4 1.4C4.5 18 4.5 18.7 4.9 19.1zM2 12c0 .6.4 1 1 1h2c.6 0 1-.4 1-1s-.4-1-1-1H3C2.4 11 2 11.4 2 12zM6.3 4.9c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l1.4 1.4C6.5 8 6.8 8.1 7.1 8.1S7.6 8 7.8 7.8c.4-.4.4-1 0-1.4L6.3 4.9z" /></svg>
						:
						<svg viewBox="0 0 30 30" className={styles.moon}><path fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.63,20a9,9,0,0,1-9.12-8.78A8.61,8.61,0,0,1,14.17,5,10.17,10.17,0,0,0,5,15,10.23,10.23,0,0,0,15.42,25,10.43,10.43,0,0,0,25,18.9,9.3,9.3,0,0,1,20.63,20Z" /></svg>
				}
			</button>
		</>
	);

};
