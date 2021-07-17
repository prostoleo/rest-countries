class CountryView {
	_data;
	_dataBorders;
	_parentEl = document.querySelector('.country__wrapper');
	// _bordersWrapper = document.querySelector('.borders-content__wrapper');
	_messageEl = this._parentEl?.querySelector('.country__message');
	_errorMessage = 'Could not load data of country😞 Try again later';

	constructor() {}

	//todo рендерим
	async render(data, dataBorders, errMsg = null) {
		console.log('data: ', data);
		console.log('dataBorders: ', dataBorders);
		//* проверка получили ли данные
		if (data.length === 0) {
			// this.renderError(this._errorNoCountrySearch);
			return;
		}
		//* присваиваем данные
		this._data = data;
		this._dataBorders = dataBorders;

		//* очищаем parentEl
		this.clear();

		const html = this._generateMarkup(this._data, dataBorders);
		console.log('html: ', html);

		/* const htmlBorders = await this.renderBorderCountries(this._dataBorders);
		console.log('htmlBorders: ', htmlBorders); */

		// await this._parentEl.insertAdjacentHTML('afterbegin', html);
		/* await this._bordersWrapper.insertAdjacentHTML('afterbegin', htmlBorders); */

		await this.insertMarkUp(html);
	}

	async insertMarkUp(html) {
		this._parentEl.insertAdjacentHTML('afterbegin', html);
	}

	clear() {
		this._parentEl.innerHTML = '';
	}

	_clearMessage() {
		this._messageEl.innerHTML = '';
	}

	_generateMarkup(country, borders) {
		console.log('borders: ', borders);

		const str = this.renderBorderCountries(borders);
		console.log('str: ', str);

		const markup = `
		<div class="country__flag">
			<img
				src="${country.flag}"
				alt="flag of ${country.name}"
				class="country__flag-img"
			/>
		</div>
		<!-- /.country__flag -->

		<div class="country__info info-country">
			<h2 class="info-country__title">${country.name}</h2>
			<div class="info-country__content">
				<div class="info-country__col">
					<p class="info-country__text">
						<span class="info-country__key">Native Name:</span>
						<span class="info-country__value">${country.nativeName}</span>
					</p>
					<!-- /.info-country__text -->
					<p class="info-country__text">
						<span class="info-country__key"> Population: </span>
						<span class="info-country__value"> ${this.formatPopulation(
							country.population
						)} </span>
					</p>
					<!-- /.info-country__text -->
					<p class="info-country__text">
						<span class="info-country__key">Region:</span>
						<span class="info-country__value">${country.region}</span>
					</p>
					<!-- /.info-country__text -->
					<p class="info-country__text">
						<span class="info-country__key">Sub Region:</span>
						<span class="info-country__value">${country.subregion}</span>
					</p>
					<!-- /.info-country__text -->
					<p class="info-country__text">
						<span class="info-country__key">Capital:</span>
						<span class="info-country__value">${country.capital}</span>
					</p>
					<!-- /.info-country__text -->
				</div>
				<!-- /.info-country__col -->
				<div class="info-country__col">
					<p class="info-country__text">
						<span class="info-country__key">Top Level Domain:</span>
						<span class="info-country__value">${country.topLevelDomain}</span>
					</p>
					<!-- /.info-country__text -->
					<p class="info-country__text">
						<span class="info-country__key">Currencies: </span>
						<span class="info-country__value">${country.currencies[0].name} - ${
			country.currencies[0].symbol
		} </span>
					</p>
					<!-- /.info-country__text -->
					<p class="info-country__text">
						<span class="info-country__key">Languages:</span>
						<span class="info-country__value">${country.languages[0].name} - ${
			country.languages[0].nativeName
		}</span>
					</p>
				</div>
				<!-- /.info-country__col -->
			</div>
			<!-- /.info-country__content -->

			<div class="info-country__content-bottom">
				<div class="info-country__content-borders borders-content">
					<h4 class="borders-content__title">Border Countries:</h4>
					<ul class="borders-content__wrapper">
						${str}
					</ul>
				</div>
				<!-- /.info-country__content-borders borders-content -->
			</div>
			<!-- /.info-country__content-bottom -->
		</div>
		<!-- /.country__info -->
		`;

		return markup;
	}

	_generateMarkupBorder(border) {
		// ${borders.map(await this._generateMarkupBorder).join('')}

		console.log('border: ', border);
		return `
		<li class="borders-content__item">
			<a href="./country.html/id=${border.alpha3Code.toLowerCase()}" class="btn borders-content__link" data-country-id="${
			border.alpha3Code
		}">
			${border.name}
			</a>
		</li>
		`;

		/* return `
		<li class="borders-content__item">
			<a href="#" class="btn borders-content__link">
				Belarus
			</a>
		</li>
		`; */
	}

	renderBorderCountries(borders) {
		console.log('borders: ', borders);

		// prettier-ignore
		const str = borders.map((border) => {
			// console.log('border: ', border);
			return `
			<li class="borders-content__item">
			<a href="./country.html/id=${border.alpha3Code.toLowerCase()}" class="btn borders-content__link" data-country-id="${
				border.alpha3Code.toLowerCase()
			}">${border.name}</a>
			</li>
			`;
		}).join('');
		console.log('str: ', str);

		return str;
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

		// this._cardsHeader.innerHTML = html;
	}

	renderMessage(query) {
		// this.clearCardsHeader();

		const html = `<h2 class="cards__title">Results on query: <span>${query}</span></h2>`;

		// this._cardsHeader?.innerHTML = html;
	}

	clearCardsHeader() {
		// this._cardsHeader?.innerHTML = '';
	}

	formatPopulation(num) {
		const locale = navigator.language;

		return Intl.NumberFormat(locale).format(num);
	}
}

export default new CountryView();
