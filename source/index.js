//todo импортируем core-js и regenerator
import 'core-js/stable';
import 'regenerator-runtime/runtime.js';
// import path from 'path';

// import './scss/main.scss';
// import '/scss/main.scss';

console.log('hello from snowpack');

const getData = async (url) => {
	const response = await fetch(url);
	console.log('response: ', response);

	const data = await response.json();
	console.log('data: ', data);

	return data;
};

getData('https://restcountries.eu/rest/v2/all');
