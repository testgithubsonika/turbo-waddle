const { authJwt } = require('../middleware');
const controller = require('../controllers/auth.controller');

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, authorization, Origin, Content-Type, Accept'
    );
    next();
  });
  // ✅ Removed manual CORS headers - handled by middleware in index.js

  // Public auth routes
  app.post('/api/auth/signup', controller.signup);
  app.post('/api/auth/signin', controller.signin);
  app.post('/api/auth/google-signin', controller.googleSignIn);
};
