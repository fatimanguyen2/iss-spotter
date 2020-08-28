/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require('request');
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const IP = JSON.parse(body).ip;
    callback(null, IP);
  });
};

const fetchCoordsByIP = (ip, cb) => {
  request(`https://ipvigilante.com/json/${ip}`, (error, response, body) => {
    if (error) return cb(error, null);
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates. Response: ${body}`;
      cb(Error(msg), null);
      return;
    }
    // const coordinates = {latitude: JSON.parse(body).data.latitude, longitude: JSON.parse(body).data.longitude};
    // cb(null, coordinates);
    const { latitude, longitude } = JSON.parse(body).data;
    cb(null, {latitude, longitude});
  });
};

const fetchISSFlyOverTimes = (coords, callback) => {
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) return callback(error, null);
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const array = JSON.parse(body).response;
    callback(null, array);
  });
};

const nextISSTimesForMyLocation = function (callback) {
  fetchMyIP((error, ip) => {
    if (error) callback(error, null)

    fetchCoordsByIP(ip, (error, coords) => {
      if (error) callback(error, null)

      fetchISSFlyOverTimes(coords, (error, nextPasses) => {
        if (error) callback(error, null)

        callback(null, nextPasses)
      });
    })
  });
};

module.exports = {nextISSTimesForMyLocation};