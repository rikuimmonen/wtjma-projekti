

const getApiUrl = (lat, lon) =>{
  const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;
  return url;
};



const weatherData = {getApiUrl};
export default weatherData;
