'use strict';

//todo импортируем core-js и regenerator
import 'core-js/stable';
import 'regenerator-runtime/runtime.js';

//* мои импорты
import * as model from './model.js';
import CardsView from './Views/CardsView.js';
console.log('CardsView: ', CardsView);
import CountryView from './Views/CountryView.js';

/* console.log('CardsView: ', CardsView);
console.log('CountryView: ', CountryView); */

import filterToggle from './filter.js';
import switchModeSimple from './switchModeSimple.js';

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

//* начало на странице index
async function initIndexHTML() {
	console.log('init index.html');
	filterToggle();
	switchModeSimple();

	//* начальные данные - все страны
	const allCountries = await model.getData();
	model.state.allCountries = allCountries;
	console.log('model.state: ', model.state);

	CardsView.render(model.state.allCountries);
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
