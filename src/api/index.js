export const getSunsetSunriseData = (params = {}) => {
  const { date, latitude, longitude } = params

  return fetch(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${date}&formatted=0`)
  .then(response => response.json())
}


