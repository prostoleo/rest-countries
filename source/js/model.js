'use strict';

//todo импорт конфига
import {
	API_URL_ALL,
	API_URL_QUERY,
	API_URL_CODE,
	TIMEOUT_SEC,
} from './config.js';

//todo импорт helper
import { timeout } from './helper.js';

// console.log('model');

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
// блок state

//todo state
/* export let state = JSON.parse(localStorage.getItem('countries-state')) ?? { */
export let state = clearState(
	JSON.parse(localStorage.getItem('countries-state'))
) ?? {
	allCountries: [], // Array of objects - all countries
	currentData: [], // Array of objects - currentData
	search: {
		query: '', // string - search value
		results: [], // Array of objects - data to render
		// page: 1, // number - cur not supported
		// resultsPerPage: 12, // number - cur not supported
	},
	filter: {
		results: [], // array of sorted results
		region: 'all', //string
		byPopulation: {
			min: 0, // number
			max: 1400000000, // number
		},
	},
	sort: {
		population: 'none', // string - 'up' / 'down' , default = none
		// countryName: 'up', // string - 'up' / 'down' /  , default = up
		countryName: 'none', // string - 'up' / 'down' /  , default = none
		capitalName: 'none', // string - 'up' / 'down' , default = none
	},
	country: {
		id: null, // default - null, country.alpha3Code

		countryHTMLFullInfo: {}, // full info on country
		borderCountries: [
			/* {
				id: null, // default - null, alpha3Code
				name: null, // default - null, country.name
			},  */
		], // default - [], array of objects
	},
	prevId: null, // default - null, country.alpha3Code
};

//todo clearState
function clearState(state) {
	//* если state нет
	if (!state) return null;

	const clearedState = state;
	console.log('clearedState: ', clearedState);

	//* очищаем ненужные поля
	clearedState.currentData = [];
	clearedState.search.query = '';
	clearedState.search.results = [];

	clearedState.filter.results = [];
	clearedState.filter.region = 'all';
	clearedState.filter.byPopulation.min = 0;
	clearedState.filter.byPopulation.max = 1400000000;

	clearedState.sort.population = 'none';
	clearedState.sort.countryName = 'none';
	clearedState.sort.capitalName = 'none';

	return clearedState;
}

//todo save prev state
/* export function savePrevState(receivedState) {
	localStorage.setItem('country-prev-state', JSON.stringify(receivedState));
}

//todo save prev state
export function getPrevState() {
	return JSON.parse(localStorage.getItem('country-prev-state'));
}

export function setPrevState(prevState) {
	savePrevState(state);

	state = prevState;
} */
//! убрал для того чтобы кнопка back просто перемезала на index.html
//todo save prev state
/* export function savePrevState(receivedState, id) {
	console.log('savePrevState - receivedState - 1): ', receivedState);
	receivedState.prevId = state.prevId;
	console.log('savePrevState - receivedState - 2): ', receivedState);

	console.log('foo - savePrevState - id: ', id);
	localStorage.setItem(
		`country-prev-state${id ? id : ''}`,
		JSON.stringify(receivedState)
	);
}

//todo save prev state
export function getPrevState(id) {
	return JSON.parse(localStorage.getItem(`country-prev-state${id ? id : ''}`));
}

export function setPrevState(prevState) {
	// savePrevState(state);

	state = prevState;
} */

//=====================================================
// блок функций вспомогательных

export async function getData(query = null, code = null) {
	try {
		//* формируем запрос на Rest countries , если есть query
		/* const request = query
			? fetch(`${API_URL_QUERY}/${query}`)
			: fetch(API_URL_ALL); */

		//* новый вариант чтобы и с кодом работало
		let request = null;

		//* по умолчанию request для всех
		request = fetch(API_URL_ALL);

		//* если есть query то
		console.log('query: ', query);
		if (query) {
			request = fetch(`${API_URL_QUERY}/${query}`);
		}

		//* если есть code то
		console.log('code: ', code);
		if (code) {
			request = fetch(`${API_URL_CODE}/${code.toLowerCase()}`);
		}

		//* гонка между таймером и запросом
		const response = await Promise.race([request, timeout(TIMEOUT_SEC)]);

		// console.log('response: ', response);

		//* кидаем ошибку
		if (!response.ok)
			throw new Error(
				`Упс! Что-то пошло не так, попробуйте повторить запрос позже (${response.status})`
			);

		const data = await response.json();
		console.log('data: ', data);

		return data;

		//* обработка ошибки
	} catch (err) {
		// console.error(`💣💣💣 ${err.message}`);
		throw err;
	}
}

//todo получаем данные о соседях
export async function getDataBorders(borders) {
	try {
		console.log('borders: ', borders);
		//* формируем запрос на Rest countries для каждой границы
		const requests = borders.map((border) => {
			return fetch(`${API_URL_CODE}/${border}?fields=alpha3Code;name`);
		});
		console.log('requests: ', requests);

		//* комбинатор all Settled
		const responses = await Promise.all(requests);

		console.log('responses: ', responses);

		//* кидаем ошибку
		/* if (!response.ok)
			throw new Error(
				`Упс! Что-то пошло не так, попробуйте повторить запрос позже (${response.status})`
			); */
		responses.forEach((response) => {
			if (!response.ok) {
				throw new Error(
					`Oops, something went wrong. Try again later (${response.status})`
				);
			}
		});

		//* седлать через map или цикл
		/* const data = await response.json();
		return data; */

		//! работает
		let data = [];

		for (let i = 0; i < responses.length; i++) {
			const el = await responses[i].json();
			data.push(el);
			// console.log('data: ', data);
		}

		return data;

		//* обработка ошибки
	} catch (err) {
		// console.error(`💣💣💣 ${err.message}`);
		throw err;
	}
}

//todo обновляем localStorage
export function updateLS(receivedState) {
	localStorage.setItem('countries-state', JSON.stringify(receivedState));
}

//todo получаем параметры поиска
export function getUrlSearchParams() {
	//* получаем url
	const url = new URL(window.location.href);
	console.log('url: ', url);

	//* получаем параметры поиска
	const params = new URLSearchParams(url.search);
	console.log('params: ', params);

	//* создаем объект для параметров
	const searchParams = {};

	//* добавляем в объект параметры
	for (const [key, value] of params) {
		searchParams[key] = value;
	}
	console.log('searchParams: ', searchParams);

	return searchParams;
}

//todo функция для получения search части url
export function updateURL(type, setts) {
	console.log('type: ', type);
	console.log('setts: ', setts);
	/* const url = window.location.search;
	console.log('url: ', url);
	// console.log('url: ', url);


	//* если у url нет параметров поиска
	if (!url) {
		switch (type) {
			//? если тип - фильтрация регионов
			case 'filter-region':
				history.pushState(null, null, `?region=${region}`);
				break;
			//? если тип - сортировка
			case 'sort':
				const [name, sort] = setts;

				history.pushState(null, null, `?${name}=${sort}`);
				break;

			//? если тип - фильтрация по населению
			case 'filter-population':
				const [min, max] = setts;

				history.pushState(null, null, `?min=${min}&max=${max}`);
				break;

			default:
				break;
		}

		return;
	}

	//* если у url есть параметры поиска
	if (url) {
		switch (type) {
			//? если тип - фильтрация регионов
			case 'filter-region':
				history.pushState(null, null, `?region=${region}`);
				break;
			//? если тип - сортировка
			case 'sort':
				const [name, sort] = params;

				history.pushState(null, null, `?${name}=${sort}`);
				break;

			//? если тип - фильтрация по населению
			case 'filter-population':
				const [min, max] = params;

				history.pushState(null, null, `?min=${min}&max=${max}`);
				break;

			default:
				break;
		}

		return;
	} */

	const sortKeys = ['population', 'name', 'capital'];

	let url = new URL(window.location.href);
	console.log('url: ', url);
	// console.log('url: ', url);

	let params = new URLSearchParams(url.search);
	console.log('params-1: ', params);

	//* если у url нет параметров поиска
	switch (type) {
		case 'filter-region':
			const region = setts;
			params.set('region', region);

			break;

		case 'sort':
			const [name, sort] = setts;
			params.set(name, sort);

			//* очищаем другие сортировки
			sortKeys.forEach((sortKey) => {
				if (sortKey !== name) params.delete(sortKey);
			});

			break;

		case 'filter-population':
			const [min, max] = setts;
			params.set('min', min);
			params.set('max', max);
			break;

		case 'country-id':
			const id = setts;
			params.set('id', id);
			break;

		default:
			break;
	}
	console.log('params-2: ', params);

	//* новые поисковые параметры
	const newSearch = params.toString();
	console.log('newSearch: ', newSearch);

	//* вставляем в url
	url.search = newSearch;

	//* меняем url на новый
	// history.replaceState(null, null, url);
	// history.pushState(state, null, url);
	history.replaceState(state, null, url);
}

/* const bel = await getData('bel');
console.log('bel: ', bel); */

//=====================================================
// блок функций

/* export async function searchCountriesOnQuery(query) {
	//todo получаем данные по поисковому запросу
	const data = await getData(query.toLowerCase());
	console.log('data: ', data);

	//* обновляем state
	state.search.query = query;
	state.search.results = data;
	console.log('state.search: ', state.search);
} */

//=====================================================
// блок инициализации

//* начало на странице index
function initIndexHTML() {
	// console.log('init index.html');
}

//* начало на странице country
function initCountryHTML() {
	// console.log('init country.html');
}
