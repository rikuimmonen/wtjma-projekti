import HSLData from "./modules/hsl-data";
import { fetchData } from "./modules/network";
import utils from "./modules/utils";
import weatherData from "./modules/weather-data";
import SodexoData from './modules/sodexo-data';
import FazerData from './modules/fazer-data';
import MyllyData from './modules/mylly-data';

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
  console.log(new Date((stop.stoptimesWithoutPatterns[0].serviceDay + stop.stoptimesWithoutPatterns[0].realtimeArrival) *1000+ 7200000).toISOString());
    let time = new Date((stop.stoptimesWithoutPatterns[0].realtimeArrival + stop.stoptimesWithoutPatterns[0].serviceDay) * 1000 + 7200000);
    document.querySelector('#hsl').innerHTML = `<p>
      Pysäkki: ${stop.name} Bussi: ${stop.stoptimesWithoutPatterns[0].trip.routeShortName} Minne:  ${stop.stoptimesWithoutPatterns[0].headsign} Aika:
      ${time.toISOString().split('T')[1].split('.')[0]}
    </p>`;
});



const getLocation = () => {
  const success = (pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

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


          const timeLeftMinutes = ((time - new Date() -7200000) / 1000 / 60).toFixed(0);

          const busRide = document.createElement('li');

          busRide.innerHTML = `Aika: ${time.toISOString().split('T')[1].split('.')[0].slice(0, 5)} Bussi: ${ride.trip.routeShortName} Minne: ${ride.headsign} Minuuttia jäljellä: ${timeLeftMinutes} min`;
          busRides.appendChild(busRide);
        }
        busStop.appendChild(busStopName);

        busList.appendChild(busStop);
        busList.appendChild(busRides);
      }
    });
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
  if(!navigator.geolocation) {
    alert('Unable to retrieve your location');
  } else {

    navigator.geolocation.getCurrentPosition(success, err);

  }
};

getLocation();


//Lunch menus

const printMenu = (menu, targetId) => {
  const ulElement = document.querySelector('#' + targetId);
  ulElement.innerHTML = '';
  for (const item of menu) {
    const li = document.createElement('li');
    li.textContent = item;
    ulElement.appendChild(li);
  }
};

//Sodexo Myyrmäki
fetchData(SodexoData.dataUrl).then(data => {
  const courses = SodexoData.createMenus(data.courses);
  console.log('MYRTSI COURSES', courses);
  printMenu(courses, 'sodexoMenu');
});

//Sodexo Myllypuro
fetchData(MyllyData.dataUrl).then(data => {
  const courses = MyllyData.createMenus(data.courses);
  console.log('MYLLYPURO', courses);
});

const getDayIndex = () => {
  let weekday = new Date().getDay() - 1;
  // weekend no service, use fridays menu
  if (weekday >= 5) {
    weekday = 4;
  } else if (weekday < 0) {
    weekday = 4;
  }
  return weekday;
};

//Fazer Karaportti
fetchData(FazerData.dataUrlFi, {},'fazer-php').then(data => {
  const courses = FazerData.createDayMenu(data.LunchMenus, getDayIndex());
  console.log('FAZER COURSES', courses);
  printMenu(courses, 'fazerMenu');
});



