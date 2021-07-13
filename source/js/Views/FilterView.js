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

	addHandlerFilterPopulation(handler) {
		this._parentEl.querySelectorAll('.filter-third__input').forEach((input) =>
			input.addEventListener('input', (e) => {
				// console.log('e: ', e);

				//* проверяем есть ли обертка
				const wrapper = e.target.closest('.filter-third__content');
				// console.log('wrapper: ', wrapper);

				if (!wrapper) return;

				//* проверяем есть ли input
				const input = e.target.closest('.filter-third__input');
				// console.log('input: ', input);

				if (!input) return;

				//* получаем значения
				const values = [];

				const inputs = wrapper.querySelectorAll('.filter-third__input');
				// console.log('inputs: ', inputs);

				inputs.forEach((input, i, arr) => {
					values.push(+input.value);
				});
				// console.log('values: ', values);

				//* сортируем массив
				values.sort((a, b) => +a - +b);

				//* вытаксиваем значения
				const [min, max] = values;

				//* получаем label
				const labels = wrapper.querySelectorAll('.label-num');

				labels[0].textContent = `${this._formatPopulation(min)} k`;
				labels[1].textContent = `${this._formatPopulation(max)} k`;

				//* вызываем функцию и отображаем в чел, а не в тыс. чел
				handler(min * 1000, max * 1000);
			})
		);
	}

	_formatPopulation(num) {
		const locale = navigator.language;

		return Intl.NumberFormat(locale).format(num);
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
