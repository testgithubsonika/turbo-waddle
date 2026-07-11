const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;
//used  to protect routes by verifying the JWT.
const verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  if (typeof token === 'string' && token.startsWith("Bearer ")) {
    token = token.slice(7);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized! Invalid or expired token.',
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const authJwt = {
  verifyToken,
};

module.exports = authJwt;