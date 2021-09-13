export default function () {
	'use strict';

	//* кнопка меню
	const toggleFilterBtn = document.querySelector('.right-filter__header');

	//* переменная флаг
	let filterIsOpen = false;

	const clipPathDueToWidth = () => {
		return document.querySelector('html').clientWidth < 599
			? 'border-box circle(150% at 0% 0%)'
			: 'border-box circle(150% at 100% 0%)';
	};

	let clipPathRes = null;

	//* слушаем изменение ширины
	window.addEventListener('resize', () => {
		if (document.querySelector('html').clientWidth <= 599) {
			clipPathRes = 'border-box circle(150% at 0% 0%)';
		} else {
			clipPathRes = 'border-box circle(150% at 100% 0%)';
		}
	});

	//* timeline GSAP
	const tlFilter = gsap.timeline();

	tlFilter
		.to('.right-filter__icon', {
			duration: 0.15,
			rotation: 180,
		})

		.to('.content-filter', {
			clipPath: clipPathRes ?? clipPathDueToWidth,
			opacity: 1,
			duration: 0.25,
		});

	tlFilter.pause();

	toggleFilterBtn.addEventListener('click', (e) => {
		if (!filterIsOpen) {
			tlFilter.play();
			filterIsOpen = !filterIsOpen;
		} else {
			tlFilter.reverse();
			filterIsOpen = !filterIsOpen;
		}
	});
}
