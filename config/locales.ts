import { Locale } from "../types";
import { BASE_URL } from "./env";

export const Locales:Locale[] = [
	{
		locale				: 'en',
		prismicLocale : 'en-eu',
		menuLabel			: 'English',
		path					: '/',
		url						: `${BASE_URL}`
	},
	/*
	{
		locale				: 'fi',
		prismicLocale	: 'fi',
		menuLabel			: 'Suomi',
		path					: '/fi/',
		url						: `${BASE_URL}/fi`
	},
	*/
];


export const getCurrentLocale = (locale:string):Locale => {
	const locales = Locales.filter(i => i.locale === locale);
	if(locales.length)
		return locales[0];

	//FALLBACK TO FIRST ONE
	return Locales[0];
};