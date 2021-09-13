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
// блок state

//todo state
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

//=====================================================
// блок функций вспомогательных

export async function getData(query = null, code = null) {
	try {
		//* новый вариант чтобы и с кодом работало
		let request = null;

		//* по умолчанию request для всех
		request = fetch(API_URL_ALL);

		//* если есть query то
		if (query) {
			request = fetch(`${API_URL_QUERY}/${query}`);
		}

		//* если есть code то
		if (code) {
			request = fetch(`${API_URL_CODE}/${code.toLowerCase()}`);
		}

		//* гонка между таймером и запросом
		const response = await Promise.race([request, timeout(TIMEOUT_SEC)]);

		//* кидаем ошибку
		if (!response.ok)
			throw new Error(
				`Упс! Что-то пошло не так, попробуйте повторить запрос позже (${response.status})`
			);

		const data = await response.json();

		return data;

		//* обработка ошибки
	} catch (err) {
		throw err;
	}
}

//todo получаем данные о соседях
export async function getDataBorders(borders) {
	try {
		//* формируем запрос на Rest countries для каждой границы
		const requests = borders.map((border) => {
			return fetch(`${API_URL_CODE}/${border}?fields=alpha3Code;name`);
		});

		//* комбинатор all Settled
		const responses = await Promise.all(requests);

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

	//* получаем параметры поиска
	const params = new URLSearchParams(url.search);

	//* создаем объект для параметров
	const searchParams = {};

	//* добавляем в объект параметры
	for (const [key, value] of params) {
		searchParams[key] = value;
	}

	return searchParams;
}

//todo функция для получения search части url
export function updateURL(type, setts) {
	const sortKeys = ['population', 'name', 'capital'];

	let url = new URL(window.location.href);

	let params = new URLSearchParams(url.search);

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

	//* новые поисковые параметры
	const newSearch = params.toString();

	//* вставляем в url
	url.search = newSearch;

	//* меняем url на новый
	history.replaceState(state, null, url);
}

//* начало на странице index
function initIndexHTML() {
	// console.log('init index.html');
}

//* начало на странице country
function initCountryHTML() {
	// console.log('init country.html');
}
