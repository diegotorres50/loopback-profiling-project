'use strict'

module.exports = function (Sectionsbyuser) {
  Sectionsbyuser.getBaseNewsByUser = function (base64AccessToken, clientId, ctx, cb) {
    console.log(ctx.userData.id)

    // Armamos la data de la respuesta profiling
    var data = {
      userData: ctx.userData
    }

    Sectionsbyuser.app.models.ThemesByUser.findOne({ where: { _id: ctx.userData.id } })
      .then(function (themeByUser) {
        data.themesByUser = themeByUser
        return Sectionsbyuser.app.models.ElasticRestModel.getNews(themeByUser.sections)
      })
      .catch((err) => {
        // Handle any error that occurred in any of the previous
        // promises in the chain.
        console.error('Error while finding news by user!!!!')
        console.error(err)

        // Si no hay datos, pasamos el error
        return new Error('no themes found')
      })
      .then(function (newsBySections) {
        // Si respondio elastic
        data.newsBySection = newsBySections
        cb(null, data)
      })
      .catch((err) => {
        // Handle any error that occurred in any of the previous
        // promises in the chain.
        console.error('Hay un error de albums')

        data.newsBySection = {}

        // Comentamos los errores de callbacks porque si rompe un datasource imprimimos lo que venga
        // en el json
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
    'getBaseNewsByUser',
    {
      http: { path: '/get-base-news-by-user/:base64_access_token', verb: 'GET' },
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
   * remote method before hook
   * @param {object} context - this is a request context.
   * @param {object} unused - pending.
   * @param {object} next - object.
   * @return {string} result of the description function.
   * @TODO validar que si venga un parametro access token
   */
  Sectionsbyuser.beforeRemote('getBaseNewsByUser', function (context, unused, next) {
    // Validate Authorization token
    Sectionsbyuser.app.models.oauthUtils.getUserDatabyToken(context.req, function (err, userData) {
      if (err) {
        console.log('buuuaaa from beforeRemote...')
        next(err)
      } else {
        console.log('Retornando datos del usuario 2...')
        // Guardamos los datos del usuario en el context de la request
        context.userData = userData
        next()
      }
    })
  })
}
