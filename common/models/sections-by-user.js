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

  Sectionsbyuser.getAllThemesByUser = function (base64AccessToken, clientId, ctx, cb) {
    console.log(base64AccessToken)
    console.log(ctx.userData.id)

    Sectionsbyuser.app.models.ThemesByUser.findOne({ where: { _id: ctx.userData.id } })
      .then(function (themeByUser) {
        console.log('Yeah!!!')
        cb(null, themeByUser)
      })
      .catch((err) => {
        // Handle any error that occurred in any of the previous
        // promises in the chain.
        console.error('Error while finding themes by user!!!!')
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
    'getAllThemesByUser',
    {
      http: { path: '/get-all-themes-by-user/:base64_access_token', verb: 'GET' },
      accepts: [
        {
          arg: 'base64_access_token',
          type: 'string',
          documented: true,
          required: true,
          status: 200,
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
          documented: true,
          errorStatus: 400,
          description: [
            'ClientId field'
          ]
        },
        {
          arg: 'ctx',
          type: 'object',
          http: { source: 'context' }
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
    validateToken(context.req, function (err, res) {
      if (err) {
        console.log(err)
        next(err)
      } else {
        // Guardamos los datos del usuario en el context de la request
        context.req.body.userData = res
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
    validateToken(context.req, function (err, res) {
      if (err) {
        console.log(err)
        next(err)
      } else {
        // Guardamos los datos del usuario en el context de la request
        context.req.body.userData = res
        next()
      }
    })
  })

  /**
   * @TODO validar que si venga un parametro access token
   */
  Sectionsbyuser.beforeRemote('getAllThemesByUser', function (context, unused, next) {
    validateToken(context.req, function (err, res) {
      if (err) {
        console.log(err)
        next(err)
      } else {
        // Guardamos los datos del usuario en el context de la request
        context.req.body.userData = res
        next()
      }
    })
  })

  function validateToken (request, cb) {
    Sectionsbyuser.app.models.oauthUtils.getUserDatabyToken(request, function (err, userData) {
      if (err) {
        cb(err)
      } else {
        cb(null, userData)
      }
    })
  }
}
