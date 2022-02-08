module.exports = {
    cssLoaderOptions:{
        url:false
    },
    sassLoaderOptions:{
        outputStyle:"compressed"
    },
    i18n: {
		locales: ['en'],
		defaultLocale: 'en',
		localeDetection: false
	},
	images: {
		domains:['images.prismic.io', 'doggywear.cdn.prismic.io'],
		quality:90,
		deviceSizes: [480, 768, 1280, 1440, 1920, 2560],
	},
};