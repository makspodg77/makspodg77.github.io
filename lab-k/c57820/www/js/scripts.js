const orbit = document.querySelector('.orbit');

let startDay = 8;
let endDay = 21;

const weatherPanel = (data, text = undefined, timezoneOffset = 0) => {
  const div = document.createElement('div');
  div.classList.add('weather-panel');

  const date = text ? text : data.dt;
  const dateDiv = document.createElement('div');
  dateDiv.classList.add('date');

  if (typeof date !== "string") {
    const localTime = new Date((date + timezoneOffset) * 1000);
    dateDiv.textContent = localTime.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
    });
  } else {
    dateDiv.textContent = date;
  }
  div.append(dateDiv);
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  const left = document.createElement('div')
  left.classList.add('left');
  div.appendChild(left);
  const iconImg = document.createElement('img');
  iconImg.src = iconUrl;
  iconImg.alt = data.weather[0].description;
  left.appendChild(iconImg);
  const right = document.createElement('div')
  right.classList.add('right');
  div.appendChild(right);
  const tempDiv = document.createElement('div');
  tempDiv.classList.add('temp');
  const tempHeader = document.createElement('h2');
  tempHeader.innerText = `${Math.round(data.main.temp)}°C`;
  tempDiv.appendChild(tempHeader);
  right.appendChild(tempDiv);
  const feelsLikeDiv = document.createElement('div');
  feelsLikeDiv.classList.add('feels-like');
  feelsLikeDiv.innerText = `Feels like ${Math.round(data.main.feels_like)}°C`;
  right.appendChild(feelsLikeDiv);
  const descriptionDiv = document.createElement('div');
  descriptionDiv.classList.add('description');
  descriptionDiv.innerText = data.weather[0].description;
  right.appendChild(descriptionDiv);

  return div;
}

// sets position of the sun and moon based on the current time
const setDayNightCycle = (timezoneOffset = 0) => {
  const now = new Date();
  const utcSeconds = now.getTime() / 1000 + (now.getTimezoneOffset() * 60);
  const cityTime = new Date((utcSeconds + timezoneOffset) * 1000);

  const currentTime = cityTime.getUTCHours() + cityTime.getUTCMinutes() / 60 + cityTime.getUTCSeconds() / 3600;

  let start = startDay;
  let end = endDay;

  const dayDuration = end - start;
  const nightDuration = 24 - dayDuration;

  let rotation;
  let isDay = false;

  if (currentTime >= start && currentTime < end) {
    isDay = true;
    const progress = (currentTime - start) / dayDuration;
    rotation = progress * 180 - 90;
  } else {
    isDay = false;
    let nightProgress;
    if (currentTime >= end) {
      nightProgress = (currentTime - end) / nightDuration;
    } else {
      nightProgress = (currentTime + (24 - end)) / nightDuration;
    }
    rotation = nightProgress * 180 + 90;
  }

  const sun = document.querySelector('.sun');
  const moon = document.querySelector('.moon');

  sun.style.opacity = isDay ? '1' : '0';
  moon.style.opacity = isDay ? '0' : '1';

  orbit.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;

  if (isDay) {
    const p = (currentTime - start) / dayDuration;
    if (p < 0.2) {
       document.body.style.backgroundColor = '#ff7e5f';
    } else if (p > 0.8) {
       document.body.style.backgroundColor = '#feb47b';
    } else {
       document.body.style.backgroundColor = '#87CEEB';
    }
  } else {
    document.body.style.backgroundColor = '#111c23';
    document.body.style.color = '#fff';
  }
}

const renderClouds = (cloudPercentage) => {
  const container = document.querySelector('.clouds');
  container.innerHTML = '';  // clear existing clouds

  // max 20 clouds
  const cloudCount = Math.floor(cloudPercentage / 5);

  for (let i = 0; i < cloudCount; i++) {
    const cloud = document.createElement('div');
    cloud.className = 'cloud';

    // random position, scale and opacity
    const top = Math.random() * 80;
    const left = Math.random() * 90;
    const scale = 0.9 + Math.random() * 1.3;
    cloud.style.top = `${top}%`;
    cloud.style.left = `${left}%`;
    cloud.style.transform = `scale(${scale})`;
    cloud.style.opacity = `${0.4 + Math.random() * 0.5}`;

    container.appendChild(cloud);
  }
}

const renderRain = (rainAmount) => {
  const container = document.querySelector('.rain');
  container.innerHTML = ''; // clear existing rain

  const dropCount = Math.min(Math.floor(rainAmount * 50), 200);

  for (let i = 0; i < dropCount; i++) {
    const drop = document.createElement('div');
    drop.className = 'rain-drop';

    const left = Math.random() * 100;
    const duration = 0.5 + Math.random() * 1.5;
    const delay = Math.random() * 2;
    const opacity = 0.3 + Math.random() * 0.5;
    const scale = 0.5 + Math.random() * 0.5;

    drop.style.left = `${left}%`;
    drop.style.animationDuration = `${duration}s`;
    drop.style.animationDelay = `${delay}s`;
    drop.style.opacity = `${opacity}`;
    drop.style.transform = `scale(${scale})`;

    container.appendChild(drop);
  }
}

const renderSnow = (snowAmount) => {
  const container = document.querySelector('.snow');
  container.innerHTML = ''; // clear existing snow

  const flakeCount = Math.min(Math.floor(snowAmount * 50), 200);

  for (let i = 0; i < flakeCount; i++) {
    const flake = document.createElement('div');
    flake.className = 'snow-flake';

    const left = Math.random() * 100;
    const fallDuration = 3 + Math.random() * 7;
    const swayDuration = 2 + Math.random() * 3;
    const delay = Math.random() * 5;
    const opacity = 0.4 + Math.random() * 0.6;
    const scale = 0.5 + Math.random() * 1.5;

    flake.style.left = `${left}%`;
    flake.style.animationDuration = `${fallDuration}s, ${swayDuration}s`;
    flake.style.animationDelay = `${delay}s, ${delay}s`;
    flake.style.opacity = `${opacity}`;
    flake.style.width = `${scale}vmin`;
    flake.style.height = `${scale}vmin`;

    container.appendChild(flake);
  }
}


const renderMist = (visibility) => {
  const container = document.querySelector('.mist');
  container.innerHTML = ''; // clear existing mist

  if (visibility < 10000) {
    // calculate number of layers based on visibility (max 6)
    const layerCount = Math.min(6, Math.max(1, Math.floor((10000 - visibility) / 1500)));

    for (let i = 0; i < layerCount; i++) {
      const layer = document.createElement('div');
      layer.className = 'mist-layer';

      const height = 50 + Math.random() * 25;
      const opacity = 0.2 + Math.random() * 0.4;

      layer.style.height = `${height}vh`;
      layer.style.opacity = `${opacity}`;
      layer.style.zIndex = `${4 + i}`;

      container.appendChild(layer);
    }
  }
}

const apiKey = '37da2f9481ae5b0c43f0c562b0f8ede5';

const currentWeatherApi = (q) => {return `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${apiKey}&units=metric`}
const forecastApi = (q) => {return `https://api.openweathermap.org/data/2.5/forecast?q=${q}&appid=${apiKey}&units=metric`}

const fetchWeather = (e) => {
  e?.preventDefault();
  const weatherPanelContainer = document.querySelector('#weather-container');

  const locationInput = document.querySelector('#location-input');

  const city = locationInput?.value?.trim() || 'Świnoujście';
  weatherPanelContainer.innerHTML = '';

  const xhrWeather = new XMLHttpRequest();
  xhrWeather.open('GET', currentWeatherApi(city), true);
  xhrWeather.onreadystatechange = function () {
    if (xhrWeather.readyState === 4) {
      if (xhrWeather.status === 200) {
        const weatherData = JSON.parse(xhrWeather.responseText);
        console.log('Current weather:', weatherData);
        const offset = weatherData.timezone; // Offset in seconds

        weatherPanelContainer.appendChild(weatherPanel(weatherData, 'Today', offset));

        if (weatherData.sys && weatherData.sys.sunrise && weatherData.sys.sunset) {
          const sunriseDate = new Date((weatherData.sys.sunrise + offset) * 1000);
          const sunsetDate = new Date((weatherData.sys.sunset + offset) * 1000);

          startDay = sunriseDate.getUTCHours() + sunriseDate.getUTCMinutes() / 60;
          endDay = sunsetDate.getUTCHours() + sunsetDate.getUTCMinutes() / 60;

          setDayNightCycle(offset);
        }

        if (weatherData.clouds && typeof weatherData.clouds.all !== 'undefined') {
          renderClouds(weatherData.clouds.all);
        }

        if (typeof weatherData.visibility !== 'undefined') {
          renderMist(weatherData.visibility);
        }
        if (weatherData.rain && weatherData.rain['1h']) {
          renderRain(weatherData.rain['1h']);
        } else if (weatherData.rain && weatherData.rain['3h']) {
          renderRain(weatherData.rain['3h'] / 3);
        } else {
          renderRain(0);
        }

        if (weatherData.snow && weatherData.snow['1h']) {
          renderSnow(weatherData.snow['1h']);
        } else if (weatherData.snow && weatherData.snow['3h']) {
          renderSnow(weatherData.snow['3h'] / 3);
        } else {
          renderSnow(0);
        }
      } else {
        console.error('Weather fetch failed');
      }
    }
  };
  xhrWeather.send();

  fetch(forecastApi(city))
    .then(response => {
      if (!response.ok) {
        throw new Error('Forecast fetch failed');
      }
      return response.json();
    })
    .then(data => {
      console.log('Forecast:', data);
      const offset = data.city ? data.city.timezone : 0;
      data.list.forEach(item => {
        if (item.dt_txt.includes('12:00:00')) {
          weatherPanelContainer.appendChild(weatherPanel(item, undefined, offset));
        }
      });
    })
    .catch(error => {
      console.error(error.message);
    });
}

document.querySelector('#location-input').addEventListener('submit', fetchWeather);
document.querySelector('#weather-form').addEventListener('submit', fetchWeather);
document.querySelector('#search-button').addEventListener('click', fetchWeather);
fetchWeather(new Event('submit'));
