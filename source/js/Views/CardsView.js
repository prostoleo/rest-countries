class CardsView {
	_data;
	_parentEl = document.querySelector('.cards__list');
	_cardsHeader = document.querySelector('.cards__header');
	_errorMessage = 'Oops, some error occured 😞 Try again later!';
	_errorNoCountrySearch =
		'Sorry, no country was found 😞 Try search for something else!';

	constructor() {
		// console.log('_parentEl: ', this._parentEl);
	}

	hello() {
		console.log('CardsView: ');
	}

	//todo рендерим
	render(data, errMsg = null) {
		console.log('data: ', data);
		//* проверка получили ли данные
		if (data.length === 0) {
			// this.renderError(this._errorNoCountrySearch);
			return;
		}
		//* присваиваем данные
		this._data = data;

		//* очищаем parentEl
		this.clear();

		const html = this._generateMarkup(this._data);
		// console.log('html: ', html);

		this._parentEl.insertAdjacentHTML('afterbegin', html);
	}

	clear() {
		this._parentEl.innerHTML = '';
	}

	_generateMarkup(data) {
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
                <span class="card__span">${this.formatPopulation(
									country.population
								)}</span>
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

	renderSpinner() {
		this.clear();

		const html = `
			<div class="cards__spinner-wrapper">
				<img src="./img/icons/fontisto_spinner.svg" alt="spinner icon" class="cards__spinner">
			</div>
		`;

		this._parentEl.insertAdjacentHTML('afterbegin', html);
	}

	renderError(errMsg) {
		const msg = errMsg ?? this._errorMessage;

		const html = `<h2 class="cards__title">${msg}</h2>`;

		// this.clearCardsHeader();

		this._cardsHeader.innerHTML = html;
	}

	renderMessage(query) {
		this.clearCardsHeader();

		const html = `<h2 class="cards__title">Results on query: <span>${query}</span></h2>`;

		this._cardsHeader.innerHTML = html;
	}

	clearCardsHeader() {
		this._cardsHeader.innerHTML = '';
	}

	formatPopulation(num) {
		const locale = navigator.language;

		return Intl.NumberFormat(locale).format(num);
	}
}

export default new CardsView();
