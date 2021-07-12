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
			/* const status = e.target.checked;
			const inputs = wrapper.querySelectorAll('input');

			inputs.forEach((input) => {
				input.checked = false;
			});

			e.target.checked = !status;
 */
			const value = e.target.value;
			console.log('value: ', value);

			handler(value);
		});
	}

	addHandlerSort(handler) {
		this._parentEl.addEventListener('click', (e) => {
			const wrapper = e.target.closest('.content-second');

			if (!wrapper) return;

			const btn = e.target.closest('.content-second__btn');
			console.log('btn: ', btn);

			if (!btn) return;

			const name = btn.dataset.name;
			const sort = btn.dataset.sort;

			console.log('name: ', name);
			console.log('sort: ', sort);

			this.btnRemoveClasses();

			switch (sort) {
				case 'none':
					btn.classList.add('active-up');
					btn.dataset.sort = 'up';
					break;
				case 'up':
					btn.classList.remove('active-up');
					btn.classList.add('active-down');
					btn.dataset.sort = 'down';
					break;
				case 'down':
					btn.classList.remove('active-down');
					btn.dataset.sort = 'none';
					break;

				default:
					break;
			}

			handler(name, sort);
		});
	}

	btnRemoveClasses() {
		this._parentEl.querySelectorAll('.content-second__btn').forEach((btn) => {
			btn.classList.remove('active-down', 'active-up');
			btn.dataset.sort = 'none';

			if (btn.dataset.name === 'name') {
				btn.classList.add('active-up');
			}
		});
	}
}

export default new FilterView();
