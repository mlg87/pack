// Middleware for token verification

var tokenManager = {
 verifyToken : function (req, res, next) {
  var token = getToken(req.headers);
    console.log('token: ', token);

}

};

module.exports = tokenManager;