class FilterView {
	_data;
	_parentEl = document.querySelector('.content-filter');

	constructor() {
		// console.log('_parentEl: ', this._parentEl);
	}

	addHandlerFilterRegion(handler) {
		this._parentEl.addEventListener('change', (e) => {
			//* проверяем кликнули ли в область региона
			const wrapper = e.target.closest('.radio');
			console.log('wrapper: ', wrapper);

			if (!wrapper) return;

			console.log('e.target.checked: ', e.target.checked);

			//* проверка - если не чекнутый просто вызываем, иначе получаем value
			if (!e.target.checked) {
				// e.target.checked = false;
				handler();
			} else {
				const value = e.target.value;
				console.log('value: ', value);

				handler(value);
			}
		});
	}
}

export default new FilterView();
