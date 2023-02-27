const jwt = require('jsonwebtoken')

class AuthJwt {
  async authJwt(req, res, next) {
    try {
      if (req.cookies && req.cookies.adminToken) {
        jwt.verify(req.cookies.adminToken, 'xE3DS8TY2N', (err, data) => {
          // console.log(err);
          req.user = data;
          next()
        })
      }else{
       next()
      }
    } catch (error) {
     // console.log(error);
      throw error
    }
  }
}

module.exports = new AuthJwt()