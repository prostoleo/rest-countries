//=========================================
//todo подключаем модуль path из node.js
const { dirname } = require('path');
const path = require('path');
//=========================================
//todo подключаем плагин cleanwebpack - очищает каждый раз паgre dist
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

//=========================================
//todo подключаем плагин miniCssExtractPlugin -  создает отдельный файл css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

//=========================================
//todo подключаем плагин html-webpack-plugin - добавляет html файл в dist папку а также подключает к нему нужные скрипты
const HTMLWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

//=========================================
//todo для минификации css файла
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
//=========================================
//todo для минификации js файла
const TerserWebpackPlugin = require('terser-webpack-plugin');

//=========================================
//todo анализ финального bundle - можно подключить потом через функцию - все начальные плагины в функцию, а если флаг isProd - то подключаем еще его
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

let htmlPageNames = ['country'];
let multipleHtmlPlugins = htmlPageNames.map((name) => {
	return new HtmlWebpackPlugin({
		template: `./${name}.html`, // relative path to the HTML files
		filename: `${name}.html`, // output HTML files
		chunks: [`${name}`], // respective JS files
	});
});

//=========================================
//* переменная isDev чтобы определять - находимся ли мы в режиме разработки или build
const isDev = process.env.NODE_ENV === 'development';
console.log('isDev: ', isDev);
const isProd = !isDev;

//=========================================
//todo функция для оптимизации и минификации кода при build
function optimize() {
	const config = {
		splitChunks: {
			chunks: 'all',
		},
	};

	if (isProd) {
		config.minimizer = [
			new OptimizeCssAssetsWebpackPlugin(),
			new TerserWebpackPlugin(),
		];
	}

	return config;
}
//=========================================
//todo функция для вывода названия файлов
const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

//=========================================

//todo функция для css loaders
const cssLoaders = (extra) => {
	const loaders = [
		{
			loader: MiniCssExtractPlugin.loader,
			options: {},
		},
		'css-loader',
	];

	if (extra) {
		loaders.push(extra);
	}

	return loaders;
};

//=========================================

//todo функция для css loaders
const babelOptions = (presetsExtra, pluginsExtra) => {
	const options = {
		presets: ['@babel/preset-env'],
		plugins: [],
	};

	if (presetsExtra) {
		options.presets = [options.presets, ...presetsExtra];
	}

	if (pluginsExtra) {
		options.plugins = [options.plugins, ...pluginsExtra];
	}

	return options;
};

//todo для добавления es-lint в режиме разработки( только для js файлов )
const jsLoaders = () => {
	const loaders = [
		{
			loader: 'babel-loader',
			options: babelOptions(),
		},
	];

	if (isDev) {
		loaders.push('eslint-loader');
	}

	return loaders;
};

//=========================================
//=========================================

//todo экспортируем объект конфигураций
module.exports = {
	//todo context - обычная строчка которая говорит где все исходники
	context: path.resolve(__dirname, 'src'),
	//todo mode
	mode: 'development',
	//todo входная точка проекта
	entry: {
		main: ['@babel/polyfill', './index.js'],
		// country: './country.js',
	},
	//todo куда выводить
	output: {
		//? название выводимого файла
		// filename: 'bundle.js',
		//? название выводимого файла - расширенный вар
		// filename: '[name].[contenthash].js',
		filename: filename('js'),
		//? путь к файлу
		path: path.resolve(__dirname, 'dist'),
	},
	//todo указывать - с каким расширениями будет работать- тогда при импорте расширения можно будет опустить
	resolve: {
		extensions: ['.js', '.json', '.png'],
		//* указывает на корень приложения
		alias: {
			'@models': path.resolve(__dirname, 'src/models'),
			'@': path.resolve(__dirname, 'src'),
		},
	},
	//todo оптимизация - чтобы не грузить все библиотеки несколько раз
	optimization: optimize(),
	//todo devServer
	devServer: {
		contentBase: './dist',
		hot: isDev ? true : false,
		// port: 2424,
		liveReload: true,
	},

	//todo devTool - контролирует как source map комплируется
	devtool: isDev ? 'source-map' : false,
	//todo плагины
	plugins: [
		//* htmlWebpack Plugin
		new HtmlWebpackPlugin({
			//? путь до template
			filename: 'index.html',
			template: './index.html',
			chunks: ['main'],
			minify: {
				collapseWhitespace: isProd,
			},
		}),
		/* //* htmlWebpack Plugin
		new HtmlWebpackPlugin({
			//? путь до template
			filename: 'country.html',
			template: './country.html',
			// chunks: ['country'],
			minify: {
				collapseWhitespace: isProd,
			},
		}), */
		//* cleanWebpackPlugin - очищает папку dist
		new CleanWebpackPlugin(),
		//* copyWebpackPlugin - откуда и куда копировать
		/* new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, './src/favicon.ico'),
        to: path.resolve(__dirname, 'dist'),
      },
    ]), */
		/* new CopyWebpackPlugin({
			patterns: [
				// {
				//   from: path.resolve(__dirname, './src/favicon.ico'),
				//   to: path.resolve(__dirname, 'dist'),
				// },
				//* если путь не указан, то по дефолту - в папку dist
				{
					from: './favicon.ico',
					to: '',
				},
			],
		}), */
		//todo для создания отдельного css файла
		new MiniCssExtractPlugin({
			// filename: '[name].[contenthash].css',
			filename: filename('css'),
		}),

		// new BundleAnalyzerPlugin(),
		//* добавляем множество страниц html к одному
	].concat(multipleHtmlPlugins),
	//* лоадеры - возможность дополнения к webpack функционала, позволяющую ему работать с другими типами файлов (css, jpg, png, xml и т.д.)
	module: {
		rules: [
			{
				/* //? регулярное выражение чтобы найти нужные файлы - как только встречается файл указанного типа, нужно использовать указанный loader
        test: /\.css$/,
        //! loader читаются справа налево
        // use: ['style-loader', 'css-loader'],
        //* чтобы выводилось отдельно в css файл
        // use: [MiniCssExtractPlugin.loader, 'css-loader'],
        //* с доп опциями
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          'css-loader',
        ], */

				//* с использовани функции
				test: /\.css$/,
				use: cssLoaders(),
			},
			//todo для препроцессора less
			{
				test: /\.less$/,
				//* с доп опциями
				/* use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          'css-loader',
          'less-loader',
        ], */
				//* через функцию css loaders
				use: cssLoaders('less-loader'),
			},
			//todo для препроцессора scss
			{
				test: /\.s[ac]ss$/,
				//* с доп опциями
				/* use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          'css-loader',
          'sass-loader',
        ], */
				//* через функцию css loaders
				use: cssLoaders('sass-loader'),
			},
			//todo для file loader - чтобы грузить картинки
			{
				test: /\.(png|jpg|svg|gif)$/,
				use: ['file-loader'],
			},
			//todo для работы со шрифтами
			{
				test: /\.(ttf|woff|woff2|eot)$/,
				use: ['file-loader'],
			},
			//todo для работы с xml
			{
				test: /\.xml$/,
				use: ['xml-loader'],
			},
			//todo для работы с csv (может еще потребоваться пакет papaparse)
			{
				test: /\.csv$/,
				use: ['csv-loader'],
			},
			//todo babel js
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					//* в начале
					loader: 'babel-loader',
					//* через функцию
					// loader: jsLoaders(),
					//* в начале
					/* options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-private-methods'],
          }, */
					//* через функцию
					options: babelOptions(),
				},
			},
			//todo babel для typeScript
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					/* options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-typescript'],
          }, */
					//* через функцию
					options: babelOptions(['@babel/preset-typescript']),
				},
			},
			//todo babel для typeScript
			{
				test: /\.jsx$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					/* options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-typescript'],
          }, */
					//* через функцию
					options: babelOptions(['@babel/preset-react']),
				},
			},

			{
				test: /\.html$/,
				loader: 'html-loader',
			},
		],
	},
};
