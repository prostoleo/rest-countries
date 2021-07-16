const borders = ['ARG', 'AFG', 'ALA', 'ALB'];

export async function getDataBorders(borders) {
	try {
		console.log('borders: ', borders);
		//* формируем запрос на Rest countries для каждой границы
		const requests = borders.map((border) => {
			return fetch(
				`https://restcountries.eu/rest/v2/alpha/${border}?fields=alpha3Code;name`
			);
		});

		//* комбинатор all Settled
		const responses = await Promise.all([...requests]);

		console.log('responses: ', responses);

		//* кидаем ошибку
		/* if (!response.ok)
			throw new Error(
				`Упс! Что-то пошло не так, попробуйте повторить запрос позже (${response.status})`
			); */
		responses.forEach((response) => {
			if (!response.ok) {
				throw new Error(
					`Oops, something went wrong. Try again later (${response.status})`
				);
			}
		});

		//* седлать через map или цикл
		// const data = await response.json();
		const data = responses.map(async (response) => {
			return await response.json();
		});
		console.log('data: ', data);

		return data;

		//* обработка ошибки
	} catch (err) {
		// console.error(`💣💣💣 ${err.message}`);
		throw err;
	}
}

export async function init() {
	const dataBorders = await getDataBorders(borders);
	// console.log('dataBorders: ', dataBorders);

	let bordersInner = [];

	await dataBorders.forEach(async (dataBorder, i) => {
		const border = await dataBorder;
		bordersInner.push(border);
	});

	// console.log('bordersInner: ', bordersInner);
	// console.log('bordersInner[0].name: ', bordersInner[0].name);
}

// init();

const bordersInfoFinal = [
	{ name: 'Belarus', alpha3Code: 'BLR' },
	{ name: 'Ukraine', alpha3Code: 'UKR' },
];

const obj = {
	alpha3Code: 'RUS',
};

export function resString(borders) {
	const str = borders
		.map((border) => {
			return `
			<li class="borders-content__item">
				<a href="./country.html/id=${border.alpha3Code.toLowerCase()}" class="btn borders-content__link" data-country-id="${
				border.alpha3Code
			}">
				${border.name}
				</a>
			</li>
		`;
		})
		.join('');

	console.log('str: ', str);
}

resString(bordersInfoFinal);
