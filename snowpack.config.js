// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
	mount: {
		/* ... */
		// * работало с названием начальной папки - public
		// public: { url: '/', static: true },
		//* работает с названием папки - source
		source: { url: '/', static: true },
		src: { url: '/dist' },
	},
	plugins: [
		/* ... */
		//todo так понимаю, будет нормально работать только только при добавлении webpack config
		// ['@snowpack/plugin-webpack', {}],
		[
			'@snowpack/plugin-sass',
			{
				native: true,
				compilerOptions: {
					loadPath: '/scss/**/*.scss',
					style: 'compressed',
				},
			},
		],
		//todo рабочий плагин, хоть и всего 2500 тысяч скачиваний в неделю. Последний патч был в начале 2021 года
		//* можно указывать target - конкретные браузеры, которые нужно поддерживать - https://www.npmjs.com/package/@snowpack/plugin-optimize
		/* [
			'@snowpack/plugin-optimize',
			{
				target: ['edge16', 'firefox52', 'chrome57', 'safari10.3', 'ios10.1'],
			},
		], */
		//* включаем babel и webpack - посмотрим работает ли
		['@snowpack/plugin-babel'],
		['@snowpack/plugin-webpack'],
	],
	packageOptions: {
		/* ... */
	},
	devOptions: {
		/* ... */
		port: 4545,
		// hmr: false,
	},
	buildOptions: {
		/* ... */
		/* baseUrl: './',
		out: 'dist', */
		out: 'dist',
		minify: true,
	},

	//todo optimize плагин - встроенная опция испорльзует esbuild
	//? документация esbuild - https://esbuild.github.io/api/#target, https://www.snowpack.dev/guides/optimize-and-bundle
	//* тут можно только указывать стандарт языка, который последний поддерживается
	/* optimize: {
		minify: true,
		bundle: true,
		splitting: true,
		treeshake: true,

		target: 'es2015',
	}, */
};
