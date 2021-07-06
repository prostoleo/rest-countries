//todo импортируем core-js и regenerator
import 'core-js/stable';
import 'regenerator-runtime/runtime.js';

import filterToggle from './js/filter';

import switchModeSimple from './js/switchModeSimple';

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
function initIndexHTML() {
	console.log('init index.html');
	filterToggle();
	switchModeSimple();
}

//* начало на странице country
function initCountryHTML() {
	console.log('init country.html');
	switchModeSimple();
}

const getData = async (url) => {
	const response = await fetch(url);
	console.log('response: ', response);

	const data = await response.json();
	console.log('data: ', data);

	return data;
};

// getData('https://restcountries.eu/rest/v2/all');
