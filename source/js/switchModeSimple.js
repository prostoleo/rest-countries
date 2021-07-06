export default function () {
	'use strict';

	let darkMode = localStorage.getItem('country-dark-mode');
	console.log('darkMode: ', darkMode);

	const btnSwitchMode = document.querySelector('.header__mode');

	//todo foo enableDarkMode
	function enableDarkMode() {
		// 1 - добавляем класс darkmode - к body
		document.documentElement.classList.add('darkmode');

		// 2 - обновляем country-dark-mode в LS
		localStorage.setItem('country-dark-mode', 'enabled');

		// 3 - меняем иконку кнопки и название
		btnSwitchMode.innerHTML = `
			<ion-icon name="moon-outline" class="header__mode-icon"></ion-icon>
			<span class="header__mode-text">Light Mode</span>
		`;
	}

	//todo foo disableDarkMode
	function disableDarkMode() {
		// 1 - добавляем класс darkmode - к body
		document.documentElement.classList.remove('darkmode');

		// 2 - обновляем country-dark-mode в LS
		localStorage.setItem('country-dark-mode', null);

		// 3 - меняем иконку кнопки и название
		btnSwitchMode.innerHTML = `
			<ion-icon name="moon" class="header__mode-icon"></ion-icon>
			<span class="header__mode-text">Dark Mode</span>
		`;
	}

	//todo если страница загрузилась и весит darkMode - то включаем его
	if (darkMode === 'enabled') {
		enableDarkMode();
	} else disableDarkMode();

	//* слушатель события
	btnSwitchMode.addEventListener('click', (e) => {
		darkMode = localStorage.getItem('country-dark-mode');
		console.log('darkMode-add-1: ', localStorage.getItem('country-dark-mode'));
		if (darkMode !== 'enabled') {
			enableDarkMode(e);
		} else {
			disableDarkMode(e);
		}
		console.log('darkMode-add-2: ', localStorage.getItem('country-dark-mode'));
	});
}
