'use strict'

module.exports = function (Sectionsbyuser) {
  Sectionsbyuser.setSectionByUser = function (bodyData, clientId, cb) {
    console.log(bodyData.userData)
    let newThemesByUser = {
      'userData': bodyData.userData
    }
    let themes = JSON.parse(bodyData.themes)
    newThemesByUser._id = newThemesByUser.userData.id
    newThemesByUser.clienteId = clientId
    newThemesByUser.sections = themes.sections

    Sectionsbyuser.app.models.ThemesByUser.upsert(newThemesByUser)
      .then(function (themeByUser) {
        console.log('Yujuuuuu')
        cb(null, themeByUser)
      })
      .catch((err) => {
        // Handle any error that occurred in any of the previous
        // promises in the chain.
        console.error('Error while creating themes by user!!!!')
        console.error(err)
        cb(err)
      })
  }
  Sectionsbyuser.deleteThemesByUser = function (bodyData, clientId, cb) {
    Sectionsbyuser.app.models.ThemesByUser.destroyById(bodyData.userData.id)
      .then(function (themeByUser) {
        console.log('Preferences from user ' + bodyData.userData.id + ' has been deleted successful')
        cb(null, 'Preferences from user ' + bodyData.userData.id + ' has been deleted successful')
      })
      .catch((err) => {
        // Handle any error that occurred in any of the previous
        // promises in the chain.
        console.error('Error while deleting themes by user!!!!')
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
      http: { path: '/set-section-by-user', verb: 'POST' },
      accepts: [
        {
          arg: 'bodyData',
          type: 'object',
          documented: true,
          http: { source: 'body' },
          required: true,
          status: 201,
          errorStatus: 400,
          description: [
            'Es el objeto json de la peticion,',
            'Un ejemplo: {}'
          ]
        },
        {
          arg: 'client_id',
          type: 'string',
          required: true,
          default: 'eltiempoandroidnativo',
          documented: true,
          errorStatus: 400,
          description: [
            'ClientId field'
          ]
        }
      ],
      returns: { arg: 'data', type: 'object' }
    }
  )

  /**
   * remote method has to be registered
   *
   * @author Diego Torres <diecam@eltiempo.com>
   *
   * @param {string} remoteMethod - remote method name to register.
   * @param {object} configuration to remote method.
   */
  Sectionsbyuser.remoteMethod(
    'deleteThemesByUser',
    {
      http: { path: '/delete-section-by-user', verb: 'POST' },
      accepts: [
        {
          arg: 'bodyData',
          type: 'object',
          documented: true,
          http: { source: 'body' },
          required: true,
          status: 201,
          errorStatus: 400,
          description: [
            'Campo vacío para la petición, pero presente para luego validar userData'
          ]
        },
        {
          arg: 'client_id',
          type: 'string',
          required: true,
          default: 'eltiempoandroidnativo',
          documented: true,
          errorStatus: 400,
          description: [
            'ClientId field'
          ]
        }
      ],
      returns: { arg: 'data', type: 'object' }
    }
  )

  /**
   * remote method before hook
   * @param {object} context - this is a request context.
   * @param {object} unused - pending.
   * @param {object} next - object.
   * @return {string} result of the description function.
   */
  Sectionsbyuser.beforeRemote('setSectionByUser', function (context, unused, next) {
    // Validate Authorization token
    Sectionsbyuser.app.models.oauthUtils.getUserDatabyToken(context.req, function (err, userData) {
      if (err) {
        next(err)
      } else {
        // Guardamos los datos del usuario en el context de la request
        context.req.body.userData = userData
        next()
      }
    })
  })

  /**
   * remote method before hook
   * @param {object} context - this is a request context.
   * @param {object} unused - pending.
   * @param {object} next - object.
   * @return {string} result of the description function.
   */
  Sectionsbyuser.beforeRemote('deleteThemesByUser', function (context, unused, next) {
    // Validate Authorization token
    Sectionsbyuser.app.models.oauthUtils.getUserDatabyToken(context.req, function (err, userData) {
      if (err) {
        next(err)
      } else {
        // Guardamos los datos del usuario en el context de la request
        context.req.body.userData = userData
        next()
      }
    })
  })
}
