import HSLData from "./modules/hsl-data";
import { fetchData } from "./modules/network";

fetchData(HSLData.apiUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/graphql'
  },
  body: HSLData.getQueryForNextRidesByStopId(2132207)
}).then(response => {
  console.log(response);
  const stop = response.data.stop;
    let time = new Date((stop.stoptimesWithoutPatterns[0].realtimeArrival + stop.stoptimesWithoutPatterns[0].serviceDay) * 1000);
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
      busStopName.innerHTML ='Pysäkki: ' + stop.node.stop.name;
      const busRides = document.createElement('ul');
      for (const ride of stop.node.stop.stoptimesWithoutPatterns) {

        let time = new Date((ride.realtimeArrival + ride.serviceDay) * 1000);

        console.log(ride);
        const busRide = document.createElement('li');

        busRide.innerHTML = `Aika: ${time.toISOString().split('T')[1].split('.')[0]} Bussi: ${ride.trip.routeShortName} Minne: ${ride.headsign}`  ;
        busRides.appendChild(busRide);
      }
      busStop.appendChild(busStopName);

      busList.appendChild(busStop);
      busList.appendChild(busRides);
    }
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
