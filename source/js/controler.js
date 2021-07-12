'use strict';

//todo импортируем core-js и regenerator
import 'core-js/stable';
import 'regenerator-runtime/runtime.js';

//* мои импорты
import * as model from './model.js';
import CardsView from './Views/CardsView.js';
// console.log('CardsView: ', CardsView);
import CountryView from './Views/CountryView.js';
import SearchView from './Views/SearchView.js';
import FilterView from './Views/FilterView.js';

/* console.log('CardsView: ', CardsView);
console.log('CountryView: ', CountryView); */

import filterToggle from './filter.js';
import switchModeSimple from './switchModeSimple.js';

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
	//* если нет всех стран - запрашиваем, иначе рендерим что есть
	if (model.state.allCountries.length === 0) {
		const allCountries = await model.getData();
		model.state.allCountries = allCountries;
	}
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
		//* 0 - рендерим спиннер
		CardsView.renderSpinner();

		//* 1 - получаем запрос
		const query = SearchView.getQuery();

		//* 2 - добавляем запрос в state
		model.state.search.query = query;

		//* 2a - если нет query (пустая строка) - чистим заголовок
		!query && CardsView.clearCardsHeader();

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
	console.log('controlFilterCountries: ');

	console.log('region: ', region);

	//* если не получили регион
	if (!region) {
		//* 0 - рендерим спиннер
		CardsView.renderSpinner();

		//* если был поиск - рендерим поиск, иначе рендерим все карточки
		if (model.state.search.results.length > 0) {
			//* 3 - рендерим данные по поиску
			CardsView.render(model.state.search.results);

			//* 4 - рендерим сообщение если query есть
			model.state.search.query &&
				CardsView.renderMessage(model.state.search.query);
		} else {
			await renderAllCountriesCards();
		}

		return;
	}

	//* 0 - рендерим спиннер
	CardsView.renderSpinner();

	//* 1 - фильтруем данные и добавляем region и data в state
	const data =
		model.state.search.results.length > 0
			? model.state.search.results.filter(
					(country) => country.region === region
			  )
			: model.state.allCountries.filter((country) => country.region === region);

	console.log('data: ', data);

	model.state.filter.region = region;
	model.state.filter.results = data;

	//* 2 - если нет по фильтру, то рендерим ошибку
	if (data.length === 0) {
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

//=====================================================
// блок инициализации

//* начало на странице index
async function initIndexHTML() {
	console.log('init index.html');
	filterToggle();
	switchModeSimple();

	//* 0 - отображаем спиннер
	CardsView.renderSpinner();

	//* 1 - начальные данные - все страны
	await renderAllCountriesCards();
	// await renderCountriesCards();

	//todo отображаем страны по поиску
	// renderCountriesCards();
	SearchView.addHandlerSearch(controlSearchCountries);

	//todo отбражаем страны по фильтрам региона
	FilterView.addHandlerFilterRegion(controlFilterRegion);
}

//* начало на странице country
function initCountryHTML() {
	console.log('init country.html');
	switchModeSimple();
}

/* const getData = async (url) => {
	const response = await fetch(url);
	console.log('response: ', response);

	const data = await response.json();
	console.log('data: ', data);

	return data;
};

getData('https://restcountries.eu/rest/v2/all'); */
