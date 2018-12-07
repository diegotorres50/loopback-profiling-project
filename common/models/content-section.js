'use strict'

/**
 * @module ContentSection
 *
 * ContentSection model contains all methods and attributes
 * needed to management content sections persitence services.
 *
 * @version 1.0.0
 * @see {@link https://loopback.io/doc/en/lb3/|LoopBack 3.x}
 *
 * @author Diego Torres <diecam@eltiempo.com>
 */
module.exports = function (ContentSection) {
  /**
   * remote method has to be registered
   *
   * @author Diego Torres <diecam@eltiempo.com>
   *
   * @param {string} remoteMethod - remote method name to register.
   * @param {object} configuration to remote method.
   */
  ContentSection.remoteMethod(
    'find',
    {
      description: 'Get info from sections.',
      http: { path: '/get-all', verb: 'get' },
      returns: { arg: 'result', type: 'object', root: true }
    })

  /**
   * remote method after hook
   * @param {object} context - this is a request context.
   * @param {object} unused - pending.
   * @param {object} next - object.
   * @return {string} result of the description function.
  ContentSection.afterRemote('find', function (ctx, unused, next) {
    if (ctx) {
      ctx.result = {
        code: 200,
        message: 'Success',
        data: ctx.result,
        result: 'Okay'
      }
    } else {
      next(new Error('Error'))
    }
    next()
  })

  /**
   * @author Diego Torres <diecam@eltiempo.com>
   */
  ContentSection.observe('loaded', function logQuery (ctx, next) {
    // Obtenemos la data del json y la transformamos
    console.log(ctx.data)
    next()
  })
}
