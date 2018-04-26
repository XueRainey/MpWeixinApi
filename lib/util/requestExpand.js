const { initParams } = require('request')

module.exports = function (request) {
  function verbPromiseFunc (verb) {
    const method = verb.toUpperCase()
    return (uri, options, callback) => {
      const params = initParams(uri, options, callback)
      return new Promise((resolve, reject) => {
        params.method = method
        params.strictSSL = false
        return request(params, (error, response, body) => {
          /* istanbul ignore if  */ if (error) return reject(error.message)
          if (params.returnResponse) return resolve(response)
          // if (!body) return reject('no body');
          resolve(body)
        })
      })
    }
  }

  request.xpost = verbPromiseFunc('post')
  request.xget = verbPromiseFunc('get')
  return request
}
