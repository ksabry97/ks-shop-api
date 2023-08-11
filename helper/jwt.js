const expressJwt = require('express-jwt');

// authenication :
function authJwt() {
   const secret = 'secret';
   return expressJwt({
      secret,
      alg: 'HS256',
   });
}
module.exports = authJwt;
