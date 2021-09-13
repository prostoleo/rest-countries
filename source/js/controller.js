'use strict';

//todo импортируем core-js и regenerator
import 'core-js/stable';
import 'regenerator-runtime/runtime.js';
// import '../../node_modules/lodash.clonedeep/index';
// import * as _ from 'lodash';

//* мои импорты
import * as model from './model.js';
import CardsView from './Views/CardsView.js';
import CountryView from './Views/CountryView.js';
import SearchView from './Views/SearchView.js';
import FilterView from './Views/FilterView.js';

import filterToggle from './filter.js';
import switchModeSimple from './switchModeSimple.js';
import scrollToTop from './scrollToTop.js';

//=====================================================
// блок на какой странице находимся?

//* проверяем , на какой странице находимся
const bodyId = document.querySelector('body').id;

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
	const allCountries = await model.getData();
	model.state.allCountries = allCountries;
	model.state.currentData = allCountries;

	history.pushState(null, null, '/');

	CardsView.render(model.state.allCountries);
}

//todo контроль поиск стран
async function controlSearchCountries(query = null) {
	try {
		FilterView.btnRemoveClasses();

		//* 0 - рендерим спиннер
		CardsView.renderSpinner();

		//* 1 - получаем запрос
		// const query = SearchView.getQuery();

		//* 2 - добавляем запрос в state
		model.state.search.query = query;

		//* 2a - если нет query (пустая строка) - чистим заголовок
		if (!query) {
			CardsView.clearCardsHeader();
		}

		//* 2б - меняем url
		history.pushState(null, null, `/?search=${query}`);

		//* 3 формируем запрос
		const data = await model.getData(query);

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

	//todo меняем url
	// history.pushState(null, null, `/?region=${region}`);
	model.updateURL('filter-region', region);

	//* 0 - рендерим спиннер
	CardsView.renderSpinner();

	//* 1 - фильтруем данные и добавляем region и data в state

	//* новый вариант
	model.state.filter.region = region;

	//* обновляем model.state.filter.results
	await updateFilteredResults(model.state.currentData);

	//* 2 - если нет по фильтру, то рендерим ошибку
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
}

//todo функция сортировки
async function controlSort(name, sort) {
	//todo меняем url
	model.updateURL('sort', [name, sort]);

	//* обновляем state.sort
	await updateSortState(name, sort);

	//* обновляем state.filter.results
	await updateFilteredResults(model.state.currentData);

	//* отображаем результат
	CardsView.render(model.state.filter.results);
}

//todo функция фильтрации стран по населению
async function controlFilterPopulation(min, max) {
	//todo меняем url
	model.updateURL('filter-population', [min, max]);

	//* 0 - рендерим спиннер
	CardsView.renderSpinner();

	//* обновляем данные
	model.state.filter.byPopulation.min = min;
	model.state.filter.byPopulation.max = max;

	//* 1 - меняем данные в state.filter.results

	//* новый вариант
	await updateFilteredResults(model.state.currentData);

	//* 2 - рендерим результат
	CardsView.render(model.state.filter.results);
}

//todo обновляем filtereResults
async function updateFilteredResults(countries) {
	//* проверяем где значение не 'none'
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
				//* в тыс. чел.
				country.population >= model.state.filter.byPopulation.min * 1000 &&
				country.population <= model.state.filter.byPopulation.max * 1000
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

	model.state.sort = newSort;
}

function whereSortIsNotNone() {
	//* клонируем model.state.sort через lodash cloneDeep
	const cloneStateSort = Object.assign({}, model.state.sort);

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

	const result = [name, sort];

	//* возвращаем name и sort
	return result;
}

//todo загружаем необходимые данные в соответствии с SearchParams
async function loadResultsOnSearchParams() {
	const curSearchParams = model.getUrlSearchParams();

	//* проходимся по объекту с параметрами
	for (const [key, value] of curSearchParams) {
		if (value !== '' && value !== null && value !== undefined) {
			switch (key) {
				// если есть поиск - вызываем поиск
				case 'search':
					controlSearchCountries(value);

					break;
				// если есть region - вызываем регион
				case 'region':
					controlFilterRegion(value);
					break;
				// если есть population / name / capital - вызываем sort
				case 'population':
				case 'name':
				case 'capital':
					controlSort(key, value);
					break;

				// если есть min / max
				case 'min':
					const maxValue = curSearchParams.max;

					controlFilterPopulation(value, maxValue);
					break;
				// если есть min / max
				case 'max':
					const minValue = curSearchParams.min;

					controlFilterPopulation(minValue, value);
					break;
				case 'id':
					updateStateCountry(id);
					await controlCountryWrapper();
					break;

				default:
					break;
			}
		}
	}
}

//todo контроль выбора страны для перехода
function controlChooseCountry(id, border = false, back = false) {
	//! убрал для того чтобы кнопка back просто перемезала на index.html
	//* если border true то сохраняем предыдущий id
	// if (border) model.state.prevId = model.state.country.id;

	//* сохраняем предыдущий state в LS
	/* model.state.prevId
		? model.savePrevState(model.state, model.state.prevId)
		: model.savePrevState(model.state); */

	// model.savePrevState(model.state);

	//* обновляем state.country
	updateStateCountry(id);

	//* обновляем LS
	model.updateLS(model.state);

	//* проверяем model.state
}

//* обновляем state.country
async function updateStateCountry(id, data = null, dataBorders = null) {
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
		//* 0 - рендерим спиннер
		CountryView.renderSpinner();

		//* меняем url
		/* history.pushState(
			null,
			null,
			`/country.html/id=${model.state.country.id.toLowerCase()}`
		); */
		//* меняем url новый
		model.updateURL('country-id', model.state.country.id.toLowerCase());

		//* 1 - получаем данные о стране
		/* const data = await model.getData(null, model.state.country.id); */
		const data = await model.getData(
			null,
			model.state.country.id.toLowerCase()
		);

		model.state.country.countryHTMLFullInfo = data;
		// await updateStateCountry(model.state.country.id, data);

		// let bordersNewData = [];

		//! работает

		//* 2 - получаем данные о соседях
		const borders = await model.getDataBorders(
			model.state.country.countryHTMLFullInfo.borders
		);

		//* 3 записываем в state
		model.state.country.borderCountries = borders;

		//* 4 рендерим результат
		CountryView.render(
			model.state.country.countryHTMLFullInfo,
			model.state.country.borderCountries
		);
	} catch (error) {
		console.error(`${error}`);
		CountryView.renderMessage(
			`Could not load data of country with code (${model.state.country.id})😞 Try again later`
		);
	}
}

//todo контроль кнопки назад
async function controlBtnBack() {
	// const prevState = localStorage.getItem('country-prev-state')

	//* получаем пред state
	const prevState = model.getPrevState(model.state.prevId);

	//* присваиваем предыдущий state
	model.setPrevState(prevState);

	controlChooseCountry(model.state.prevId);

	window.history.back();
}

//=====================================================
// блок инициализации

//* начало на странице index
async function initIndexHTML() {
	filterToggle();
	switchModeSimple();
	scrollToTop();

	//* 0 - отображаем спиннер
	CardsView.renderSpinner();

	//* 1 - начальные данные - все страны
	await renderAllCountriesCards();

	//todo отображаем страны по поиску
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
	switchModeSimple();
	scrollToTop();

	//todo
	await controlCountryWrapper();

	//todo реализовываем переход по другим странам
	CountryView.addHandlerToBorderCountry(controlChooseCountry);
}
