class FilterView {
	_data;
	_parentEl = document.querySelector('.content-filter');

	constructor() {
		// console.log('_parentEl: ', this._parentEl);
	}

	addHandlerFilterRegion(handler) {
		this._parentEl.addEventListener('change', (e) => {
			const value = e.target.value;
			handler(value);
		});
	}
}

export default new FilterView();
