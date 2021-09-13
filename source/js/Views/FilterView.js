class FilterView {
	_data;
	_parentEl = document.querySelector('.content-filter');
	_filterPopulationEls = document.querySelectorAll('.filter-third__input');

	constructor() {
		this.inputFormatPopulation(this._filterPopulationEls);
	}

	addHandlerFilterRegion(handler) {
		this._parentEl.addEventListener('change', (e) => {
			//* проверяем кликнули ли в область региона
			const wrapper = e.target.closest('.radio');

			if (!wrapper) return;

			const value = e.target.value;

			handler(value);
		});
	}

	addHandlerSort(handler) {
		this._parentEl.addEventListener('click', (e) => {
			//* проверка есть ли оболочка
			const wrapper = e.target.closest('.content-second');

			if (!wrapper) return;

			//* проверка есть ли кнопка
			const btn = e.target.closest('.content-second__btn');

			if (!btn) return;

			//* получаем поле сортировки у кнопки и параметры сортировки
			const name = btn.dataset.name;
			let sort = btn.dataset.sort;

			//* убираем все активные классы
			this.btnRemoveClasses();

			//* проверяем какая именно сортировка должна быть и устанавливаем нужные классы и dataset
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

			//* обновляем sort
			sort = btn.dataset.sort;

			handler(name, sort);
		});
	}

	addHandlerFilterPopulation(handler) {
		this._parentEl.querySelectorAll('.filter-third__input').forEach((input) =>
			input.addEventListener('input', (e) => {
				//* проверяем есть ли обертка
				const wrapper = e.target.closest('.filter-third__content');

				if (!wrapper) return;

				//* проверяем есть ли input
				const input = e.target.closest('.filter-third__input');

				if (!input) return;

				//* получаем значения
				const values = [];

				const inputs = wrapper.querySelectorAll('.filter-third__input');

				inputs.forEach((input, i, arr) => {
					values.push(+input.value);
				});

				//* сортируем массив
				values.sort((a, b) => +a - +b);

				//* вытаксиваем значения
				const [min, max] = values;

				//* получаем label
				const labels = wrapper.querySelectorAll('.label-num');

				labels[0].textContent = `${this._formatPopulation(min)}`;
				labels[1].textContent = `${this._formatPopulation(max)}`;

				//* вызываем функцию и отображаем в чел, а не в тыс. чел
				handler(min, max);
			})
		);
	}

	inputFormatPopulation(inputs) {
		inputs.forEach((input) => {
			const value = input.value;

			const formattedValue = this._formatPopulation(value);
			input.value = formattedValue;
		});
	}

	//* чтобы числа отображались с пробелами / точками запятыми в соответсвии с locale
	_formatPopulation(num) {
		const locale = navigator.language;

		return Intl.NumberFormat(locale).format(num);
	}

	//* убираем активные классы на все кнопках сортировки
	btnRemoveClasses() {
		this._parentEl.querySelectorAll('.content-second__btn').forEach((btn) => {
			btn.classList.remove('active-down', 'active-up');
			btn.dataset.sort = 'none';

			/* if (btn.dataset.name === 'name') {
				btn.classList.add('active-up');
			} */
		});
	}
}

export default new FilterView();
