// Middleware for token verification
var jwt = require('jsonwebtoken');
var secret_token = require('../config/secret');

var tokenManager = {
 verify : function (req, res, next) {
   var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    console.log('token: ', token);

    if (token) {
      try {
        var decoded = jwt.verify(token, secret_token);
          console.log('decoded: ', decoded);
      } catch (err) {
        console.log('err: ', err);
        res.status(500);
        res.json({
          "status": 500,
          "message": "Oops something went wrong",
          "error": err
        });
          console.log('err: ', err);
      }
    } else {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid Token or Key"
      });
      return;
    }
    next();
}


};

module.exports = tokenManager;