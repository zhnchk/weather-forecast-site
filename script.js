'use strict';

const weather = {
	apiKey: 'dcad83dca2f8384d522f0775a506cc55',
	fetchCurrentWeather(positionInput = null) {
		if (positionInput === null) {
			const successCallback = position => {
				const { latitude, longitude } = position.coords;

				fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${this.apiKey}`)
					.then(response => response.json())
					.then(data => this.displayCurrentWeather(data));

				fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${this.apiKey}`)
					.then(response => response.json())
					.then(data => this.displayHourly(data));
			};
			navigator.geolocation.getCurrentPosition(successCallback);
		} else {
			fetch(`https://api.openweathermap.org/data/2.5/weather?q=${positionInput}&units=metric&appid=${this.apiKey}`)
				.then(response => response.json())
				.then(data => this.displayCurrentWeather(data))
				.catch(() => this.showError());

			fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${positionInput}&units=metric&appid=${this.apiKey}`)
				.then(response => response.json())
				.then(data => this.displayHourly(data))
				.catch(() => this.showError());
		}
	},
	fetchFiveDayForecast(positionInput = null) {
		if (positionInput === null) {
			const successCallback = position => {
				const { latitude, longitude } = position.coords;

				fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${this.apiKey}`)
					.then(response => response.json())
					.then(data => this.displayFiveDayForecast(data));
			};
			navigator.geolocation.getCurrentPosition(successCallback);
		} else {
			fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${positionInput}&units=metric&appid=${this.apiKey}`)
				.then(response => response.json())
				.then(data => this.displayFiveDayForecast(data))
				.catch(() => this.showError());
		}
	},
	displayFiveDayForecast(data) {
		this.showSecondScreen();

		let i = 0;
		document.querySelectorAll('.short-forecast__section').forEach(element => {
			element.firstElementChild.textContent = parseDay(+(data.list[i].dt + '000'));
			element.firstElementChild.nextElementSibling.textContent = parseMonthAndDate(+(data.list[i].dt + '000'));
			element.firstElementChild.nextElementSibling.nextElementSibling.src = `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`;
			element.lastElementChild.previousElementSibling.textContent = Math.round(data.list[i].main.temp) + '°C';
			element.lastElementChild.textContent = data.list[i].weather[0].main;

			if (element.style.backgroundColor === 'rgb(183, 167, 174)') {
				let j = i;
				document.querySelectorAll('.f-day-forecast__section').forEach(iterator => {
					iterator.firstElementChild.textContent = parseHours(data.list[j].dt_txt);
					iterator.firstElementChild.nextElementSibling.src = `https://openweathermap.org/img/wn/${data.list[j].weather[0].icon}@2x.png`;
					iterator.firstElementChild.nextElementSibling.nextElementSibling.textContent = data.list[j].weather[0].main;
					iterator.lastElementChild.previousElementSibling.previousElementSibling.textContent =
						Math.round(data.list[j].main.temp) + '°C';
					iterator.lastElementChild.previousElementSibling.textContent = Math.round(data.list[j].main.feels_like) + '°C';
					iterator.lastElementChild.textContent = data.list[j].wind.speed + ' ' + windDirection(data.list[j].wind.deg);
					j++;
				});
				function parseHours(time) {
					switch (time.split(' ')[1].split(':')[0]) {
						case '00':
							return '12AM';
						case '03':
							return '3AM';
						case '06':
							return '6AM';
						case '09':
							return '9AM';
						case '12':
							return '12PM';
						case '15':
							return '3PM';
						case '18':
							return '6PM';
						case '21':
							return '9PM';
					}
				}
				function windDirection(deg) {
					if (deg <= 90) return 'NE';
					else if (deg > 90 && deg <= 180) return 'SE';
					else if (deg > 180 && deg <= 270) return 'SW';
					else return 'NW';
				}
			}
			function parseDay(unixTime) {
				switch (new Date(unixTime).getDay()) {
					case 0:
						return 'SUN';
					case 1:
						return 'MON';
					case 2:
						return 'TUE';
					case 3:
						return 'WED';
					case 4:
						return 'THU';
					case 5:
						return 'FRI';
					case 6:
						return 'SAT';
				}
			}
			function parseMonthAndDate(unixTime) {
				const date = new Date(unixTime);
				switch (date.getMonth()) {
					case 0:
						return 'JAN' + ' ' + date.getDate().toString().padStart(2, '0');
					case 1:
						return 'FEB' + ' ' + date.getDate().toString().padStart(2, '0');
					case 2:
						return 'MAR' + ' ' + date.getDate().toString().padStart(2, '0');
					case 3:
						return 'APR' + ' ' + date.getDate().toString().padStart(2, '0');
					case 4:
						return 'MAY' + ' ' + date.getDate().toString().padStart(2, '0');
					case 5:
						return 'JUN' + ' ' + date.getDate().toString().padStart(2, '0');
					case 6:
						return 'JUL' + ' ' + date.getDate().toString().padStart(2, '0');
					case 7:
						return 'AUG' + ' ' + date.getDate().toString().padStart(2, '0');
					case 8:
						return 'SEP' + ' ' + date.getDate().toString().padStart(2, '0');
					case 9:
						return 'OCT' + ' ' + date.getDate().toString().padStart(2, '0');
					case 10:
						return 'NOV' + ' ' + date.getDate().toString().padStart(2, '0');
					case 11:
						return 'DEC' + ' ' + date.getDate().toString().padStart(2, '0');
				}
			}
			i += 8;
		});
	},
	displayCurrentWeather(data) {
		this.showFirstScreen();
		const { main, icon } = data.weather[0],
			{ temp, feels_like } = data.main,
			{ sunrise, sunset } = data.sys;
		document.querySelector('main').style.display = 'block';
		document.querySelectorAll('.current-weather__main').forEach(element => (element.textContent = main));
		document.querySelector('.current-weather__date').textContent = parseDate();
		document.querySelector('.current-weather__img').src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
		document.querySelector('.current-weather__real-temperature').textContent = temp.toFixed(1) + '°C';
		document.querySelector('.current-weather__real-feel').textContent = 'Real feel ' + feels_like.toFixed(1) + '°C';
		document.querySelector('.current-weather__sunrise').lastElementChild.textContent = parseSunriseAndSunset(sunrise) + ' AM';
		document.querySelector('.current-weather__sunset').lastElementChild.textContent = parseSunriseAndSunset(sunset) + ' PM';
		document.querySelector('.current-weather__duration').lastElementChild.textContent = parseDuration(sunrise, sunset);

		function parseDate() {
			const now = new Date();
			return (
				now.getDate().toString().padStart(2, '0') + '.' + (now.getMonth() + 1).toString().padStart(2, '0') + '.' + now.getFullYear()
			);
		}
		function parseSunriseAndSunset(numbers) {
			const date = new Date(numbers);
			return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
		}
		function parseDuration(rise, set) {
			const sunrise = new Date(rise);
			const sunset = new Date(set);
			return (
				(sunset.getHours() + (12 - sunrise.getHours())).toString().padStart(2, '0') +
				'.' +
				(sunset.getMinutes() - sunrise.getMinutes()).toString().padStart(2, '0') +
				' hr'
			);
		}
	},
	displayHourly(data) {
		this.closeError();
		const night = document.querySelector('.night'),
			morning = document.querySelector('.morning'),
			day = document.querySelector('.day'),
			night12 = document.querySelector('.zero'),
			morning6 = document.querySelector('.six'),
			day12 = document.querySelector('.twelve'),
			evening18 = document.querySelector('.eighteen'),
			currentHour = +data.list[0].dt_txt.split(' ')[1].split(':')[0];

		function displayCase(caseNumber) {
			const blockId = {
				'8': 0,
				'7': 1,
				'6': 2,
				'5': 3,
				'4': 4,
				'3': 5,
				'2': 6,
				'1': 7,
			};

			// display images
			const imageBlocks = [
				document.querySelector('.zero__img'),
				document.querySelector('.three__img'),
				document.querySelector('.six__img'),
				document.querySelector('.nine__img'),
				document.querySelector('.twelve__img'),
				document.querySelector('.fifteen__img'),
				document.querySelector('.eighteen__img'),
				document.querySelector('.twenty-one__img'),
			];
			const images = [];
			for (let index = 0; index < 8; index++) {
				images.push(data.list[index].weather[0].icon);
			}
			for (let index = 0; index < blockId[String(caseNumber)]; index++) {
				imageBlocks.shift();
			}
			imageBlocks.forEach((element, index) => (element.src = `https://openweathermap.org/img/wn/${images[index]}@2x.png`));

			// display forecast
			const forecastBlocks = [
				document.querySelector('.zero__forecast'),
				document.querySelector('.three__forecast'),
				document.querySelector('.six__forecast'),
				document.querySelector('.nine__forecast'),
				document.querySelector('.twelve__forecast'),
				document.querySelector('.fifteen__forecast'),
				document.querySelector('.eighteen__forecast'),
				document.querySelector('.twenty-one__forecast'),
			];
			const forecast = [];
			for (let index = 0; index < 8; index++) {
				forecast.push(data.list[index].weather[0].main);
			}
			for (let index = 0; index < blockId[String(caseNumber)]; index++) {
				forecastBlocks.shift();
			}
			forecastBlocks.forEach((element, index) => (element.textContent = forecast[index]));

			// display temperature
			const temperatureBlocks = [
				document.querySelector('.zero__temperature'),
				document.querySelector('.three__temperature'),
				document.querySelector('.six__temperature'),
				document.querySelector('.nine__temperature'),
				document.querySelector('.twelve__temperature'),
				document.querySelector('.fifteen__temperature'),
				document.querySelector('.eighteen__temperature'),
				document.querySelector('.twenty-one__temperature'),
			];
			const temperature = [];
			for (let index = 0; index < 8; index++) {
				temperature.push(data.list[index].main.temp);
			}
			for (let index = 0; index < blockId[String(caseNumber)]; index++) {
				temperatureBlocks.shift();
			}
			temperatureBlocks.forEach((element, index) => (element.textContent = Math.round(temperature[index]) + '°'));

			// display feel
			const feelBlocks = [
				document.querySelector('.zero__feel'),
				document.querySelector('.three__feel'),
				document.querySelector('.six__feel'),
				document.querySelector('.nine__feel'),
				document.querySelector('.twelve__feel'),
				document.querySelector('.fifteen__feel'),
				document.querySelector('.eighteen__feel'),
				document.querySelector('.twenty-one__feel'),
			];
			const feel = [];
			for (let index = 0; index < 8; index++) {
				feel.push(data.list[index].main.feels_like);
			}
			for (let index = 0; index < blockId[String(caseNumber)]; index++) {
				feelBlocks.shift();
			}
			feelBlocks.forEach((element, index) => (element.textContent = Math.round(feel[index]) + '°'));

			// display wind
			const windBlocks = [
				document.querySelector('.zero__wind'),
				document.querySelector('.three__wind'),
				document.querySelector('.six__wind'),
				document.querySelector('.nine__wind'),
				document.querySelector('.twelve__wind'),
				document.querySelector('.fifteen__wind'),
				document.querySelector('.eighteen__wind'),
				document.querySelector('.twenty-one__wind'),
			];
			const wind = [];
			for (let index = 0; index < 8; index++) {
				function windDirection(deg) {
					if (deg <= 90) return 'NE';
					else if (deg > 90 && deg <= 180) return 'SE';
					else if (deg > 180 && deg <= 270) return 'SW';
					else return 'NW';
				}
				wind.push(data.list[index].wind.speed + ' ' + windDirection(data.list[index].wind.deg));
			}
			for (let index = 0; index < blockId[String(caseNumber)]; index++) {
				windBlocks.shift();
			}
			windBlocks.forEach((element, index) => (element.textContent = wind[index]));
		}

		switch (currentHour) {
			case 0:
				displayCase(8);
				break;
			case 3:
				night12.style.display = 'none';
				displayCase(7);
				break;
			case 6:
				night.style.display = 'none';
				displayCase(6);
				break;
			case 9:
				night.style.display = 'none';
				morning6.style.display = 'none';
				displayCase(5);
				break;
			case 12:
				night.style.display = 'none';
				morning.style.display = 'none';
				displayCase(4);
				break;
			case 15:
				night.style.display = 'none';
				morning.style.display = 'none';
				day12.style.display = 'none';
				displayCase(3);
				break;
			case 18:
				night.style.display = 'none';
				morning.style.display = 'none';
				day.style.display = 'none';
				displayCase(2);
				break;
			case 21:
				night.style.display = 'none';
				morning.style.display = 'none';
				day.style.display = 'none';
				evening18.style.display = 'none';
				displayCase(1);
				break;
		}
	},
	showFirstScreen() {
		this.closeError();
		document.querySelector('.main__first-screen').style.display = 'block';
		document.querySelector('.main__second-screen').style.display = 'none';
	},
	showSecondScreen() {
		this.closeError();
		document.querySelector('.main__first-screen').style.display = 'none';
		document.querySelector('.main__second-screen').style.display = 'block';
	},
	showError() {
		document.querySelector('main').style.display = 'none';
		document.querySelector('.error').style.display = 'flex';
	},
	closeError() {
		document.querySelector('main').style.display = 'block';
		document.querySelector('.error').style.display = 'none';
	},
};

const searchInput = document.querySelector('.search__input'),
	searchButton = document.querySelector('.search__button'),
	ShortForecast = document.querySelector('.short-forecast');

weather.fetchCurrentWeather();

ShortForecast.firstElementChild.style.backgroundColor = '#b7a7ae';
ShortForecast.addEventListener('click', event => {
	if (event.target.closest('.short-forecast__section')) {
		event.target.closest('.short-forecast__section').style.backgroundColor = '#b7a7ae';
		document.querySelectorAll('.short-forecast__section').forEach(element => (element.style.backgroundColor = '#e1d5d9'));
		event.target.closest('.short-forecast__section').style.backgroundColor = '#b7a7ae';

		if (searchInput.value === '') weather.fetchFiveDayForecast();
		else weather.fetchFiveDayForecast(searchInput.value);
	}
});

searchButton.addEventListener('click', () => {
	weather.fetchCurrentWeather(searchInput.value);
	weather.fetchFiveDayForecast(searchInput.value);
});
searchButton.addEventListener('submit', () => {
	weather.fetchCurrentWeather(searchInput.value);
	weather.fetchFiveDayForecast(searchInput.value);
});

document.querySelector('.header__menu').addEventListener('click', event => {
	if (event.target.id === 'today-button') {
		if (searchInput.value === '') weather.fetchCurrentWeather();
		else weather.fetchCurrentWeather(searchInput.value);
	} else if (event.target.id === 'f-day-forecast-button') {
		if (searchInput.value === '') weather.fetchFiveDayForecast();
		else weather.fetchFiveDayForecast(searchInput.value);
	}
});
