const getApiUrl = (lat, lon) => {
  return `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;
};

const weatherData = { getApiUrl };
export default weatherData;