const request = require('request-promise-native');

const fetchMyIP = function() {
  return request('https://api.ipify.org?format=json');
};

const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip
  return request(`https://ipvigilante.com/json/${ip}`)
};

const fetchISSFlyOverTimes = (body) => {
  coords = JSON.parse(body).data
  return request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`)
};

const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};
const nextISSTimesForMyLocation = function (time) {
  fetchMyIP()
  .then(fetchCoordsByIP)
  .then(fetchISSFlyOverTimes)
  .then(json => JSON.parse(json).response)
  .then(printPassTimes)
};


module.exports = {nextISSTimesForMyLocation};