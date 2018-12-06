/**
 * @module Oauthutils
 *
 * Oauthutils. Functions utils referer accessToken
 *
 * getTokenFromRequestHeader- Valida el token Bearer en el header y retorna el token limpio.
 *
 * @version 1.0.0
 * @see {@link https://loopback.io/doc/en/lb3/|LoopBack 3.x}
 *
 * @author Diego Torres <diecam@eltiempo.com>
 */

module.exports = function (oauthUtils) {
  //
  oauthUtils.getTokenFromRequestHeader = function (req) {
    var matches = req.headers.authorization.match(/Bearer\s(\S+)/)
    return matches[1]
  }

  /* Aqui crear las funciones que hacen referencia al token */
  oauthUtils.getUserDatabyToken = function (req, cb) {
    //
    let reqToken = oauthUtils.getTokenFromRequestHeader(req)

    // Validamos que el usuario sea valido
    oauthUtils.app.models.EmptorRestModel.getUserData(reqToken)
      .then(function (userData) {
        // Called if the operation succeeds.
        console.log('userData: <<' + userData + '>> has been found.')
        cb(null, userData)
      })
      .catch((err) => {
        // Handle any error that occurred in any of the previous
        // promises in the chain.
        err.status = 401
        err.result = 'Unauthorized or Forbidden or Not Found'
        cb(err)
      })
  }

  oauthUtils.remoteMethod('getUserDatabyToken', {
    isStatic: true,
    accepts: { arg: 'req', type: 'object' },
    returns: { arg: 'accessToken', type: 'object' }
  })
}
