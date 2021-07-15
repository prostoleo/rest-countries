class SearchView {
	_data;
	_parentEl = document.querySelector('.left-filter');
	_input = this._parentEl.querySelector('input');

	constructor() {
		// console.log('_parentEl: ', this._parentEl);
	}

	//* слушатель для поиска
	addHandlerSearch(handler) {
		//* слушаем событие input на searchbox
		this._input.addEventListener('input', (e) => {
			//* получаем запрос
			const query = e.currentTarget.value.trim();
			console.log('query: ', query);

			if (!query) return;

			handler(query);

			//* как только input теряет focus, то обнуляем значение
			this._input.addEventListener('blur', (e) => {
				e.currentTarget.value = '';
			});
		});
	}

	getQuery() {
		/* const query = this._input.value.trim();
		if (query) {
			return query;
		} else {
			this._clearCardsHeader();
		} */
		//* возвращаем значение input
		return this._input.value.trim();
	}
}

export default new SearchView();
