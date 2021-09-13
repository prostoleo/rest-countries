//todo импортируем core-js и regenerator
import 'core-js/stable';
import 'regenerator-runtime/runtime.js';

import filterToggle from './js/filter';

import switchModeSimple from './js/switchModeSimple';

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

//* начало на странице index
function initIndexHTML() {
	filterToggle();
	switchModeSimple();
}

//* начало на странице country
function initCountryHTML() {
	switchModeSimple();
}

const getData = async (url) => {
	const response = await fetch(url);

	const data = await response.json();

	return data;
};
