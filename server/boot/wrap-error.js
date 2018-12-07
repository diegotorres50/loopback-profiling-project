// Modificamos la respuesta para adaptar el estandar jsonapi.org
// https://loopback.io/doc/en/lb3/Remote-hooks.html
// https://github.com/strongloop/loopback/issues/624
module.exports = function (app) {
  var remotes = app.remotes()

  remotes.options.rest = remotes.options.rest || {}
  remotes.options.rest.handleErrors = false

  app.middleware('final', FinalErrorHandler)

  function FinalErrorHandler (err, req, res, next) {
    var status = err.status || err.statusCode || 400

    if (status >= 500) {
      let log = global.log
      log.error({ err: err }, 'Oops!')
    }

    res.status(status).send({
      code: status,
      message: err.message,
      data: {},
      result: err.result
    }).end()
  }
}
