const controller = require('../controllers/train.controller');
const { authJwt } = require('../middleware');

module.exports = function(app) {
  // removed manual CORS header middleware - global CORS in index.js handles it
  app.get(
    '/api/trains/stations',
    controller.getStations
  );

//   Inputs
//   source(station_code)
//   destination(station_code)
//   date
//   POST / api / trains / search
// Output shown
//   train_id
//   train_name
//   train_number
//   departure_time
//   arrival_time
//   distance_km
//   base_fare_per_km
app.post(
    '/api/trains/search',
    controller.searchTrains
  );

  app.get(
    '/api/trains/search-trains',
    controller.searchTrainsWithPrediction
  );

  app.post(
    '/api/trains/search-trains',
    controller.searchTrainsWithPrediction
  );

  // getTrainAvailability
  // Expects:
  // HTTP GET
  // Parameters: train_id, class_type, date
  app.get(
    '/api/trains/availability',
    [authJwt.verifyToken],
    controller.getTrainAvailability
  );


  // add route to fetch train details used by BookingPage
  app.get(
    '/api/trains/:id',
    controller.getTrainById
  );
};