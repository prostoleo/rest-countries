export function timeout(s) {
	return new Promise(function (_, reject) {
		setTimeout(function () {
			reject(
				new Error(
					`Запрос занял слишком много времени! Таймаут после ${s} секунд`
				)
			);
		}, s * 1000);
	});
}
