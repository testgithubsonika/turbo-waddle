const { authJwt } = require('../middleware');
const controller = require('../controllers/profile.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'authorization,x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  app.get('/api/profile', 
  [authJwt.verifyToken], 
  controller.getProfile);
  
  app.put('/api/profile/update', [authJwt.verifyToken], controller.updateProfile);
  app.put('/api/profile/password', [authJwt.verifyToken], controller.changePassword);
  app.delete('/api/profile/delete', [authJwt.verifyToken], controller.deleteAccount);
};
