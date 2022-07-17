let jwt = require('jsonwebtoken')

module.exports.ensureToken = function(req, res, next) {
 var bearerHeader = req.headers["authorization"]
 if(typeof bearerHeader !== 'undefined') {
  const bearer = bearerHeader.split(" ")
  const bearerToken = bearer[1]
  jwt.verify(bearerToken, 'secretkey', (err, result) => {
    if(err) { res.sendStatus(403) }
    else{ next() }
  })
 } else {
  res.sendStatus(403)
 }
}

module.exports.parseJwt = function(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload)
};