'use strict'

module.exports = function (Sectionsbyuser) {
  Sectionsbyuser.setSectionByUser = function (accessToken, cb) {
    // Armamos la data de la respuesta profiling
    var data = {}

    // Delete me
    console.log(accessToken)

    // Validamos que el usuario sea valido
    Sectionsbyuser.app.models.EmptorRestModel.getUserData(accessToken)
      .then(function (userData) {
        data.userData = userData
        cb(null, data)
      })
      .catch((err) => {
        // Handle any error that occurred in any of the previous
        // promises in the chain.
        console.error('Error while retrieving user data!!!!')
        console.error(err)
        cb(err)
      })
  }

  /**
   * remote method has to be registered
   *
   * @author Diego Torres <diecam@eltiempo.com>
   *
   * @param {string} remoteMethod - remote method name to register.
   * @param {object} configuration to remote method.
   */
  Sectionsbyuser.remoteMethod(
    'setSectionByUser',
    {
      http: { path: '/set-section-by-user', verb: 'get' },
      accepts: [
        { arg: 'ACCESS_TOKEN',
          type: 'string',
          required: true,
          documented: true,
          description: [
            'User access token'
          ]
        }
      ],
      returns: { arg: 'data', type: 'object' }
    }
  )
}
