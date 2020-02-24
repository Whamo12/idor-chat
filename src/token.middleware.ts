let jwt = require('jsonwebtoken');

/**
 * @description Checks for valid token before API logic
 * @param {Request} req
 * @param {Response} res
 */
let checkToken = (req, res, next) => {
  let token = req.headers['authorization'];
  if (token) {
    jwt.verify(token, process.env.SALT, (err, decoded) => {
      if (err) {
        return res.status(401).json('Authorization token is not valid');
      } else {
        req.user = decoded.userId;
        next();
      }
    });
  } else {
    return res.status(401).json('Unauthorized');
  }
};

module.exports = {
  checkToken: checkToken
};
