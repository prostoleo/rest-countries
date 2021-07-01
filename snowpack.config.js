// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
	mount: {
		/* ... */
		public: { url: '/public', static: true },
		src: '/',
	},
	plugins: [
		/* ... */
		['@snowpack/plugin-webpack', {}],
		[
			'@snowpack/plugin-sass',
			{
				native: true,
				compilerOptions: {
					style: 'compressed',
				},
			},
		],
	],
	packageOptions: {
		/* ... */
	},
	devOptions: {
		/* ... */
	},
	buildOptions: {
		/* ... */
	},
};
