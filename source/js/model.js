'use strict';

//todo импорт конфига
import { API_URL_ALL, API_URL_QUERY, TIMEOUT_SEC } from './config.js';

//todo импорт helper
import { timeout } from './helper.js';

// console.log('model');
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

//todo state
export const state = {
	search: {
		query: '', // string - search value
		results: [], // Array of objects - data to render
		// page: 1, // number - cur not supported
		// resultsPerPage: 12, // number - cur not supported
	},
	filter: {
		region: null, //string
		byPopulation: {
			min: null, // number
			max: null, // number
		},
	},
	sort: {
		population: null, // string - 'asc' / 'des' , default = null
		countryName: null, // string - 'asc' / 'des' , default = null
		capitalName: null, // string - 'asc' / 'des' , default = null
	},
};

//* начало на странице index
function initIndexHTML() {
	console.log('init index.html');
}

//* начало на странице country
function initCountryHTML() {
	console.log('init country.html');
}

export async function getData(query = null) {
	try {
		//* формируем запрос на Rest countries , если есть query
		const request = query
			? fetch(`${API_URL_QUERY}${query}`)
			: fetch(API_URL_ALL);

		//* гонка между таймером и запросом
		const response = await Promise.race([request, timeout(TIMEOUT_SEC)]);

		console.log('response: ', response);

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
		console.error(`💣💣💣 ${err.message}`);
		throw err;
	}
}
