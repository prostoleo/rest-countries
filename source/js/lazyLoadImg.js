export default function () {
	// const imgTargets = document.querySelectorAll('img[data-src]');
	// if (document.querySelector('html').clientWidth >= 1200) {
	const imgTargets = document.querySelectorAll('img[data-src]');

	const loadImageFn = function (entries, observer) {
		if (!entries.every((entry) => !entry.isIntersecting)) return;

		//* текущий элемент
		const curTargets = entries.map((entry) => entry.target);

		//* меняем размытое изображение на нормальное
		curTargets.forEach((curTarget) =>
			curTarget.setAttribute('src', curTarget.dataset.src)
		);

		curTargets.forEach((curTarget) => {
			curTarget.addEventListener('load', () =>
				curTarget.classList.remove('lazy-load')
			);
		});
		curTargets.forEach((curTarget) => observer.unobserve(curTarget));
	};

	const loadImageOptions = {
		root: null,

		threshold: [0, 0.25, 0.5, 0.75, 1],
		rootMargin: '-500px',
	};

	const imgObserver = new IntersectionObserver(loadImageFn, loadImageOptions);

	//* добавляем ко всем изображения observer
	imgTargets.forEach((img) => {
		imgObserver.observe(img);
	});
}
