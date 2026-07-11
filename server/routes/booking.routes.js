const { authJwt } = require('../middleware');
const controller = require('../controllers/booking.controller');

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, authorization, Origin, Content-Type, Accept'
    );
    next();
  });


  app.post(
    '/api/bookings/book',
    [authJwt.verifyToken],
    controller.createBooking
  );
  
  app.get(
    '/api/bookings/history',
    [authJwt.verifyToken],
    controller.getBookingHistory
  );
  
  app.post(
    '/api/bookings/:booking_id/cancel',
    [authJwt.verifyToken],
    controller.cancelBooking
  );
};

//for booking routes
// {
//   "train_id": 102,
//   "journey_date": "2025-11-10",
//   "class_type": "2A",
//   "fare": 850,
//   "passengers": [
//     { "name": "Amit Sharma", "age": 32, "gender": "M" },
//     { "name": "Priya Sharma", "age": 29, "gender": "F" }
//   ]
// }

// for history routes optional
// | Parameter    | Type   | Description                                       |
// | ------------ | ------ | ------------------------------------------------- |
// | `page`       | number | Default = 1                                       |
// | `limit`      | number | Default = 10                                      |
// | `status`     | string | Filter: `"confirmed"`, `"cancelled"`, `"pending"` |
// | `start_date` | string | ISO date filter start                             |
// | `end_date`   | string | ISO date filter end                               |


//delete method use user_id as path pramas
// | Name         | Type    | Description             |
// | ------------ | ------- | ----------------------- |
// | `booking_id` | integer | The booking’s unique ID |
