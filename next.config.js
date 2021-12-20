module.exports = {
    cssLoaderOptions:{
        url:false
    },
    sassLoaderOptions:{
        outputStyle:"compressed"
    },
    i18n: {
		locales: ['en', 'fi'],
		defaultLocale: 'en',
		localeDetection: false
	},
	images: {
		domains:['images.prismic.io', 'doggywear.cdn.prismic.io'],
		quality:85,
		deviceSizes: [480, 768, 1024, 1366, 1920, 2560],
	},
};