/* eslint-disable consistent-return */
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.status(401).send({
      status: 401,
      message: 'Unauthorized User',
    });
  }
  jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).send({
        status: 403,
        message: 'Token invalid or expired',
      });
    }
    req.username = decoded.username;
    next();
  });
};

module.exports = {
  verifyToken,
};
