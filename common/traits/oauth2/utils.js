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
 *
 * @TODO falta unificar los metodos de emptor en un solo metodo para optimizar
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
    console.log('getUserDatabyToken...')

    //
    let reqToken = oauthUtils.getTokenFromRequestHeader(req)
    // Validamos que el usuario sea valido
    oauthUtils.app.models.EmptorRestModel.getUserData(reqToken)
      .then(function (userData) {
        // Called if the operation succeeds.
        console.log('userData: <<' + userData + '>> has been found.')
        cb(null, userData.data)
      })
      .catch((err) => {
        console.log(err.message)
        // Handle any error that occurred in any of the previous
        // promises in the chain.
        console.log('buuu from getUserDatabyToken...')
        err.status = 401
        err.result = 'Unauthorized or Forbidden or Not Found'
        cb(err)
      })
  }

  /* Aqui crear las funciones que hacen referencia al token */
  oauthUtils.getUserDatabyBase64Token = function (base64Token, cb) {
    //
    console.log('getUserDatabyBase64Token...')

    console.log(base64Token)
    // Validate Authorization token

    // base64Token is access_token encoded with base64,
    // so we are going to decode to use it
    var reqToken = new Buffer(base64Token, 'base64').toString('ascii')

    console.log(reqToken)

    // Validamos que el usuario sea valido
    oauthUtils.app.models.EmptorRestModel.getUserData(reqToken)
      .then(function (userData) {
        // Called if the operation succeeds.
        console.log('userData: <<' + userData + '>> has been found.')
        cb(null, userData.data)
      })
      .catch((err) => {
        console.log(err.message)
        // Handle any error that occurred in any of the previous
        // promises in the chain.
        console.log('buuu from getUserDatabyToken...')
        err.status = 401
        err.result = 'Unauthorized or Forbidden or Not Found'
        cb(err)
      })
  }
}
