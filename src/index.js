import HSLData from "./modules/hsl-data";
import { fetchData } from "./modules/network";
import utils from "./modules/utils";
import weatherData from "./modules/weather-data";
import app from "./modules/app.js";

const getLocation = () => {
  const success = (pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const weatherUrl = weatherData.getApiUrl(lat, lon);

    fetchData(weatherUrl).then(response => {
      console.log(response.properties);
      const hour = new Date().getHours();
      for (const time of response.properties.timeseries) {
        if (hour == time.time.split('T')[1].split(':')[0]) {
          const weatherSymbol = document.querySelector('#weather-symbol');
          const temperatureP = document.querySelector('#temperature');
          const windSpeedP = document.querySelector('#wind-speed');
          const humidity = document.querySelector('#humidity');

          weatherSymbol.setAttribute('src', 'assets/weathericon/' + time.data.next_1_hours.summary.symbol_code + '.svg');
          temperatureP.innerHTML = time.data.instant.details.air_temperature + " \u2103";
          windSpeedP.innerHTML = time.data.instant.details.wind_speed + ' ms';
          humidity.innerHTML = time.data.instant.details.relative_humidity + ' %';
          break;
        }
      }
      console.log(hour);
      console.log(response.properties.timeseries);
    });
  };
  const err = () => {
    console.log('Unable to retrieve location');
  };
  if (!navigator.geolocation) {
    alert('Unable to retrieve your location');
  } else {

    navigator.geolocation.getCurrentPosition(success, err);

  }
};

getLocation();

const bindHSL = (data) => {
  const container = document.querySelector('#hsl');

  for (const stop of data.data.stopsByRadius.edges) {
    const stopH3 = document.createElement('h3');
    stopH3.innerHTML = `${stop.node.stop.name} <span class="stop-code">${stop.node.stop.code}</span>`;
    container.appendChild(stopH3);

    const table = document.createElement('table');
    const tableHeaders = ['Lähtee', 'Linja', 'Määränpää'];
    const headerRow = document.createElement('tr');
    for (const header of tableHeaders) {
      const headerCell = document.createElement('th');
      headerCell.innerText = header;
      headerRow.appendChild(headerCell);
    }
    table.appendChild(headerRow);
    container.appendChild(table);

    for (const ride of stop.node.stop.stoptimesWithoutPatterns) {
      const time = new Date((ride.realtimeArrival + ride.serviceDay) * 1000);
      const timeLeftMinutes = ((time - Date.now()) / 1000 / 60).toFixed();

      const contentRow = document.createElement('tr');
      table.appendChild(contentRow);

      const rideContent = [timeLeftMinutes + ' min', ride.trip.routeShortName, ride.headsign];
      for (const item of rideContent) {
        const cell = document.createElement('td');
        cell.innerText = item;
        contentRow.appendChild(cell);
      };
    }
  }
};

const getHSL = async (pos) => {
  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;

  const data = await fetchData(HSLData.apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/graphql' },
    body: HSLData.getQueryForStopsByLocation(lat, lon)
  });

  return data;
};

const HSL = async (pos) => {
  const data = await getHSL(pos);
  bindHSL(data);
};

const posError = (err) => {
  console.warn(`ERROR(${err.code}): ${err.message}`);
};

if (!navigator.geolocation) {
  alert('Unable to retrieve your location');
} else {
  navigator.geolocation.getCurrentPosition(HSL, posError);
}

/* APP */

const initApp = () => {
  const pageList = app.createPageList('main');

  app.createNav('nav', pageList);

  window.addEventListener('DOMContentLoaded', () => {
    app.showPage(pageList);
  });

  window.addEventListener('hashchange', () => {
    app.showPage(pageList);
  });

  const next = document.createElement('button');
  next.innerText = 'Seuraava';
  next.addEventListener('click', () => {
    app.nextPage(pageList);
  });

  const prev = document.createElement('button');
  prev.innerText = 'Edellinen';
  prev.addEventListener('click', () => {
    app.nextPage(pageList, false);
  });

  document.querySelector('header').appendChild(prev);
  document.querySelector('header').appendChild(next);

  /*
  window.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowRight') {
      app.nextPage(pageList);
    }
  });
  window.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft') {
      app.nextPage(pageList, false);
    }
  });
  */
};

/* SIGNAGE */

const clock = (parent) => {
  const time = new Date(Date.now());

  const hours = time.getHours();
  const minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
  parent.innerHTML = hours + '.' + minutes;

  setTimeout(() => clock(parent), 1000);
};

const carousel = (slides, pageIndicator, current, displayTime) => {
  if (current === slides.length) {
    current = 0;
  }

  slides.forEach((element, index) => {
    if (index === current) {
      element.style.display = 'block';
    } else {
      element.style.display = 'none';
    }
  });

  pageIndicator.innerHTML = `${current + 1} / ${slides.length}`;

  current++;

  setTimeout(() => carousel(slides, pageIndicator, current, displayTime), displayTime);
};

const initSignage = () => {
  const header = document.querySelector('header');
  header.innerHTML = `<div id="meta"><p id="clock"></p><p id="pages"></p></div>`;

  const clockParent = document.querySelector('#clock');
  clock(clockParent);

  const slides = document.querySelectorAll('section');
  const pageIndicator = document.querySelector('#pages');
  carousel(slides, pageIndicator, 0, 3000);

  //const indicator = document.querySelector('#indicator');
  //indicator.style.animation = `indicator ${displayTime / 1000}s linear infinite`;

  /*
  const lunchList = document.querySelector('#lunch ul');
  let lunchFontSize = 1;
  lunchList.style.lineHeight = 1.5;

  while (lunchList.scrollHeight > lunchList.clientHeight) {
    lunchFontSize = 0.95 * lunchFontSize;
    lunchList.style.fontSize = lunchFontSize * 0.95 + 'em';
  }
  */
};

if (location.search) {
  initSignage();
} else {
  initApp();
}