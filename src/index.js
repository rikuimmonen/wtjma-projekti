import HSLData from './modules/hsl-data';
import {fetchData} from './modules/network';
import weatherData from './modules/weather-data';
import app from './modules/app';
import signage from './modules/signage';

const getLocation = () => {
  const success = (pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const weatherUrl = weatherData.getApiUrl(lat, lon);

    fetchData(weatherUrl).then(response => {
      console.log(response.properties);
      const hour = new Date().getHours();
      for (const time of response.properties.timeseries) {
        if (hour === time.time.split('T')[1].split(':')[0]) {
          const weatherSymbol = document.querySelector('#weather-symbol');
          const temperatureP = document.querySelector('#temperature');
          const windSpeedP = document.querySelector('#wind-speed');
          const humidity = document.querySelector('#humidity');

          weatherSymbol.setAttribute('src',
            'assets/weathericon/' + time.data.next_1_hours.summary.symbol_code +
            '.svg');
          temperatureP.innerHTML = time.data.instant.details.air_temperature +
            ' \u2103';
          windSpeedP.innerHTML = time.data.instant.details.wind_speed + ' ms';
          humidity.innerHTML = time.data.instant.details.relative_humidity +
            ' %';
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

      const rideContent = [
        timeLeftMinutes + ' min',
        ride.trip.routeShortName,
        ride.headsign];
      for (const item of rideContent) {
        const cell = document.createElement('td');
        cell.innerText = item;
        contentRow.appendChild(cell);
      }
    }
  }
};

const getHSL = async (pos) => {
  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;

  return await fetchData(HSLData.apiUrl, {
    method: 'POST',
    headers: {'Content-Type': 'application/graphql'},
    body: HSLData.getQueryForStopsByLocation(lat, lon),
  });
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

const initApp = () => {
  const pageList = app.createPageList('main');

  app.createNav('nav', pageList);
  app.addSectionNavButtons(pageList);
};

const initSignage = () => {
  const header = document.querySelector('header');
  header.innerHTML = `<div id="meta"><p id="clock"></p><p id="pages"></p></div>`;

  const clockParent = document.querySelector('#clock');
  signage.clock(clockParent);

  const slides = document.querySelectorAll('section');
  const pageIndicator = document.querySelector('#pages');
  signage.carousel(slides, pageIndicator, 0, 3000);
};

if (location.search) {
  initSignage();
} else {
  initApp();
}
