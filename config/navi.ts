import { INSTAGRAM_URL } from '../config/env';

type NaviItem = {
	label:string;
	href:string;
	external?:boolean;
}

export const getNaviItems = ():NaviItem[] => [
	{
		label: `PRODUCTS`
		, href: `/`
	},
	{
		label: "ABOUT"
		, href: `/about`
	},
	{
		label: "PRIVACY POLICY"
		, href: `/privacy-policy`
	},
	{
		label: "INSTAGRAM"
		, href: INSTAGRAM_URL
		, external: true
	},
];