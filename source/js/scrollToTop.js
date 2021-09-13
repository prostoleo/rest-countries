export default function () {
	const links = document.querySelectorAll('a[data-to]');

	links.forEach(controlScrollTo);

	function controlScrollTo(link) {
		link.addEventListener('click', (e) => {
			const to = e.currentTarget.dataset.to;

			if (!to) return;

			const elToScroll = document.querySelector(to);

			elToScroll.scrollIntoView({ behavior: 'smooth' });
		});
	}
}
