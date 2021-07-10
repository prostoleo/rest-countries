class CardsView {
	_data;
	_parentEl = document.querySelector('.cards__list');

	constructor() {
		console.log('_parentEl: ', this._parentEl);
	}

	hello() {
		console.log('CardsView: ');
	}

	//todo рендерим
	render(data) {
		//* присваиваем данные
		this._data = data;
		console.log('this._data: ', this._data);

		//* очищаем parentEl
		this._clear();

		const html = this.generateMarkup(this._data);
		// console.log('html: ', html);

		this._parentEl.insertAdjacentHTML('afterbegin', html);
	}

	_clear() {
		this._parentEl.innerHTML = '';
	}

	generateMarkup(data) {
		return data
			.map((country) => {
				return `
        <li class="cards__item">
          <a href="/country.html" class="cards__link card" data-country-id="">
            <img src="${country.flag}" alt="" class="card__img">
            <div class="card__content">
              <h3 class="card__title">${country.name}</h3>
              <p class="card__text">
                <span class="card__subtitle">Population:</span>
                <span class="card__span">${country.population}</span>
              </p>
              <p class="card__text">
                <span class="card__subtitle">Region:</span>
                <span class="card__span">${country.region}</span>
              </p>
              <p class="card__text">
                <span class="card__subtitle">Capital:</span>
                <span class="card__span">${country.capital}</span>
              </p>
            </div>
          </a>
        </li>
      `;
			})
			.join('');
	}
}

export default new CardsView();
