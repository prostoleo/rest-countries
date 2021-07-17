'use strict';

//todo импортируем core-js и regenerator
import 'core-js/stable';
import 'regenerator-runtime/runtime.js';
// import '../../node_modules/lodash.clonedeep/index';
// import * as _ from 'lodash';

//* мои импорты
import * as model from './model.js';
import CardsView from './Views/CardsView.js';
// console.log('CardsView: ', CardsView);
import CountryView from './Views/CountryView.js';
import SearchView from './Views/SearchView.js';
import FilterView from './Views/FilterView.js';

//! тест Promise.all
import * as PromisAllTest from './Promise-all-test.js';

// PromisAllTest.resString();

/* console.log('CardsView: ', CardsView);
console.log('CountryView: ', CountryView); */

import filterToggle from './filter.js';
import switchModeSimple from './switchModeSimple.js';
import scrollToTop from './scrollToTop.js';

//=====================================================
// блок на какой странице находимся?

//* проверяем , на какой странице находимся
const bodyId = document.querySelector('body').id;
// console.log('bodyId: ', bodyId);

switch (bodyId) {
	case 'index':
		initIndexHTML();
		break;
	case 'country':
		initCountryHTML();
		break;

	default:
		break;
}

//=====================================================
// блок функций

//todo рендерим карточки всех стран
async function renderAllCountriesCards() {
	console.log('model.state: ', model.state);

	//* если нет всех стран - запрашиваем, иначе рендерим что есть
	/* if (model.state.allCountries.length === 0) {
		const allCountries = await model.getData();
		model.state.allCountries = allCountries;
		model.state.currentData = allCountries;
		// model.state.filter.results = allCountries;
	} else {
		model.state.currentData = allCountries;
	} */
	const allCountries = await model.getData();
	model.state.allCountries = allCountries;
	model.state.currentData = allCountries;

	console.log('model.state: ', model.state);

	history.pushState(null, null, '/');

	CardsView.render(model.state.allCountries);
}
//todo 2 вар - рендерим карточки всех стран
/* async function renderCountriesCards(all = true) {
	if (all) {
		const allCountries = await model.getData();
		model.state.allCountries = allCountries;
		console.log('model.state: ', model.state);

		CardsView.render(model.state.allCountries);
	} else {
		CardsView.render(model.state.search.results);
	}
} */

//todo рендерим карточки стран по поиску
/* async function renderCountriesCards() {
	// CardsView.renderSpinner();
	SearchView.addHandlerSearch(model.searchCountriesOnQuery);
	CardsView.render(model.state.search.results);
} */

//todo контроль поиск стран
async function controlSearchCountries() {
	try {
		console.log('controlSearchCountries-1 model.state: ', model.state);

		FilterView.btnRemoveClasses();

		//* 0 - рендерим спиннер
		CardsView.renderSpinner();

		//* 1 - получаем запрос
		const query = SearchView.getQuery();

		//* 2 - добавляем запрос в state
		model.state.search.query = query;

		//* 2a - если нет query (пустая строка) - чистим заголовок
		if (!query) {
			CardsView.clearCardsHeader();

			/* CardsView.render(model.state.allCountries);
			return; */
		}

		//* 2б - меняем url
		history.pushState(null, null, `/?search=${query}`);

		//* 3 формируем запрос
		const data = await model.getData(query);
		console.log('data: ', data);

		//* 3a - если данных нет - выводим ошибку
		if (data.length === 0)
			CardsView.renderError(
				`Sorry, no country was found on your query <span>${query}</span>😞 Try search for something else!`
			);

		//* 4 - результат помещаем в state
		model.state.search.results = data;

		model.state.currentData = data;
		model.state.filter.results = data;

		//* 5 - рендерим результат
		CardsView.render(model.state.search.results);

		//* 6 - рендерим сообщение
		CardsView.renderMessage(model.state.search.query);

		console.log('controlSearchCountries-2 model.state: ', model.state);
	} catch (err) {
		console.warn(`💣💣💣 ${err.message} ${err.status}`);

		if (err.message.includes('404')) {
			CardsView.renderError(
				`Sorry, no country was found on your query <span>${model.state.search.query}</span>😞 Try search for something else!`
			);

			CardsView.clear();
		}
	}
}

//todo фильтры и сортировка
async function controlFilterRegion(region) {
	console.log('controlFilterRegion-1 model.state: ', model.state);

	// CardsView.clearCardsHeader();

	//* если не получили регион
	/* if (region === 'all') {
		//* старый старый )
		//* 0 - рендерим спиннер
		// CardsView.renderSpinner();

		// //* если был поиск - рендерим поиск, иначе рендерим все карточки
		// if (model.state.search.results.length > 0) {
		// 	//* 3 - рендерим данные по поиску
		// 	CardsView.render(model.state.search.results);

		// 	//* 4 - рендерим сообщение если query есть
		// 	model.state.search.query &&
		// 		CardsView.renderMessage(model.state.search.query);
		// } else {
		// 	await renderAllCountriesCards();
		// }

		model.state.filter.results.length > 0
			? CardsView.render(model.state.filter.results)
			: CardsView.render(model.state.currentData);

		return;
	} */

	//* 0 - рендерим спиннер
	CardsView.renderSpinner();

	//* 1 - фильтруем данные и добавляем region и data в state

	//* старый вариант
	/* const data =
		model.state.filter.results.length > 0
			? model.state.filter.results.filter(
					(country) => country.region === region
			  )
			: model.state.currentData.filter((country) => country.region === region);

	console.log('data: ', data); */

	/* model.state.filter.region = region;
	model.state.filter.results = data; */

	//* новый вариант
	model.state.filter.region = region;

	//* обновляем model.state.filter.results
	await updateFilteredResults(model.state.currentData);

	//* 2 - если нет по фильтру, то рендерим ошибку
	//* старый вариант
	/* if (data.length === 0) {
		CardsView.renderError(
			`Sorry, no country was found on filter input <span>${model.state.filter.region}</span>😞 Try other filters!`
		);

		CardsView.clear();

		return;
	} */
	//* новый вариант
	if (model.state.filter.results.length === 0) {
		CardsView.renderError(
			`Sorry, no country was found on filter input <span>${model.state.filter.region}</span>😞 Try other filters!`
		);

		CardsView.clear();

		return;
	}

	//* 3 - рендерим данные
	CardsView.render(model.state.filter.results);

	//* 4 - рендерим сообщение если query есть
	model.state.search.query && CardsView.renderMessage(model.state.search.query);

	console.log('controlFilterRegion-2 model.state: ', model.state);
}

//todo функция сортировки
async function controlSort(name, sort) {
	// model.state.filter.results = model.state.filter.results.sort(a[name] - )
	console.log({ name, sort });
	console.log('controlSort-1 - model.state: ', model.state);

	//* обновляем state.sort
	await updateSortState(name, sort);

	//* обновляем state.filter.results
	await updateFilteredResults(model.state.currentData);

	//* старый вариант
	/* 	switch (sort) {
		case 'none':
		case 'down':
			model.state.filter.results.sort((a, b) => {
				return name === 'population'
					? +a[name] - +b[name]
					: a[name].localeCompare(b[name]);
			});
			break;

		case 'up':
			model.state.filter.results.sort((a, b) => {
				return name === 'population'
					? +b[name] - +a[name]
					: b[name].localeCompare(a[name]);
			});
			break;

		default:
			break;
	} */

	//* отображаем результат
	CardsView.render(model.state.filter.results);

	console.log('controlSort-2 - model.state: ', model.state);
}

//todo функция фильтрации стран по населению
async function controlFilterPopulation(min, max) {
	console.log({ min, max });
	console.log('controlFilterPopulation-1 - model.state:', model.state);

	//* 0 - рендерим спиннер
	CardsView.renderSpinner();

	//* обновляем данные
	model.state.filter.byPopulation.min = min;
	model.state.filter.byPopulation.max = max;

	//* 1 - меняем данные в state.filter.results
	/* const data =
		model.state.filter.results.length > 0
			? model.state.filter.results.filter(
					(country) => country.population >= min && country.population <= max
			  )
			: model.state.currentData.filter(
					(country) => country.population >= min && country.population <= max
			  ); */

	//* новый вариант
	await updateFilteredResults(model.state.currentData);

	//* старый вариант
	// model.state.filter.results = data;

	/* model.state.filter.byPopulation.min = min;
	model.state.filter.byPopulation.max = max; */

	//* 2 - рендерим результат
	CardsView.render(model.state.filter.results);

	console.log('controlFilterPopulation-2 - model.state:', model.state);
}

//todo обновляем filtereResults
async function updateFilteredResults(countries) {
	console.log('update FilterResults - countries: ', countries);
	//* проверяем где значение не 'none'
	// const res = await whereSortIsNotNone();
	const res = await whereSortIsNotNone();
	const [name, sort] = res;

	const data = countries
		.filter((country) => {
			return model.state.filter.region === 'all'
				? country
				: country.region === model.state.filter.region;
		})
		.filter((country) => {
			return (
				country.population >= model.state.filter.byPopulation.min &&
				country.population <= model.state.filter.byPopulation.max
			);
		});

	if (name && sort) {
		switch (sort) {
			case 'down':
				data.sort((a, b) => {
					return name === 'population'
						? +b[name] - +a[name]
						: b[name].localeCompare(a[name]);
				});
				break;

			case 'up':
				data.sort((a, b) => {
					return name === 'population'
						? +a[name] - +b[name]
						: a[name].localeCompare(b[name]);
				});
				break;

			default:
				break;
		}
	}
	console.log('data - new.model.state.filters: ', data);

	model.state.filter.results = data;
}

//todo обновляем sortState
async function updateSortState(name, sort) {
	const newSort = {
		population: 'none', // string - 'up' / 'down' , default = none
		countryName: 'none', // string - 'up' / 'down' /  , default = none
		capitalName: 'none', // string - 'up' / 'down' , default = none
	};

	newSort[name] = sort;

	console.log('newSort: ', newSort);

	model.state.sort = newSort;
}

function whereSortIsNotNone() {
	//* клонируем model.state.sort через lodash cloneDeep
	const cloneStateSort = Object.assign({}, model.state.sort);
	console.log('cloneStateSort: ', cloneStateSort);

	let name = null;
	let sort = null;

	//* проходимся по клону , и если значение не равно none - то при присваиваем name и sort
	for (const [key, value] of Object.entries(cloneStateSort)) {
		if (value !== 'none') {
			name = key;
			sort = value;
			break;
		}
	}
	/* Object.entries(cloneStateSort).forEach(([key, value]) => {
		console.log('key:value', `${key}:${value}`);
		if (value !== 'none') {
			name = key;
			sort = value;
			// return;
		}
	}); */

	//* проверка
	/* const obj = {
		population: 'none',
		countryName: 'none',
		capitalName: 'none',
	};

	Object.entries(obj).forEach(([key, value]) => {
		console.log('key:value', `${key}:${value}`);
		if (value !== 'none') {
			name = key;
			sort = value;
			// return;
		}
	}); */

	console.log('name: ', name);
	console.log('sort: ', sort);

	const result = [name, sort];

	//* возвращаем name и sort
	return result;
}

//todo контроль выбора страны для перехода
function controlChooseCountry(id) {
	console.log('ChooseCountry - 1) - model.state: ', model.state);

	//* обновляем state.country
	updateStateCountry(id);

	//* обновляем LS
	model.updateLS();

	//* проверяем model.state
	console.log('ChooseCountry - 2) - model.state: ', model.state);
}

//* обновляем state.country
async function updateStateCountry(id, data = null, dataBorders = null) {
	/* const newStateCountry = Object.assign({}, model.state.country);
	// const newStateCountry = _.cloneDeep({}, model.state.country);

	newStateCountry.id = id;
	console.log('newStateCountry: ', newStateCountry);

	//* если есть data то обновляем state CountryFull
	if (data) {
		newStateCountry.country.countryHTMLFullInfo = data;
	}

	if (dataBorders) {
		newStateCountry.country.borderCountries = dataBorders;
	}

	model.state.country = newStateCountry; */
	if (id) {
		model.state.country.id = id;
	}

	if (data) {
		model.state.country.countryHTMLFullInfo = data;
	}

	if (dataBorders) {
		model.state.country.borderCountries = dataBorders;
	}
}

//=====================================================
// блок функций для country html
async function controlCountryWrapper() {
	try {
		console.log('controlCountryWrapper - 1 - model.state: ', model.state);

		//* 0 - рендерим спиннер
		CountryView.renderSpinner();

		//* меняем url
		/* history.pushState(
			null,
			null,
			`/country.html/id=${model.state.country.id.toLowerCase()}`
		); */

		//* 1 - получаем данные о стране
		/* const data = await model.getData(null, model.state.country.id); */
		const data = await model.getData(
			null,
			model.state.country.id.toLowerCase()
		);
		console.log('data: ', data);

		model.state.country.countryHTMLFullInfo = data;
		// await updateStateCountry(model.state.country.id, data);

		console.log(
			'model.state.country.countryHTMLFullInfo: ',
			model.state.country.countryHTMLFullInfo
		);

		let bordersNewData = [];

		//! работает

		//* 2 - получаем данные о соседях
		const borders = await model.getDataBorders(
			model.state.country.countryHTMLFullInfo.borders
		);
		console.log('borders: ', borders);

		//* 3 записываем в state
		model.state.country.borderCountries = borders;

		//* 4 рендерим результат
		CountryView.render(
			model.state.country.countryHTMLFullInfo,
			model.state.country.borderCountries
		);

		console.log('controlCountryWrapper - 2 - model.state: ', model.state);
	} catch (error) {
		console.error(`${error}`);
		CountryView.renderMessage(
			`Could not load data of country with code (${model.state.country.id})😞 Try again later`
		);
	}
}

//todo контроль кнопки назад
function controlBtnBack() {
	history.back();
}

//=====================================================
// блок инициализации

//* начало на странице index
async function initIndexHTML() {
	console.log('init index.html');
	filterToggle();
	switchModeSimple();
	scrollToTop();

	//* 0 - отображаем спиннер
	CardsView.renderSpinner();

	//* 1 - начальные данные - все страны
	await renderAllCountriesCards();
	// await renderCountriesCards();

	//todo отображаем страны по поиску
	// renderCountriesCards();
	SearchView.addHandlerSearch(controlSearchCountries);

	//todo отображаем страны по фильтрам региона
	FilterView.addHandlerFilterRegion(controlFilterRegion);

	//todo отображаем страны по сортировке
	FilterView.addHandlerSort(controlSort);

	//todo отображаем страны между двумя значениями по населению
	FilterView.addHandlerFilterPopulation(controlFilterPopulation);

	//todo handle клик на карточки страны
	CardsView.addHandlerChooseCountry(controlChooseCountry);
}

//* начало на странице country
async function initCountryHTML() {
	console.log('init country.html');
	switchModeSimple();
	scrollToTop();

	console.log('Country.html - model.state: ', model.state);

	//todo обновляем url
	// history.pushState(null, null, `/country.html/?id=${model.state.country.id}`);

	//todo
	await controlCountryWrapper();
	console.log('init country.html - 2');

	//todo релизовываем кнопку назад
	CountryView.addHandlerBtnBack(controlBtnBack);

	//todo реализовываем переход по другим странам
	CountryView.addHandlerToBorderCountry(controlChooseCountry);
}

/* const getData = async (url) => {
	const response = await fetch(url);
	console.log('response: ', response);

	const data = await response.json();
	console.log('data: ', data);

	return data;
};

getData('https://restcountries.eu/rest/v2/all'); */
