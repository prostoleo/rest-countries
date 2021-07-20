export default function () {
	const imgTargets = document.querySelectorAll('img[data-src]');
	// console.log('imgTargets: ', imgTargets);

	const loadImageFn = function (entries, observer) {
		// console.log('entries: ', entries);
		// const [entry] = entries;

		// console.log('entry: ', entry);

		if (!entries.every((entry) => !entry.isIntersecting)) return;

		// if (!entry.isIntersecting) return;

		//* текущий элемент
		/* const curTarget = entry.target;
		console.log('curTarget: ', curTarget); */
		const curTargets = entries.map((entry) => entry.target);

		//* меняем размытое изображение на нормальное
		// curTarget.setAttribute('src', curTarget.dataset.src);

		curTargets.forEach((curTarget) =>
			curTarget.setAttribute('src', curTarget.dataset.src)
		);

		//! чтобы убирать класс только когда изображение загрузилось
		/* curTarget.addEventListener('load', function () {
			curTarget.classList.remove('lazy-img');
		}); */

		curTargets.forEach((curTarget) => {
			curTarget.addEventListener('load', () =>
				curTarget.classList.remove('lazy-load')
			);
		});

		// observer.unobserve(curTarget);

		curTargets.forEach((curTarget) => observer.unobserve(curTarget));
	};

	const loadImageOptions = {
		root: null,

		threshold: [0, 0.25, 0.5, 0.75, 1],
		// rootMargin: '-55%',
		rootMargin: '-500px',
	};

	const imgObserver = new IntersectionObserver(loadImageFn, loadImageOptions);

	//* добавляем ко всем изображения observer
	imgTargets.forEach((img) => {
		imgObserver.observe(img);
	});
}
