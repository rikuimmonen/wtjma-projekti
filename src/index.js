import campuses from "./assets/campusCoordinates";
import HSLData from "./modules/hsl-data";
import { fetchData } from "./modules/network";
import utils from "./modules/utils";
import weatherData from "./modules/weather-data";


/*
console.log(new Date());
fetchData(HSLData.apiUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/graphql'
  },
  body: HSLData.getQueryForNextRidesByStopId(2132207)
}).then(response => {
  console.log(response);
  const stop = response.data.stop;
  console.log(new Date((stop.stoptimesWithoutPatterns[0].serviceDay + stop.stoptimesWithoutPatterns[0].realtimeArrival) * 1000 + 7200000).toISOString());
  let time = new Date((stop.stoptimesWithoutPatterns[0].realtimeArrival + stop.stoptimesWithoutPatterns[0].serviceDay) * 1000 + 7200000);
  document.querySelector('#hsl').innerHTML = `<p>
      Pysäkki: ${stop.name} Bussi: ${stop.stoptimesWithoutPatterns[0].trip.routeShortName} Minne:  ${stop.stoptimesWithoutPatterns[0].headsign} Aika:
      ${time.toISOString().split('T')[1].split('.')[0]}
    </p>`;
});
*/

const renderWeather = (array) => {
  const hour = new Date().getHours();
  console.log(array);
  const weatherSection = document.querySelector('#weather-section');
  const table = document.createElement('table');
  table.setAttribute('id', 'weather-table');
  const tableHeaders = ['Tänään', 'Huomenna', 'Ylihuomenna'];
  const weatherSymbol = document.querySelector('#weather-symbol');
  weatherSection.appendChild(table);
  let i = 0;
  for (const time of array) {
    weatherSymbol.setAttribute('src', 'assets/weathericon/' + array[i].data.next_1_hours.summary.symbol_code + '.svg');
    const tr = document.createElement('tr');
    const headerCell = document.createElement('th');
    headerCell.innerHTML = tableHeaders[i];

    if (hour == time.time.split('T')[1].split(':')[0]) {

      const temperature = document.createElement('td');
      temperature.innerHTML = time.data.instant.details.air_temperature + " \u2103";
      const wind = document.createElement('td');
      wind.innerHTML = time.data.instant.details.wind_speed + ' ms';
      const humidity = document.createElement('td');
      humidity.innerHTML = time.data.instant.details.relative_humidity + ' %';
      tr.appendChild(headerCell);
      tr.appendChild(temperature);
      tr.appendChild(wind);
      tr.appendChild(humidity);
      i++;
    }

    table.appendChild(tr);

    // if (hour == time.time.split('T')[1].split(':')[0]) {
    //   console.log(time.time);
    //   const li = document.createElement('li');
    //   li.setAttribute('class', 'weather-day');
    //   const ul = document.createElement('ul');
    //   ul.setAttribute('class', 'day-list');
    //   const listItemTemperature = document.createElement('li');
    //   listItemTemperature.setAttribute('class', 'weather-list-item');
    //   const temperatureP = document.createElement('p');
    //   temperatureP.innerHTML = time.data.instant.details.air_temperature + " \u2103";

    //   listItemTemperature.appendChild(temperatureP);
    //   ul.appendChild(listItemTemperature);
    //   li.appendChild(ul);
    //   weatherSection.appendChild(li);
    //   i++;
    // }

    if (i > 2) {
      break;
    }
  }
  // for (const time of array) {
  //   if (hour == time.time.split('T')[1].split(':')[0]) {
  //     const weatherSymbol = document.querySelector('#weather-symbol');
  //     const temperatureP = document.querySelector('#temperature');
  //     const windSpeedP = document.querySelector('#wind-speed');
  //     const humidity = document.querySelector('#humidity');

  //     weatherSymbol.setAttribute('src', 'assets/weathericon/' + time.data.next_1_hours.summary.symbol_code + '.svg');
  //     temperatureP.innerHTML = time.data.instant.details.air_temperature + " \u2103";
  //     windSpeedP.innerHTML = time.data.instant.details.wind_speed + ' ms';
  //     humidity.innerHTML = time.data.instant.details.relative_humidity + ' %';
  //     break;
  //   }
  // }
};
const getLocation = () => {
  const success = (pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    /*
        fetchData(HSLData.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/graphql'
          },
          body: HSLData.getQueryForStopsByLocation(lat, lon)
        }).then(response => {
          console.log(response);
          const busList = document.querySelector('#bus-list');
          for (const stop of response.data.stopsByRadius.edges) {

            const busStop = document.createElement('li');
            const busStopName = document.createElement('p');
            busStopName.innerHTML = `Pysäkki: ${stop.node.stop.name} ${stop.node.stop.code}`;
            const busRides = document.createElement('ul');
            for (const ride of stop.node.stop.stoptimesWithoutPatterns) {

              let time = new Date((ride.realtimeArrival + ride.serviceDay) * 1000 + 7200000);


              const timeLeftMinutes = ((time - new Date() - 7200000) / 1000 / 60).toFixed(0);

              const busRide = document.createElement('li');

              busRide.innerHTML = `Aika: ${time.toISOString().split('T')[1].split('.')[0].slice(0, 5)} Bussi: ${ride.trip.routeShortName} Minne: ${ride.headsign} Minuuttia jäljellä: ${timeLeftMinutes} min`;
              busRides.appendChild(busRide);
            }
            busStop.appendChild(busStopName);

            busList.appendChild(busStop);
            busList.appendChild(busRides);
          }
        });
        */
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
  const storedCampus = JSON.parse(localStorage.getItem('location'));
  return storedCampus;
};

const useStoredCampus = () => {
  if (getStoredCampus()) {
    const lat = getStoredCampus().lat;
    const lon = getStoredCampus().lon;
    const weatherUrl = weatherData.getApiUrl(lat, lon);
    fetchData(weatherUrl).then(response => {
      console.log(response.properties);
      renderWeather(response.properties.timeseries);

      console.log(response.properties.timeseries);
    });

    fetchData(HSLData.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/graphql' },
      body: HSLData.getQueryForStopsByLocation(lat, lon)
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
      'lat': document.querySelector('input[name=selected_campus]:checked').getAttribute('data-lat'),
      'lon': document.querySelector('input[name=selected_campus]:checked').getAttribute('data-lon'),
      'nameFi': document.querySelector('input[name=selected_campus]:checked').getAttribute('data-name-fi'),
      'nameEn': document.querySelector('input[name=selected_campus]:checked').getAttribute('data-name-en'),
    };

    localStorage.setItem('location', JSON.stringify(campus));

    locationsList.style.display = 'none';
    useStoredCampus();

  });
});



const bindHSL = (data) => {
  const container = document.querySelector('#hsl');
  container.innerHTML = '';
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



/* ULKOASU */

const createPageList = (parentElementName) => {
  const pages = document.querySelectorAll(parentElementName + ' > *');
  const pageList = new Map();

  pages.forEach((element, index) => {
    pageList.set('#' + element.id, index);
  });

  return pageList;
};

const createNav = (parentElementName, pageList) => {
  const parent = document.querySelector(parentElementName);
  const ul = document.createElement('ul');
  const pageIds = [...pageList.keys()];

  pageIds.forEach((pageId) => {
    const title = document.querySelector(pageId + ' h2').innerText;

    const li = document.createElement('li');
    const a = document.createElement('a');

    li.appendChild(a);
    ul.appendChild(li);

    a.innerText = title;
    a.href = pageId;

    a.addEventListener('click', (event) => {
      event.preventDefault();

      location = event.target.href;
    });
  });

  parent.appendChild(ul);
};

const showPage = (pageList) => {
  const pageIds = [...pageList.keys()];

  pageIds.forEach((id) => {
    document.querySelector(id).style.display = 'none';
  });

  if (pageList.has(location.hash)) {
    document.querySelector(location.hash).style.display = 'block';
  } else {
    document.querySelector(pageIds[0]).style.display = 'block';
  }
};

const nextPage = (pageList, forward = true) => {
  let current = pageList.get(location.hash) || 0;
  let next;

  if (forward) {
    next = current + 1;

    if (next >= pageList.size) {
      next = 0;
    }
  } else {
    next = current - 1;

    if (next < 0) {
      next = pageList.size - 1;
    }
  }

  location.hash = [...pageList.keys()][next];
};

const init = () => {
  const pageList = createPageList('main');

  createNav('nav', pageList);

  window.addEventListener('DOMContentLoaded', () => {
    showPage(pageList);
  });

  window.addEventListener('hashchange', () => {
    showPage(pageList);
  });

  const next = document.createElement('button');
  next.innerText = 'Seuraava';
  next.addEventListener('click', (event) => {
    nextPage(pageList);
  });

  const prev = document.createElement('button');
  prev.innerText = 'Edellinen';
  prev.addEventListener('click', (event) => {
    nextPage(pageList, false);
  });

  document.querySelector('header').appendChild(prev);
  document.querySelector('header').appendChild(next);

  /*
  window.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowRight') {
      nextPage(pageList);
    }
  });
  window.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft') {
      nextPage(pageList, false);
    }
  });
  */
};
useStoredCampus();
init();
