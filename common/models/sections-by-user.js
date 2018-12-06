'use strict'

module.exports = function (Sectionsbyuser) {
  Sectionsbyuser.setSectionByUser = function (themes, client_id, cb) {
    //
    console.log('from setSectionByUser...')

    // See sections
    console.log(themes)

    // See client_id
    console.log(client_id)

    // This is de whole body request
    var requestBodyData = themes

    // This is the user data key containing request json data built from beforeRemote methos
    var _userData = requestBodyData.userData.data

    // Armamos la data de la respuesta profiling
    var newThemesByUser = {}

    newThemesByUser._id = _userData.id
    newThemesByUser.userData = JSON.parse(_userData)
    newThemesByUser.client_id = client_id
    newThemesByUser.sections = themes.sections

    // Validamos que el usuario sea valido
    Sectionsbyuser.app.models.ThemesByUser.create(newThemesByUser)
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
      http: { path: '/set-section-by-user', verb: 'post' },
      accepts: [
        { arg: 'themes',
          type: 'object',
          documented: true,
          http: { source: 'body' },
          required: true,
          status: 201,
          errorStatus: 400,
          description: [
            'Es el objeto json de la peticion,',
            'Un ejemplo: {}'
          ] },
        { arg: 'client_id',
          type: 'string',
          required: true,
          default: 'eltiempoandroidnativo',
          documented: true,
          description: [
            'Es el id del cliente de la aplicacion'
          ] }
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
    // @TODO we have to validate authorization

    console.log('beforeRemote')

    //
    Sectionsbyuser.app.models.oauthUtils.getUserDatabyToken(context.req, function (err, userData) {
      if (err) {
        console.log('buuu from beforeRemote...')
        next(err)
      } else {
        console.log('Retornando datos del usuario...')
        // Guardamos los datos del usuario en el context de la request
        context.req.body.userData = userData
        next()
      }
    })
  })
}
