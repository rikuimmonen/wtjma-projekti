import campuses from './assets/campusCoordinates';
import HSLData from './modules/hsl-data';
import {fetchData} from './modules/network';
import weatherData from './modules/weather-data';
import app from './modules/app';
import utils from './modules/utils';
import signage from './modules/signage';

const renderWeather = (array) => {
  const hour = new Date().getHours();
  for (const time of array) {
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
      humidity.innerHTML = time.data.instant.details.relative_humidity + ' %';
      break;
    }
  }
};
const getLocation = () => {
  const success = (pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const weatherUrl = weatherData.getApiUrl(lat, lon);

    fetchData(weatherUrl).then(response => {
      console.log(response.properties);
      renderWeather(response.properties.timeseries);
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

const getStoredCampus = () => {
  return JSON.parse(localStorage.getItem('location'));
};

const useStoredCampus = () => {
  if (getStoredCampus()) {
    const lat = getStoredCampus().lat;
    const lon = getStoredCampus().lon;
    const weatherUrl = weatherData.getApiUrl(lat, lon);
    fetchData(weatherUrl).then(response => {
      console.log('sää', response.properties);
      renderWeather(response.properties.timeseries);

      console.log(response.properties.timeseries);
    });

    fetchData(HSLData.apiUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/graphql'},
      body: HSLData.getQueryForStopsByLocation(lat, lon),
    }).then(response => {
      bindHSL(response);
    });
  }
};

const setLocationButton = document.querySelector('#set-location');

setLocationButton.addEventListener('click', () => {
  getLocation();
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
});

const locationsList = document.querySelector('#locations-list');
const pickLocationButton = document.querySelector('#pick-location');
const radioHeader = document.createElement('h3');

pickLocationButton.addEventListener('click', () => {
  locationsList.style.display = 'block';
  locationsList.innerHTML = '';
  radioHeader.innerHTML = 'Valitse ravintola';
  locationsList.appendChild(radioHeader);
  campuses.forEach(campus => {
    const input = document.createElement('input');

    const shortNameForID = campus.campusNameFi.split(' ')[0];
    input.type = 'radio';
    input.id = shortNameForID;
    input.name = 'selected_campus';
    input.value = shortNameForID;
    input.setAttribute('data-lat', campus.lat);
    input.setAttribute('data-lon', campus.lon);
    input.setAttribute('data-name-fi', campus.campusNameFi);
    input.setAttribute('data-name-en', campus.campusNameEn);

    const label = document.createElement('label');
    label.setAttribute('for', shortNameForID);
    label.innerHTML = campus.campusNameFi;
    locationsList.appendChild(input);
    locationsList.appendChild(label);
    locationsList.innerHTML += '<br>';
  });

  const button = document.createElement('button');
  button.innerHTML = 'OK';
  locationsList.appendChild(button);

  button.addEventListener('click', () => {

    const campus = {
      'lat': document.querySelector('input[name=selected_campus]:checked').
        getAttribute('data-lat'),
      'lon': document.querySelector('input[name=selected_campus]:checked').
        getAttribute('data-lon'),
      'nameFi': document.querySelector('input[name=selected_campus]:checked').
        getAttribute('data-name-fi'),
      'nameEn': document.querySelector('input[name=selected_campus]:checked').
        getAttribute('data-name-en'),
    };

    localStorage.setItem('location', JSON.stringify(campus));

    locationsList.style.display = 'none';
    useStoredCampus();

  });
});

const bindHSL = (data) => {
  const container = document.createElement('div');
  document.querySelector('#hsl header').after(container);
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

utils.getLunch();

const initApp = () => {
  const pageList = app.createPageList('main');
  app.createNav('nav', pageList);
  app.addSectionNavButtons(pageList);
};

const initSignage = () => {
  const style = document.querySelector('link[rel="stylesheet"]');
  style.href = './assets/ds.css';
  document.querySelector('#location').remove();
  document.querySelector('h2').remove();
  const slides = document.querySelectorAll('section');
  document.querySelector(
    'header').innerHTML = '<div id="meta"><p id="clock"></p><p id="pages"></p></div>';
  const pageIndicator = document.querySelector('#pages');
  const clockParent = document.querySelector('#clock');
  signage.clock(clockParent);
  signage.carousel(slides, pageIndicator, 0, 1000);
};

if (location.search) {
  switch (location.search) {
    case '?campus=arabia':
      localStorage.setItem('location', JSON.stringify(campuses[0]));
      break;
    case '?campus=karamalmi':
      localStorage.setItem('location', JSON.stringify(campuses[1]));
      break;
    case '?campus=myllypuro':
      localStorage.setItem('location', JSON.stringify(campuses[2]));
      break;
    case '?campus=myyrmaki':
      localStorage.setItem('location', JSON.stringify(campuses[3]));
      break;
    default:
      localStorage.setItem('location', JSON.stringify(campuses[1]));
      break;
  }
  useStoredCampus();
  initSignage();
} else {
  useStoredCampus();
  initApp();
}
